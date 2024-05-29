import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { StorageService } from '../storage.service';
import { DatabaseService } from '../database.service';
import { interval } from 'rxjs';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-sync-data',
  templateUrl: './sync-data.page.html',
  styleUrls: ['./sync-data.page.scss'],
})
export class SyncDataPage implements OnInit {
  statelivedataCount: any = 0;
  statelocaldataCount: any = 0;
  stateList: any;
  dosageList: any;
  dosagelivedataCount: any;
  dosagelocaldataCount: number =0;
  drugscount: any;
  drugsLivecount: any;
  isReadOnly: boolean = true;
  rangeValue: number = 100000;
  progress: number = 0;
  drugList: any;
  drugslivedataCount: any =0;
  drugs_return_policy: any;
  drugs_return_policylivedataCount: any;
  manufacturer_return_policyLivecount: any;
  manufacturer_return_policylocaldataCount: any;
  manufacturerLivecount: any;
  drugCount: any = 0;
  finalData: any; 
  manufacturerList: any;
  manufacturerCount: any =0;
  ManufacturerlocaldataCount: any;
  manufacturer_return_policy: any;
  manufacturer_return_policylivedataCount: any;
  wholesalerList: any;
  wholesalerlivedataCount: any;
  wholesalerlocaldataCount: number =0;
  companyList: any;
  companylivedataCount: any;
  companylocaldataCount: number=0;
  return_memoList: any;
  return_memolivedataCount: any;
  return_memolocaldataCount: number=0;
  accountList: any;
  accountlivedataCount: any;
  return_reasonList: any;
  return_reasonlivedataCount: any;
  return_memo_itemsList: any;
  return_itemsLocaldataCount: any;

  return_memo_itemslivedataCount: any;
  return_reasonlocaldataCount: number =0;
  return_memo_itemsLocaldataCount: number =0;
  drugs_return_policylocaldataCount: number =0;
  drugslocaldataCount: number =0;
  accountlocaldataCount: number =0;
  constructor( public commonService: CommonService, public storageservice: StorageService,private datastorage : DatabaseService,private backgroundMode: BackgroundMode, private platform: Platform) {

    
//  setInterval(() => {
//       this.progress += 0.01;

//       // Reset the progress bar when it reaches 100%
//       // to continuously show the demo
      
//     }, 50);
  }
   

   ngOnInit() {

  
     this.getstatelist()
     this.getDosagelist()
     this.getdrugscount()
     this.getdrugs_return_policylist()
     this.getManufacturercount()
     this.getManufacturer_return_policy()
     this.getWholesalerlist() 
     this.getcompanylist()
     this.getreturn_memolist()
     this.getaccountlist()
     this.getreturn_reasonlist()
     this.getreturn_memo_itemslist()
     this.getreturnItemLocalcount()

     
    }
  async getdrugscount() {
    this.storageservice.getrequest("api/auth/app/drugInfoMaster/getDrugInfoCount").subscribe(
      (response :any) => {
        this.drugsLivecount = response.count;
        
      },
      (error) => {
        console.error(error);
      });

      try {
        this.drugslocaldataCount = await this.datastorage.countRows('drugs');
      } catch (error) {
        console.error('Error:', error);
        alert( error)
  
      }  
  }

  async getManufacturercount() {
    this.storageservice.getrequest("api/auth/app/manufacturerMaster/getManufacturerCount").subscribe(
      (response :any) => {
        this.manufacturerLivecount = response.count;
        
      },
      (error) => {
        console.error(error);
      });


      try {
        this.ManufacturerlocaldataCount = await this.datastorage.countManufacturerRows();
      } catch (error) {
        console.error('Error:', error);
        alert( error)
      }
  }

  async getreturnItemLocalcount() {
    
      try {
        this.return_itemsLocaldataCount =  await this.datastorage.countRows('return_memo_items_local');
      } catch (error) {
        console.error('Error:', error);
        alert( error)
      }
  }

  
  
  async getstatelist(){
    this.storageservice.getrequest("api/auth/app/commonServices/getAllStateToMobileDatabase").subscribe(
      (response) => {
        this.stateList = response;
        this.statelivedataCount = this.stateList?.length
      },
      (error) => {
        console.error(error);
      });

      try {
        this.statelocaldataCount = await this.datastorage.countRows('state');
      } catch (error) {
        console.error('Error:', error);
        alert( error)
  
      }  
  }
  async getreturn_memolist(){
    this.storageservice.getrequest("api/auth/app/debitMemo/getAllDebitMemoToMobileDatabase").subscribe(
      (response:any) => {
        this.return_memoList = response.listDebitMemoSQLite;
        this.return_memolivedataCount = this.return_memoList?.length
      },
      (error) => {
        console.error(error);
      });

      try {
        this.return_memolocaldataCount = await this.datastorage.countRows('return_memo');
      } catch (error) {
        console.error('Error:', error);
        alert( error)
  
      }  
  }

  async getDosagelist(){
    this.storageservice.getrequest("api/auth/app/commonServices/getDosageDropdownList").subscribe(
      (response) => {
        this.dosageList = response;
        this.dosagelivedataCount = this.dosageList?.length
      },
      (error) => {
        console.error(error);
      });

      try {
        this.dosagelocaldataCount = await this.datastorage.countdosageRows();
      } catch (error) {
        console.error('Error:', error);
        alert( error)
  
      }  
  }



  async getWholesalerlist(){
    this.storageservice.getrequest("api/auth/app/wholesalerMaster/getAllWholesalerToMobileDatabase").subscribe(
      (response:any) => {
        this.wholesalerList = response.listWholesalerSQLite;
        this.wholesalerlivedataCount = this.wholesalerList?.length
      },
      (error) => {
        console.error(error);
      });

      try {
        this.wholesalerlocaldataCount = await this.datastorage.countRows('wholesaler');
      } catch (error) {
        console.error('Error:', error);
        alert( error)
  
      }  
  }

  async getcompanylist(){
    this.storageservice.getrequest("api/auth/app/companyMaster/getAllCompanyToMobileDatabase").subscribe(
      (response:any) => {
        this.companyList = response.listCompanyMasterSQLite;
        this.companylivedataCount = this.companyList?.length
      },
      (error) => {
        console.error(error);
      });

      try {
        this.companylocaldataCount = await this.datastorage.countRows('company');
      } catch (error) {
        console.error('Error:', error);
        alert( error)
  
      }  
  }

  async getaccountlist(){
    this.storageservice.getrequest("api/auth/app/settings/getAllAccountToMobileDatabase").subscribe(
      (response:any) => {
        this.accountList = response.listAccountSQLite;
        this.accountlivedataCount = this.accountList?.length
      },
      (error) => {
        console.error(error);
      });

      try {
        this.accountlocaldataCount = await this.datastorage.countRows('account');
      } catch (error) {
        console.error('Error:', error);
        alert( error)
  
      }  
  }


  async getreturn_reasonlist(){
    this.storageservice.getrequest("api/auth/app/commonServices/getAllReturnReasonToMobileDatabase").subscribe(
      (response:any) => {
        this.return_reasonList = response;
        this.return_reasonlivedataCount = this.return_reasonList?.length
      },
      (error) => {
        console.error(error);
      });

      try {
        this.return_reasonlocaldataCount = await this.datastorage.countRows('return_reason');
        alert( this.companylocaldataCount)
      } catch (error) {
        console.error('Error:', error);
        alert( error)
  
      }  
  }

  async getreturn_memo_itemslist(){
    this.storageservice.getrequest("api/auth/app/returnMemoItems/getAllReturnMemoItemsToMobileDatabase").subscribe(
      (response:any) => {
        this.return_memo_itemsList = response.listReturnMemoItemsSQLite;
        this.return_memo_itemslivedataCount = this.return_memo_itemsList?.length
      },
      (error) => {
        console.error(error);
      });

      try {
        this.return_memo_itemsLocaldataCount = await this.datastorage.countRows('return_memo_items');
      } catch (error) {
        console.error('Error:', error);
        alert( error)
  
      }  
  }

  

  async SyncState(){
    for (let i = 0; i < this.stateList.length; i++) {
      console.log(this.stateList[i]); // Output each element of the array
      await this.datastorage.insertStateRow(this.stateList[i])
    }

    this.statelocaldataCount = await this.datastorage.countRows('state');
  }


  async SyncDosage(){
    for (let i = 0; i < this.dosageList.length; i++) {
      console.log(this.dosageList[i]); // Output each element of the array
      this.datastorage.insertDosageRow(this.dosageList[i])
    }

    try {
      this.dosagelocaldataCount = await this.datastorage.countdosageRows();
    } catch (error) {
      console.error('Error:', error);
      alert( error)

    }  
  }


  syncreturn_reason(){
    for (let i = 0; i < this.return_reasonList.length; i++) {
      console.log(this.return_reasonList[i]); // Output each element of the array
      this.datastorage.insertreturn_reasonRow(this.return_reasonList[i])
    }
  }

  syncreturn_memo_items(){
    for (let i = 0; i < this.return_memo_itemsList.length; i++) {
      console.log(this.return_memo_itemsList[i]); // Output each element of the array
      this.datastorage.insertreturn_memo_items(this.return_memo_itemsList[i])
    }
  }
  syncdrugs_return_policy(){
    for (let i = 0; i < this.drugs_return_policy.length; i++) {
      console.log(this.drugs_return_policy[i]); // Output each element of the array
      this.datastorage.insertDrugs_return_policyRow(this.drugs_return_policy[i])
    }

  }

  syncWholesaler(){
    for (let i = 0; i < this.wholesalerList.length; i++) {
      console.log(this.wholesalerList[i]); // Output each element of the array
      this.datastorage.insertWholesalerListRow(this.wholesalerList[i])
    }

  }

  synccompany(){
    for (let i = 0; i < this.companyList.length; i++) {
      console.log(this.companyList[i]); // Output each element of the array
      this.datastorage.insertCompanyListRow(this.companyList[i])
    }

  }
  syncaccount(){
    for (let i = 0; i < this.accountList.length; i++) {
      console.log(this.accountList[i]); // Output each element of the array
      this.datastorage.insertaccountListRow(this.accountList[i])
    }

  }
  syncreturn_memo(){
    for (let i = 0; i < this.return_memoList.length; i++) {
      console.log(this.return_memoList[i]); // Output each element of the array
      this.datastorage.insertreturn_memoRow(this.return_memoList[i])
    }

  }
  Deleatetable(state :any){
    this.datastorage.deleteTable(state)
  }
  // SyncDrugs(){
  //   for(let i=1;this.drugslivedataCount < this.drugsLivecount;){
  //   var postData = {
  //     "pageId" : i,
  //     "pageSize" : 100
  //   }
  //   this.storageservice.postrequest("api/auth/app/drugInfoMaster/getAllDrugInfoToMobileDatabase",postData).subscribe((response) => {
  //       this.drugList = response;
  //       this.dosagelivedataCount = this.dosageList?.length
  //       i++
  //     },
  //     (error) => {
  //       console.error(error);
  //     });
  // }
  // }

  syncDrugs(i: number = 1) {
    

    this.platform.ready().then(() => {
      this.backgroundMode.enable();
    });
    
    const postData = {
      "pageId": i,
      "pageSize": "1000"
    };
  
    this.storageservice.postrequest("api/auth/app/drugInfoMaster/getAllDrugInfoToMobileDatabase", postData).subscribe(
      async (response:any) => {
        
        this.drugList = response.listDruginfoMasterSQLite    ;
        await this.datastorage.insertDrugListIntoDatabase(this.drugList);

        this.drugCount = this.drugCount+ this.drugList?.length;
        // Continue the loop with the next iteration
        if (this.drugCount <= this.drugsLivecount) {
          this.syncDrugs(i + 1);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  async getdrugs_return_policylist(){
    this.storageservice.getrequest("api/auth/app/drugInfoMaster/getAllDrugInfoReturnPolicyToMobileDatabase").subscribe(
      (response:any) => {
        this.drugs_return_policy = response.listDruginfoMasterReturnPolicySQLite;
        this.drugs_return_policylivedataCount = this.drugs_return_policy?.length
      },
      (error) => {
        console.error(error);
      });

      try {
        this.drugs_return_policylocaldataCount = await this.datastorage.countRows('drugs_return_policy');
      } catch (error) {
        console.error('Error:', error);
        alert( error)
  
      }  
  }

  syncManufacturer(i: number = 1) {
    const postData = {
      "pageId": i,
      "pageSize": "1000"
    };
  
    this.storageservice.postrequest("api/auth/app/manufacturerMaster/getAllManufacturerToMobileDatabase", postData).subscribe(
      (response:any) => {
        console.log("pageId "+ i)
        // if (this.drugList == undefined ){
          this.manufacturerList = response.listManufacturerSQLite    ;

          for (let i = 0; i < this.manufacturerList.length; i++) {
            console.log(this.manufacturerList[i]); // Output each element of the array
            this.datastorage.insertmanufacturerRow(this.manufacturerList[i])
          }
        this.manufacturerCount = this.manufacturerCount+ this.manufacturerList?.length;
        // Continue the loop with the next iteration
        if (this.manufacturerList?.length!= 0) {
          this.syncManufacturer(i + 1);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }


  // async getManufacturer_return_policyLivecountlist(){
  //   this.storageservice.getrequest("api/auth/app/drugInfoMaster/getAllDrugInfoReturnPolicyToMobileDatabase").subscribe(
  //     (response:any) => {
  //       this.manufacturer_return_policy = response.listDruginfoMasterReturnPolicySQLite;
  //       this.manufacturer_return_policyLivecount = this.manufacturer_return_policy?.length
  //     },
  //     (error) => {
  //       console.error(error);
  //     });

  //     try {
  //       this.dosagelocaldataCount = await this.datastorage.countRows('manufacturer_return_policy');
  //       alert( this.statelocaldataCount)
  //     } catch (error) {
  //       console.error('Error:', error);
  //       alert( error)
  
  //     }  
  // }

  async getManufacturer_return_policy(){
    this.storageservice.getrequest("api/auth/app/manufacturerMaster/getAllManufacturerReturnPolicyToMobileDatabase").subscribe(
      (response:any) => {
        this.manufacturer_return_policy = response.listManufacturerMasterReturnPolicySQLite;
        this.manufacturer_return_policyLivecount = this.manufacturer_return_policy?.length
      },
      (error) => {
        console.error(error);
      });

      try {
        this.manufacturer_return_policylocaldataCount = await this.datastorage.countmanufacturer_return_policyRows();
      } catch (error) {
        console.error('Error:', error);
        alert( error)
  
      }  
  }


  syncManufacturer_return_policy(){
    for (let i = 0; i < this.manufacturer_return_policy.length; i++) {
      console.log(this.manufacturer_return_policy[i]); // Output each element of the array
      this.datastorage.insertmanufacture_return_policyRow(this.manufacturer_return_policy[i])
    }
  }
}
