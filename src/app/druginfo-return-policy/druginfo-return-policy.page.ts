import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { StorageService } from '../storage.service';
import Swiper from 'swiper';

@Component({
  selector: 'app-druginfo-return-policy',
  templateUrl: './druginfo-return-policy.page.html',
  styleUrls: ['./druginfo-return-policy.page.scss'],
})
export class DruginfoReturnPolicyPage implements OnInit {
  @ViewChild('swiper')
  swiperRef:ElementRef | undefined
  swiper?:Swiper
  //#region Declaration
  drimsFormOne: FormGroup;
  drimsFormTwo: FormGroup;
  isSubmitted: boolean = false;
  userId: any;
  wholesalerCode: string ="";
  IsEditMode: boolean = false;
  Acceptpercentage: boolean = false;
  requestId: string ="";

  constructor(private router: Router, public formbuilder: FormBuilder, public storageservice: StorageService,
    private route: ActivatedRoute) {
    this.userId = localStorage.getItem('empId');
    this.route.queryParams.subscribe((params:any) => {
      if (params && params != null && params.ndcupc != null) {
        this.requestId = decodeURIComponent(params.ndcupc);
        this.IsEditMode = true;
        this.BindExistingValues();
        this.drimsFormOne.patchValue({
          'ndcupcCode': this.requestId
        })
      }
    });
    this.drimsFormOne = formbuilder.group({
      ndcupcCode: ["", [Validators.required]],
      noMonthsBeforeExpiration: [""],
      noMonthsAfterExpiration: [""],
      acceptReturns: ["", [Validators.required]],
      acceptPartialReturns: 'false',
      acceptpercentage: [""],
      checkPackageOriginality: false,
    });

    this.drimsFormTwo = formbuilder.group({
      instnormaldrugitem: [""],
      instschedule2items: [""],
      instschedule3to5items: [""],
    });

  }

  //#region OnInit
  ngOnInit() {
  }
  //#endregion

  //#endregion
  getBoolean(value:any) {
    switch (value) {
      case true:
      case "true":
      case 1:
      case "1":
      case "on":
      case "yes":
      case "t":
        return true;
      default:
        return false;
    }
  }
  //#region Functions
  BindExistingValues() {
    var postData = {
      "editId": this.requestId
    }
    this.storageservice.showLoadingIndicator();
    var editServiceUrl = "api/auth/app/drugInfoMaster/editDruginfoReturnPolicy";
    this.storageservice.postrequest(editServiceUrl, postData).subscribe((result:any) => {
      if (result["success"] == true) {
        var data = result["druginfoReturnPolicyBean"];
        if (data != null) {
          this.drimsFormOne.patchValue({
            'ndcupcCode': data["ndcupcCode"],
            'noMonthsBeforeExpiration': data["noMonthsBeforeExpiration"],
            'noMonthsAfterExpiration': data["noMonthsAfterExpiration"],
            'acceptReturns': this.getBoolean(data["acceptReturns"]).toString(),
            'acceptPartialReturns': this.getBoolean(data["acceptPartialReturns"]).toString(),
            'acceptpercentage': data["acceptpercentage"],
            'checkPackageOriginality': data["checkPackageOriginality"]
          });
          this.drimsFormTwo.patchValue({
            'instnormaldrugitem': data["instnormaldrugitem"],
            'instschedule2items': data["instschedule2items"],
            'instschedule3to5items': data["instschedule3to5items"],
            cityName: data["cityName"]
          });
        }
        this.storageservice.hideLoadingIndicator();
      } else {
        this.storageservice.hideLoadingIndicator();
      }
    });
  }

  //#endregion

  //#region Click events 
  firstCardNextClick() {
    this.isSubmitted = true;
    if (!this.drimsFormOne.valid) {

      this.storageservice.warningToast('Please provide all the required values!');
    }
    else {
this.next()
    }
  }

  moveToPrevious() {
    this.isSubmitted = false;
this.back()  }

  submitFinalClick() {
    this.isSubmitted = true;
    if (this.drimsFormOne.value.acceptReturns == 'true') {
      this.drimsFormOne.controls['acceptPartialReturns'].setValidators(Validators.required);
      this.drimsFormOne.controls['acceptPartialReturns'].updateValueAndValidity();

      this.drimsFormOne.controls['noMonthsBeforeExpiration'].setValidators(Validators.required);
      this.drimsFormOne.controls['noMonthsBeforeExpiration'].updateValueAndValidity();

      this.drimsFormOne.controls['noMonthsAfterExpiration'].setValidators(Validators.required);
      this.drimsFormOne.controls['noMonthsAfterExpiration'].updateValueAndValidity();

      if (this.drimsFormOne.value.acceptPartialReturns == 'true') {
        this.drimsFormOne.controls['acceptpercentage'].setValidators(Validators.required);
        this.drimsFormOne.controls['acceptpercentage'].updateValueAndValidity();
      } else {
        this.Acceptpercentage = false;
        this.drimsFormOne.controls['acceptpercentage'].clearValidators();;
        this.drimsFormOne.controls['acceptpercentage'].updateValueAndValidity();

        this.drimsFormOne.patchValue({
          'acceptpercentage': '',
        })
      }
    } else {
      this.drimsFormOne.controls['acceptPartialReturns'].clearValidators();;
      this.drimsFormOne.controls['acceptPartialReturns'].updateValueAndValidity();

      this.drimsFormOne.controls['noMonthsBeforeExpiration'].clearValidators();
      this.drimsFormOne.controls['noMonthsBeforeExpiration'].updateValueAndValidity();

      this.drimsFormOne.controls['noMonthsAfterExpiration'].clearValidators();
      this.drimsFormOne.controls['noMonthsAfterExpiration'].updateValueAndValidity();

      this.drimsFormOne.patchValue({
        'acceptPartialReturns': 'false',
        'acceptpercentage': '',
        'noMonthsBeforeExpiration': '',
        'noMonthsAfterExpiration': ''
      })
      this.drimsFormTwo.patchValue({
        'instnormaldrugitem': '',
        'instschedule2items': '',
        'instschedule3to5items': ''
      })
    }
    if (!this.drimsFormTwo.valid || !this.drimsFormOne.valid) {
      this.storageservice.warningToast('Please provide all the required values !');
    }
    else {
      var postData = {
        "ndcupcCode": this.requestId,
        "noMonthsBeforeExpiration": this.drimsFormOne.controls['noMonthsBeforeExpiration'].value,
        "noMonthsAfterExpiration": this.drimsFormOne.controls['noMonthsAfterExpiration'].value,
        "acceptReturns": this.drimsFormOne.controls['acceptReturns'].value,
        "acceptPartialReturns": this.drimsFormOne.controls['acceptPartialReturns'].value,
        "acceptpercentage": this.drimsFormOne.controls['acceptpercentage'].value,
        "checkPackageOriginality": this.drimsFormOne.controls['checkPackageOriginality'].value,

        "instnormaldrugitem": this.drimsFormTwo.controls['instnormaldrugitem'].value,
        "instschedule2items": this.drimsFormTwo.controls['instschedule2items'].value,
        "instschedule3to5items": this.drimsFormTwo.controls['instschedule3to5items'].value,
      }

      var addOrUpdateURL = "";
      if (this.IsEditMode) {
        addOrUpdateURL = "api/auth/app/drugInfoMaster/saveDruginfoReturnPolicy";
      }
      else {
        addOrUpdateURL = "api/auth/app/drugInfoMaster/saveDruginfoReturnPolicy";
      }
      this.storageservice.showLoadingIndicator();
      this.storageservice.postrequest(addOrUpdateURL, postData).subscribe((result:any) => {
        this.storageservice.hideLoadingIndicator();
        if (result['success']) {
          if (this.IsEditMode) {
            this.storageservice.successToast('Return Policy has been updated successfully.');
          }
          else {
            this.storageservice.successToast('Return Policy has been saved successfully.');
          }

          let navigationExtras: NavigationExtras = {
            queryParams: {
              refreshPage: 'yes'
            }
          };
          this.router.navigate(['/druginfo-list'], navigationExtras);
        }
        else if (!result['success']) {
          this.storageservice.warningToast('Error: ' + result['message']);
        }

      },
        error => {
          this.storageservice.hideLoadingIndicator();

          if (error.name == "HttpErrorResponse") {
            this.storageservice.warningToast('Internet connection problem, Pls check your internet.');
            this.storageservice.GeneralAlert('HttpErrorResponse', 'Internet connection problem, Pls check your internet.');
          }
          else {
            this.storageservice.warningToast('Error: ' + error.message);
          }
        },
        () => {
          // Completed call...
          this.storageservice.hideLoadingIndicator();

        }
      );
    }
  }
  //#endregion
  acceptPercetageValidation(data:any) {
    if (data < 1) {
      this.Acceptpercentage = true;
      this.drimsFormOne.controls['acceptpercentage'].setValidators(Validators.compose([Validators.required, Validators.max(100), Validators.min(1), Validators.pattern(/^(100(\.0{1,2})?|[1-9]?\d(\.\d{1,2})?)$/)]));
      this.drimsFormOne.controls['acceptpercentage'].updateValueAndValidity();
    } else if (data > 100) {
      this.Acceptpercentage = true;
      this.drimsFormOne.controls['acceptpercentage'].setValidators(Validators.compose([Validators.required, Validators.max(100), Validators.min(1), Validators.pattern(/^(100(\.0{1,2})?|[1-9]?\d(\.\d{1,2})?)$/)]));
      this.drimsFormOne.controls['acceptpercentage'].updateValueAndValidity();
    }
    else {
      this.Acceptpercentage = false;
      this.drimsFormOne.controls['acceptpercentage'].clearValidators();
      this.drimsFormOne.controls['acceptpercentage'].updateValueAndValidity();
    }
  }
  ///////****** For Max Length(numeric input) ******////////
  noMonthsBeforeExpirationLimit(event: Event, maxLength: number) {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    if (inputValue.length > maxLength) {
      const numericInput = +inputValue.slice(0, maxLength); // Convert back to a number
      this.drimsFormOne.patchValue({
        'noMonthsBeforeExpiration': numericInput,
      });
    }
  }

  noMonthsAfterExpirationLimit(event: Event, maxLength: number) {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    if (inputValue.length > maxLength) {
      const numericInput = +inputValue.slice(0, maxLength); // Convert back to a number
      this.drimsFormOne.patchValue({
        'noMonthsAfterExpiration': numericInput,
      });
    }
  }

  next(){
    this.swiperReady()
  
  
    this.swiper?.slideNext();
  }
  swiperReady(){
  
    this.swiper= this.swiperRef?.nativeElement.swiper
  }
   
  back(){
    this.swiperReady()
  
  
    this.swiper?.slidePrev();
  }
}
