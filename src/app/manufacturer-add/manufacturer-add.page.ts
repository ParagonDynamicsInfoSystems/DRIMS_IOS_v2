import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { CommonService } from '../common.service';
import { StorageService } from '../storage.service';
import { register } from 'swiper/element/bundle';
import Swiper from 'swiper';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';

register();

@Component({
  selector: 'app-manufacturer-add',
  templateUrl: './manufacturer-add.page.html',
  styleUrls: ['./manufacturer-add.page.scss'],
})
export class ManufacturerAddPage implements OnInit {
  @ViewChild('swiper')
swiperRef:ElementRef | undefined
swiper?:Swiper
  //#region Declaration
  drimsFormOne: FormGroup;
  drimsFormTwo: FormGroup;
  drimsFormThree: FormGroup;
  isSubmitted: boolean = false;
  dosageList: any;
  requestId: any;
  IsEditMode: boolean = false;
  batchAccountName: any;
  stateList : any;
  public patternMask = {
    guide: false,
    showMask: true,
    mask: [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
  };
  readonly phoneMask: MaskitoOptions = {
    mask: [ /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
  };

  readonly cardMask: MaskitoOptions = {
   
    mask:  [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/] ,
  };

  readonly zipMask: MaskitoOptions = {
   
    mask:  [/\d/, /\d/, /\d/, /\d/, /\d/] ,
  };

  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

  constructor(private router: Router, public formbuilder: FormBuilder, public storageservice: StorageService,
    private route: ActivatedRoute, public commonService: CommonService) {
    //First
    this.drimsFormOne = formbuilder.group({
      manufacturerCode: [""],
      manufacturerName: ["", [Validators.required]],
      phoneNo: ["", [Validators.required, Validators.pattern('[0-9]{3}[-]{1}[0-9]{3}[-]{1}[0-9]{4}'), Validators.maxLength(12), Validators.minLength(12)]],
      emailId: ["", [Validators.email, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
      linkTo: ["", [Validators.required]]
    });
    //Second
    this.drimsFormTwo = formbuilder.group({
      billTo: ["MANUFACTURER", [Validators.required]],
      billingPreference: ["DIRECT", [Validators.required]],
      streetName: [""],
      cityName: [""]
    });
    //Third
    this.drimsFormThree = formbuilder.group({
      stateName: [""],
      zipCode: ["", [Validators.pattern("^[0-9]*$"), Validators.maxLength(5), Validators.minLength(5)]],
      tollFreeNo: ["", [Validators.pattern('[0-9]{3}[-]{1}[0-9]{3}[-]{1}[0-9]{4}'), Validators.maxLength(12), Validators.minLength(12)]],
      fax: ["", [Validators.pattern('[0-9]{3}[-]{1}[0-9]{3}[-]{1}[0-9]{4}'), Validators.maxLength(12), Validators.minLength(12)]],
      isSpecial: false,
    });
  }

  //#endregion

  //#region OnInit
  ngOnInit() {
    this.commonService.getStateDropdownList().subscribe(
      (response) => {
        this.stateList = response;
      },
      (error) => {
        console.error(error);
      });
    var getBatchAccountNameURL = `api/auth/app/settings/getBatchAccountName`;
    this.storageservice.getrequest(getBatchAccountNameURL).subscribe((result:any) => {
      if (result['text'] != undefined && result['text'] != null && result['text'] != "") {
        this.batchAccountName = result['text'];
      }
    },
      (error) => {
        console.error(error);
      });

    //Load existing values from the page.
    this.route.queryParams.subscribe((params:any) => {
      if (params && params != null && params.manufacturerCode != null) {
        this.requestId = decodeURIComponent(params.manufacturerCode);
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
    var editServiceUrl = "api/auth/app/manufacturerMaster/edit";
    this.storageservice.postrequest(editServiceUrl, postData).subscribe((result:any) => {
      if (result["success"] == true) {
        //Employee details
        var data = result["manufacturerMasterBean"];
        //To show the values
        this.drimsFormOne.patchValue({
          'manufacturerCode': data["manufacturerCode"],
          'manufacturerName': data["manufacturerName"],
          'phoneNo': data["phoneNo"],
          'emailId': data["emailId"],
          'linkTo': data["linkTo"]
        });
        this.drimsFormTwo.patchValue({
          'billTo': data["billTo"],
          'billingPreference': data["billingPreference"],
          'streetName': data["streetName"],
          cityName: data["cityName"]
        });
        this.drimsFormThree.patchValue({
          'stateName': data["stateName"],
          'zipCode': data["zipCode"],
          'tollFreeNo': data["tollFreeNo"],
          'fax': data["fax"],
          'isSpecial': this.getBoolean(data["isSpecial"]),
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
      this.next()
    }
  }

  secondCardNextClick() {
    this.isSubmitted = true;
    if (!this.drimsFormTwo.valid) {

      this.storageservice.warningToast('Please provide all the required values!');
    }
    else {
      this.next()
    }
  }

  moveToPrevious() {
    this.isSubmitted = false;
this.back()
 }

  submitFinalClick() {
    this.isSubmitted = true;
    if (!this.drimsFormThree.valid || !this.drimsFormTwo.valid || !this.drimsFormOne.valid) {

      this.storageservice.warningToast('Please provide all the required values!');
    }
    else {
      var postData = {
        "manufacturerCode": this.drimsFormOne.controls['manufacturerCode'].value,
        "manufacturerName": this.drimsFormOne.controls['manufacturerName'].value,
        "phoneNo": this.drimsFormOne.controls['phoneNo'].value,
        "emailId": this.drimsFormOne.controls['emailId'].value,
        "linkTo": this.drimsFormOne.controls['linkTo'].value,

        "billTo": this.drimsFormTwo.controls['billTo'].value,
        "billingPreference": this.drimsFormTwo.controls['billingPreference'].value,
        "streetName": this.drimsFormTwo.controls['streetName'].value,
        "cityName": this.drimsFormTwo.controls['cityName'].value,

        "stateName": this.drimsFormThree.controls['stateName'].value,
        "zipCode": this.drimsFormThree.controls['zipCode'].value,
        "tollFreeNo": this.drimsFormThree.controls['tollFreeNo'].value,
        "fax": this.drimsFormThree.controls['fax'].value,
        "isSpecial": this.drimsFormThree.controls['isSpecial'].value
      }
      var addOrUpdateURL = "";
      if (this.IsEditMode) {
        addOrUpdateURL = "api/auth/app/manufacturerMaster/update";
      }
      else {
        addOrUpdateURL = "api/auth/app/manufacturerMaster/save";
      }

      this.storageservice.showLoadingIndicator();
      this.storageservice.postrequest(addOrUpdateURL, postData).subscribe((result:any) => {
        this.storageservice.hideLoadingIndicator();
        if (result['success']) {
          if (this.IsEditMode) {
            this.storageservice.successToast('Manufacturer has been updated successfully.');
          }
          else {
            this.storageservice.successToast('Manufacturer has been saved successfully.');
          }

          let navigationExtras: NavigationExtras = {
            queryParams: {
              refreshPage: 'yes'
            }
          };
          this.router.navigate(['/manufacturer-list'], navigationExtras);
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

        });
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
  }}
