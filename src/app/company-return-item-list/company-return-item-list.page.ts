import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CedService } from '../ced.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-company-return-item-list',
  templateUrl: './company-return-item-list.page.html',
  styleUrls: ['./company-return-item-list.page.scss'],
})
export class CompanyReturnItemListPage implements OnInit {
  //#region Declaration
  debitMemoList: any;
  companyCode: string ="";
  returnMemoNo: string ="";
  returnItemName: string ="";
  searchInput: string = '';
  isonline: boolean;
  debitMemoListlocal: any;

  constructor(private router: Router, private ced: CedService, public storageservice: StorageService, private route: ActivatedRoute, public alertController: AlertController ) {
    //Load existing values from the "Visit request" page.

    if(localStorage.getItem('onlineStatus') =="true"){
      this.isonline = true
    }else{
      this.isonline = true
    }
    this.route.queryParams.subscribe(par => {
      var params :any = par
      if (params && params != null) {
        if (params.returnMemoNo != null) {
          this.returnMemoNo = this.ced.decryptAesformString(decodeURIComponent(params.returnMemoNo), this.storageservice.secretKey);
          var getReturnMemoNamebyIdURL = `api/auth/app/returnMemoItems/fetchreturnMemoNamebyId?returnMemoNo=${this.returnMemoNo}`;
          this.storageservice.getrequest(getReturnMemoNamebyIdURL).subscribe(
            (result:any) => {
              this.returnItemName = result?.text;
              this.companyCode = result?.value;            
            },
            (error) => {
              
            });
        }
      }
    });
  }
  
  ngOnInit() {
    if(localStorage.getItem('onlineStatus') =="true"){
      this.isonline = true
    }else{
      this.isonline = true
    }
    this.bindList();
  }

  gotoAddNew() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        returnMemoNo: encodeURIComponent(this.ced.encryptAesToString(this.returnMemoNo, this.storageservice.secretKey))
      }
    };
    this.router.navigate(['/company-return-item-add'], navigationExtras);
  }

  resetList() {
    this.searchInput = '';
    this.debitMemoList = [];
    this.bindList();
  }

  edit_click(returnMemoNo :any, returnMemoItemsCode :any) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        returnMemoNo: encodeURIComponent(this.ced.encryptAesToString(returnMemoNo, this.storageservice.secretKey)),
        returnMemoItemsCode: encodeURIComponent(this.ced.encryptAesToString(returnMemoItemsCode, this.storageservice.secretKey))
      }
    };
    this.router.navigate(['/company-return-item-add'], navigationExtras);
  }


async delete(returnMemoItemsCode:any) {
      let alert = await this.alertController.create({
        header: 'Delete request',
        message: 'Are you sure you want to delete this record?',
        cssClass: 'alertclass',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'alert-button-cancel',
            handler: () => {
              
            }
          },
          {
            text: 'Yes',
            cssClass: 'alert-button-yes',
            handler: () => {
              
              try {
                const obj = {
                  // returnMemoItemsNo: returnMemoItemsCode,
                  // returnMemoNo: this.returnMemoNo
                  returnMemoItemsNo: this.ced.encryptAesToString(returnMemoItemsCode, this.storageservice.secretKey),
                  returnMemoNo: this.ced.encryptAesToString(this.returnMemoNo, this.storageservice.secretKey)
                };
                var deleteServiceUrl = "api/auth/app/returnMemoItems/delete";
  
                this.storageservice.postrequest(deleteServiceUrl, obj).subscribe(res => {
                  var result :any = res
                  if (result['success'] === true) {
                    this.storageservice.successToastCustom('Delete', 'Record has been deleted successfully.');
                    this.resetList();
                  } else if (result['success'] === false) {
                    var msg = result['message'];
                    if (msg == null) {
                      msg = 'Unable to delete, Please contact support.';
                    }
                    this.storageservice.warningToast(msg);
                  }
                },
                error => {                  
                  if (error.name === 'HttpErrorResponse') {
                    this.storageservice.warningToast('Internet connection problem, Pls check your internet.');
                    this.storageservice.GeneralAlert('HttpErrorResponse', 'Internet connection problem, Pls check your internet.');
                  } else {
                    this.storageservice.warningToast('Error: ' + error.message);
                  }            
                });
              } catch (Exception) {
                this.storageservice.warningToast('Unable to delete, Please contact support.');
  
              }
  
            }
          }
        ]
      });
  
      await alert.present();
    }
  
    returnMemo_click(companyCode :any, companyName :any){
      let navigationExtras: NavigationExtras = {
        queryParams: {
          companyCode: companyCode,
          companyName: companyName
        }
      };
      this.router.navigate(['/company-debit-memo-list'], navigationExtras); 
    }
    filterList() {
      if (!this.searchInput || this.searchInput.trim() === '') {
        this.storageservice.warningToast('Please enter a value in the search field.');
        return;
      }
      this.storageservice.showLoadingIndicator();
      var getListURL = 'api/auth/app/returnMemoItems/getReturnMemoItemslist?returnMemoItemNo='+this.returnMemoNo+'&searchContent='+ this.searchInput;
      this.storageservice.getrequest(getListURL).subscribe(
        (res) => {
          var result :any = res

          this.storageservice.hideLoadingIndicator();
          this.debitMemoList = result['returnMemoItemsDashboardListBean'];
        },
        (error) => {
          this.storageservice.hideLoadingIndicator();
          
          if (error.name === 'HttpErrorResponse') {
            this.storageservice.warningToast('Internet connection problem, Please check your internet.');
            this.storageservice.GeneralAlert('HttpErrorResponse', 'Internet connection problem, Please check your internet.');
          } else {
            this.storageservice.warningToast('Error: ' + error.message);
          }
        }
      );
    }  
    navigateBackWithParams() {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          companyCode: encodeURIComponent(this.ced.encryptAesToString(this.companyCode, this.storageservice.secretKey))
        }
      };
      this.router.navigate(['/company-debit-memo-list'], navigationExtras); 
    }

    bindList() {
      if(this.isonline){
      var getListURL = 'api/auth/app/returnMemoItems/getList?returnMemoItemNo='+this.returnMemoNo;
      this.storageservice.getrequest(getListURL).subscribe(
        (res) => {
          var result :any = res

          this.debitMemoList = result['returnMemoItemsDashboardListBean'];

          // // this.datastorage.getreturnItemListLoacl().then((data: any)=>{
          // //   this.debitMemoListlocal =data
          // })

        },
        (error) => {
          this.storageservice.hideLoadingIndicator();
          
          if (error.name === 'HttpErrorResponse') {
            this.storageservice.warningToast('Internet connection problem, Please check your internet.');
            this.storageservice.GeneralAlert('HttpErrorResponse', 'Internet connection problem, Please check your internet.');
          } else {
            this.storageservice.warningToast('Error: ' + error.message);
          }
        }
      );
      }else{
        // this.datastorage.getMemoitemlist(this.returnMemoNo)
        // .then((Memo :any) => {
        //   console.log("Companies:", Memo);
        //   this.debitMemoList = Memo
        // })
        // .catch((error :any) => {
        //   console.error("Error fetching companies:", error);
        // });


        // this.datastorage.getreturnItemListLoacl().then((data: any)=>{
        //   this.debitMemoListlocal =data
        // })
      }
    }  

    uplodeLive(i: number = 0){
        let data :any = this.debitMemoListlocal[i]
console.log(JSON.stringify(data))
const json = {
  "returnMemoItemsCode": data.returnMemoItemsCode,
  "return": data.return,
  "returnMemoNo": data.returnMemoNo,
  "companyCode": data.companyCode,
  "ndcupcCode": data.ndcupcCode,
  "unitPackage": data.unitPackage,
  "description": data.description,
  "controlNo": data.controlNo,
  "packageSize": data.packageSize,
  "strength": data.strength,
  "dosage": data.dosage,
  "manufacturerBy": data.manufacturerBy,
  "returnTo":data.returnTo,
  "price": data.price,
  "quantity": data.quantity,
  "dosageDescription": data.dosageDescription,
  "fullParticalProduct": data.fullParticalProduct,
  "reason": data.reason,
  "expDate": data.expDate,
  "entryNo":data.entryNo,
  "lotNo": data.lotNo,
  "returnable": data.returnable,
  "repackagedProduct": data.repackagedProduct,
  "overridePolicy": data.overridePolicy,
  "overridePolicyname": data.overridePolicyname,
  "isFutureDated": data.isFutureDated
};


//  const json ={"returnMemoItemsCode":"","returnMemoNo":"1902TEST",
// "companyCode":"VoorqckDijxOG/Hgd2RGzQ==","ndcupcCode":"11111-1111-11",
// "unitPackage":"2","description":"TEST","controlNo":"2",
// "packageSize":"100","strength":"150","dosage":"ACC",
// "manufacturerBy":"M2968","returnTo":"jenny link to",
// "price":"10","quantity":10,"dosageDescription":"Accessory",
// "fullParticalProduct":"true","reason":"4","expDate":"03/2024",
// "entryNo":28,"lotNo":"H1","returnable":"true",
// "repackagedProduct":"false","overridePolicy":"",
// "overridePolicyname":"YES","isFutureDated":"false"}
console.log("json"+JSON.stringify(json));
console.log(data);
console.log(data.id)

 this.submitFinalClick(json).then((res)=>{
  if(this.debitMemoListlocal.length > i){
    this.uplodeLive(i+1)

    console.log(i)
    }
 })



    }

    async submitFinalClick(data :any) {

      var addOrUpdateURL = "";
     console.log("karthi check"+JSON.stringify(data))
   
        addOrUpdateURL = "api/auth/app/returnMemoItems/save";
      
       this.storageservice.showLoadingIndicator();
      this.storageservice.postrequest(addOrUpdateURL, data).subscribe((res) => {
                          var result :any = res

        console.log("karthi result"+JSON.stringify(result))

        this.storageservice.hideLoadingIndicator();
        if (result['success']) {
         


          //Back
          // this.navigateBackWithParams();
        }
        else if (!result['success']) {
          this.storageservice.warningToast('Error: ' + result['message']);

        }
  
      },
        (        error: any) => {
          // this.storageservice.hideLoadingIndicator();
          if (error.name == "HttpErrorResponse") {
            this.storageservice.warningToast('Internet connection problem, Pls check your internet.');
            this.storageservice.GeneralAlert('HttpErrorResponse', 'Internet connection problem, Pls check your internet.');
            return  {success :false};

          }
          else {
            this.storageservice.warningToast('Error: ' + error.message);
            return error.message;

          }
        });
  
    }
}
