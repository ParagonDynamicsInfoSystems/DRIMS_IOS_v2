import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CedService } from '../ced.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.page.html',
  styleUrls: ['./company-list.page.scss'],
})
export class CompanyListPage implements OnInit {
  
  //#region Declaration

  companyList: any;
  searchInput: string = '';
  constructor(
    private router: Router,
    public storageservice: StorageService,
    private route: ActivatedRoute,
    public alertController: AlertController,
    private ced: CedService
  ) {}
  ngOnInit() {
    this.bindList();
  }
 
  gotoAddNew() {
    this.router.navigate(['/company-add']);
  }

  resetList() {
    this.searchInput = '';
    this.companyList = [];
    this.bindList();
  }

  edit_click(companyCode:any) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        companyCode: encodeURIComponent(this.ced.encryptAesToString(companyCode, this.storageservice.secretKey)),

      }
    };
    this.router.navigate(['/company-add'], navigationExtras); 
  }

  async delete(companyCode:any) {
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
                deletingId: this.ced.encryptAesToString(companyCode, this.storageservice.secretKey)
              };
              var deleteServiceUrl = "api/auth/app/companyMaster/delete";

              this.storageservice.postrequest(deleteServiceUrl, obj).subscribe(res => {
                var result :any= res
                if (result['success'] === true) {
                  this.storageservice.successToastCustom('Delete', 'Record has been deleted successfully.');
                  this.resetList()
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


  debitMemo_click(companyCode :any) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        companyCode: encodeURIComponent(this.ced.encryptAesToString(companyCode, this.storageservice.secretKey))
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
    var getListURL = `api/auth/app/companyMaster/getCompanyList?searchContent=${this.searchInput}`;
    this.storageservice.getrequest(getListURL).subscribe(
      (res) => {
        var result :any= res

        this.storageservice.hideLoadingIndicator();
        this.companyList = result['listCompanyListBean'];
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
    var getListURL = `api/auth/app/companyMaster/getList`;
    this.storageservice.getrequest(getListURL).subscribe(
      (res) => {
        var result :any= res

        this.companyList = result['listCompanyListBean'];
      },
      (error :any) => {
        
        if (error.name === 'HttpErrorResponse') {
          this.storageservice.warningToast('Internet connection problem, Please check your internet.');
          this.storageservice.GeneralAlert('HttpErrorResponse', 'Internet connection problem, Please check your internet.');
        } else {
          this.storageservice.warningToast('Error: ' + error.message);
        }
      });
  } 
  reload() {
    this.router.navigateByUrl('/refresh', { skipLocationChange: true }).then(() => {
      this.router.navigate(['']);
    });
  }
}
