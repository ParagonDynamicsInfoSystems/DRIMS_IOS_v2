import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { StorageService } from '../storage.service';
import { CedService } from '../ced.service';
import { ConnectivityService } from '../connectivity.service';
import { Location } from '@angular/common';
import { DatabaseService } from '../database.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  companyList: any;
  userName: any = '';
  searchInput: string = '';
  isonline :boolean = true;
  constructor(private ced: CedService,private router: Router,private navCtrl: NavController,private loadingCtrl: LoadingController,
     public storageservice: StorageService, private route: ActivatedRoute, public alertController: AlertController,private connectivity: ConnectivityService,public dbService: DatabaseService) {
    this.userName = localStorage.getItem('firstNameLastName');

   }

   async ngOnInit() {
    // window.location.reload();
    localStorage.setItem('onlineStatus', "true");

    if(localStorage.getItem('onlineStatus') =="true"){
     this.isonline = true
   }else{
     this.isonline = true
   }
  //  this.connectivity.showNetworkStatusAlert();

   this.bindList();

  //  this.dbService.createDB()
//    this.dbService.insertUser("karthi","karthi@adfa.com")
//    const result = await this.dbService.executeQuery("select username from users")
// console.log("resultKarthi :" +result)
 } 

 gotoAddNew() {
  this.navCtrl.navigateForward('/company-add');
 }

 resetList() {
   this.searchInput = '';
   this.companyList = [];
   this.bindList();
 }

 edit_click(companyCode: any) {
   let navigationExtras: NavigationExtras = {
     queryParams: {
       companyCode: encodeURIComponent(this.ced.encryptAesToString(companyCode, this.storageservice.secretKey)),
          }
   };
   this.navCtrl.navigateForward(['/company-add'], navigationExtras);

  //  this.router.navigate(['/company-add'], navigationExtras); 
 }
 toggleChanged(event: CustomEvent) {
   // Get the value of the toggle
   const isonline = event.detail.checked;
   this.isonline = event.detail.checked;
   localStorage.setItem('onlineStatus', "true");
   console.log('Toggle changed. New value:', "true");
   
   // You can perform other actions based on the value of the toggle
 }
 async delete(companyCode: any) {
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
              var result :any = res
               if (result['success'] === true) {
                 this.storageservice.successToastCustom('Delete', 'Record has been deleted successfully.');
                 this.resetList() ;
                //  this.filterList();
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

 debitMemo_click(companyCode: any) {
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
      var result :any = res

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

   this.showLoading()
   
   var getListURL = `api/auth/app/companyMaster/getList`;
   this.storageservice.getrequest(getListURL).subscribe(
     (res) => {
      var result :any = res
this.dismissLoading()
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

async showLoading() {
  const loading = await this.loadingCtrl.create({
    message: 'Loading...',
    duration: 9000,
  });

  loading.present();

  
}

async dismissLoading() {
  const loading = await this.loadingCtrl.getTop();
  if (loading) {
    await loading.dismiss();
  }
}

}
