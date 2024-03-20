import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { StorageService } from '../storage.service';
import { register } from 'swiper/element/bundle';
import Swiper from 'swiper';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';

register();

@Component({
  selector: 'app-manufacturer-return-policy',
  templateUrl: './manufacturer-return-policy.page.html',
  styleUrls: ['./manufacturer-return-policy.page.scss'],
})
export class ManufacturerReturnPolicyPage implements OnInit {
  @ViewChild('swiper')
swiperRef:ElementRef | undefined
swiper?:Swiper
  // Declaration
  drimsFormOne: FormGroup;
  drimsFormTwo: FormGroup;
  drimsFormThree: FormGroup=new FormGroup({});
  drimsFormFour: FormGroup = new FormGroup({});
  isSubmitted: boolean = false;
  userId: any;
    IsEditMode: boolean = false;
  manufacturerCode: string ="";
  Acceptpercentage: boolean = false;
  requestId: string ="";
  manufacturerName: any;
 
  constructor(private router: Router, public formbuilder: FormBuilder, public storageservice: StorageService,
    private route: ActivatedRoute) {
    this.userId = localStorage.getItem('empId');
    this.drimsFormOne = formbuilder.group({
      manufacturerCode: ["", [Validators.required]],
      beforeExpiration: [""],
      afterExpiration: [""],

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

    this.route.queryParams.subscribe((params:any) => {
      if (params && params != null && params.manufacturerCode != null) {
        this.manufacturerCode = params.manufacturerCode;
        this.requestId = decodeURIComponent(params.manufacturerCode);
        this.IsEditMode = true;
        this.BindExistingValues();
        this.drimsFormOne.patchValue({
          'manufacturerCode': this.manufacturerCode,
        });
      }
      if (params.manufacturerName != null) {
        this.manufacturerName = params.manufacturerName;
      }
    });
  }

  ngOnInit() { }

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
  // Functions //
  BindExistingValues() {
    var postData = {
      "editId": this.requestId
    }
    this.storageservice.showLoadingIndicator();
    var editServiceUrl = "api/auth/app/manufacturerMaster/editManufactureReturnPolicy";
    this.storageservice.postrequest(editServiceUrl, postData).subscribe((result:any) => {
      if (result["success"] == true) {
        var data = result["manufactureReturnPolicyBean"];
        //To show the values
        this.drimsFormOne.patchValue({
          'manufacturerCode': data["manufacturerCode"],
          'beforeExpiration': data["noMonthsBeforeExpiration"],
          'afterExpiration': data["noMonthsAfterExpiration"],
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
        this.storageservice.hideLoadingIndicator();
      }
      else {
        this.storageservice.hideLoadingIndicator();
      }
    });
  }

  firstCardNextClick() {
    this.isSubmitted = true;
    if (!this.drimsFormOne.valid) {
      this.storageservice.warningToast('Please provide all the required values!');
    }
    else {
      this.next();
    }
  }

  moveToPrevious() {
    this.isSubmitted = false;
    this.back();
  }

  submitFinalClick() {
    this.isSubmitted = true;
    if (this.drimsFormOne.value.acceptReturns == 'true') {
      this.drimsFormOne.controls['acceptPartialReturns'].setValidators(Validators.required);
      this.drimsFormOne.controls['acceptPartialReturns'].updateValueAndValidity();

      this.drimsFormOne.controls['beforeExpiration'].setValidators(Validators.required);
      this.drimsFormOne.controls['beforeExpiration'].updateValueAndValidity();

      this.drimsFormOne.controls['afterExpiration'].setValidators(Validators.required);
      this.drimsFormOne.controls['afterExpiration'].updateValueAndValidity();

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

      this.drimsFormOne.controls['beforeExpiration'].clearValidators();
      this.drimsFormOne.controls['beforeExpiration'].updateValueAndValidity();

      this.drimsFormOne.controls['afterExpiration'].clearValidators();
      this.drimsFormOne.controls['afterExpiration'].updateValueAndValidity();

      this.drimsFormOne.patchValue({
        'acceptPartialReturns': 'false',
        'acceptpercentage': '',
        'beforeExpiration': '',
        'afterExpiration': '',
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
      this.storageservice.showLoadingIndicator();
      var postData = {
        "manufacturerCode": this.requestId,
        "noMonthsBeforeExpiration": this.drimsFormOne.controls['beforeExpiration'].value,
        "noMonthsAfterExpiration": this.drimsFormOne.controls['afterExpiration'].value,
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
        addOrUpdateURL = "api/auth/app/manufacturerMaster/saveManufactureReturnPolicy";
      }
      else {
        addOrUpdateURL = "api/auth/app/manufacturerMaster/saveManufactureReturnPolicy";
      }

      this.storageservice.postrequest(addOrUpdateURL, postData).subscribe((result:any) => {
        if (result['success']) {
          this.storageservice.hideLoadingIndicator();
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
          this.router.navigate(['/manufacturer-list'], navigationExtras);
        }
        else if (!result['success']) {
          this.storageservice.hideLoadingIndicator();
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
        });
    }
  }
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
