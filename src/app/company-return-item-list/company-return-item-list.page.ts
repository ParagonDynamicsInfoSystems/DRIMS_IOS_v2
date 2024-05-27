import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CedService } from '../ced.service';
import { StorageService } from '../storage.service';
import { DatabaseService } from '../database.service';

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

  constructor(private router: Router, private ced: CedService, public storageservice: StorageService, private route: ActivatedRoute, public alertController: AlertController 
    ,private datastorage : DatabaseService,
  ) {
    //Load existing values from the "Visit request" page.

    if(localStorage.getItem('networkstatus') !="offline"){
      this.isonline = true
    }else{
      this.isonline = false
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
    if(localStorage.getItem('networkstatus') != "offline"){
      this.isonline = true
    }else{
      this.isonline = false
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

  edit_clickOffline(id:any) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        ref: id
      }
    };
    this.router.navigate(['/company-return-item-add'], navigationExtras);
  }
  async deletelocal(id:any){
    let alert = await this.alertController.create({
      header: 'Delete request',
      message: 'Are you sure you want to delete this record in local?',
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
           

              this.datastorage.deleteitemlocal(id).then(res => {
                var result :any = res
                if (result['success'] === true) {
                  this.storageservice.successToastCustom('Delete', 'Record has been deleted successfully in local.');
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

      

          this.datastorage.getreturnItemListLoacl(this.returnMemoNo).then((data: any)=>{
            this.debitMemoListlocal =data
  
            for(let i = 0 ; i<this.debitMemoListlocal.length; i++){
             if(this.debitMemoListlocal[i].fullParticalProduct) {
              this.debitMemoListlocal[i].fullParticalProductloc = "Yes"
             }else{
              this.debitMemoListlocal[i].fullParticalProductloc = "NO"
  
             }
  
             if(this.debitMemoListlocal[i].returnable) {
              this.debitMemoListlocal[i].returnableloc = "Yes"
             }else{
              this.debitMemoListlocal[i].returnableloc = "NO"
  
             }
            }
          })

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
        this.datastorage.getMemoitemlist(this.returnMemoNo)
        .then((Memo :any) => {
          console.log("Companies:", Memo);
          this.debitMemoList = Memo
        })
        .catch((error :any) => {
          console.error("Error fetching companies:", error);
        });


        this.datastorage.getreturnItemListLoacl(this.returnMemoNo).then((data: any)=>{
          this.debitMemoListlocal =data

          for(let i = 0 ; i<this.debitMemoListlocal.length; i++){
           if(this.debitMemoListlocal[i].fullParticalProduct) {
            this.debitMemoListlocal[i].fullParticalProductloc = "Yes"
           }else{
            this.debitMemoListlocal[i].fullParticalProductloc = "NO"

           }

           if(this.debitMemoListlocal[i].returnable) {
            this.debitMemoListlocal[i].returnableloc = "Yes"
           }else{
            this.debitMemoListlocal[i].returnableloc = "NO"

           }
          }
        })
      }
    }  

    uplodeLive(i: number = 0){
        let data :any = this.debitMemoListlocal
console.log(data)




console.log(data);
try{
for (let i = 0 ; i < data.length ; i++){
this.submitFinalClick(data[i]).then((res)=>{

  console.log(res)

  if(res){
    this.datastorage.updatereturn_memo_items_local(data[i].id)
  }
})}
this.storageservice.successToast("Updated to live successfully")
}catch{

}

    }

    async submitFinalClick(data :any) {
var issucess = true
      var addOrUpdateURL = "";
     console.log("karthi check"+JSON.stringify(data))
   
        addOrUpdateURL = "api/auth/app/returnMemoItems/save";
      
       this.storageservice.showLoadingIndicator();
      this.storageservice.postrequest(addOrUpdateURL, data).subscribe((res) => {
                          var result :any = res

        console.log("karthi result"+JSON.stringify(result))
        this.storageservice.hideLoadingIndicator();
        if (result['success']) {
          issucess = true




          //Back
          // this.navigateBackWithParams();

          
        }
        else if (!result['success']) {
          this.storageservice.warningToast('Error: ' + result['message']);
          issucess = false

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
        return  issucess

    }
}
