import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CedService } from '../ced.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-druginfo-list',
  templateUrl: './druginfo-list.page.html',
  styleUrls: ['./druginfo-list.page.scss'],
})
export class DruginfoListPage implements OnInit {

  drugList: any = [];
  selectedStatus: string = 'Y';
  searchInput: string = '';
  pageId: number = 1; 
  pageSize: number = 50; 

  constructor(
    private router: Router,
    public storageservice: StorageService,
    private route: ActivatedRoute,
    public alertController: AlertController,
    private ced: CedService
  ) {}

  ngOnInit() {
    this.resetList();
  }

  gotoAddNew() {
    this.router.navigate(['/druginfo-add']);
  }

  resetList() {
    this.searchInput = '';
    this.selectedStatus = 'Y';
    this.drugList = [];
    this.pageId = 1; 
    this.bindList();
  }

  edit(ndcupc: any) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        ndcupc: encodeURIComponent(this.ced.encryptAesToString(ndcupc, this.storageservice.secretKey))
      }
    };
    this.router.navigate(['/druginfo-add'], navigationExtras);
  }

  returnPolicy(ndcupc: any) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        ndcupc: encodeURIComponent(this.ced.encryptAesToString(ndcupc, this.storageservice.secretKey))
      }
    };
    this.router.navigate(['/druginfo-return-policy'], navigationExtras);
  }


  async delete(ndcupc: any) {
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
            // Main concept.
            try {
              const obj = {
                deletingId: this.ced.encryptAesToString(ndcupc, this.storageservice.secretKey)
              };
              var deleteServiceUrl = 'api/auth/app/drugInfoMaster/delete';
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
    } else {
      this.drugList = [];
      this.pageId = 1;
      this.bindList();
    }
  }

  public bindList() {
    this.storageservice.showLoadingIndicator();
    var listURL = `api/auth/app/drugInfoMaster/getDrugInfoList`;
    const searchObj = {
      pageSize: this.pageSize,
      pageId: this.pageId,
      searchContent: this.searchInput,
      isActive: this.selectedStatus
    }
    this.storageservice.postrequest(listURL, searchObj).subscribe((result:any) => {
        this.storageservice.hideLoadingIndicator();
        this.drugList = this.drugList.concat(result['listDrugInfoListBean']);
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

  loadData(event:any) {
    this.pageId++; 
    var listURL = `api/auth/app/drugInfoMaster/getDrugInfoList`;
    const searchObj = {
      pageSize: this.pageSize,
      pageId: this.pageId,
      searchContent: this.searchInput,
      isActive: this.selectedStatus
    }
    this.storageservice.postrequest(listURL, searchObj).subscribe((result:any) => {
        this.drugList = this.drugList.concat(result['listDrugInfoListBean']);
        event.target.complete(); 
      },
      (error) => {
        event.target.complete(); 
      });
  }
 

}
