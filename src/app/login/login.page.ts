import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { LoadingController, NavController, Platform } from '@ionic/angular';
import { CedService } from '../ced.service';
import { DatabaseService } from '../database.service';
import { Network } from '@awesome-cordova-plugins/network/ngx';
declare var grecaptcha: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginform!: FormGroup;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  response: any;
  empIdVal: string ="";
  pwdVal: string ="";
  alreadylogedIn:boolean = false;

  constructor(public formbuilder: FormBuilder, private navCtrl: NavController,
    private router: Router, public storageservice: StorageService,
    private loadingCtrl: LoadingController, 
    private network: Network, private platform: Platform,
    private datastorage : DatabaseService,
    private route: ActivatedRoute, private ced: CedService) {
      this.loginform = formbuilder.group({
        empId: ['', Validators.compose([Validators.maxLength(50), Validators.required])],
        password: ['', Validators.compose([Validators.maxLength(20), Validators.required])]
      });
     }

  ngOnInit() {

    // this.platform.ready().then(() => {
    //   this.checkNetworkStatus();
    // });
    if(localStorage.getItem("isloggedin")== "True"){
      this.storageservice.setData('True');
      this.alreadylogedIn = true;
     this.login_click_session()
      // this.navCtrl.navigateForward('/dashboard');
    }
  }

  // checkNetworkStatus() {
  //   console.log('Checking network status');
  //   let networkType = this.network.type;
  //   console.log('Network type:', networkType);
  //   if (networkType === 'none') {
  //     console.log('The device is offline');
  //   } else {
  //     console.log('The device is online');
  //   }

  //   this.network.onDisconnect().subscribe(() => {
  //     console.log('network was disconnected :-(');
  //   });

  //   this.network.onConnect().subscribe(() => {
  //     console.log('network connected!');
  //     setTimeout(() => {
  //       if (this.network.type === 'wifi') {
  //         console.log('we got a wifi connection, woohoo!');
  //       }
  //     }, 3000);
  //   });
  // }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }


  login_click() {
    //Show Loading indicator
    this.showLoadingIndicator()
    const captchaValue = grecaptcha.getResponse();
    if (!captchaValue) {
      return;
    }

    let email_get = this.ced.encryptingProcess(this.loginform.controls['empId'].value);
    let password_get = this.ced.encryptingProcess(this.loginform.controls['password'].value);

    var logInServiceUrl = "api/auth/signin";
    var postData = {
      "username": email_get,      
      "password": password_get,
      "recaptchaResponse": captchaValue,    
    }
this.storageservice.showLoadingIndicator()
    this.storageservice.postrequest(logInServiceUrl, postData).subscribe(res => {
      this.storageservice.hideLoadingIndicator()

      var result:any = res
      this.response = result;
      this.hideLoadingIndicator();
      let message = this.ced.decryptingProcess(result['message']);
      if (this.ced.decryptingProcess(result["success"]) === "true") {
        this.storageservice.successToast(message)
        //userDetail
        //#region To store in local storage
        localStorage.setItem('accessToken', result["accessToken"]);
        localStorage.setItem('empId', this.ced.decryptingProcess(result["empId"]));
        localStorage.setItem('firstNameLastName', this.ced.decryptingProcess(result["firstNameLastName"]));
        localStorage.setItem('pharmaciesType', this.ced.decryptingProcess(result["pharmaciesType"]));
        localStorage.setItem('formCodeList', result["formCodeList"]);
        localStorage.setItem('roles', result["roles"]);
        localStorage.setItem('roleType', this.ced.decryptingProcess(result["roleType"]));
        localStorage.setItem('DRIMS_Id', email_get);
        localStorage.setItem('DRIMS_Pwd', password_get);
        localStorage.setItem('isloggedin', "True");
        localStorage.setItem('showsidebar', "True");


        // this.router.navigateByUrl('/dashboard', {skipLocationChange: true}).then(() => {
        //   this.router.navigate(["/dashboard"]);
        //   });
        this.storageservice.setData('True');

        this.datastorage.createDB()


        this.navCtrl.navigateForward('/dashboard');

      }
      else {
        this.storageservice.warningToast(message);
      }
    },
      error => {
        this.hideLoadingIndicator();
        if (error.name == "HttpErrorResponse") {
          
          this.storageservice.warningToast('Internet connection problem, Pls check your internet.');
        }
        else {
          this.storageservice.warningToast('Error: ' + error.message);
        }
      },
      () => {
        this.hideLoadingIndicator();
      }
    );
  }

  login_click_session() {
    //Show Loading indicator
    this.showLoadingIndicator()
    // const captchaValue = grecaptcha.getResponse();
   

    let email_get :any = localStorage.getItem('DRIMS_Id')
    let password_get:any = localStorage.getItem('DRIMS_Pwd')

    var logInServiceUrl = "api/auth/signin";
    var postData = {
      "username": email_get,      
      "password": password_get,
      // "recaptchaResponse": captchaValue,    
    }
this.storageservice.showLoadingIndicator()
    this.storageservice.postrequest(logInServiceUrl, postData).subscribe(res => {
      this.storageservice.hideLoadingIndicator()

      var result:any = res
      this.response = result;
      this.hideLoadingIndicator();
      let message = this.ced.decryptingProcess(result['message']);
      if (this.ced.decryptingProcess(result["success"]) === "true") {
        this.storageservice.successToast(message)
        //userDetail
        //#region To store in local storage
        localStorage.setItem('accessToken', result["accessToken"]);
        localStorage.setItem('empId', this.ced.decryptingProcess(result["empId"]));
        localStorage.setItem('firstNameLastName', this.ced.decryptingProcess(result["firstNameLastName"]));
        localStorage.setItem('pharmaciesType', this.ced.decryptingProcess(result["pharmaciesType"]));
        localStorage.setItem('formCodeList', result["formCodeList"]);
        localStorage.setItem('roles', result["roles"]);
        localStorage.setItem('roleType', this.ced.decryptingProcess(result["roleType"]));
        localStorage.setItem('DRIMS_Id', email_get);
        localStorage.setItem('DRIMS_Pwd', password_get);
        localStorage.setItem('isloggedin', "True");
        localStorage.setItem('showsidebar', "True");


        // this.router.navigateByUrl('/dashboard', {skipLocationChange: true}).then(() => {
        //   this.router.navigate(["/dashboard"]);
        //   });
        this.storageservice.setData('True');

        this.datastorage.createDB()


        this.navCtrl.navigateForward('/dashboard');

      }
      else {
        this.storageservice.warningToast(message);
      }
    },
      error => {
        this.hideLoadingIndicator();
        if (error.name == "HttpErrorResponse") {
          localStorage.setItem("networkstatus","offline")
          this.storageservice.setData('True');
          this.navCtrl.navigateForward('/dashboard');
          // this.storageservice.warningToast('Internet connection problem, Pls check your internet.');
        }
        else {
          this.storageservice.warningToast('Error: ' + error.message);
        }
      },
      () => {
        this.hideLoadingIndicator();
      }
    );
  }
  //#endregion

 
  login_click_session1() {
    //Show Loading indicator
    this.showLoadingIndicator()
    const captchaValue = grecaptcha.getResponse();
   

    let email_get :any = localStorage.getItem('DRIMS_Id')
    let password_get:any = localStorage.getItem('DRIMS_Pwd')

    var logInServiceUrl = "api/auth/signin";
    var postData = {
      "username": email_get,      
      "password": password_get,
      "recaptchaResponse": captchaValue,    
    }
this.storageservice.showLoadingIndicator()
    this.storageservice.postrequest(logInServiceUrl, postData).subscribe(res => {
      this.storageservice.hideLoadingIndicator()

      var result:any = res
      this.response = result;
      this.hideLoadingIndicator();
      let message = this.ced.decryptingProcess(result['message']);
      if (this.ced.decryptingProcess(result["success"]) === "true") {
        this.storageservice.successToast(message)
        //userDetail
        //#region To store in local storage
        localStorage.setItem('accessToken', result["accessToken"]);
        localStorage.setItem('empId', this.ced.decryptingProcess(result["empId"]));
        localStorage.setItem('firstNameLastName', this.ced.decryptingProcess(result["firstNameLastName"]));
        localStorage.setItem('pharmaciesType', this.ced.decryptingProcess(result["pharmaciesType"]));
        localStorage.setItem('formCodeList', result["formCodeList"]);
        localStorage.setItem('roles', result["roles"]);
        localStorage.setItem('roleType', this.ced.decryptingProcess(result["roleType"]));
        localStorage.setItem('DRIMS_Id', email_get);
        localStorage.setItem('DRIMS_Pwd', password_get);
        localStorage.setItem('isloggedin', "True");
        localStorage.setItem('showsidebar', "True");


        // this.router.navigateByUrl('/dashboard', {skipLocationChange: true}).then(() => {
        //   this.router.navigate(["/dashboard"]);
        //   });
        this.storageservice.setData('True');

        this.datastorage.createDB()


        this.navCtrl.navigateForward('/dashboard');

      }
      else {
        this.storageservice.warningToast(message);
      }
    },
      error => {
        this.hideLoadingIndicator();
        if (error.name == "HttpErrorResponse") {
          localStorage.setItem("networkstatus","offline")
          this.storageservice.setData('True');
          this.navCtrl.navigateForward('/dashboard');
          // this.storageservice.warningToast('Internet connection problem, Pls check your internet.');
        }
        else {
          this.storageservice.warningToast('Error: ' + error.message);
        }
      },
      () => {
        this.hideLoadingIndicator();
      }
    );
  }

  openforgot() {
    this.router.navigate(['/forgot-password'])
  }



  showLoadingIndicator() {
    // this.loadingCtrl.create({
    //   message: 'Processing...',
    //   spinner: 'bubbles',
    //   cssClass: 'loadingIndicatorCustom'
    // }).then((loading) => {
    //   loading.present();
    // });
  }

  hideLoadingIndicator() {
    // setTimeout(() => {
    //   this.loadingCtrl.dismiss();
    // });
  }
  //#endregion


  onCaptchaResolved(response: any): void {
    console.log('reCAPTCHA response:', response);
  }
  
}
