import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient, public storageservice: StorageService) { }

  public getcompanyMasterDropdownListUrl = `${this.storageservice.mobileserverurl}api/auth/app/commonServices/getCompanyMasterDropdownList`;
  public getdebitMemoDropdownListUrl = `${this.storageservice.mobileserverurl}api/auth/app/commonServices/getDebitMemoDropdownList`;
  public getManufacturerListUrl = `${this.storageservice.mobileserverurl}api/auth/app/commonServices/getManufacturerDropdownList`;
  public getStateDropdownListUrl = `${this.storageservice.mobileserverurl}api/auth/app/commonServices/getStateDropdownList`;
  public getFacilityTypeDropdownListUrl = `${this.storageservice.mobileserverurl}api/auth/app/commonServices/getFacilityTypeDropdownList`;
  public getWholesalerDropdownListUrl = `${this.storageservice.mobileserverurl}api/auth/app/commonServices/getWholesalerDropdownList`;
  public getWholesalerWithAddressDropdownListUrl = `${this.storageservice.mobileserverurl}api/auth/app/commonServices/getWholesalerWithAddressDropdownList`;
  public uniqueValidateUrl = `${this.storageservice.mobileserverurl}api/auth/app/commonServices/validateUnique`;
  public getDosageDropdownListUrl = `${this.storageservice.mobileserverurl}api/auth/app/commonServices/getDosageDropdownList`;
  public getReturnReasonDropdownListUrl = `${this.storageservice.mobileserverurl}api/auth/app/commonServices/getReturnReasonDropdownList`;
  public getAllPagePermissionListUrl = `${this.storageservice.mobileserverurl}api/auth/app/commonServices/getAllPagePermissionList`;
  public getAllShipperCountryListUrl = `${this.storageservice.mobileserverurl}api/auth/app/commonServices/shipperCountryList`;
  public getAllStateCodeDropdownListUrl = `${this.storageservice.mobileserverurl}api/auth/app/commonServices/getAllStateCodeDropdownList`;

  getcompanyMasterDropdownList(): Observable<any> {
    return this.http.get(this.getcompanyMasterDropdownListUrl);
  }

  getdebitMemoDropdownList(): Observable<any> {
    return this.http.get(this.getdebitMemoDropdownListUrl);
  }

  getManufacturerList(): Observable<any> {
    return this.http.get(this.getManufacturerListUrl);
  }

  getStateDropdownList(): Observable<any> {
    return this.http.get(this.getStateDropdownListUrl);
  }
  getFacilityTypeDropdownList(): Observable<any> {
    return this.http.get(this.getFacilityTypeDropdownListUrl);
  }

  getWholesalerDropdownList(): Observable<any> {
    return this.http.get(this.getWholesalerDropdownListUrl);
  }

  getWholesalerWithAddressDropdownList(): Observable<any> {
    return this.http.get(this.getWholesalerWithAddressDropdownListUrl);
  }

  uniqueValidate(): Observable<any> {
    return this.http.get(this.uniqueValidateUrl);
  }

  getDosageDropdownList(): Observable<any> {
    return this.http.get(this.getDosageDropdownListUrl);
  }

  getReturnReasonDropdownList(): Observable<any> {
    return this.http.get(this.getReturnReasonDropdownListUrl);
  }

  getAllPagePermissionList(): Observable<any> {
    return this.http.get(this.getAllPagePermissionListUrl);
  }

  getAllShipperCountryList(): Observable<any> {
    return this.http.get(this.getAllShipperCountryListUrl);
  }

  getAllStateCodeDropdownList(): Observable<any> {
    return this.http.get(this.getAllStateCodeDropdownListUrl);
  }

}
