import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  loading = new BehaviorSubject(false);
  private dataSubject = new BehaviorSubject<string>('Initial Value');
  public data$ = this.dataSubject.asObservable();

  secretKey: any;
  baseurl: any;
  serverurl: any;
  //LocalURL
  // mobileserverurl: string = "http://localhost:8081/";
  // baseURL: string = "http://localhost:8081/";
  // mobileserverurl: string = "http://192.168.5.155:8080/";
  // baseURL: string = "http://192.168.5.155:8080/";
  //ServerURL
  mobileserverurl: string = "http://65.108.201.61:8090/drug/";
  baseURL: string = "http://65.108.201.61:8090/";
  mobileserverserive: any;
  constructor(private http: HttpClient, public toastController: ToastController, public alertController: AlertController, private loadingCtrl: LoadingController) {
    this.secretKey = 7061737323313233;
   }

   setData(value: string) {
    this.dataSubject.next(value);
  }
  postrequest(url: string, data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.mobileserverurl + url, data, { headers: headers });
  }

  postrequest_WithBaseURL(url: string, data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.baseURL + url, data, { headers: headers });
  }

  getrequest(url: string) {
    return this.http.get(this.mobileserverurl + url);
  }

  getrequest_WithBaseURL(url: string) {
    return this.http.get(this.baseURL + url);
  }
  
  private fooSubject = new Subject<any>();
  publishSomeData(data: any) {
    this.fooSubject.next(data);
  }

  public async successToast(msg: string) {
    const toast = await this.toastController.create({
      header: 'Congratulations!',
      color: 'success',
      cssClass: "toast-success",
      message: msg,
      duration: 2000
    });
    toast.present();
  }
  
  public async successToastCustom(header: any, msg: any) {
    const toast = await this.toastController.create({
      header: header,
      color: 'success',
      cssClass: "toast-success",
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  public async warningToast(msg: string) {
    const toast = await this.toastController.create({
      header: 'Oops!',
      color: 'warning',
      cssClass: "toast-success",
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  public async warningToastCustom(header: any, msg: any) {
    const toast = await this.toastController.create({
      header: header,
      color: 'warning',
      cssClass: "toast-success",
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  public async generalAlertToast(msg: any) {
    const toast = await this.toastController.create({
      header: 'Alert!',
      color: 'warning',
      cssClass: "toast-success",
      message: msg,
      duration: 3000
    });
    toast.present();
  }

  public async generalAlertToastGreen(msg: any) {
    const toast = await this.toastController.create({
      header: 'Alert!',
      color: 'success',
      cssClass: "toast-success",
      message: msg,
      duration: 3000
    });
    toast.present();
  }

  public async generalAlertToastCustom(msg: any, duration: any) {
    const toast = await this.toastController.create({
      header: 'Alert!',
      color: 'warning',
      cssClass: "toast-success",
      message: msg,
      duration: duration
    });
    toast.present();
  }

  async GeneralAlert(headerText: string, messageText: string) {
    let alert = await this.alertController.create({
      header: headerText,
      message: messageText,
      cssClass: 'alertclass',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          //cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }
      ]
    });

    await alert.present();
  }

  async GeneralAlertCus(headerText: string, messageText: string, ok: string, cancel: string) {
    let alert = await this.alertController.create({
      header: headerText,
      message: messageText,
      cssClass: 'alertclass',
      buttons: [
        {
          text: ok,
          role: cancel,
          //cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }
      ]
    });

    await alert.present();
  }

  async GeneralAlertCustom(headerText: string, messageText: string, yesBtnText: string, cancelBtnText: string) {
    let alert = await this.alertController.create({
      header: headerText,
      message: messageText,
      cssClass: 'alertclass',
      buttons: [
        {
          text: cancelBtnText,
          role: 'cancel',
          //cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: yesBtnText,
          //cssClass: 'btncss',
          handler: () => {
            console.log('Confirm Okay');
            window.open('market://details?id=com.paragondynamics.visitorchek', '_system');
          }
        }
      ]
    });

    await alert.present();
  }

  //Added by Gokul for confirmation alert that gives the user options to choose "Yes" or "No".
  async GeneralConfirmationAlert(headerText: string, messageText: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alertController.create({
        header: headerText,
        message: messageText,
        cssClass: 'alertclass',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
              resolve(false); // User chose "No"
            }
          },
          {
            text: 'Yes',
            handler: () => {
              resolve(true); // User chose "Yes"
            }
          }
        ]
      });
  
      await alert.present();
    });
  }
  
  //Added by Gokul for Confirmation alert that gives the user an "OK" button
  async GeneralConfirmationAlertOK(headerText: string, messageText: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alertController.create({
        header: headerText,
        message: messageText,
        cssClass: 'alertclass',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              resolve(true); // User clicked "OK"
            }
          }
        ]
      });
  
      await alert.present();
    });
  }

  //Added by Gokul for To create an alert with two buttons, one labeled "Override Policy & Save" and the other labeled "Ok".
 async showConfirmationAlert(headerText: string, messageText: string, overrideText: string, okText: string): Promise<boolean> {
  return new Promise<boolean>(async (resolve) => {
    const alert = await this.alertController.create({
      header: headerText,
      message: messageText,
      inputs: [
        {
          name: 'checkbox1',
          type: 'checkbox',
          label: overrideText,
          value: 'value',
          id: "overrideCheckbox"
        }],
      cssClass: 'alertclass',
      buttons: [
        {
          text: okText,
          role: 'cancel',
          handler: () => {
             const checkbox = document.getElementById('overrideCheckbox') as HTMLIonCheckboxElement;
            const isCheckboxChecked :any= checkbox.ariaChecked;
            resolve(isCheckboxChecked); // Return whether the checkbox is checked
          }
        }
      ]
    });

    await alert.present();
  });
}


  getProperImageUrl(imageUrl:any) {
    if (imageUrl.includes(this.baseURL)) {
      return imageUrl;
    }
    else {
      var profileImageURL = this.baseURL + imageUrl;
      return profileImageURL;
    }

  }

  getObservable(): Subject<any> {
    return this.fooSubject;
  }

  //#region Functions
  async showLoadingIndicator() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      duration: 9000,
    });
  
    loading.present();
  }
  async hideLoadingIndicator() {
    const loading = await this.loadingCtrl.getTop();
  if (loading) {
    await loading.dismiss();
  }
  }
  //#endregion

  watchLoading(){
    return this.loading.asObservable();
  }
}
