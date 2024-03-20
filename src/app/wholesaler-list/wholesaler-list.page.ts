import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CedService } from '../ced.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-wholesaler-list',
  templateUrl: './wholesaler-list.page.html',
  styleUrls: ['./wholesaler-list.page.scss'],
})
export class WholesalerListPage implements OnInit {
  wholesalerList: any;
  searchInput: string = '';
  constructor(
    private router: Router,
    public storageservice: StorageService,
    public alertController: AlertController,
    private ced: CedService
  ) { }
  ngOnInit() {
    this.bindList();
  }
  gotoAddNew() {
    this.router.navigate(['/wholesaler-add']);
  }

  resetList() {
    this.searchInput = '';
    this.wholesalerList = [];
    this.bindList();
  }

  edit_click(wholesalerCode: any) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        wholesalerCode: encodeURIComponent(this.ced.encryptAesToString(wholesalerCode, this.storageservice.secretKey))
      }
    };
    this.router.navigate(['/wholesaler-add'], navigationExtras);
  }

  async delete(wholesalerCode: any) {
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
            
            //Main concept. 
            try {
              const obj = {
                deletingId: this.ced.encryptAesToString(wholesalerCode, this.storageservice.secretKey)
              };
              var deleteServiceUrl = 'api/auth/app/wholesalerMaster/delete';
              this.storageservice.postrequest(deleteServiceUrl, obj).subscribe((result:any) => {
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
    var getListURL = `api/auth/app/wholesalerMaster/getWholesalerList?searchContent=${this.searchInput}`;
    this.storageservice.getrequest(getListURL).subscribe(
      (result:any) => {
        this.wholesalerList = result['listWholesalerListBean'];
        this.storageservice.hideLoadingIndicator();
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
  //#endregion

  bindList() {
    this.storageservice.showLoadingIndicator();
    var getListURL = 'api/auth/app/wholesalerMaster/getList';
    this.storageservice.getrequest(getListURL).subscribe((result:any) => {
      this.storageservice.hideLoadingIndicator();
      this.wholesalerList = result['listWholesalerListBean'];
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
        this.storageservice.hideLoadingIndicator();
      });
  }
}
