import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { CommonService } from '../common.service';
import { StorageService } from '../storage.service';
import { register } from 'swiper/element/bundle';
import Swiper from 'swiper';

register();

@Component({
  selector: 'app-company-debit-memo-add',
  templateUrl: './company-debit-memo-add.page.html',
  styleUrls: ['./company-debit-memo-add.page.scss'],
})
export class CompanyDebitMemoAddPage implements OnInit {

  isDisabled : boolean=true;
    drimsFormOne: FormGroup;
  isSubmitted: boolean = false;
  userId: any;
  IsEditMode: boolean = false;
  dateEnteredVal: any;
  dbMemoNoVal: string="";
  companyList:any;
  requestId: string="";
  compId: any;
  //#endregion

  //#region Constructor
  constructor(private router: Router, public formbuilder: FormBuilder, public storageservice: StorageService,
    private route: ActivatedRoute, private datePipe: DatePipe, public commonService: CommonService) {

    this.userId = localStorage.getItem('empId');
    this.drimsFormOne = formbuilder.group({
      returnName: ['', Validators.required],
      companyName: ['', Validators.required,],
      dateEntered: ['', Validators.required],
      dbMemoNo: ['', Validators.required]
    });
    var currentDt = new Date().toISOString();
    this.dateEnteredVal = this.datePipe.transform(currentDt, 'yyyy-MM-dd');

    //Load existing values from the "Visit request" page.
    this.route.queryParams.subscribe(par => {
var params :any = par
      if (params && params != null) {
        if (params.returnMemoNo != null) {
          this.dbMemoNoVal = params.returnMemoNo;
          this.requestId = decodeURIComponent(params.returnMemoNo);
          this.IsEditMode = true;
          //Load existing values
          this.BindExistingValues();
        }
        if (params.companyCode != null) {
          setTimeout(() => {
            this.drimsFormOne.patchValue({           
              'companyName': params.companyCode,           
            });
          }, 500);
         this.compId = params.companyCode
        }
      }
    });
  }
  ngOnInit() {
    this.commonService.getcompanyMasterDropdownList().subscribe(
      (data) => {
        this.companyList = data;
      });
  }
   //#region Functions
  BindExistingValues() {
    var postData = {
      "editId": this.requestId
    }
  
    this.storageservice.showLoadingIndicator();
    var editServiceUrl = "api/auth/app/debitMemo/edit";
    this.storageservice.postrequest(editServiceUrl, postData).subscribe(res => {
      var result :any= res

      if (result["success"] == true) {
        //Edit details
        var data = result["debitMemo"];
        //To show the values
        //First
        this.drimsFormOne.patchValue({
          'returnName': data["returnMemoName"],
          'companyName': data["company"],
          'dbMemoNo': data["returnMemoNo"],
          'dateEntered': data["returnMemoDate"]
        });
        this.storageservice.hideLoadingIndicator();
      }
      else{
        this.storageservice.hideLoadingIndicator();
      }
    });   
  }
  //#region Click events 
  Cancel() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        refreshPage: 'yes'
      }
    };
    this.router.navigate(['/company-debit-memo-list'], navigationExtras);
  }

  submitFinalClick() {
    this.isSubmitted = true;
    if (!this.drimsFormOne.valid) {
      this.storageservice.warningToast('Please provide all the required values!');
    }
    else {
      var companyName = this.drimsFormOne.controls['companyName'].value;
      var dateEntered = this.drimsFormOne.controls['dateEntered'].value;
      var returnName = this.drimsFormOne.controls['returnName'].value;
      var dbMemoNo = this.drimsFormOne.controls['dbMemoNo'].value;
      var postData: any;
        postData = {
          "company": companyName,
          "createdBy": this.userId,
          "returnMemoDate": dateEntered,
          "returnMemoName": returnName,
          "returnMemoNo": dbMemoNo
        }  
      var addOrUpdateURL = "";
      if (this.IsEditMode) {
        addOrUpdateURL = "api/auth/app/debitMemo/update";
      }
      else {
        addOrUpdateURL = "api/auth/app/debitMemo/save";
      }
      this.storageservice.showLoadingIndicator();
      this.storageservice.postrequest(addOrUpdateURL, postData).subscribe(res => {
        var result :any= res

        this.storageservice.hideLoadingIndicator();
        if (result['success']) {
          if (this.IsEditMode) {
            this.storageservice.successToast('Return order has been updated successfully.');
          }
          else {
            this.storageservice.successToast('Return order has been saved successfully.');
          }
          let navigationExtras: NavigationExtras = {
            queryParams: {
              refreshPage: 'yes'
            }
          };
          this.router.navigate(['/company-debit-memo-list'], navigationExtras);
        }
        else if (!result['success']) {
          this.storageservice.warningToast('Error: ' + result['message']);
        }

      },
        error => {
          this.storageservice.hideLoadingIndicator();
          if (error.name == "HttpErrorResponse") {
            this.storageservice.warningToast('Internet connection problem, Pls check your internet.');
          }
          else {
            this.storageservice.warningToast('Error: ' + error.message);
          }
        },
        () => {
        });
    }
  }
  //#endregion
}
