import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CedService } from '../ced.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../storage.service';
import { CommonService } from '../common.service';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { register } from 'swiper/element/bundle';
import Swiper from 'swiper';
import { IonSelect } from '@ionic/angular';

register();

@Component({
  selector: 'app-company-add',
  templateUrl: './company-add.page.html',
  styleUrls: ['./company-add.page.scss'],
})
export class CompanyAddPage implements OnInit {
@ViewChild('swiper')

swiperRef:ElementRef | undefined
swiper?:Swiper
@ViewChild('input2') input2!: IonSelect;




  drimsFormOne!: FormGroup;
  drimsFormTwo!: FormGroup;
  drimsFormThree!: FormGroup;
  drimsFormFour!: FormGroup;
  drimsFormFive!: FormGroup;
  drimsFormSix!: FormGroup;
  drimsFormSeven!: FormGroup;
  drimsFormEight!: FormGroup;
  drimsFormNine!: FormGroup;
  drimsFormTen!: FormGroup;

  isSubmitted: boolean = false;
  requestId: any;
  IsEditMode: boolean = false;
  disabledAWPLessPercentage: boolean = true;
  stateList:any;
  wholesalerList: any;
  invoiceOptionsList = [{ id: 1, text: 'CPP' }, { id: 2, text: 'OPP' }, { id: 3, text: 'DPP' }, { id: 4, text: 'Destruction' }, { id: 5, text: 'Others' }];
  splCharNumRegex: string = "^[^<>{}\"/|;:,~!?@#$%^=&*\\]\\\\()\\[¿§«»ω⊙¤°℃℉€¥£¢¡®©0-9_+]*$";
  readonly phoneMask: MaskitoOptions = {
    mask: [ /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
  };

  readonly cardMask: MaskitoOptions = {
   
    mask:  [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/] ,
  };

  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

  constructor(private ced: CedService, private router: Router, public formbuilder: FormBuilder, public storageservice: StorageService,
    private route: ActivatedRoute, public commonService: CommonService) { 
      this.drimsFormTen = this.formbuilder.group({
        invoiceDetails: this.formbuilder.array([]) // Initialize invoiceDetails as a FormArray
      });
    

    this.drimsFormOne = formbuilder.group({
      companyCode: [""],
      companyName: ["", [Validators.required]],
      companyDba: [""],
      companyStreet: ["", [Validators.required]],
      companyCity: ["", [Validators.required]],
      companyState: ["", [Validators.required]],
    });

    this.drimsFormTwo = formbuilder.group({
      companyPincode: ["", [Validators.required, Validators.pattern('[0-9]{5}'), Validators.maxLength(5), Validators.minLength(5)]],
      companyPhone: ["", [Validators.required, Validators.pattern('[0-9]{3}[-]{1}[0-9]{3}[-]{1}[0-9]{4}'), Validators.maxLength(12), Validators.minLength(12)]],
      companyFax: ["", [Validators.required, Validators.pattern('[0-9]{3}[-]{1}[0-9]{3}[-]{1}[0-9]{4}'), Validators.maxLength(12), Validators.minLength(12)]],
      companyContact: ['', Validators.compose([Validators.maxLength(60), Validators.pattern(this.splCharNumRegex), Validators.required])],

      companyEmailID: ['', [Validators.required, Validators.email, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
      defNumber: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z]{2}[0-9]{7}')])],
      defExpirationDate: ['', [Validators.required]],
    });

    this.drimsFormThree = formbuilder.group({
      wholesalerPolicyCode: ["", [Validators.required]],
      wholesalerCode: ["", [Validators.required]],
      wholesalerPhoneNo: ["", [Validators.required, Validators.pattern('[0-9]{3}[-]{1}[0-9]{3}[-]{1}[0-9]{4}'), Validators.maxLength(12), Validators.minLength(12)]],
      wholesalerEmailID: ['', [Validators.required, Validators.email, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
    });

    this.drimsFormFour = formbuilder.group({
      wholesalerStreet: [""],
      wholesalerCity: [""],
      wholesalerState: [""],
      wholesalerZipCode: ["", [Validators.pattern("^[0-9]*$"), Validators.maxLength(5), Validators.minLength(5)]],

      wholesalerName: [""],
      wholesalerExpiryPacket: [""],
      wholesalerAllowOverride: [""],
      wholesalerDepartment: [""],
      wholesalerTollFreeNo: [""],
      wholesalerFax: [""],
      wholesalerPhone: [""],
    });
    this.drimsFormFive = formbuilder.group({
     
      issuesCreditsName: ['', Validators.required],
    });
    this.drimsFormSeven = formbuilder.group({
      issuesCreditsDba: [""],
      issuesCreditsStreet: ["", [Validators.required]],
      issuesCreditsCity: ["", [Validators.required]],
      issuesCreditsState: ["", [Validators.required]],
      issuesCreditsZipCode: ["", [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(5), Validators.minLength(5)]],
      issuesCreditsPhone: ["", [Validators.required, Validators.pattern('[0-9]{3}[-]{1}[0-9]{3}[-]{1}[0-9]{4}'), Validators.maxLength(12), Validators.minLength(12)]],
      issuesCreditsFax: ["", [Validators.required, Validators.pattern('[0-9]{3}[-]{1}[0-9]{3}[-]{1}[0-9]{4}'), Validators.maxLength(12), Validators.minLength(12)]],

    });

    this.drimsFormEight = formbuilder.group({
     
      generalInfroWacAwapMyprice: ['', ''],
      generalInfroWacAwapPer: ['', '']
    });

    this.drimsFormNine = formbuilder.group({
      myWholesalerPolicyType: ['', ''],
      myWholesalerPolicyMonths: ['', '']
    });

    this.drimsFormTen = formbuilder.group({
      invoiceOptions: ['', Validators.required],

      cppDirect: ['', ''],
      cppBatch: ['', ''],
      oppDirect: ['', ''],
      oppBatch: ['', ''],
      dppReturnFee: ['', ''],
      destructionDisposerx: ['', ''],
      destructionDisposalhazardous: ['', ''],
      invoiceDetails: this.formbuilder.array([
        this.formbuilder.group({
          inventoryName: [''],
          inventoryValue: [''],
        })
      ]),
    });
    }

  ngOnInit() {
    
    this.commonService.getWholesalerWithAddressDropdownList().subscribe(
      (data) => {
        this.wholesalerList = data;
      });

    this.commonService.getStateDropdownList().subscribe(
      (response) => {
        this.stateList = response;
      });
    //Load existing values from the "Visit request" page.
    this.route.queryParams.subscribe(par => {
      var params:any = par
      if (params && params != null && params.companyCode != null) {
        this.requestId = decodeURIComponent(params.companyCode);
        this.IsEditMode = true;
        //Load existing values
        this.BindExistingValues();
      }
    });

  }


  BindExistingValues() {
    var postData = {
      "editId": this.requestId
    }
    var editServiceUrl = "api/auth/app/companyMaster/edit";
    this.storageservice.postrequest(editServiceUrl, postData).subscribe(res => {
      var result :any = res
      if (result["success"] == true) {
        //Employee details
        var data = result["companyMaster"];
        //  this.wholesalerfetchDetailsById(this.ced.decryptAesformString(data['wholesalerCode'], this.storageservice.secretKey));
        this.drimsFormOne.patchValue({
          'companyCode': this.ced.decryptAesformString(data['companyCode'], this.storageservice.secretKey),
          "companyName": data['companyName'],
          "companyDba": data['companyDba'],
          "companyStreet": data['companyStreet'],
          "companyCity": data['companyCity'],
          "companyState": data['companyState'],
        });
        this.drimsFormTwo.patchValue({
          "companyPincode": data['companyPincode'],
          "companyPhone": data['companyPhone'],
          "companyFax": data['companyFax'],
          "companyContact": data['companyContact'],
          "companyEmailID": data['companyEmailID'],
          "defNumber": data['defNumber'],
          "defExpirationDate": data['defExpirationDate'],
        });

        this.drimsFormThree.patchValue({
          "wholesalerPolicyCode": data['wholesalerPolicyCode'],
          "wholesalerCode": this.ced.decryptAesformString(data['wholesalerCode'], this.storageservice.secretKey),
          "wholesalerPhoneNo": data['wholesalerPhoneNo'],
          "wholesalerEmailID": data['wholesalerEmailID'],
        });

        this.drimsFormFour.patchValue({
          "wholesalerStreet": data['wholesalerStreet'],
          "wholesalerCity": data['wholesalerCity'],
          "wholesalerState": data['wholesalerState'],
          "wholesalerZipCode": data['wholesalerZipCode'],
          "wholesalerName": data['wholesalerName'],
          "wholesalerExpiryPacket": data['wholesalerExpiryPacket'],
          "wholesalerAllowOverride": data['wholesalerAllowOverride'],
          "wholesalerDepartment": data['wholesalerDepartment'],
          "wholesalerTollFreeNo": data['wholesalerTollFreeNo'],
          "wholesalerFax": data['wholesalerFax'],
          //   "wholesalerPhone": data['wholesalerPhone'], 
        });

        this.drimsFormFive.patchValue({
          
          "issuesCreditsName": data['issuesCreditsName'],
        });

        this.drimsFormSeven.patchValue({
          "issuesCreditsDba": data['issuesCreditsDba'],
          "issuesCreditsStreet": data['issuesCreditsStreet'],
          "issuesCreditsCity": data['issuesCreditsCity'],
          "issuesCreditsState": data['issuesCreditsState'],
          "issuesCreditsZipCode": data['issuesCreditsZipCode'],
          "issuesCreditsPhone": data['issuesCreditsPhone'],
          "issuesCreditsFax": data['issuesCreditsFax']
        });

        this.drimsFormEight.patchValue({
        
          "generalInfroWacAwapMyprice": data['generalInfroWacAwapMyprice'],
          "generalInfroWacAwapPer": data['generalInfroWacAwapPer'],
        });

        this.drimsFormNine.patchValue({
          "myWholesalerPolicyType": data['myWholesalerPolicyType'],
          "myWholesalerPolicyMonths": data['myWholesalerPolicyMonths'],
        });
        this.drimsFormTen.patchValue({
          "cppDirect": data['cppDirect'],
          "cppBatch": data['cppBatch'],
          "oppDirect": data['oppDirect'],
          "oppBatch": data['oppBatch'],
          "destructionDisposerx": data['destructionDisposerx'],
          "destructionDisposalhazardous": data['destructionDisposalhazardous'],
          "dppReturnFee": data['dppReturnFee']
        });
        this.isCppEnable = this.getBoolean(data['cppOption']);
        this.isOppEnable = this.getBoolean(data['oppOption']);
        this.IsReturnFeeEnable = this.getBoolean(data['dppOption']);
        this.IsDestructionEnable = this.getBoolean(data['destructionOption']);
        if (this.isCppEnable == true) {
          this.drimsFormTen.patchValue({
            'invoiceOptions': "1"
          })
        }
        if (this.isOppEnable == true) {
          this.drimsFormTen.patchValue({
            'invoiceOptions': "2"
          })
        }
        if (this.IsReturnFeeEnable == true) {
          this.drimsFormTen.patchValue({
            'invoiceOptions': "3",
          })
        }
        if (this.IsDestructionEnable == true) {
          this.drimsFormTen.patchValue({
            'invoiceOptions': "4"
          })
        }
        if (data['companyInvoiceOptions'].length >= 1) {
          this.drimsFormTen.patchValue({
            'invoiceOptions': "5"
          })
          let invoiceDetailsArray = this.drimsFormTen.controls['invoiceDetails'] as FormArray;
          invoiceDetailsArray.removeAt(0);
          data.companyInvoiceOptions.forEach((element:any) => {
            let invoiceDetailsArray = this.drimsFormTen.controls['invoiceDetails'] as FormArray;
            let arraylen = invoiceDetailsArray.length;
            let newUsergroup: FormGroup = this.formbuilder.group({
              inventoryName: [element.inventoryName],
              inventoryValue: [element.inventoryValue],
            })
            invoiceDetailsArray.insert(arraylen, newUsergroup);
          })
        }
        this.invoiceOptionsChange(this.drimsFormTen.controls['invoiceOptions'].value);
      }
      else {
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
  secondCardNextClick() {
    this.isSubmitted = true;
    if (!this.drimsFormTwo.valid) {
      this.storageservice.warningToast('Please provide all the required values!');
    }
    else {
      this.next() 
    }
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
  fourthCardNextClick() {
    this.isSubmitted = true;
    if (!this.drimsFormFour.valid) {
      this.storageservice.warningToast('Please provide all the required values!');
    }
    else {
      this.next() 
    }
  }
  fifthCardNextClick() {
    this.isSubmitted = true;
    if (!this.drimsFormFive.valid) {
      this.storageservice.warningToast('Please provide all the required values!');
    }
    else {
      this.next() 
    }
  }

  sixthCardNextClick() {
    this.isSubmitted = true;
    if (!this.drimsFormSix.valid) {
      this.storageservice.warningToast('Please provide all the required values!');
    }
    else {
      this.next() 
    }
  }

  seventhCardNextClick() {
    this.isSubmitted = true;
    if (!this.drimsFormSeven.valid) {
      this.storageservice.warningToast('Please provide all the required values!');
    }
    else {
      this.next() 
    }
  }

  eighthCardNextClick() {
    this.isSubmitted = true;
    if (!this.drimsFormEight.valid) {
      this.storageservice.warningToast('Please provide all the required values!');
    }
    else {
      this.next() 
    }
  }

  ninthCardNextClick() {
    this.isSubmitted = true;
    if (!this.drimsFormNine.valid) {
      this.storageservice.warningToast('Please provide all the required values!');
    }
    else {
this.next() 
   }
  }

  submitFinalClick() {
    this.isSubmitted = true;
    if (!this.drimsFormOne.valid || !this.drimsFormTwo.valid || !this.drimsFormThree.valid ||
      !this.drimsFormFour.valid || !this.drimsFormFive.valid ||
      !this.drimsFormSeven.valid || !this.drimsFormEight.valid || !this.drimsFormNine.valid ||
      !this.drimsFormTen.valid) {
      this.storageservice.warningToast('Please provide all the required values!');
    }
    else {
      // Get all values
      var postData = {
        "companyCode": this.drimsFormOne.controls['companyCode'].value,
        "companyName": this.drimsFormOne.controls['companyName'].value,
        "companyDba": this.drimsFormOne.controls['companyDba'].value,
        "companyStreet": this.drimsFormOne.controls['companyStreet'].value,
        "companyCity": this.drimsFormOne.controls['companyCity'].value,
        "companyState": this.drimsFormOne.controls['companyState'].value,

        "companyPincode": this.drimsFormTwo.controls['companyPincode'].value,
        "companyPhone": this.drimsFormTwo.controls['companyPhone'].value,
        "companyFax": this.drimsFormTwo.controls['companyFax'].value,
        "companyContact": this.drimsFormTwo.controls['companyContact'].value,
        "companyEmailID": this.drimsFormTwo.controls['companyEmailID'].value,

        "wholesalerPolicyCode": this.drimsFormThree.controls['wholesalerPolicyCode'].value,
        "wholesalerCode": this.drimsFormThree.controls['wholesalerCode'].value,
        "wholesalerPhoneNo": this.drimsFormThree.controls['wholesalerPhoneNo'].value,
        "wholesalerEmailID": this.drimsFormThree.controls['wholesalerEmailID'].value,

        "wholesalerStreet": this.drimsFormFour.controls['wholesalerStreet'].value,
        "wholesalerCity": this.drimsFormFour.controls['wholesalerCity'].value,
        "wholesalerState": this.drimsFormFour.controls['wholesalerState'].value,
        "wholesalerZipCode": this.drimsFormFour.controls['wholesalerZipCode'].value,
        "wholesalerName": this.drimsFormFour.controls['wholesalerName'].value,
        "wholesalerExpiryPacket": this.drimsFormFour.controls['wholesalerExpiryPacket'].value,
        "wholesalerAllowOverride": this.drimsFormFour.controls['wholesalerAllowOverride'].value,
        "wholesalerDepartment": this.drimsFormFour.controls['wholesalerDepartment'].value,
        "wholesalerTollFreeNo": this.drimsFormFour.controls['wholesalerTollFreeNo'].value,
        "wholesalerFax": this.drimsFormFour.controls['wholesalerFax'].value,
        //   "wholesalerPhone": this.drimsFormFour.controls['wholesalerPhone'].value,
        "defNumber": this.drimsFormTwo.controls['defNumber'].value,
        "defExpirationDate": this.drimsFormTwo.controls['defExpirationDate'].value,
        "issuesCreditsName": this.drimsFormFive.controls['issuesCreditsName'].value,
        "issuesCreditsDba": this.drimsFormSeven.controls['issuesCreditsDba'].value,
        "issuesCreditsStreet": this.drimsFormSeven.controls['issuesCreditsStreet'].value,
        "issuesCreditsCity": this.drimsFormSeven.controls['issuesCreditsCity'].value,
        "issuesCreditsState": this.drimsFormSeven.controls['issuesCreditsState'].value,
        "issuesCreditsZipCode": this.drimsFormSeven.controls['issuesCreditsZipCode'].value,

        "issuesCreditsPhone": this.drimsFormSeven.controls['issuesCreditsPhone'].value,
        "issuesCreditsFax": this.drimsFormSeven.controls['issuesCreditsFax'].value,
        "generalInfroWacAwapMyprice": this.drimsFormEight.controls['generalInfroWacAwapMyprice'].value,
        "generalInfroWacAwapPer": this.drimsFormEight.controls['generalInfroWacAwapPer'].value,

        "myWholesalerPolicyType": this.drimsFormNine.controls['myWholesalerPolicyType'].value,
        "myWholesalerPolicyMonths": this.drimsFormNine.controls['myWholesalerPolicyMonths'].value,

        "invoiceOptions": this.drimsFormTen.controls['invoiceOptions'].value,
        "cppDirect": this.drimsFormTen.controls['cppDirect'].value,
        "cppBatch": this.drimsFormTen.controls['cppBatch'].value,

        "oppDirect": this.drimsFormTen.controls['oppDirect'].value,
        "oppBatch": this.drimsFormTen.controls['oppBatch'].value,
        "destructionDisposerx": this.drimsFormTen.controls['destructionDisposerx'].value,
        "destructionDisposalhazardous": this.drimsFormTen.controls['destructionDisposalhazardous'].value,

        'cppOption': this.isCppEnable,
        'oppOption': this.isOppEnable,
        'dppOption': this.IsReturnFeeEnable,
        'destructionOption': this.IsDestructionEnable,
        'dppReturnFee': this.drimsFormTen.controls['dppReturnFee'].value,
        'companyInvoiceOptions': []

      };
      let invoiceDetailsArray = this.drimsFormTen.controls['invoiceDetails'] as FormArray;
      let arraylen = invoiceDetailsArray.length;
      if (arraylen >= 1) {
        postData.companyInvoiceOptions = invoiceDetailsArray.value;
      }
      var addOrUpdateURL = "";
      if (this.IsEditMode) {
        addOrUpdateURL = "api/auth/app/companyMaster/update";
      }
      else {
        addOrUpdateURL = "api/auth/app/companyMaster/save";
      }

      this.storageservice.showLoadingIndicator();
      this.storageservice.postrequest(addOrUpdateURL, postData).subscribe(res => {
        var result :any = res
        this.storageservice.hideLoadingIndicator();
        if (result['success']) {
          if (this.IsEditMode) {
            this.storageservice.successToast('Company has been updated successfully.');
          }
          else {
            this.storageservice.successToast('Company has been saved successfully.');
          }

          let navigationExtras: NavigationExtras = {
            queryParams: {
              refreshPage: 'yes'
            }
          };
          this.router.navigate(['/company-list'], navigationExtras);
          this.storageservice.hideLoadingIndicator();
        }
        else if (!result['success']) {
          this.storageservice.warningToast('Error: ' + result['message']);
          this.storageservice.hideLoadingIndicator();
        }

      },
        error => {
          this.storageservice.hideLoadingIndicator();

          if (error.name == "HttpErrorResponse") {
            this.storageservice.warningToast('Internet connection problem, Pls check your internet.');
            this.storageservice.GeneralAlert('HttpErrorResponse', 'Internet connection problem, Pls check your internet.');
            this.storageservice.hideLoadingIndicator();
          }
          else {
            this.storageservice.warningToast('Error: ' + error.message);
            this.storageservice.hideLoadingIndicator();
          }
        },
        () => {
          // Completed call...
          this.storageservice.hideLoadingIndicator();
        }
      );
    }
  }
  IsMyWholesalerNotAcceptReturns: boolean = false;

  myWholesalerWill(selectedValue :any) {
    if (selectedValue == "wsNotAcceptRFOO") {
      this.IsMyWholesalerNotAcceptReturns = true;
    }
    else {
      this.IsMyWholesalerNotAcceptReturns = false;
    }
  }
  IsDestructionEnable: boolean = false;
  isCppEnable: boolean = false;
  IsReturnFeeEnable: boolean = false;
  isOppEnable: boolean = false;
  isOthers: boolean = false;

  invoiceOptionsChange(e :any) {
    if(e.detail.value !=null && e.detail.value !=undefined && e.detail.value !=null){
      var options = parseInt(e.detail.value);
      if (options == 1) {
        this.isCppEnable = true;
        this.isOppEnable = false;
        this.IsReturnFeeEnable = false;
        this.IsDestructionEnable = false;
        this.isOthers = false;
      }
      else if (options == 2) {
        this.isCppEnable = false;
        this.isOppEnable = true;
        this.IsReturnFeeEnable = false;
        this.IsDestructionEnable = false;
        this.isOthers = false;
      }
      else if (options == 3) {
        this.isOppEnable = false;
        this.isCppEnable = false;
        this.IsReturnFeeEnable = true;
        this.IsDestructionEnable = false;
        this.isOthers = false;
      }
      else if (e.detail.value == 4) {
        this.isCppEnable = false;
        this.isOppEnable = false;
        this.IsReturnFeeEnable = false;
        this.IsDestructionEnable = true;
        this.isOthers = false;
      }
      else if (options == 5) {
        this.isCppEnable = false;
        this.isOppEnable = false;
        this.IsReturnFeeEnable = false;
        this.IsDestructionEnable = false;
        this.isOthers = true;
      }
    }
  }
  wholesalerfetchDetailsById(whoCode: any): void {
    if (whoCode != undefined && whoCode != null && whoCode != "") {
      this.commonService.getWholesalerWithAddressDropdownList().subscribe(
        (data) => {
          data.forEach((who: any) => {
            if (who.id === whoCode) {
              who.address = who.text;
            }
          });
          this.wholesalerList = data;
          this.drimsFormThree.patchValue({
            'wholesalerCode': whoCode,
          });
        });
    }
    var postData = {
      "editId": this.ced.encryptAesToString(whoCode, this.storageservice.secretKey)
    }
    var editServiceUrl = "api/auth/app/wholesalerMaster/edit";
    this.storageservice.postrequest(editServiceUrl, postData).subscribe(res => {
      var result :any = res
      if (result["success"] == true) {
        //Employee details
        var data = result["wholesalerMasterBean"];
        //First
        this.drimsFormThree.patchValue({
          'wholesalerCode': whoCode,
          'wholesalerPhoneNo': data["phoneNo"],
          'wholesalerEmailID': data["emailID"],
        });
        //Second
        this.drimsFormFour.patchValue({
          'wholesalerName': data["wholesalerName"],
          //  "wholesalerExpiryPacket": data['wholesalerExpiryPacket'],
          "wholesalerAllowOverride": data['allowOverride'],
          "wholesalerDepartment": data['department'],
          "wholesalerPhone": data['contact'],
          'wholesalerStreet': data["street"],
          'wholesalerCity': data["city"],
          'wholesalerState': data["state"],
          'wholesalerZipCode': data["zipCode"],
          'wholesalerTollFreeNo': data["tollFreeNo"],
          'wholesalerFax': data["fax"],
        });
      }
    });
  }
  getCompanyAddress(event :any) {
    if (event.detail.checked == true) {
      this.drimsFormFive.patchValue({
        'issuesCreditsName': this.drimsFormOne.value.companyName,
      })
      this.drimsFormSeven.patchValue({
        'issuesCreditsDba': this.drimsFormOne.value.companyDba,
        'issuesCreditsStreet': this.drimsFormOne.value.companyStreet,
        'issuesCreditsCity': this.drimsFormOne.value.companyCity,
        'issuesCreditsState': this.drimsFormOne.value.companyState,
        'issuesCreditsZipCode': this.drimsFormTwo.value.companyPincode,
        'issuesCreditsPhone': this.drimsFormTwo.value.companyPhone,
        'issuesCreditsFax': this.drimsFormTwo.value.companyFax
      })
      this.drimsFormEight.patchValue({
     
      })
    } else {
      this.drimsFormFive.patchValue({
        'issuesCreditsName': '',
      })
      this.drimsFormEight.patchValue({
        'issuesCreditsPhone': '',
        'issuesCreditsFax': ''
      })
      this.drimsFormSeven.patchValue({
        'issuesCreditsName': '',
        'issuesCreditsDba': '',
        'issuesCreditsStreet': '',
        'issuesCreditsCity': '',
        'issuesCreditsState': '',
        'issuesCreditsZipCode': ''
      })
    }
  }

  addRow() {
    let invoiceDetailsArray = this.drimsFormTen.controls['invoiceDetails'] as FormArray;
    let arraylen = invoiceDetailsArray.length;
    let newUsergroup: FormGroup = this.formbuilder.group({
      inventoryName: [''],
      inventoryValue: [''],
    })
    invoiceDetailsArray.insert(arraylen, newUsergroup);
  }

  removeRow(index :any) {
    let invoiceDetailsArray = this.drimsFormTen.controls['invoiceDetails'] as FormArray;
    invoiceDetailsArray.removeAt(index);
  }
  getBoolean(value :any) {
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
  onSelectionGeneralInfroWacAwapMyprice() {
    if (this.drimsFormEight.value.generalInfroWacAwapMyprice == 'AWP') {
      this.disabledAWPLessPercentage = false;
      this.drimsFormEight.controls['generalInfroWacAwapPer'].setValidators(Validators.compose([Validators.required, Validators.max(100), Validators.min(0), Validators.pattern(/^(100(\.0{1,2})?|[1-9]?\d(\.\d{1,2})?)$/)]));
      this.drimsFormEight.controls['generalInfroWacAwapPer'].updateValueAndValidity();
    } else {
      this.disabledAWPLessPercentage = true;
      this.drimsFormEight.controls['generalInfroWacAwapPer'].clearValidators();
      this.drimsFormEight.controls['generalInfroWacAwapPer'].updateValueAndValidity();
      this.drimsFormEight.patchValue({
        'generalInfroWacAwapPer': '',
      })
    }
  }
  onInputChange(event: any) {
    const value = event.target.value;
    const newValue = value.replace(/[^a-zA-Z ]/g, '');
    this.drimsFormTwo.patchValue({
      "companyContact": newValue,
    });
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

focusInput(event :any, nextInput :any) {
  if (event.key === 'Tab') {
    event.preventDefault(); // prevent default tab behavior
    switch (nextInput) {
      case 'input2':
        this.input2.open();
        break;
    }
  }
}
}

