import { Component } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private router: Router, public storageservice: StorageService, public nativeStorage: NativeStorage, private platform: Platform) { 
   // this.initializeApp();
  }


  // initializeApp() {
  //   this.platform.ready().then(() => {
  //     timer(3000).subscribe(() => {
  //       this.splashScreen.hide();
  //     });      
  //   });
  // }

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

    this.storageservice.publishSomeData({
      status_get: false
    });
    localStorage.clear();

    this.nativeStorage.clear();

    this.router.navigate(['/login']);
  }
}
