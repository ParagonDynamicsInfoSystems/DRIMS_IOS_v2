import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CommonService } from '../common.service';
import { StorageService } from '../storage.service';
import { register } from 'swiper/element/bundle';
import Swiper from 'swiper';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';

register();

@Component({
  selector: 'app-wholesaler-add',
  templateUrl: './wholesaler-add.page.html',
  styleUrls: ['./wholesaler-add.page.scss'],
})
export class WholesalerAddPage implements OnInit {
  @ViewChild('swiper')
  swiperRef:ElementRef | undefined
  swiper?:Swiper
  //#region Declaration
  drimsFormOne: FormGroup;
  drimsFormTwo: FormGroup;
  drimsFormThree: FormGroup;
  isSubmitted: boolean = false;
  requestId: any;
  IsEditMode: boolean = false;
  stateList:any;
  //#endregion
  splCharNumRegex: string = "^[^<>{}\"/|;:,~!?@#$%^=&*\\]\\\\()\\[¿§«»ω⊙¤°℃℉€¥£¢¡®©0-9_+]*$";
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

  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();


  //#region Constructor
  constructor(private router: Router, public formbuilder: FormBuilder, public storageservice: StorageService,
    private route: ActivatedRoute, public commonService: CommonService) {
    //First
    this.drimsFormOne = formbuilder.group({
      wholesalerCode: [""],
      wholesalerName: ["", [Validators.required]],
      department: [""],
      contact: ['', Validators.compose([Validators.maxLength(60), Validators.pattern(this.splCharNumRegex), Validators.required])],
      phoneNo: ["", [Validators.required, Validators.pattern('[0-9]{3}[-]{1}[0-9]{3}[-]{1}[0-9]{4}'), Validators.maxLength(12), Validators.minLength(12)]],
      emailID: ['', [Validators.required, Validators.email, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
    });
    //Second
    this.drimsFormTwo = formbuilder.group({
      street: [""],
      city: [""],
      state: [""],
      zipCode: ["", [Validators.pattern("^[0-9]*$"), Validators.maxLength(5), Validators.minLength(5)]],
    });
    //Third
    this.drimsFormThree = formbuilder.group({
      tollFreeNo: ["", [Validators.pattern('[0-9]{3}[-]{1}[0-9]{3}[-]{1}[0-9]{4}'), Validators.maxLength(12), Validators.minLength(12)]],
      fax: ["", [Validators.pattern('[0-9]{3}[-]{1}[0-9]{3}[-]{1}[0-9]{4}'), Validators.maxLength(12), Validators.minLength(12)]],
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
    //Load existing values from the "Visit request" page.
    this.route.queryParams.subscribe((params:any) => {
      if (params && params != null && params.wholesalerCode != null) {
        this.requestId = decodeURIComponent(params.wholesalerCode);
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
    var editServiceUrl = "api/auth/app/wholesalerMaster/edit";
    this.storageservice.postrequest(editServiceUrl, postData).subscribe((result:any) => {
      if (result["success"] == true) {
        //Employee details
        var data = result["wholesalerMasterBean"];
        //To show the values 
        //First
        this.drimsFormOne.patchValue({
          wholesalerCode: data["wholesalerCode"],
          wholesalerName: data["wholesalerName"],
          department: data["department"],
          contact: data["contact"],
          phoneNo: data["phoneNo"],
          emailID: data["emailID"],
        });
        //Second
        this.drimsFormTwo.patchValue({
          street: data["street"],
          city: data["city"],
          state: data["state"],
          zipCode: data["zipCode"],
        });
        //Third
        this.drimsFormThree.patchValue({
          tollFreeNo: data["tollFreeNo"],
          fax: data["fax"],
        });
        this.storageservice.hideLoadingIndicator();
      }
      else{
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
this.back() 
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

  submitFinalClick() {
    this.isSubmitted = true;
    if (!this.drimsFormThree.valid || !this.drimsFormTwo.valid || !this.drimsFormOne.valid) {
      
      this.storageservice.warningToast('Please provide all the required values!');
    }
    else {
      // Get all values
      var postData = {
        "wholesalerCode": this.drimsFormOne.controls['wholesalerCode'].value,
        "wholesalerName": this.drimsFormOne.controls['wholesalerName'].value,
        "department": this.drimsFormOne.controls['department'].value,
        "contact": this.drimsFormOne.controls['contact'].value,
        "phoneNo": this.drimsFormOne.controls['phoneNo'].value,
        "emailID": this.drimsFormOne.controls['emailID'].value,
        "street": this.drimsFormTwo.controls['street'].value,
        "city": this.drimsFormTwo.controls['city'].value,
        "state": this.drimsFormTwo.controls['state'].value,
        "zipCode": this.drimsFormTwo.controls['zipCode'].value,
        "fax": this.drimsFormThree.controls['fax'].value,
        "tollFreeNo": this.drimsFormThree.controls['tollFreeNo'].value,
      };
      var addOrUpdateURL = "";
      if (this.IsEditMode) {
        addOrUpdateURL = "api/auth/app/wholesalerMaster/update";
      }
      else {
        addOrUpdateURL = "api/auth/app/wholesalerMaster/save";
      }

      this.storageservice.postrequest(addOrUpdateURL, postData).subscribe((result:any) => {
        this.storageservice.hideLoadingIndicator();
        if (result['success']) {
          if (this.IsEditMode) {
            this.storageservice.successToast('Wholesaler has been updated successfully.');
          }
          else {
            this.storageservice.successToast('Wholesaler has been saved successfully.');
          }

          let navigationExtras: NavigationExtras = {
            queryParams: {
              refreshPage: 'yes'
            }
          };
          this.router.navigate(['/wholesaler-list'], navigationExtras);
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
