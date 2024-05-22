import { Injectable } from '@angular/core';
import { DatabaseService } from '../database.service';

//Drug Table Data
export interface DruginfoMaster {
  ndcupc_code: string;
  description: string;
  pakage_size: number;
  strength: string;
  my_price: number;
  awp_price: number;
  wac_price: number;
  control_class: string;
  rx_or_otc: string;
  uom: string;
  unit_per_pkg: number;
  is_hazardous: boolean;
  is_unit_dose: boolean;
  dosage: string;
  manufactured_by: string;
  input_source: string;
  is_active: string;
  created_by: string;
  created_on: Date;
  modified_by: string;
  modified_on: Date;
  notes: string;
  manufacture_id: number;
  isupdated: boolean;
  dosageVal: string;
}

//Drug/Manufacturer ReturnPolicy Table Data
export interface ReturnPolicy {
  ndcupc_code: string;
  manufacturer_code: string;
  months_before_expiration: number;
  months_after_expiration: number;
  accept_returns: boolean;
  accept_partial: boolean;
  accept_percentage: number;
  check_package_originality: boolean;
  inst_normaldrugitem: string;
  inst_schedule2items: string;
  inst_schedule3to5items: string;
}

//Manufacturer Table Data
export interface Manufacturer {
  manufacturer_code: string;
  manufacturer_name: string;
  department: string;
  street: string;
  city: string;
  state: number;
  zip_code: string;
  contact_persosn: string;
  mail_id: string;
  phone_no: string;
  fax_no: string;
  toll_free_no: string;
  link_to: string;
  bill_to: string;
  return_service: string;
  is_active: string;
  created_by: string;
  created_on: string;
  modified_by: string;
  modified_on: string;
  billing_preference: string;
  is_special: boolean;
  manufacture_id: number;
  isupdated: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class IsReturnableOverridepolicyService {
  databaseObj: any;

  constructor(private databaseService: DatabaseService) { 
    this.initDatabase();
  }

  async initDatabase() {
    this.databaseObj = await this.databaseService.getDatabase();
  }
  async checkIsReturnableFromLocal(ndcupccode: string, isfull: boolean, expirationdtstr: string, quantity: string): Promise<{ overridepolicyText: string, overridepolicyNumber: string, success: boolean}> {
    console.log("ndcupccode:"+ndcupccode+" isfull:"+ isfull+" expirationdtstr:"+  expirationdtstr+" quantity:"+  quantity);
    var monthEdit = parseInt(expirationdtstr.substring(0, 2));
    var editMonth = (monthEdit < 10 ? '0' : '') + monthEdit;
    var editYear = parseInt(expirationdtstr.substring(3, 8));
    var editTempExpValue = new Date(editMonth + "/01/" + editYear);

    try {
      let overridepolicyNumber = '';
      let overridepolicyText = '';
  
      if (this.isNullOrEmpty(ndcupccode)) {
        console.log('ndcupc Code is Required.');
        throw new Error('ndcupc Code is Required.');
      }
  
      if (isfull === null || isfull === undefined) {
        console.log('Please specify Partial or Full Return.');
        throw new Error('Please specify Partial or Full Return.');
      }
  
      const drugExists = await this.executeSql<any>(`SELECT 1 FROM drugs WHERE TRIM(ndcupc_code) = TRIM(?)`, [ndcupccode]);
      if (!drugExists) {
        console.log(`This ndcupc Code ${ndcupccode} does not exist in the Database.`);
        throw new Error(`This ndcupc Code ${ndcupccode} does not exist in the Database.`);
      }
  
      const policyExists = await this.executeSql<any>(`
        SELECT EXISTS (
          SELECT 1 FROM drugs_return_policy WHERE TRIM(ndcupc_code) = TRIM(?)
          UNION  
          SELECT 1 FROM manufacturer_return_policy 
          JOIN drugs  ON manufacturer_code = manufactured_by 
          WHERE TRIM(ndcupc_code) = TRIM(?)
        ) AS policy_exists;
      `, [ndcupccode, ndcupccode]);
  
      if (!policyExists) {
        console.log('Return Policy is not defined neither for ndcupc Code nor for its manufacturer');
        throw new Error('Return Policy is not defined neither for ndcupc Code nor for its manufacturer');
      }
  
      const druginfo = await this.executeSql<DruginfoMaster>(`SELECT *,dosage.description as dosageVal FROM drugs left outer join dosage on dosage.code=drugs.dosage  WHERE TRIM(ndcupc_code) = TRIM(?)`, [ndcupccode]);
      const druginfoPolicy = await this.executeSql<ReturnPolicy>(`SELECT * FROM drugs_return_policy WHERE TRIM(ndcupc_code) = TRIM(?)`, [ndcupccode]);
      const manufacturer = await this.executeSql<Manufacturer>(`SELECT * FROM manufacturer JOIN drugs ON manufacturer_code = manufactured_by WHERE TRIM(ndcupc_code) = TRIM(?)`, [ndcupccode]);
      const manufacturerPolicy = await this.executeSql<ReturnPolicy>(`SELECT * FROM manufacturer_return_policy JOIN drugs ON manufacturer_code = manufactured_by WHERE TRIM(ndcupc_code) = TRIM(?)`, [ndcupccode]);
      console.log('Druginfo Data', JSON.stringify(druginfo));
      console.log('DruginfoPolicy Data', JSON.stringify(druginfoPolicy));
      console.log('Manufacturer Data', JSON.stringify(manufacturer));
      console.log('ManufacturerPolicy Data', JSON.stringify(manufacturerPolicy));
  
      let returnPolicy!: ReturnPolicy ;
      if (druginfoPolicy != null && druginfoPolicy !== undefined) {
        returnPolicy = druginfoPolicy;
      } else if (manufacturerPolicy != null && manufacturerPolicy !== undefined) {
        returnPolicy = manufacturerPolicy;
      }
      console.log('ReturnPolicy Data', JSON.stringify(returnPolicy));
  
      if (returnPolicy) {
        const packageSizeNum:any = null
        const acceptPercentage = returnPolicy.accept_percentage;
        const dosageVal :any = null
        const quantityNum = parseFloat(quantity);
        if(druginfo) {
          const packageSizeNum = druginfo.pakage_size;
          const acceptPercentage = returnPolicy.accept_percentage;
          const dosageVal = druginfo.dosageVal;
          const quantityNum = parseFloat(quantity);
        }
       
  
        if (!isfull) {
          if (!returnPolicy.accept_partial) {
            if (quantityNum > packageSizeNum) {
              console.log(`The partial quantity meets or exceeds a full package size. Reduce the Number of ${dosageVal} or increase the package size.`);
              throw new Error(`The partial quantity meets or exceeds a full package size. Reduce the Number of ${dosageVal} or increase the package size.`);
            }
        
            if (quantityNum < packageSizeNum * acceptPercentage / 100) {
              overridepolicyNumber += '5,';
              overridepolicyText += 'The percentage of product remaining does not meet the minimum requirement.<br>';
              console.log(`Override Policy Number: ${overridepolicyNumber}`);
              console.log(`Override Policy Text: ${overridepolicyText}`);
            }
          }
        }
        
        if (isfull && !returnPolicy.accept_returns && manufacturer) {
  
          if (manufacturer.bill_to === 'WHOLESALER') {
            overridepolicyNumber += '9,';
            overridepolicyText += 'This product is non-returnable based on the wholesaler policy.<br>';
            console.log(`Override Policy Number: ${overridepolicyNumber}`);
            console.log(`Override Policy Text: ${overridepolicyText}`);
          } else {
            overridepolicyNumber += '6,';
            overridepolicyText += 'This drug is not returnable as per the defined policy.<br>';
            console.log(`Override Policy Number: ${overridepolicyNumber}`);
            console.log(`Override Policy Text: ${overridepolicyText}`);
          }
        }
  
        if (!isfull && !returnPolicy.accept_partial && manufacturer) {
          if (manufacturer.bill_to === 'WHOLESALER') {
            overridepolicyNumber += '7,';
            overridepolicyText += 'Wholesaler will not accept partials.<br>';
            console.log(`Override Policy Number: ${overridepolicyNumber}`);
            console.log(`Override Policy Text: ${overridepolicyText}`);
          }
          overridepolicyNumber += '3,';
          overridepolicyText += 'Partial packages of this product are non-returnable.<br>';
          console.log(`Override Policy Number: ${overridepolicyNumber}`);
          console.log(`Override Policy Text: ${overridepolicyText}`);
        }
      }
  
      // Calculate Returnable based on the conditions provided
      const Returnable: boolean = (isfull && returnPolicy.accept_returns) || (!isfull && returnPolicy.accept_partial);
      console.log("Returnable: " +Returnable);

      const expirationDate: Date = editTempExpValue;
      const currentDate: Date = new Date();
      let monthsToExpire: number = 0;
      let expiredMonths: number = 0;

      console.log("expirationDate1: " +expirationDate);
      console.log("currentDate1: " +currentDate);
      console.log("monthsToExpire1: " +monthsToExpire);
      console.log("expiredMonths1: " +expiredMonths);

      if (expirationDate >= currentDate) {
        monthsToExpire = (expirationDate.getFullYear() * 12 + expirationDate.getMonth()) -
          (currentDate.getFullYear() * 12 + currentDate.getMonth()) + 1;
      } else {
        expiredMonths = (currentDate.getFullYear() * 12 + currentDate.getMonth()) -
          (expirationDate.getFullYear() * 12 + expirationDate.getMonth());
      }

      console.log("expirationDate2: " +expirationDate);
      console.log("currentDate2: " +currentDate);
      console.log("monthsToExpire2: " +monthsToExpire);
      console.log("expiredMonths2: " +expiredMonths);

      if (Returnable) {
        if (editTempExpValue >= new Date()) {
          if (Math.abs(monthsToExpire) <= returnPolicy.months_before_expiration) {
            overridepolicyText += 'YES'; 
            console.log(`Override Policy Number: ${overridepolicyNumber}`);
            console.log(`Override Policy Text: ${overridepolicyText}`);
          } else {
            if (!isfull) {
              overridepolicyNumber += '8,';
              overridepolicyText += 'Future dated partials are non-returnable.<br>';
              console.log(`Override Policy Number: ${overridepolicyNumber}`);
              console.log(`Override Policy Text: ${overridepolicyText}`);
              overridepolicyNumber += '2,';
              overridepolicyText += `This partial product falls beyond the future dated return policy by ${Math.abs(monthsToExpire) - returnPolicy.months_before_expiration} Month(s).<br>`;
              console.log(`Override Policy Number: ${overridepolicyNumber}`);
              console.log(`Override Policy Text: ${overridepolicyText}`);
            } else {
              overridepolicyNumber += '2,';
              overridepolicyText += `This product falls beyond the future dated return policy by ${Math.abs(monthsToExpire) - returnPolicy.months_before_expiration} Month(s).<br>`;
              console.log(`Override Policy Number: ${overridepolicyNumber}`);
              console.log(`Override Policy Text: ${overridepolicyText}`);
            }
          }
        } else {
          if (Math.abs(expiredMonths) <= returnPolicy.months_after_expiration) {
            overridepolicyText += 'YES'; 
            console.log(`Override Policy Number: ${overridepolicyNumber}`);
            console.log(`Override Policy Text: ${overridepolicyText}`);
          } else {
            overridepolicyNumber += '4,';
            overridepolicyText += `This product exceeds the expiration return policy by ${Math.abs(expiredMonths) - returnPolicy.months_after_expiration} Month(s).<br>`;
            console.log(`Override Policy Number: ${overridepolicyNumber}`);
            console.log(`Override Policy Text: ${overridepolicyText}`);
          }
        }
      } else {
        if (editTempExpValue >= new Date()) {
          if (Math.abs(monthsToExpire) > returnPolicy.months_before_expiration) {
            if (!isfull) {
              overridepolicyNumber += '8,';
              overridepolicyText += 'Future dated partials are non-returnable.<br>';
              console.log(`Override Policy Number: ${overridepolicyNumber}`);
              console.log(`Override Policy Text: ${overridepolicyText}`);
              overridepolicyNumber += '2,';
              overridepolicyText += `This partial product falls beyond the future dated return policy by ${Math.abs(monthsToExpire) - returnPolicy.months_before_expiration} Month(s).<br>`;
              console.log(`Override Policy Number: ${overridepolicyNumber}`);
              console.log(`Override Policy Text: ${overridepolicyText}`);
            } else {
              overridepolicyNumber += '2,';
              overridepolicyText += `This product falls beyond the future dated return policy by ${Math.abs(monthsToExpire) - returnPolicy.months_before_expiration} Month(s).<br>`;
              console.log(`Override Policy Number: ${overridepolicyNumber}`);
              console.log(`Override Policy Text: ${overridepolicyText}`);
            }
          }
        } else {
          if (Math.abs(expiredMonths) > returnPolicy.months_after_expiration) {
            overridepolicyNumber += '4,';
            overridepolicyText += `This product exceeds the expiration return policy by ${Math.abs(expiredMonths) - returnPolicy.months_after_expiration} Month(s).<br>`;
            console.log(`Override Policy Number: ${overridepolicyNumber}`);
            console.log(`Override Policy Text: ${overridepolicyText}`);
          }
        }
      }

      console.log(`Override Policy Number: ${overridepolicyNumber}`);
      console.log(`Override Policy Text: ${overridepolicyText}`);
      
      return { overridepolicyText: overridepolicyText, overridepolicyNumber: overridepolicyNumber, success: true };
  
    } catch (error) {
      console.error('Error IsReturnable Function:', error);
      throw error;
    }
  }

  

  async executeSql<T>(sql: string, params: any[] = []) {
    try {
      const result = await this.databaseObj.executeSql(sql, params);
      return result.rows.length > 0 ? result.rows.item(0) as T : null;
    } catch (error) {
      console.error('Error executing SQL:', error);
      return null;
    }
  }

  isNullOrEmpty(expr: string): boolean {
    return expr == null || expr === '' || expr == undefined;
  }
  
}
