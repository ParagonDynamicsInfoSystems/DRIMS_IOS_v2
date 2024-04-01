import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { StorageService } from './storage.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  loading = false;

  public AfterLogin :any = [
    {
      title: 'Settings',
      icon: 'settings-outline',
      children: [
        { title: 'Change password', url: '/change-password' }
      ]
    },
    {
      title: 'Manufacturer',
      icon: 'boat-outline',
      url: '/manufacturer-list'
    },
    {
      title: 'Wholesaler',
      icon: 'layers-outline',
      url: '/wholesaler-list'
    },
    {
      title: 'Drug Info',
      icon: 'bandage-outline',
      url: '/druginfo-list'
    },
    {
      title: 'Company',
      icon: 'business-outline',
      url: '/company-list'
    },
    {
      title: 'Sync local ',
      icon: 'sync-circle',
      url: '/sync-data'
    }
  ];
  showSplash = true;
  islogedin: boolean = false;

  constructor(private router: Router, public storageservice: StorageService, public nativeStorage: NativeStorage, private platform: Platform) { 
   var data 
    this.storageservice.data$.subscribe(value => {
      data = value;
      this.showSideBar(data)

    });

    

  
   // this.initializeApp();
  }


  // initializeApp() {
  //   this.platform.ready().then(() => {
  //     timer(3000).subscribe(() => {
  //       this.splashScreen.hide();
  //     });      
  //   });
  // }

  showSideBar(data:any){
     var islogedin:any = localStorage.getItem('isloggedin');
    if (data == "True")
    {
      this.islogedin = true
    }else if(islogedin == "True"){
      this.islogedin = true
     }
     else{
      this.islogedin = false
     }
  }
  watchLoading(){
    this.storageservice.watchLoading().subscribe(loading => {
      this.loading = loading;
    })
  }

  goto_Home() {
    this.router.navigate(['/dashboard']);
  }

  logOut() {
    localStorage.setItem('accessToken', '');
    localStorage.setItem('empId', '');
    localStorage.setItem('firstNameLastName', '');
    localStorage.setItem('pharmaciesType', '');
    localStorage.setItem('formCodeList', '');
    localStorage.setItem('roles', '');
    localStorage.setItem('roleType', '');
    localStorage.setItem('DRIMS_Id', '');
    localStorage.setItem('DRIMS_Pwd', '');
    localStorage.setItem('isloggedin', "");

    this.storageservice.publishSomeData({
      status_get: false
    });
    localStorage.clear();

    this.nativeStorage.clear(); 
    let navigationExtras: NavigationExtras = {
      queryParams: {
        refreshPage: 'yes'

      },
      skipLocationChange: false
}

    this.router.navigate(['/login'],navigationExtras);
  }
}
function elseif() {
  throw new Error('Function not implemented.');
}

