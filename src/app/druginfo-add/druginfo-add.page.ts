import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { CommonService } from '../common.service';
import { StorageService } from '../storage.service';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import Swiper from 'swiper';

@Component({
  selector: 'app-druginfo-add',
  templateUrl: './druginfo-add.page.html',
  styleUrls: ['./druginfo-add.page.scss'],
})
export class DruginfoAddPage implements OnInit {
  @ViewChild('swiper')
swiperRef:ElementRef | undefined
swiper?:Swiper


  valuetest:any;
  //#region Declaration
  drimsFormOne: FormGroup;
  drimsFormTwo: FormGroup;
  drimsFormThree: FormGroup;
  drimsFormFour: FormGroup;
  isSubmitted: boolean = false;
  IsEditMode: boolean = false;
  manufacturerList: any;
  dosageList: any;
  requestId: any;
  readonly phoneMask: MaskitoOptions = {
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/],
  };

  readonly cardMask: MaskitoOptions = {
   
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/],
  };

  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();


  
  constructor(private router: Router, public formbuilder: FormBuilder, public storageservice: StorageService,
    private route: ActivatedRoute, public commonService: CommonService, public el: ElementRef) {
    //First
    this.drimsFormOne = formbuilder.group({
      ndcupc: ["", [Validators.required, Validators.pattern('[0-9]{5}[-]{1}[0-9]{4}[-]{1}[0-9]{2}'), Validators.maxLength(13), Validators.minLength(13)]],
      manufacturerBy: ['', Validators.required],
      description: ['', Validators.required],
      strength: ['', Validators.required]
    });
    //Second
    this.drimsFormTwo = formbuilder.group({
      packageSize: ['', Validators.required],
      unitPerPackage: ['', Validators.required],
      dosage: ['', Validators.required],
      unitDose: [false, ''],
      hazardous: [false, ''],
    });
    //Third
    this.drimsFormThree = formbuilder.group({
      control: ['RX', Validators.required],
      unitOfMeasure: ['EA', Validators.required],
      notes: ['', ''],
    });
    //Fourth  
    this.drimsFormFour = formbuilder.group({
      awp: [''],
      wap: [''],
      myPrice: ['', Validators.required]
    });
  }
  //#endregion

  //#region OnInit
  ngOnInit() {
    this.commonService.getManufacturerList().subscribe(
      (response) => {
        this.manufacturerList = response;
      });
    this.commonService.getDosageDropdownList().subscribe(
      (response) => {
        this.dosageList = response;
      });

    //Load existing values from the "Visit request" page.
    this.route.queryParams.subscribe((params:any) => {
      if (params && params != null && params.ndcupc != null) {
        this.requestId = decodeURIComponent(params.ndcupc);
        this.IsEditMode = true;
        //Load existing values
        this.BindExistingValues();
      }
    });
  }
  //#endregion

  //#region Functions
  BindExistingValues() {
    var postData = {
      "editId": this.requestId
    }
    this.storageservice.showLoadingIndicator();
    var editServiceUrl = "api/auth/app/drugInfoMaster/edit";
    this.storageservice.postrequest(editServiceUrl, postData).subscribe((result:any) => {
      if (result["success"] == true) {
        //Edit details
        var data = result["drugInfoMasterBean"];
        //To show the values
        //First
        this.drimsFormOne.patchValue({
          'ndcupc': data["ndcupc"],
          'manufacturerBy': data["manufacturerBy"],
          'description': data["description"],
          'strength': data["strength"]
        });
        //Second
        this.drimsFormTwo.patchValue({
          'packageSize': data["packageSize"],
          'unitPerPackage': data["unitPerPackage"],
          'dosage': data["dosage"],
          'unitDose': this.getBoolean(data["unitDose"]),
          'hazardous': this.getBoolean(data["hazardous"])
        });
        //Third
        this.drimsFormThree.patchValue({
          'control': data["control"],
          'unitOfMeasure': data["unitOfMeasure"],
          'notes': data["notes"]
        });
        //Fourth
        this.drimsFormFour.patchValue({
          'awp': data["awp"],
          'wap': data["wap"],
          'myPrice': data["myPrice"]
        });
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
this.next()    }
  }

  moveToPrevious() {
    this.isSubmitted = false;
this.back()  }

  secondCardNextClick() {
    this.isSubmitted = true;
    if (!this.drimsFormTwo.valid) {

      this.storageservice.warningToast('Please provide all the required values!');
    }
    else {
this.next()    }
  }

  thirdCardNextClick() {
    this.isSubmitted = true;
    if (!this.drimsFormThree.valid) {

      this.storageservice.warningToast('Please provide all the required values!');
    }
    else {
this.next()
    }
  }

  submitFinalClick() {
    this.isSubmitted = true;
    if (!this.drimsFormFour.valid || !this.drimsFormThree.valid || !this.drimsFormTwo.valid || !this.drimsFormOne.valid) {

      this.storageservice.warningToast('Please provide all the required values!');
    }
    else {
      var postData = {
        "ndcupc": this.drimsFormOne.controls['ndcupc'].value,
        "manufacturerBy": this.drimsFormOne.controls['manufacturerBy'].value,
        "description": this.drimsFormOne.controls['description'].value,
        "strength": this.drimsFormOne.controls['strength'].value,

        "packageSize": String(this.drimsFormTwo.controls['packageSize'].value),
        "unitPerPackage": String(this.drimsFormTwo.controls['unitPerPackage'].value),
        "dosage": this.drimsFormTwo.controls['dosage'].value,
        "unitDose": this.drimsFormTwo.controls['unitDose'].value,
        "hazardous": this.drimsFormTwo.controls['hazardous'].value,

        "control": this.drimsFormThree.controls['control'].value,
        "unitOfMeasure": this.drimsFormThree.controls['unitOfMeasure'].value,
        "notes": this.drimsFormThree.controls['notes'].value,

        "awp": this.drimsFormFour.controls['awp'].value,
        "wap": this.drimsFormFour.controls['wap'].value,
        "myPrice": this.drimsFormFour.controls['myPrice'].value
      }

      var addOrUpdateURL = "";
      if (this.IsEditMode) {
        addOrUpdateURL = "api/auth/app/drugInfoMaster/update";
      }
      else {
        addOrUpdateURL = "api/auth/app/drugInfoMaster/save";
      }




      this.storageservice.showLoadingIndicator();
      this.storageservice.postrequest(addOrUpdateURL, postData).subscribe((result:any) => {
        this.storageservice.hideLoadingIndicator();
        if (result['success']) {
          if (this.IsEditMode) {
            this.storageservice.successToast('Drug information has been updated successfully.');
          }
          else {
            this.storageservice.successToast('Drug information has been saved successfully.');
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

        }
      );
    }
  }

  getBoolean(value: any) {
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
  ndcupcCodeValidation(event: any) {
    if (event != undefined && event != null && event != "" && this.IsEditMode == false) {
      var getListURL = `api/auth/app/commonServices/validateUnique?tableName=` + "drugs" + "&columnName=" + "ndcupc_code" + "&columnValue=" + event;
      this.storageservice.getrequest(getListURL).subscribe((res) => {
        if (res) {
          this.drimsFormOne.controls['ndcupc'].setErrors({ ndcupcValid: true });
        }
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
