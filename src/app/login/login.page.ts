import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { LoadingController } from '@ionic/angular';
import { CedService } from '../ced.service';
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

  constructor(public formbuilder: FormBuilder, private router: Router, public storageservice: StorageService,
    private loadingCtrl: LoadingController, 
    private route: ActivatedRoute, private ced: CedService) {
      this.loginform = formbuilder.group({
        empId: ['', Validators.compose([Validators.maxLength(50), Validators.required])],
        password: ['', Validators.compose([Validators.maxLength(20), Validators.required])]
      });
     }

  ngOnInit() {
  }

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

    this.storageservice.postrequest(logInServiceUrl, postData).subscribe(res => {
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
        //#endregion
        // this.datastorage.createDB()

        this.router.navigate(['/dashboard']);
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
  //#endregion

 

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
