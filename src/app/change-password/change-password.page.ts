import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  drimsFormOne: FormGroup;
  DRIMS_Pwd: any;
  isSubmitted: boolean = false;

  passwordTypeOldPwd: string = 'password';
  passwordIconOldPwd: string = 'eye-off';

  passwordTypeNewPwd: string = 'password';
  passwordIconNewPwd: string = 'eye-off';

  passwordTypeConfNewPwd: string = 'password';
  passwordIconConfNewPwd: string = 'eye-off';

  constructor(public formbuilder: FormBuilder, public storageservice: StorageService, private router: Router) {

    this.DRIMS_Pwd = localStorage.getItem('DRIMS_Pwd');

    this.drimsFormOne = formbuilder.group({
      oldPwd: ['', Validators.required],
      newPwd: ['', Validators.required],
      confNewPwd: ['', Validators.required]
    });

  }

  ngOnInit() {
  }

  OldPwdChange() {

  }

  hideShowOldPassword() {
    this.passwordTypeOldPwd = this.passwordTypeOldPwd === 'text' ? 'password' : 'text';
    this.passwordIconOldPwd = this.passwordIconOldPwd === 'eye-off' ? 'eye' : 'eye-off';
  }

  hideShowNewPassword() {
    this.passwordTypeNewPwd = this.passwordTypeNewPwd === 'text' ? 'password' : 'text';
    this.passwordIconNewPwd = this.passwordIconNewPwd === 'eye-off' ? 'eye' : 'eye-off';
  }

  hideShowConfNewPassword() {
    this.passwordTypeConfNewPwd = this.passwordTypeConfNewPwd === 'text' ? 'password' : 'text';
    this.passwordIconConfNewPwd = this.passwordIconConfNewPwd === 'eye-off' ? 'eye' : 'eye-off';
  }

  cancelClick() {
    this.router.navigate(['/dashboard']);
  }

  submitClick() {
    this.isSubmitted = true;
    if (!this.drimsFormOne.valid) {
      
      this.storageservice.warningToast('Please provide all the required values!');
    }
    else {
      var oldPwd = this.drimsFormOne.controls['oldPwd'].value;
      if (oldPwd == this.DRIMS_Pwd) {
        var newPwd = this.drimsFormOne.controls['newPwd'].value;
        var confNewPwd = this.drimsFormOne.controls['confNewPwd'].value;
        if (newPwd == confNewPwd) {

          var passwordChangeURL = "";
          var postData = {

          }

          this.storageservice.showLoadingIndicator();
          this.storageservice.postrequest(passwordChangeURL, postData).subscribe((result:any) => {
            this.storageservice.hideLoadingIndicator();
            if (result['success']) {
              this.logOut();
            }
          },
          error => {
            this.storageservice.hideLoadingIndicator();
            
            if (error.name == "HttpErrorResponse") {
              this.storageservice.warningToast('Internet connection/Web service problem, Pls check your internet or contact support.');
            }
            else {
              this.storageservice.warningToast('Error: ' + error.message);
            }
          },
          () => {
            // Completed call...
            
          }
        );
        }
        else {
          this.storageservice.warningToast('New passwords are not matched, Please correct.');
        }
      }
      else {
        this.storageservice.warningToast('Please provide correct old password.');
      }
    }
  }

  logOut() {

    localStorage.setItem('empId', '');

    localStorage.setItem('firstNameLastName', '');
    localStorage.setItem('accessToken', '');
    localStorage.setItem('DRIMS_Id', '');
    localStorage.setItem('DRIMS_Pwd', '');


    this.storageservice.publishSomeData({
      status_get: false
    });
    localStorage.clear();

    this.router.navigate(['/login']);
  }
}
