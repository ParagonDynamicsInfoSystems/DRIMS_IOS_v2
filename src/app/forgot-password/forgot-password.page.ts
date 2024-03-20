import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  //#region Declaration
  drimsform: FormGroup;
  response: any;
  isSubmitted = false;
  splCharRegex: string = "^[^<>{}\"/|;:,~!?@#$%^=&*\\]\\\\()\\[¿§«»ω⊙¤°℃℉€¥£¢¡®©_+]*$";
  //#endregion

  //#region Constructor
  constructor(public formbuilder: FormBuilder, public router: Router, public storageservice: StorageService,
    private loadingCtrl: LoadingController) {

    this.drimsform = formbuilder.group({
      unEmailId: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('^[A-Za-z0-9 ]*$'), Validators.required])],
    });

  }
  //#endregion

  //#region OnInit
  ngOnInit() {
  }
  //#endregion

  //#region Click events
  submit() {

    this.isSubmitted = true;
    if (!this.drimsform.valid) {
      
      this.storageservice.warningToast('Please provide all the required values!');
    }
    else {
      try {
        var unEmailId = this.drimsform.controls['unEmailId'].value;

        var postData = {
          "otpValue": "string",
          "password": "",
          "recaptchaResponse": "string",
          "userNameEmailId": unEmailId,
          "username": ""
        }
        var forgetPassServiceUrl = "api/auth/forgotPassword";

        this.storageservice.showLoadingIndicator(); // Show Loading indicator        
        this.storageservice.postrequest(forgetPassServiceUrl, postData).subscribe((result:any) => {
          this.storageservice.hideLoadingIndicator(); //Hide loading indicator
          this.response = result;
          if (result["success"] == true) {
            this.storageservice.successToast("Your new password has been sent to your mail id, Please check. Thank You!");

            let navigationExtras: NavigationExtras = {
              queryParams: {
                unEmailId: unEmailId
              }
            };
            this.router.navigate(['/login'], navigationExtras);
          }
          else if (result["success"] == false) {
            var msg = result["message"];
            if (msg == null) {
              msg = "Given detail is wrong, Please enter correct User Id or Email Id.";
            }
            this.storageservice.warningToast(msg);
          }
        },
        error => {
          this.storageservice.hideLoadingIndicator();
          
          if (error.name == "HttpErrorResponse") {
            this.storageservice.warningToast('Internet connection problem, Pls check your internet.');
          }
          else {
            this.storageservice.warningToast('Error: ' + error.message);
          }
        },
        () => {
          // 'onCompleted' callback.
          // No errors, route to new page here  
        }
        );
      }
      catch (Exception) {
        this.storageservice.hideLoadingIndicator(); //Hide loading indicator
        this.storageservice.warningToast('Connection unavailable!');
      }
    }
  }

  Cancel() {
    this.router.navigate(['/login']);
  }
  //#endregion


}
