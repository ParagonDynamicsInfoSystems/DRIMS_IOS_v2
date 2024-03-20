import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CedService } from '../ced.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { BarcodeScannerOptions } from '@awesome-cordova-plugins/barcode-scanner';
import { CommonService } from '../common.service';
import { ConnectivityService } from '../connectivity.service';
import { StorageService } from '../storage.service';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';

@Component({
  selector: 'app-company-return-item-add',
  templateUrl: './company-return-item-add.page.html',
  styleUrls: ['./company-return-item-add.page.scss'],
})
export class CompanyReturnItemAddPage implements OnInit {
  modelExpDate: Date = new Date(); ;
  datePickerConfig: Partial<BsDatepickerConfig>;
  isonline: boolean =true;

  onOpenCalendar(container: any) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }

  changeExpDate(event: any) {
    const monthCurrent = this.modelExpDate.getMonth() + 1;
    const currentMonth = (monthCurrent < 10 ? '0' : '') + monthCurrent;

    this.docForm.patchValue({
      expDate: `${currentMonth}/${this.modelExpDate.getFullYear()}`
    });
  }
  scannedData: any;
  
  //#region Declaration
  docForm: FormGroup;
  isSubmitted: boolean = false;
  IsEditMode: boolean = false;
  manufacturerList: any;
  dosageList: any;
  returnMemoNo: string ="";
  returnItemName: string ="";
  companyCode: any;
  returnReasonList: any;
  returnMemoItemsCode: any;
  defaultNDCUPC: boolean = true;
  greenNDCUPC: boolean = false;
  redNDCUPC: boolean = false;
  blueNDCUPC: boolean = false;
  // public ndcUpcTextMask = {
  //   guide: false,
  //   showMask: true,
  //   mask: [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/],
  // };

  readonly phoneMask: MaskitoOptions = {
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/],
  };

  readonly cardMask: MaskitoOptions = {
   
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/],
  };

  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();


  constructor(private ced: CedService, private router: Router, public formbuilder: FormBuilder, public storageservice: StorageService,
    private route: ActivatedRoute, public commonService: CommonService, public el: ElementRef,private connectivity: ConnectivityService
   //, private barcodeScanner: BarcodeScanner,
    ) {

    // Initialize the datePickerConfig object
    this.datePickerConfig = {
      dateInputFormat: 'MM/YYYY',
      containerClass: 'theme-default',
      monthLabel: 'MMM'
    };

    this.docForm = formbuilder.group({
      returnMemoItemsCode: [""],
      return: [""],
      returnMemoNo: [""],
      companyCode: [""],
      ndcupcCode: ["", [Validators.required, Validators.pattern('[0-9]{5}[-]{1}[0-9]{4}[-]{1}[0-9]{2}'), Validators.maxLength(13), Validators.minLength(13)]],
      unitPackage: [""],
      description: [""],
      controlNo: [""],
      packageSize: [""],
      strength: [""],
      estimatedValue: [""],
      dosage: [""],
      manufacturerBy: [""],
      returnTo: ["", [Validators.required]],
      price: ["", [Validators.required]],
      quantity: ["", [Validators.required]],
      dosageDescription: [""],
      fullParticalProduct: ["true", [Validators.required]],
      reason: ['4', [Validators.required]],
      expDate: ["", [Validators.required]],
      entryNo: [""],
      lotNo: ["", [Validators.required]],
      returnable: false,
      repackagedProduct: false,
      overridePolicy: [""],
      overridePolicyname: [""],
      isFutureDated: false,
    });
  }
  //#endregion

  //#region OnInit
  ngOnInit() {

    if(localStorage.getItem('onlineStatus') =="true"){
      this.isonline = true
    }else{
      this.isonline = false
    }
   // this.connectivity.showNetworkStatusAlert();
    
    this.modelExpDate = new Date();
    var monthCurrent = this.modelExpDate.getMonth() + 1;
    var currentMonth = (monthCurrent < 10 ? '0' : '') + monthCurrent;
    this.docForm.patchValue({
      'expDate': String(currentMonth) + '/' + String(this.modelExpDate.getFullYear()),
    });
    this.docForm.patchValue({
      'overridePolicyname': '',
      'overridePolicy': '',
    });
    this.commonService.getManufacturerList().subscribe(
      (response) => {
        this.manufacturerList = response;
      });
if(this.isonline){
    this.commonService.getReturnReasonDropdownList().subscribe(
      (data) => {
        this.returnReasonList = data;
      });
    }else{
      // this.datastorage.getreasomlist().then((data)=>{
      //   this.returnReasonList = data;

      // })
    }
    this.commonService.getDosageDropdownList().subscribe(
      (response) => {
        this.dosageList = response;
      });

    //Load existing values from the "Visit request" page.
    this.route.queryParams.subscribe(par => {
      var params:any=par
      if (params && params != null) {
        if (params.returnMemoNo != null) {
          this.returnMemoNo = this.ced.decryptAesformString(decodeURIComponent(params.returnMemoNo), this.storageservice.secretKey);
          var getReturnMemoNamebyIdURL = `api/auth/app/returnMemoItems/fetchreturnMemoNamebyId?returnMemoNo=${this.returnMemoNo}`;
          this.storageservice.getrequest(getReturnMemoNamebyIdURL).subscribe(
            (result: any) => {
              this.returnItemName = result?.text;
              this.companyCode = result?.value;
              this.docForm.patchValue({
                'returnMemoNo': this.returnMemoNo,
                'return': this.returnItemName,
                'companyCode': this.companyCode,
              })
            });
        }

        if (params.returnMemoItemsCode != null) {
          this.IsEditMode = true;
          this.returnMemoItemsCode = this.ced.decryptAesformString(decodeURIComponent(params.returnMemoItemsCode), this.storageservice.secretKey);
          this.docForm.patchValue({
            'returnMemoNo': this.returnMemoNo,
            'return': this.returnItemName,
            'companyCode': this.companyCode,
            'returnMemoItemsCode': this.returnMemoItemsCode,
          })
          //Load existing values
          this.BindExistingValues();
        }
      }
    });
    this.nextEntryNumber();
  }
  //#endregion

  //#region Functions
  BindExistingValues() {
    this.storageservice.showLoadingIndicator();
    var editServiceUrl = "api/auth/app/returnMemoItems/edit?returnMemoItemNo=" + this.returnMemoItemsCode;
    this.storageservice.getrequest(editServiceUrl).subscribe(res => {
      var result :any = res
      if (result["success"] == true) {
        //Edit details
        var data = result["returnMemoItemEditDetailsBean"];
        //To show the values
        this.docForm.patchValue({
          'returnMemoItemsCode': data["returnMemoItemsCode"],
          'ndcupcCode': data["ndcupcCode"],
          'unitPackage': data['unitPerPackage'],
          'description': data['description'],
          'controlNo': data['control'],
          'packageSize': data['packageSize'],
          'strength': data['strength'],
          'estimatedValue': data['estimateval'],
          'dosage': data['dosage'],
          'manufacturerBy': data['manufacturerBy'],
          'returnTo': data['linkToReturn'],
          'price': data['price'],
          'quantity': data['quantity'],
          'dosageDescription': data['dosageDescription'],
          'fullParticalProduct': this.getBoolean(data['fullParticalProduct']).toString(),
          'reason': data['reason'],
          'expDate': data['expDate'],
          'entryNo': data['entryNo'],
          'lotNo': data['lotNo'],
          'returnable': this.getBoolean(data['returnable']),
          'repackagedProduct': this.getBoolean(data['repackagedProduct']),
        });

        //Date picker start
        //Added by gokul for monthDate Date picker
        var monthEdit = parseInt(data['expDate'].substring(0, 2));
        var editMonth = (monthEdit < 10 ? '0' : '') + monthEdit;
        var editYear = parseInt(data['expDate'].substring(3, 8));
        var editTempExpValue = new Date(editMonth + "/01/" + editYear);
        this.modelExpDate = editTempExpValue;
        //Date picker end

        if (!this.getBoolean(data["hazardous"])) {
          if (data["control"] == 3 || data["control"] == 4 || data["control"] == 5) {
            this.greenNDCUPC = true;
            this.defaultNDCUPC = false;
            this.redNDCUPC = false;
            this.blueNDCUPC = false;
          } else if (data["control"] == 2) {
            this.redNDCUPC = true;
            this.defaultNDCUPC = false;
            this.greenNDCUPC = false;
            this.blueNDCUPC = false;
          } else {
            this.defaultNDCUPC = true;
            this.greenNDCUPC = false;
            this.redNDCUPC = false;
            this.blueNDCUPC = false;
          }
        } else {
          this.blueNDCUPC = true;
          this.defaultNDCUPC = false;
          this.greenNDCUPC = false;
          this.redNDCUPC = false;
        }
        this.storageservice.hideLoadingIndicator();
      } else {
        this.storageservice.hideLoadingIndicator();
      }

    });
  }
  //#endregion


  async checkValidationAndFullParticalProduct(valueForSubmitOrUpdate: any) {
    this.isSubmitted = true;
    if (!this.docForm.valid) {

      this.storageservice.warningToast('Please provide all the required values!');
    }
    // FullParticalProduct Quantity Start //   
    if (typeof this.docForm.value.quantity === 'number' && !Number.isInteger(this.docForm.value.quantity) && this.docForm.value.fullParticalProduct === 'true') {
      this.storageservice.warningToast('Quantity entered is not a whole number');
    }
    // FullParticalProduct Quantity End //

    //Check IsFullpackage Start //
    if (this.docForm.value.fullParticalProduct === 'true') {
      const userConfirmed = await this.storageservice.GeneralConfirmationAlert('Returnable Package', 'Is the Package(s) entered in full unopened Salable units?');
      if (userConfirmed) {
        // User chose "Yes"
        this.docForm.patchValue({
          'fullParticalProduct': 'true'
        })
        if(this.isonline){
        this.checkDrugIsReturnable(valueForSubmitOrUpdate);
        }else{
        this.checkDrugIsReturnableFromLocal(valueForSubmitOrUpdate);
         }
      } else {
        // User chose "No"
        this.docForm.patchValue({
          'fullParticalProduct': 'false'
        })
        if(this.isonline){
          this.checkDrugIsReturnable(valueForSubmitOrUpdate);
          }else{
          this.checkDrugIsReturnableFromLocal(valueForSubmitOrUpdate);
           }      }
    } else if (this.docForm.value.fullParticalProduct === 'false') {
      if(this.isonline){
        this.checkDrugIsReturnable(valueForSubmitOrUpdate);
        }else{
        this.checkDrugIsReturnableFromLocal(valueForSubmitOrUpdate);
         }    }
    // Check IsFullpackage End //
  }

//Check is Returnable From Local SQLite Starts 
async checkDrugIsReturnableFromLocal(valueForSubmitOrUpdate: any) {
  // this.docForm.patchValue({
  //   'overridePolicyname': '',
  //   'overridePolicy': '',
  //   'returnable': false,
  // })
  // this.storageservice.showLoadingIndicator();
  // await this.isReturnableOverridepolicyService.checkIsReturnableFromLocal(this.docForm.controls['ndcupcCode'].value, this.docForm.controls['fullParticalProduct'].value, this.docForm.controls['expDate'].value, this.docForm.controls['quantity'].value)
  // .then(async (result) => {
  //   this.storageservice.hideLoadingIndicator();
  //   if (result['success']) {
  //     if (this.docForm.value.repackagedProduct) {
  //       this.docForm.patchValue({
  //         'overridePolicyname': this.docForm.value.overridePolicyname + result['overridepolicyText'] + 'Repackaged products are non-returnable. <br>',
  //         'overridePolicy': this.docForm.value.overridePolicy + result['overridepolicyNumber'] + '1,',
  //       })
  //     } else {
  //       this.docForm.patchValue({
  //         'overridePolicyname': this.docForm.value.overridePolicyname + result['overridepolicyText'],
  //         'overridePolicy': this.docForm.value.overridePolicy + result['overridepolicyNumber'],
  //       })
  //     }


  //     if (result['overridepolicyText'] == 'YES' && this.docForm.value.controlNo != '2' && !this.docForm.value.repackagedProduct) {
  //       this.docForm.patchValue({
  //         'returnable': true,
  //       })
  //       if (valueForSubmitOrUpdate == 'onSubmit') {
  //         this.submitFinalClick();
  //       } else {
  //         this.submitFinalClick();
  //       }
  //     } else if (result['overridepolicyText'] == 'YES' && this.docForm.value.controlNo == '2' && !this.docForm.value.repackagedProduct) {
  //       const message = `Item is Returnable <br> Control 2 products require a 222 Form in order to be returned`;
  //       const userClickedOK = await this.storageservice.GeneralConfirmationAlertOK('Confirmation', message);
  //       if (userClickedOK) {
  //         // User clicked "OK"
  //         this.docForm.patchValue({
  //           'returnable': true,
  //         })
  //         if (valueForSubmitOrUpdate == 'onSubmit') {
  //           this.submitFinalClick();
  //         } else {
  //           this.submitFinalClick();
  //         }
  //       }
  //     } else if (this.docForm.value.overridePolicy != undefined && this.docForm.value.overridePolicy != null && this.docForm.value.overridePolicy != "") {
  //       //TO REPLACE 'YES' STRING 
  //       var re = /YES/gi;
  //       this.docForm.patchValue({
  //         'overridePolicyname': this.docForm.value.overridePolicyname.replace(re, ""),
  //       })

  //       let isFutureDatedProduct = false;
  //       if (this.docForm.value.overridePolicy === '2,') {
  //         isFutureDatedProduct = true;
  //       } else {
  //         isFutureDatedProduct = false;
  //       }

  //       var headerText = "";
  //       if (isFutureDatedProduct) {
  //         headerText = "Future Dated Item";
  //       } else {
  //         headerText = "Non-Returnable Item";
  //       }
  //       const userConfirmed = await this.storageservice.showConfirmationAlert(headerText, this.docForm.value.overridePolicyname, 'Override Policy & Save', 'Ok');
  //       if (this.docForm.value.overridePolicy === '2,') {
  //         if (userConfirmed) {
  //           // User clicked "Override Policy & Save"
  //           this.docForm.patchValue({
  //             'returnable': true,
  //             'isFutureDated': false
  //           })
  //         } else {
  //           this.docForm.patchValue({
  //             'returnable': false,
  //             'isFutureDated': true
  //           })
  //         }
  //       } else {
  //         this.docForm.patchValue({
  //           'returnable': userConfirmed
  //         })
  //       }

  //       if (valueForSubmitOrUpdate == 'onSubmit') {
  //         this.submitFinalClick();
  //       } else {
  //         this.submitFinalClick();
  //       }
  //     }
  //   }
  //   else if (!result['success']) {
  //     this.storageservice.warningToast(result['errorMessage']);
  //   }
  // })
  // .catch((error) => {
  //   this.storageservice.hideLoadingIndicator();
  //   console.error('Error occurred:', error.message);
  //   this.storageservice.warningToast(error.message);
  // });
} 
//Check is Returnable From Local SQLite End 

  // Check Drug IsReturnable Starts //
  checkDrugIsReturnable(valueForSubmitOrUpdate: any) {
    this.docForm.patchValue({
      'overridePolicyname': '',
      'overridePolicy': '',
      'returnable': false,
    })

    var postData = {
      'expDate': this.docForm.controls['expDate'].value,
      'ndcupcCode': this.docForm.controls['ndcupcCode'].value,
      'fullParticalProduct': this.docForm.controls['fullParticalProduct'].value,
      'quantity': this.docForm.controls['quantity'].value,
    }
    var checkDrugIsReturnableURL = "api/auth/app/returnMemoItems/checkDrugIsReturnable";
    this.storageservice.showLoadingIndicator();
    this.storageservice.postrequest(checkDrugIsReturnableURL, postData).subscribe(async res => {
      var result :any =  res
      this.storageservice.hideLoadingIndicator();
      if (result['success']) {
        if (this.docForm.value.repackagedProduct) {
          this.docForm.patchValue({
            'overridePolicyname': this.docForm.value.overridePolicyname + result['overridepolicyText'] + 'Repackaged products are non-returnable. <br>',
            'overridePolicy': this.docForm.value.overridePolicy + result['overridepolicyNumber'] + '1,',
          })
        } else {
          this.docForm.patchValue({
            'overridePolicyname': this.docForm.value.overridePolicyname + result['overridepolicyText'],
            'overridePolicy': this.docForm.value.overridePolicy + result['overridepolicyNumber'],
          })
        }


        if (result['overridepolicyText'] == 'YES' && this.docForm.value.controlNo != '2' && !this.docForm.value.repackagedProduct) {
          this.docForm.patchValue({
            'returnable': true,
          })
          if (valueForSubmitOrUpdate == 'onSubmit') {
            this.submitFinalClick();
          } else {
            this.submitFinalClick();
          }
        } else if (result['overridepolicyText'] == 'YES' && this.docForm.value.controlNo == '2' && !this.docForm.value.repackagedProduct) {
          const message = `Item is Returnable <br> Control 2 products require a 222 Form in order to be returned`;
          const userClickedOK = await this.storageservice.GeneralConfirmationAlertOK('Confirmation', message);
          if (userClickedOK) {
            // User clicked "OK"
            this.docForm.patchValue({
              'returnable': true,
            })
            if (valueForSubmitOrUpdate == 'onSubmit') {
              this.submitFinalClick();
            } else {
              this.submitFinalClick();
            }
          }
        } else if (this.docForm.value.overridePolicy != undefined && this.docForm.value.overridePolicy != null && this.docForm.value.overridePolicy != "") {
          //TO REPLACE 'YES' STRING 
          var re = /YES/gi;
          this.docForm.patchValue({
            'overridePolicyname': this.docForm.value.overridePolicyname.replace(re, ""),
          })

          let isFutureDatedProduct = false;
          if (this.docForm.value.overridePolicy === '2,') {
            isFutureDatedProduct = true;
          } else {
            isFutureDatedProduct = false;
          }

          var headerText = "";
          if (isFutureDatedProduct) {
            headerText = "Future Dated Item";
          } else {
            headerText = "Non-Returnable Item";
          }
          const userConfirmed = await this.storageservice.showConfirmationAlert(headerText, this.docForm.value.overridePolicyname, 'Override Policy & Save', 'Ok');
          if (this.docForm.value.overridePolicy === '2,') {
            if (userConfirmed) {
              // User clicked "Override Policy & Save"
              this.docForm.patchValue({
                'returnable': true,
                'isFutureDated': false
              })
            } else {
              this.docForm.patchValue({
                'returnable': false,
                'isFutureDated': true
              })
            }
          } else {
            this.docForm.patchValue({
              'returnable': userConfirmed
            })
          }

          if (valueForSubmitOrUpdate == 'onSubmit') {
            this.submitFinalClick();
          } else {
            this.submitFinalClick();
          }
        }
      }
      else if (!result['success']) {
        this.storageservice.warningToast(result['errorMessage']);
      }
    },
      error => {
        this.storageservice.hideLoadingIndicator();
        if (error.name == "HttpErrorResponse") {
          this.storageservice.warningToast('Internet connection problem, Pls check your internet.');
          this.storageservice.GeneralAlert('HttpErrorResponse', 'Internet connection problem, Pls check your internet.');
        }
        else {
          this.storageservice.warningToast(error.message);
        }
      });
  }
  //Check Drug IsReturnable End

  submitFinalClick() {

    if(this.isonline){
    var addOrUpdateURL = "";
    if (this.IsEditMode) {
      addOrUpdateURL = "api/auth/app/returnMemoItems/update";
    }
    else {
      addOrUpdateURL = "api/auth/app/returnMemoItems/save";
    }
    this.storageservice.showLoadingIndicator();
    this.storageservice.postrequest(addOrUpdateURL, this.docForm.value).subscribe(res => {
      var result :any =  res

      this.storageservice.hideLoadingIndicator();
      if (result['success']) {
        if (this.IsEditMode) {
          this.storageservice.successToast('updated successfully.');
        }
        else {
          this.storageservice.successToast('saved successfully.');
        }
        //Back
        this.navigateBackWithParams();
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
      });

    }else{
      // this.datastorage.createrReturn_memo_itemsLocalTable()

      // this.datastorage.insertReturnLocalDatabase( this.docForm.value).then((data)=>{
      //   this.storageservice.successToast('saved successfully in local.');
      //   this.navigateBackWithParams();

      // }

      // )
      // .catch()
    }
  }

  //Back
  navigateBackWithParams() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        returnMemoNo: encodeURIComponent(this.ced.encryptAesToString(this.returnMemoNo, this.storageservice.secretKey)),
      }
    };
    this.router.navigate(['/company-return-item-list'], navigationExtras);
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
  //#endregion

  find_Click() {
    
if(this.isonline){
    if (this.docForm.controls['ndcupcCode'].value != undefined && this.docForm.controls['ndcupcCode'].value != null && this.docForm.controls['ndcupcCode'].value != "") {
      var Url = "api/auth/app/commonServices/validateUnique?tableName=" + "drugs" + "&columnName=" + "ndcupc_code" + "&columnValue=" + this.docForm.value.ndcupcCode;
      this.storageservice.getrequest(Url).subscribe(res => {
        if (res) {
          this.docForm.controls['ndcupcCode'].setErrors(null);
          //   this.spinner.hide();
          const postData = {
            editId: decodeURIComponent(this.ced.encryptAesToString(this.docForm.value.ndcupcCode, this.storageservice.secretKey)),

          }
          //  this.spinner.show();
          var editServiceUrl = "api/auth/app/drugInfoMaster/edit";
          this.storageservice.postrequest(editServiceUrl, postData).subscribe(result => {
            var res :any =  result

            if (res["success"] == true) {
              var data = res["drugInfoMasterBean"];
              this.docForm.patchValue({
                'ndcupc': data["ndcupc"],
                'description': data["description"],
                'unitPackage': data["unitPerPackage"],
                'controlNo': data["control"],
                'packageSize': data["packageSize"],
                'strength': data["strength"],
                'dosage': data["dosage"],
                'estimatedValue': data["estimatedValue"],
                'manufacturerBy': data["manufacturerBy"],
                'returnTo': data["linkToReturn"],
                'price': data["price"],
                'dosageDescription': data["dosageDescription"]
              });

              if (!this.getBoolean(data["hazardous"])) {
                if (data["control"] == 3 || data["control"] == 4 || data["control"] == 5) {
                  this.greenNDCUPC = true;
                  this.defaultNDCUPC = false;
                  this.redNDCUPC = false;
                  this.blueNDCUPC = false;
                } else if (data["control"] == 2) {
                  this.redNDCUPC = true;
                  this.defaultNDCUPC = false;
                  this.greenNDCUPC = false;
                  this.blueNDCUPC = false;
                } else {
                  this.defaultNDCUPC = true;
                  this.greenNDCUPC = false;
                  this.redNDCUPC = false;
                  this.blueNDCUPC = false;

                }
              } else {
                this.blueNDCUPC = true;
                this.defaultNDCUPC = false;
                this.greenNDCUPC = false;
                this.redNDCUPC = false;
              }
            }
          });
        }
        else {
          this.docForm.controls['ndcupcCode'].setErrors({ ndcUpcCodeValid: true });
        }
      });
    }

  }else{
//     if (this.docForm.controls['ndcupcCode'].value != undefined && this.docForm.controls['ndcupcCode'].value != null && this.docForm.controls.ndcupcCode.value != "") 
//     {
//       this.datastorage.validate(this.docForm.value.ndcupcCode).then((res) => {
//         if (res) {
//         this.docForm.controls['ndcupcCode'].setErrors(null);

//         this.datastorage.feachdtl(this.docForm.value.ndcupcCode).then((res) => {
// console.log("res"+JSON.stringify(res))
//           var data = res;
//             this.docForm.patchValue({
//               'ndcupc': data["ndcupc"],
//               'description': data["description"],
//               'unitPackage': data["unitPerPackage"],
//               'controlNo': data["control"],
//               'packageSize': data["packageSize"],
//               'strength': data["strength"],
//               'dosage': data["dosage"],
//               'estimatedValue': data["estimatedValue"],
//               'manufacturerBy': data["manufacturerBy"],
//               'returnTo': data["linkToReturn"],
//               'price': data["price"],
//               'dosageDescription': data["dosageDescription"]
//             });

//             if (!this.getBoolean(data["hazardous"])) {
//               if (data["control"] == 3 || data["control"] == 4 || data["control"] == 5) {
//                 this.greenNDCUPC = true;
//                 this.defaultNDCUPC = false;
//                 this.redNDCUPC = false;
//                 this.blueNDCUPC = false;
//               } else if (data["control"] == 2) {
//                 this.redNDCUPC = true;
//                 this.defaultNDCUPC = false;
//                 this.greenNDCUPC = false;
//                 this.blueNDCUPC = false;
//               } else {
//                 this.defaultNDCUPC = true;
//                 this.greenNDCUPC = false;
//                 this.redNDCUPC = false;
//                 this.blueNDCUPC = false;

//               }
//             } else {
//               this.blueNDCUPC = true;
//               this.defaultNDCUPC = false;
//               this.greenNDCUPC = false;
//               this.redNDCUPC = false;
//             }

//         })

//         }
//         else {
//           this.docForm.controls['ndcupcCode'].setErrors({ ndcUpcCodeValid: true });
//         }

//       })
//       .catch((error) => {
//         console.error("Error fetching companies:", error);
//       });

//     }else{

//     }

    
  }
  }

  keyUpQuantityAndcheckDecimalOrInteger(event: any) {
    if (typeof this.docForm.value.quantity === 'number' && !Number.isInteger(this.docForm.value.quantity)) {
      this.docForm.patchValue({
        'fullParticalProduct': "false"
      });
    } else if (typeof this.docForm.value.quantity === 'number' && Number.isInteger(this.docForm.value.quantity)) {
      this.docForm.patchValue({
        'fullParticalProduct': "true"
      });
    }
  }

  nextEntryNumber() {
    var getReturnmemoItemsEntrynoURL = `api/auth/app/returnMemoItems/getReturnmemoItemsEntryno?returnMemoNo=${this.returnMemoNo}`;
    this.storageservice.getrequest(getReturnmemoItemsEntrynoURL).subscribe(
      (data: any) => {
        this.docForm.patchValue({
          'entryNo': data.number,
        })
      },
      (error) => {

      });
  }
  onInputChange() {
    if (this.docForm.controls['lotNo'].value) {
      this.docForm.patchValue({
        'lotNo': this.docForm.controls['lotNo'].value.toUpperCase()
      });
    }
  }

  //Added by Gokul For Scan NDCUPC QRCode
  scanBarcode() {
    // const options: BarcodeScannerOptions = {
    //   preferFrontCamera: false,
    //   showFlipCameraButton: true,
    //   showTorchButton: true,
    //   torchOn: false,
    //   prompt: 'Place a barcode inside the scan area',
    //   resultDisplayDuration: 500,
    //   formats: 'EAN_13,EAN_8,QR_CODE,PDF_417 ',
    //   orientation: 'portrait',
    // };
    // this.barcodeScanner.scan(options).then(barcodeData => {
    //   this.scannedData = barcodeData["text"];
    //   if (this.scannedData != undefined && this.scannedData != null && this.scannedData != "") {
    //     if (13 > parseInt(this.scannedData.length)) {
    //       var hypenRemovedNdcupcCode = this.scannedData.replaceAll("-", "");
    //       const length = 11 - parseInt(hypenRemovedNdcupcCode.length);
    //       var ndcupcCodeTempValue = hypenRemovedNdcupcCode;
    //       for (let i = 0; i < length; i++) {
    //         ndcupcCodeTempValue = '0' + ndcupcCodeTempValue
    //       }
    //       setTimeout(() => {
    //         if (ndcupcCodeTempValue != undefined && ndcupcCodeTempValue != null && ndcupcCodeTempValue != "") {
    //           this.docForm.patchValue({
    //             'ndcupcCode': ndcupcCodeTempValue
    //           });
    //           this.find_Click();
    //         }
    //       }, 5);
    //     }
    //   }
    // }).catch(err => {
    //   console.log('Error', err);
    // });
  }

}
