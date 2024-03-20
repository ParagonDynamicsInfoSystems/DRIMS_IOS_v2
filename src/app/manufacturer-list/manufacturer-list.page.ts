import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CedService } from '../ced.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-manufacturer-list',
  templateUrl: './manufacturer-list.page.html',
  styleUrls: ['./manufacturer-list.page.scss'],
})
export class ManufacturerListPage implements OnInit {
  userId: string ="";
  manufacturerList: any = [];
  searchInput: string = '';
  pageId: number = 1; 
  pageSize: number = 50; 

  constructor(
    private router: Router,
    public storageservice: StorageService,
    private route: ActivatedRoute,
    public alertController: AlertController,
    private ced: CedService
  ) { }

  ngOnInit() {
    this.resetList();
  }

  gotoAddNew() {
    this.router.navigate(['/manufacturer-add']);
  }

  resetList() {
    this.searchInput = '';
    this.manufacturerList = [];
    this.pageId = 1; 
    this.bindList();
  }
  
  edit_click(manufacturerCode: any) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        manufacturerCode: encodeURIComponent(this.ced.encryptAesToString(manufacturerCode, this.storageservice.secretKey))
      }
    };
    this.router.navigate(['/manufacturer-add'], navigationExtras);
  }

  async delete(manufacturerCode: any) {
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
                deletingId: this.ced.encryptAesToString(manufacturerCode, this.storageservice.secretKey)
              };
              var deleteServiceUrl = 'api/auth/app/manufacturerMaster/delete';
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

  returnPolicy_click(manufacturerCode: any, manufacturerName: any) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        manufacturerCode: encodeURIComponent(this.ced.encryptAesToString(manufacturerCode, this.storageservice.secretKey)),
        manufacturerName: manufacturerName
      }
    };
    this.router.navigate(['/manufacturer-return-policy'], navigationExtras);
  }

  filterList() {
    if (!this.searchInput || this.searchInput.trim() === '') {
      this.storageservice.warningToast('Please enter a value in the search field.');
      return;
    } else {
      this.manufacturerList = [];
      this.pageId = 1;
      this.bindList();
    }
  }

  public bindList() {
    var listURL = `api/auth/app/manufacturerMaster/getManufacturerList`;
    const searchObj = {
      pageSize: this.pageSize,
      pageId: this.pageId,
      searchContent: this.searchInput
    }
    this.storageservice.postrequest(listURL, searchObj).subscribe((result:any) => {
        this.manufacturerList = this.manufacturerList.concat(result['listmanufacturerListBean']);
      },
      (error) => {

        if (error.name === 'HttpErrorResponse') {
          this.storageservice.warningToast('Internet connection problem, Please check your internet.');
          this.storageservice.GeneralAlert('HttpErrorResponse', 'Internet connection problem, Please check your internet.');
        } else {
          this.storageservice.warningToast('Error: ' + error.message);
        }
      });
  }

  loadData(event :any) {
    this.pageId++; 
    var listURL = `api/auth/app/manufacturerMaster/getManufacturerList`;
    const searchObj = {
      pageSize: this.pageSize,
      pageId: this.pageId,
      searchContent: this.searchInput
    }
    this.storageservice.postrequest(listURL, searchObj).subscribe((result: any) => {
        this.manufacturerList = this.manufacturerList.concat(result['listmanufacturerListBean']);
        event.target.complete(); 
      },
      (error: any) => {
        event.target.complete(); 
      }); 
  }      

}
