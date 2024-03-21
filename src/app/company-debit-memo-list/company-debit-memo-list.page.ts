import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CedService } from '../ced.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-company-debit-memo-list',
  templateUrl: './company-debit-memo-list.page.html',
  styleUrls: ['./company-debit-memo-list.page.scss'],
})
export class CompanyDebitMemoListPage implements OnInit {
  //#region Declaration
  debitMemoList: any;
  companyCode: string ="";
  companyName: string="";
  searchInput: string = '';
  isonline: boolean;
  debitMemoListlocal: any;
  constructor(private router: Router, public storageservice: StorageService, private route: ActivatedRoute, public alertController: AlertController, private ced: CedService
   ) {
    if(localStorage.getItem('onlineStatus') =="true"){
      this.isonline = true
    }else{
      this.isonline = true
    }
    //Load existing values from the "Visit request" page.
    this.route.queryParams.subscribe(par => {
      var params :any = par
      if (params && params != null) {
        if (params.companyCode != null) {
          this.companyCode = this.ced.decryptAesformString(decodeURIComponent(params.companyCode), this.storageservice.secretKey);
          if(this.isonline){
          var getCompanyNamebyIdURL = `api/auth/app/debitMemo/fetchcompanyNamebyId?companyCode=${params.companyCode}`;
          this.storageservice.getrequest(getCompanyNamebyIdURL).subscribe(
            (result:any) => {
              this.companyName = result.text;
            },
            (error) => {
              
            });
          }else{
            
          }

        }
      }
    });
  }
  //#endregion

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
        companyCode: this.companyCode
      }
    };
    this.router.navigate(['/company-debit-memo-add'], navigationExtras);
  }

  resetList() {
    this.searchInput = '';
    this.debitMemoList = [];
    this.bindList();
  }
  
  edit_click(returnMemoNo :any) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        returnMemoNo: encodeURIComponent(this.ced.encryptAesToString(returnMemoNo, this.storageservice.secretKey)) ,
        companyCode: this.companyCode
      }
    };
    this.router.navigate(['/company-debit-memo-add'], navigationExtras);
  }
  
  addReturnItem_click(returnMemoNo:any, returnMemoName:any) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        returnMemoNo: encodeURIComponent(this.ced.encryptAesToString(returnMemoNo, this.storageservice.secretKey)),
      }
    };
    this.router.navigate(['/company-return-item-list'], navigationExtras);
  }

  
  async delete(id :any) {
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
                deletingId: this.ced.encryptAesToString(id, this.storageservice.secretKey)
              };
              var deleteServiceUrl = "api/auth/app/debitMemo/delete";

              this.storageservice.postrequest(deleteServiceUrl, obj).subscribe(res => {
                var result :any= res

                if (result['success'] === true) {
                  this.storageservice.successToastCustom('Delete', 'Record has been deleted successfully.');
                  this.filterList();
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

  filterList() {
    if (!this.searchInput || this.searchInput.trim() === '') {
      this.storageservice.warningToast('Please enter a value in the search field.');
      return;
    }
    this.storageservice.showLoadingIndicator();
    var getListURL = 'api/auth/app/debitMemo/getDebitMemoList?companyCode='+this.companyCode+'&searchContent='+ this.searchInput;
    this.storageservice.getrequest(getListURL).subscribe(
      (res) => {
        var result :any= res

        this.storageservice.hideLoadingIndicator();
        this.debitMemoList = result['listDebitMemo'];
      },
      (error) => {
        this.storageservice.hideLoadingIndicator();
        
        if (error.name === 'HttpErrorResponse') {
          this.storageservice.warningToast('Internet connection problem, Please check your internet.');
          this.storageservice.GeneralAlert('HttpErrorResponse', 'Internet connection problem, Please check your internet.');
        } else {
          this.storageservice.warningToast('Error: ' + error.message);
        }
      });
  } 
  
  bindList() {

    if(this.isonline){
    const obj = {
      company: this.companyCode
    }  
    this.storageservice.showLoadingIndicator();
    var getListURL = 'api/auth/app/debitMemo/getList';
    this.storageservice.postrequest(getListURL, obj).subscribe(
      (res) => {
        var result :any= res

        this.storageservice.hideLoadingIndicator();
        this.debitMemoList = result['listDebitMemo'];

       
      },
      (error) => {
        this.storageservice.hideLoadingIndicator();
        
        if (error.name === 'HttpErrorResponse') {
          this.storageservice.warningToast('Internet connection problem, Please check your internet.');
          this.storageservice.GeneralAlert('HttpErrorResponse', 'Internet connection problem, Please check your internet.');
        } else {
          this.storageservice.warningToast('Error: ' + error.message);
        }
      });
  } else{
    // this.datastorage.getMemolist(this.companyCode)
    // .then((Memo) => {
    //   console.log("Companies:", Memo);
    //   this.debitMemoList = Memo
    // })
    // .catch((error) => {
    //   console.error("Error fetching companies:", error);
    // });
  }
}

}
