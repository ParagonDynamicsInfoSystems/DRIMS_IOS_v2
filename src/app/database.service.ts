import { Injectable } from "@angular/core";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite/ngx";


@Injectable({
  providedIn: "root"
})
export class DatabaseService {
  databaseObj!: SQLiteObject;
  count: number =0;
  Statecount: number =0;

  constructor( private sqlite: SQLite,) { }


 createDB() {

    this.sqlite.create({
      name: "DRI.db",
      location: "default"
    })
    .then((db: SQLiteObject) => {
      this.databaseObj = db;
       alert("DRI Database Created!");
       console.log("Database created");
      this.createStateTable()
      this.createDosageTable()
      this.createDrugsTable()
      this.createDrugs_return_policyTable()
      this.createManufacturerTable()
      this.createManufacturer_return_policyTable()
      this.createwholesalerTable()
      this.createCompanyTable()
      this.createrAccountTable()
      this.createrReturn_reasonTable()   
      this.createrReturn_memoTable()
this.createrReturn_memo_itemsTable()   
    })
    .catch(error => {console.log("Error creating database", error)
      alert("error " + JSON.stringify(error))
    });
  
  }
  async createStateTable() {
   
    this.databaseObj.executeSql(`
    CREATE TABLE state
    (
      state_id integer NOT NULL,
      state_name character varying(25) NOT NULL,
      state_code character varying(2) NOT NULL,
      Sync_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT state_pkey PRIMARY KEY (state_id)
    )
    `, [])
      .then(() => {
        alert("State Table Created!");
        console.log("State Table Created!")
      })
      .catch(e => {
        
      
        if(!(JSON.stringify(e.message).includes("table state already exists")) ){
          alert("error " + JSON.stringify(e.message)
        )}
      });
   
  }

  async createDosageTable() {
  
    this.databaseObj.executeSql(`
    CREATE TABLE dosage
    (
      code character varying(25) NOT NULL,
      description character varying(50) NOT NULL,
      Sync_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT dosage_pkey PRIMARY KEY (code)
    )
    `, [])
      .then(() => {
        alert("State dosage Created!");
        console.log("State dosage Created!")
      })
      .catch(e => {
        if(!(JSON.stringify(e.message).includes("table dosage already exists")) ){
          alert("error " + JSON.stringify(e.message)
        )}
      });
  
  }


  async createDrugsTable() {

   
    this.databaseObj.executeSql(`
    CREATE TABLE drugs (
      ndcupc_code TEXT PRIMARY KEY NOT NULL,
      description TEXT NOT NULL,
      pakage_size INTEGER NOT NULL,
      strength TEXT NOT NULL,
      my_price NUMERIC(9,2) NOT NULL,
      awp_price NUMERIC(9,2) NOT NULL,
      wac_price NUMERIC(9,2) NOT NULL,
      control_class TEXT NOT NULL  ,
      rx_or_otc TEXT  ,
      uom TEXT NOT NULL,
      unit_per_pkg INTEGER NOT NULL,
      is_hazardous BOOLEAN NOT NULL,
      is_unit_dose BOOLEAN,
      dosage TEXT NOT NULL,
      manufactured_by TEXT NOT NULL,
      input_source TEXT DEFAULT "API",
      is_active TEXT DEFAULT "Y",
      created_by TEXT,
      created_on DATE,
      modified_by TEXT,
      modified_on DATE,
      notes TEXT,
      manufacture_id INTEGER,
      Sync_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (dosage) REFERENCES dosage (code),
      FOREIGN KEY (manufactured_by) REFERENCES manufacturer (manufacturer_code)
  );
    `, [])
      .then(() => {
        alert("State drugs Created!");
        console.log("State drugs Created!")
      })
      .catch(e => {
        if(!(JSON.stringify(e.message).includes("table drugs already exists")) ){
          alert("error " + JSON.stringify(e.message)
        )}     
       });
 
  }


  async createDrugs_return_policyTable() {

    this.databaseObj.executeSql(`
    CREATE TABLE drugs_return_policy (
      ndcupc_code TEXT NOT NULL,
      months_before_expiration INTEGER,
      months_after_expiration INTEGER,
      accept_returns BOOLEAN,
      accept_partial BOOLEAN,
      accept_percentage NUMERIC(6,2),
      check_package_originality BOOLEAN,
      inst_normaldrugitem TEXT,
      inst_schedule2items TEXT,
      inst_schedule3to5items TEXT,
      Sync_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (ndcupc_code) REFERENCES drugs (ndcupc_code)
  );
    `, [])
      .then(() => {
        alert("State drugs_return_policy Created!");
        console.log("State drugs_return_policy Created!")
      })
      .catch(e => {
        if(!(JSON.stringify(e.message).includes("table drugs_return_policy already exists")) ){
          alert("error " + JSON.stringify(e.message)
        )}      });
   
  }




  async createManufacturerTable() {
   
    this.databaseObj.executeSql(`
    CREATE TABLE manufacturer (
      manufacturer_code TEXT PRIMARY KEY NOT NULL,
      manufacturer_name TEXT NOT NULL,
      department TEXT,
      street TEXT NOT NULL,
      city TEXT NOT NULL,
      state INTEGER,
      zip_code TEXT NOT NULL,
      contact_person TEXT,
      mail_id TEXT,
      phone_no TEXT,
      fax_no TEXT,
      toll_free_no TEXT,
      link_to TEXT,
      bill_to TEXT,
      return_service TEXT,
      is_active TEXT DEFAULT "Y",
      created_by TEXT,
      created_on DATE,
      modified_by TEXT,
      modified_on DATE,
      billing_preference TEXT CHECK (billing_preference IN ("DIRECT", "BATCH")),
      is_special BOOLEAN DEFAULT 0,
      manufacture_id INTEGER,
      Sync_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (state) REFERENCES state (state_id)
  );
    `, [])
      .then(() => {
        alert("State manufacturer Created!");
        console.log("State manufacturer Created!")
      })
      .catch(e => {
        if(!(JSON.stringify(e.message).includes("table manufacturer already exists")) ){
          alert("error " + JSON.stringify(e.message)
        )}
      });

  }


  async createManufacturer_return_policyTable() {
  
    this.databaseObj.executeSql(`
    CREATE TABLE manufacturer_return_policy (
      manufacturer_code TEXT NOT NULL,
      months_before_expiration INTEGER,
      months_after_expiration INTEGER,
      accept_returns BOOLEAN,
      accept_partial BOOLEAN,
      accept_percentage NUMERIC(15,5),
      check_package_originality BOOLEAN,
      inst_normaldrugitem TEXT,
      inst_schedule2items TEXT,
      inst_schedule3to5items TEXT,
      Sync_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (manufacturer_code) REFERENCES manufacturer (manufacturer_code)
  );
    `, [])
      .then(() => {
        alert("State manufacturer_return_policy Created!");
        console.log("State manufacturer_return_policy Created!")
      })
      .catch(e => {
        if(!(JSON.stringify(e.message).includes("table manufacturer_return_policy already exists")) ){
          alert("error " + JSON.stringify(e.message)
        )}      });
  
  }

  async createwholesalerTable() {
  
    this.databaseObj.executeSql(`
    CREATE TABLE wholesaler (
      wholesaler_code TEXT PRIMARY KEY NOT NULL,
      wholesaler_name TEXT NOT NULL,
      department TEXT,
      street TEXT NOT NULL,
      city TEXT NOT NULL,
      state INTEGER,
      zip_code TEXT NOT NULL,
      contact_person TEXT,
      mail_id TEXT,
      phone_no TEXT,
      fax_no TEXT,
      toll_free_no TEXT,
      is_active TEXT DEFAULT "Y",
      expiry_packet TEXT,
      created_by TEXT,
      created_on DATE,
      modified_by TEXT,
      modified_on DATE,
      Sync_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (state) REFERENCES state (state_id)
  );
    `, [])
      .then(() => {
        alert("State wholesaler Created!");
        console.log("State wholesaler Created!")
      })
      .catch(e => {
        if(!(JSON.stringify(e.message).includes("table wholesaler already exists")) ){
          alert("error " + JSON.stringify(e.message)
        )}      });
  
  }

  async createCompanyTable() {
   
    this.databaseObj.executeSql(`
    CREATE TABLE company (
      company_code TEXT PRIMARY KEY NOT NULL,
      company_name TEXT NOT NULL,
      dba_name TEXT,
      street TEXT NOT NULL,
      city TEXT NOT NULL,
      zip_code TEXT NOT NULL,
      contact_person TEXT,
      mail_id TEXT,
      phone_no TEXT,
      fax_no TEXT,
      dea_no TEXT,
      dea_exp_date DATE,
      authorised_classes TEXT,
      facility_type TEXT,
      credit_to_name TEXT,
      credit_to_street TEXT NOT NULL,
      credit_to_city TEXT NOT NULL,
      credit_to_state INTEGER NOT NULL,
      credit_to_zip_code TEXT NOT NULL,
      credit_to_phone_no TEXT,
      return_pricing TEXT NOT NULL CHECK (return_pricing IN ("MYP", "WAC", "AWP")),
      return_pricing_awp_per NUMERIC(5,2),
      wholesaler_will_options INTEGER NOT NULL,
      wholesaler_will_months INTEGER,
      is_active TEXT DEFAULT "Y",
      wholesaler TEXT,
      cpp_option BOOLEAN NOT NULL DEFAULT 0,
      cpp_direct NUMERIC(8,2),
      cpp_batch NUMERIC(8,2),
      opp_option BOOLEAN NOT NULL DEFAULT 0,
      opp_direct NUMERIC(8,2),
      opp_batch NUMERIC(8,2),
      dpp_option BOOLEAN NOT NULL DEFAULT 0,
      dpp_return_fee NUMERIC(8,2),
      destruction_option BOOLEAN NOT NULL DEFAULT 0,
      state INTEGER,
      credit_to_fax_no TEXT,
      wholesaler_account TEXT,
      credit_to_dba TEXT,
      destruction_controlledsubstances NUMERIC(8,2),
      destruction_disposerx NUMERIC(8,2),
      destruction_disposalhazardous NUMERIC(8,2),
      Sync_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (credit_to_state) REFERENCES state (state_id),
      FOREIGN KEY (state) REFERENCES state (state_id),
      FOREIGN KEY (wholesaler) REFERENCES wholesaler (wholesaler_code)
  );
    `, [])
      .then(() => {
        alert("State company Created!");
        console.log("State company Created!")
      })
      .catch(e => {
        if(!(JSON.stringify(e.message).includes("table company already exists")) ){
          alert("error " + JSON.stringify(e.message)
        )}       });
  
  }
  async createrReturn_memoTable() {
 
    this.databaseObj.executeSql(`
    CREATE TABLE return_memo (
      return_memo_no TEXT PRIMARY KEY NOT NULL,
      return_memo_name TEXT NOT NULL,
      return_memo_date DATE NOT NULL,
      company TEXT NOT NULL,
      input_source TEXT DEFAULT "WEB",
      created_by TEXT NOT NULL,
      modified_by TEXT,
      modified_on TIMESTAMP,
      created_on TIMESTAMP,
      is_active TEXT DEFAULT "Y",
      Sync_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (company) REFERENCES company (company_code)
  );
    `, [])
      .then(() => {
        alert("State return_memo Created!");
        console.log("State return_memo Created!")
      })
      .catch(e => {
        if(!(JSON.stringify(e.message).includes("table return_memo already exists")) ){
          alert("error " + JSON.stringify(e.message)
        )}      });
  
  }


  async createrAccountTable() {
   
    this.databaseObj.executeSql(`
    CREATE TABLE account (
      account_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      account_name TEXT NOT NULL,
      street TEXT NOT NULL,
      city TEXT NOT NULL,
      state INTEGER NOT NULL,
      zip_code TEXT NOT NULL,
      phone_no TEXT,
      fax_no TEXT,
      dea_no TEXT,
      created_by TEXT,
      created_on TIMESTAMP,
      modified_by TEXT,
      modified_on TIMESTAMP,
      user_id TEXT NOT NULL,
      Sync_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (state) REFERENCES state (state_id)
  );
  
    `, [])
      .then(() => {
        alert("State account Created!");
        console.log("State account Created!")
      })
      .catch(e => {
        if(!(JSON.stringify(e.message).includes("table account already exists")) ){
          alert("error " + JSON.stringify(e.message)
        )}      });
  
  }

  
  async createrReturn_memo_itemsLocalTable() {
   
    this.databaseObj.executeSql(`
    CREATE TABLE IF NOT EXISTS return_memo_items_local (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      returnMemoItemsCode TEXT,
      returnMemo TEXT,
      returnMemoNo TEXT,
      companyCode TEXT,
      ndcupcCode TEXT,
      unitPackage TEXT,
      description TEXT,
      controlNo TEXT,
      packageSize TEXT,
      strength TEXT,
      dosage TEXT,
      manufacturerBy TEXT,
      returnTo TEXT,
      price TEXT,
      quantity INTEGER,
      dosageDescription TEXT,
      fullParticalProduct TEXT,
      reason TEXT,
      expDate TEXT,
      entryNo INTEGER,
      lotNo TEXT,
      returnable TEXT,
      repackagedProduct TEXT,
      overridePolicy TEXT,
      overridePolicyname TEXT,
      isFutureDated TEXT,
      created_local_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      live_updated_on TIMESTAMP,
      is_synced_live INTEGER DEFAULT 0
  );
  
    `, [])
      .then(() => {
        alert("State return_memo_items_local Created!");
        console.log("State return_memo_items_local Created!")
      })
      .catch(e => {
        if(!(JSON.stringify(e.message).includes("table return_memo_items_local already exists")) ){
          alert("error " + JSON.stringify(e.message)
        )}      });
  
  }



  async createrReturn_reasonTable() {
   
    this.databaseObj.executeSql(`
    CREATE TABLE return_reason
    (
      reason_id integer NOT NULL,
      reason_name character varying(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT return_reason_pkey PRIMARY KEY (reason_id)
    )
    `, [])
      .then(() => {
        alert("State return_reason Created!");
        console.log("State return_reason Created!")
      })
      .catch(e => {
        if(!(JSON.stringify(e.message).includes("table return_reason already exists")) ){
          alert("error " + JSON.stringify(e.message)
        )}      });
   
  }
  async createrReturn_memo_itemsTable() {
   
    this.databaseObj.executeSql(`
    CREATE TABLE return_memo_items (
      return_memo_items_code TEXT PRIMARY KEY NOT NULL,
      return_memo_no TEXT NOT NULL,
      ndcupc_code TEXT NOT NULL,
      pakage_or_unit CHAR(1) NOT NULL,
      quantity NUMERIC NOT NULL,
      price NUMERIC(8,2) NOT NULL,
      exp_date TEXT NOT NULL,
      reason INTEGER,
      lot_no TEXT,
      created_by TEXT,
      created_on TIMESTAMP,
      modified_by TEXT,
      modified_on TIMESTAMP,
      is_returnable BOOLEAN,
      full_partical_quantity BOOLEAN,
      repackaged_product BOOLEAN,
      return_to TEXT,
      is_active TEXT DEFAULT "Y",
      is_future_dated BOOLEAN,
      override_policy TEXT,
      item_no TEXT,
      entry_no INTEGER,
      override_policyname TEXT,
      account_id INTEGER,
      company_pricetype TEXT,
      Sync_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (account_id) REFERENCES account (account_id),
      FOREIGN KEY (ndcupc_code) REFERENCES drugs (ndcupc_code),
      FOREIGN KEY (reason) REFERENCES return_reason (reason_id),
      FOREIGN KEY (return_memo_no) REFERENCES return_memo (return_memo_no),
      FOREIGN KEY (return_to) REFERENCES manufacturer (manufacturer_code),
      CHECK (pakage_or_unit IN ("P", "U"))
  );
  
    `, [])
      .then(() => {
        console.log("State return_memo_items Created!")
      })
      .catch(e => {
        if(!(JSON.stringify(e.message).includes("table return_memo_items already exists")) ){
          alert("error " + JSON.stringify(e.message)
        )}      });
   
  }
  tableExists(tableName: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.sqlite.create({name: "your_database.db", location: "default"})
        .then((db: SQLiteObject) => {
          db.executeSql(`SELECT name FROM sqlite_master WHERE type="table" AND name=?`, [tableName])
            .then(result => {
              alert("result  " + JSON.stringify(result.rows))
              if (result.rows.length > 0) {
                // Table exists
                resolve(true);
              } else {
                // Table does not exist
                resolve(false);
              }
            })
            .catch(error => reject(error));
        })
        .catch(error => reject(error));
    });
  }

  insertStateRow(row :any) {
 

    this.databaseObj.executeSql(`
    INSERT INTO state (state_id, state_name, state_code) 
    VALUES 
    ("${row.state_id}", "${row.state_name}", "${row.state_code}");    `, [])
      .then(() => {
        console.log("Row Inserted!"+row.state_name);
      //  this.getRows();

      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }

  insertDosageRow(row :any) {
 

    this.databaseObj.executeSql(`
    INSERT INTO dosage (code, description)
    VALUES 
    ("${row.id}", "${row.text}");    `, [])
      .then(() => {
        console.log("Row Inserted!"+row.text);
      //  this.getRows();
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }

  insertreturn_reasonRow(row :any) {
 

    this.databaseObj.executeSql(`
    INSERT INTO return_reason (reason_id, reason_name)
    VALUES 
    ("${row.reason_id}", "${row.reason_name}");    `, [])
      .then(() => {
        console.log("Row Inserted!"+row.reason_name);
      //  this.getRows();
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }


  insertDrugs_return_policyRow(row :any) {
 

    this.databaseObj.executeSql(`
    INSERT INTO drugs_return_policy (ndcupc_code, months_before_expiration, months_after_expiration, accept_returns, accept_partial, accept_percentage, check_package_originality, inst_normaldrugitem, inst_schedule2items, inst_schedule3to5items)
    VALUES 
    ("${row.ndcupc_code}", "${row.months_before_expiration}", "${row.months_after_expiration}", "${row.accept_returns}", "${row.accept_partial}", "${row.accept_percentage}", "${row.check_package_originality}" , "${row.inst_normaldrugitem}" , "${row.inst_schedule2items}", "${row.inst_schedule3to5items}" );    `, [])
      .then(() => {
        console.log("Row Inserted!"+row.text);
      //  this.getRows();
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }

  insertWholesalerListRow(row :any) {
 

    this.databaseObj.executeSql(`
    INSERT INTO wholesaler (
      wholesaler_code, wholesaler_name, department, street, city, state, zip_code,
      contact_person, mail_id, phone_no, fax_no, toll_free_no, is_active,
      expiry_packet, created_by, created_on, modified_by, modified_on
    )    VALUES 
    ("${row.wholesaler_code}", "${row.wholesaler_name}", "${row.department}", "${row.street}", "${row.city}", "${row.state}", "${row.zip_code}" ,
     "${row.contact_person}" , "${row.mail_id}", "${row.phone_no}", "${row.fax_no}", "${row.toll_free_no}", "${row.is_active}",
      "${row.expiry_packet}", "${row.created_by}", "${row.created_on}", "${row.modified_by}" , "${row.modified_on}");    `, [])
      .then(() => {
        console.log("Row Inserted!"+row.wholesaler_code);
      //  this.getRows();
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }


  insertaccountListRow(row :any) {
 

    this.databaseObj.executeSql(`
    INSERT INTO account (
      account_name, street, city, state, zip_code, phone_no, fax_no,
      dea_no, created_by, created_on, modified_by, modified_on, user_id
    )   VALUES 
    ("${row.account_name}", "${row.street}", "${row.city}", "${row.state}", "${row.zip_code}", "${row.phone_no}", "${row.fax_no}" ,
     "${row.dea_no}" , "${row.created_by}", "${row.created_on}", "${row.modified_by}", "${row.modified_on}", "${row.user_id}");    `, [])
      .then(() => {
        console.log("Row Inserted!"+row.wholesaler_code);
      //  this.getRows();
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }

  insertCompanyListRow(row :any) {
 

    this.databaseObj.executeSql(`
    INSERT INTO company (
      company_code, company_name, dba_name, street, city, zip_code,
      contact_person, mail_id, phone_no, fax_no, dea_no, dea_exp_date,
      authorised_classes, facility_type, credit_to_name, credit_to_street,
      credit_to_city, credit_to_state, credit_to_zip_code, credit_to_phone_no,
      return_pricing, return_pricing_awp_per, wholesaler_will_options,
      wholesaler_will_months, is_active, wholesaler, cpp_option, cpp_direct,
      cpp_batch, opp_option, opp_direct, opp_batch, dpp_option, dpp_return_fee,
      destruction_option, state, credit_to_fax_no, wholesaler_account,
      credit_to_dba, destruction_controlledsubstances,
      destruction_disposerx, destruction_disposalhazardous
    )   VALUES 
    ("${row.company_code}", "${row.company_name}", "${row.dba_name}", "${row.street}", "${row.city}",  "${row.zip_code}" ,
     "${row.contact_person}" , "${row.mail_id}", "${row.phone_no}", "${row.fax_no}", "${row.dea_no}", "${row.dea_exp_date}",
      "${row.authorised_classes}", "${row.facility_type}", "${row.credit_to_name}", "${row.credit_to_street}" , 
      "${row.credit_to_city}" ,"${row.credit_to_state}" , "${row.credit_to_zip_code}", "${row.credit_to_phone_no}", 
      "${row.return_pricing}", "${row.return_pricing_awp_per}", "${row.wholesaler_will_options}",
      "${row.wholesaler_will_months}","${row.is_active}" , "${row.wholesaler}", "${row.cpp_option}", "${row.cpp_direct}",
      "${row.cpp_batch}","${row.opp_option}" , "${row.opp_direct}", "${row.opp_batch}", "${row.dpp_option}","${row.dpp_return_fee}",
      "${row.destruction_option}","${row.state}" , "${row.credit_to_fax_no}", "${row.wholesaler_account}", 
      "${row.credit_to_dba}","${row.destruction_controlledsubstances}",
      "${row.destruction_disposerx}","${row.destruction_disposalhazardous}");    `, [])
      .then(() => {
        console.log("Row Inserted!"+row.wholesaler_code);
      //  this.getRows();
      })
      .catch(e => {


        alert("error " + JSON.stringify(e))
      });
  }

  insertreturn_memo_items(row :any) {
    const sql = `
    INSERT INTO return_memo_items (
      return_memo_items_code, return_memo_no, ndcupc_code, pakage_or_unit,
      quantity, price, exp_date, reason, lot_no, created_by, created_on,
      modified_by, modified_on, is_returnable, full_partical_quantity,
      repackaged_product, return_to, is_active, is_future_dated,
      override_policy, item_no, entry_no, override_policyname, account_id,
      company_pricetype
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

    this.databaseObj.executeSql(sql, [
      row.return_memo_items_code, row.return_memo_no, row.ndcupc_code, row.pakage_or_unit,
      row.quantity, row.price, row.exp_date, row.reason, row.lot_no, row.created_by, row.created_on,
      row.modified_by, row.modified_on, row.is_returnable, row.full_partical_quantity,
      row.repackaged_product, row.return_to, row.is_active, row.is_future_dated,
      row.override_policy, row.item_no, row.entry_no, row.override_policyname, row.account_id, row.company_pricetype
  ])
      .then(() => {
        console.log("Row Inserted!"+row.wholesaler_code);
      //  this.getRows();
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }

  async insertDrugListIntoDatabase(drugList: any[]) {
    for (let i = 0; i < drugList.length; i++) {
      const drug = drugList[i];
      try {
        await this.databaseObj.executeSql(
          `INSERT INTO drugs (ndcupc_code, description, pakage_size, strength, my_price, awp_price, wac_price, control_class, rx_or_otc, uom, unit_per_pkg, is_hazardous, is_unit_dose, dosage, manufactured_by, created_by)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [drug.ndcupc_code, drug.description, drug.pakage_size, drug.strength, drug.my_price, drug.awp_price, drug.wac_price, drug.control_class, drug.rx_or_otc, drug.uom, drug.unit_per_pkg, drug.is_hazardous, drug.is_unit_dose, drug.dosage, drug.manufactured_by, drug.created_by]
        );
        console.log("Row Inserted! " + drug.text);
      } catch (e) {
       
        console.error("Error in drug insertion: " + JSON.stringify(e));
      }
    }
  }

  async insertReturnLocalDatabase(data :any) {
      try {
        await this.databaseObj.executeSql(
          `INSERT INTO return_memo_items_local (
            returnMemoItemsCode,
            returnMemo,
            returnMemoNo,
            companyCode,
            ndcupcCode,
            unitPackage,
            description,
            controlNo,
            packageSize,
            strength,
            dosage,
            manufacturerBy,
            returnTo,
            price,
            quantity,
            dosageDescription,
            fullParticalProduct,
            reason,
            expDate,
            entryNo,
            lotNo,
            returnable,
            repackagedProduct,
            overridePolicy,
            overridePolicyname,
            isFutureDated
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
         [
           data.returnMemoItemsCode,
           data.returnMemo,
           data.returnMemoNo,
           data.companyCode,
           data.ndcupcCode,
           data.unitPackage,
           data.description,
           data.controlNo,
           data.packageSize,
           data.strength,
           data.dosage,
           data.manufacturerBy,
           data.returnTo,
           data.price,
           data.quantity,
           data.dosageDescription,
           data.fullParticalProduct,
           data.reason,
           data.expDate,
           data.entryNo,
           data.lotNo,
           data.returnable,
           data.repackagedProduct,
           data.overridePolicy,
           data.overridePolicyname,
           data.isFutureDated,
         ]
        );
        console.log("Row Inserted! " +JSON.stringify(data) );
      } catch (e) {
       
        console.error("Error in drug insertion: " + JSON.stringify(e));
      }
    
  }

  insertreturn_memoRow(row :any) {
    this.databaseObj.executeSql(`
    INSERT INTO return_memo (
      return_memo_no, return_memo_name, return_memo_date, company, input_source,
      created_by, modified_by, modified_on, created_on, is_active
    )    VALUES 
    ("${row.return_memo_no}", "${row.return_memo_name}", "${row.return_memo_date}", "${row.company}", "${row.input_source}", 
    "${row.created_by}", "${row.modified_by}" , "${row.modified_on}" , "${row.created_on}", "${row.is_active}" );   `, [])
      .then(() => {
        console.log("Row Inserted!"+row.text);
      //  this.getRows();
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }

  insertmanufacturerRow(row :any) {

    console.log(`
    INSERT INTO manufacturer (manufacturer_code, manufacturer_name, department, street, city, state, zip_code, contact_person, mail_id, phone_no, fax_no, toll_free_no, link_to, bill_to, return_service, created_by, created_on, modified_by, modified_on, billing_preference, is_special, manufacture_id)     VALUES 
    ("${row.manufacturer_code}", "${row.manufacturer_name}", "${row.department}", "${row.street}", "${row.city}", "${row.state}", "${row.zip_code}" , "${row.contact_person}" , "${row.mail_id}", "${row.phone_no}" 
    , "${row.fax_no}", "${row.toll_free_no}", "${row.link_to}", "${row.bill_to}", "${row.return_service}", "${row.created_by}" , "${row.created_on}" , "${row.modified_by}" , "${row.modified_on}" , "${row.billing_preference}" , "${row.is_special}" , "${row.manufacture_id}" ) ; `)

    this.databaseObj.executeSql(`
    INSERT INTO manufacturer (manufacturer_code, manufacturer_name, department, street, city, state, zip_code, contact_person, mail_id, phone_no, fax_no, toll_free_no, link_to, bill_to, return_service, created_by, created_on, modified_by, modified_on, billing_preference, is_special, manufacture_id)     VALUES 
    ("${row.manufacturer_code}", "${row.manufacturer_name}", "${row.department}", "${row.street}", "${row.city}", "${row.state}", "${row.zip_code}" , "${row.contact_person}" , "${row.mail_id}", "${row.phone_no}" 
    , "${row.fax_no}", "${row.toll_free_no}", "${row.link_to}", "${row.bill_to}", "${row.return_service}", "${row.created_by}" , "${row.created_on}" , "${row.modified_by}" , "${row.modified_on}" , "${row.billing_preference}" , "${row.is_special}" , "${row.manufacture_id}" ) ; `, [])
      .then(() => {
        console.log("Row Inserted!"+row.manufacturer_code);
      //  this.getRows();
      })
      .catch(e => {

        console.log("error121"+`
        INSERT INTO manufacturer (manufacturer_code, manufacturer_name, department, street, city, state, zip_code, contact_person, mail_id, phone_no, fax_no, toll_free_no, link_to, bill_to, return_service, created_by, created_on, modified_by, modified_on, billing_preference, is_special, manufacture_id)     VALUES 
        ("${row.manufacturer_code}", "${row.manufacturer_name}", "${row.department}", "${row.street}", "${row.city}", "${row.state}", "${row.zip_code}" , "${row.contact_person}" , "${row.mail_id}", "${row.phone_no}" 
        , "${row.fax_no}", "${row.toll_free_no}", "${row.link_to}", "${row.bill_to}", "${row.return_service}", "${row.created_by}" , "${row.created_on}" , "${row.modified_by}" , "${row.modified_on}" , "${row.billing_preference}" , "${row.is_special}" , "${row.manufacture_id}" ) ; `)
        alert("error " + JSON.stringify(e))

       
    
      });
  }

  insertmanufacture_return_policyRow(row :any) {
 

    this.databaseObj.executeSql(`
    INSERT INTO manufacturer_return_policy 
    (manufacturer_code, months_before_expiration, months_after_expiration, accept_returns, accept_partial, accept_percentage, check_package_originality, inst_normaldrugitem, inst_schedule2items, inst_schedule3to5items) 
        VALUES 
    ("${row.manufacturer_code}", "${row.months_before_expiration}", "${row.months_after_expiration}", "${row.accept_returns}", "${row.accept_partial}", "${row.accept_percentage}", "${row.check_package_originality}" ,
     "${row.inst_normaldrugitem}" , "${row.inst_schedule2items}", "${row.inst_schedule3to5items}" );   `, [])
      .then(() => {
        console.log("Row Inserted!"+row.manufacturer_code);
      //  this.getRows();
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }


  countRows( table:any): Promise<number> {
    return new Promise((resolve, reject) => {
      
       this.databaseObj.executeSql(`SELECT COUNT(*) AS row_count FROM ${table}`, []).then((data) => {
          if (data && data.rows.length > 0) {
            resolve(data.rows.item(0).row_count);
          } else {
            resolve(0);
          }
        }).catch(error => {
          console.error("Error executing SQL query:", error);
          reject(error);
        });
     
    });
  }

  countdosageRows(): Promise<number> {
    return new Promise((resolve, reject) => {
      
       this.databaseObj.executeSql("SELECT COUNT(*) AS row_count FROM dosage", []).then((data) => {
          if (data && data.rows.length > 0) {
            resolve(data.rows.item(0).row_count);
          } else {
            resolve(0);
          }
        }).catch(error => {
          console.error("Error executing SQL query:", error);
          reject(error);
        });
     
    });
  }
  countManufacturerRows(): Promise<number> {
    return new Promise((resolve, reject) => {
      
       this.databaseObj.executeSql("SELECT COUNT(*) AS row_count FROM manufacturer", []).then((data) => {
          if (data && data.rows.length > 0) {
            resolve(data.rows.item(0).row_count);
          } else {
            resolve(0);
          }
        }).catch(error => {
          console.error("Error executing SQL query:", error);
          reject(error);
        });
     
    });
  }

  countmanufacturer_return_policyRows(): Promise<number> {
    return new Promise((resolve, reject) => {
      
       this.databaseObj.executeSql("SELECT COUNT(*) AS row_count FROM manufacturer_return_policy", []).then((data) => {
          if (data && data.rows.length > 0) {
            resolve(data.rows.item(0).row_count);
          } else {
            resolve(0);
          }
        }).catch(error => {
          console.error("Error executing SQL query:", error);
          reject(error);
        });
     
    });
  }

  deleteTable(tableName: string): Promise<void> {
   
      return this.databaseObj.executeSql(`DROP TABLE IF EXISTS ${tableName}`, []).then(() => {
        console.log(`Table ${tableName} deleted successfully`);
        alert(`Table ${tableName} deleted successfully`)
      }).catch(error => {
        console.error(`Error deleting table ${tableName}:`, error);
      });
    
  }

  getCompanylist(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.databaseObj.executeSql(`
          SELECT 
            com.company_code as companyCode, 
            com.company_name as companyName, 
            com.dba_name as companyDba, 
            com.street as companyStreet, 
            com.city as companyCity, 
            st.state_name as companyState, 
            com.dea_exp_date as defExpirationDate, 
            com.zip_code as companyPincode, 
            com.contact_person as companyContact, 
            com.mail_id as companyEmailID, 
            com.phone_no as companyPhone, 
            com.dea_no as defNumber 
          FROM 
            company com 
          LEFT JOIN 
            state st ON st.state_id = com.state 
          WHERE 
            com.is_active = 'Y' 
          ORDER BY 
            com.company_name ASC;
        `, []).then((data) => {
          let result = [];
          for (let i = 0; i < data.rows.length; i++) {
            result.push(data.rows.item(i));
            console.log(JSON.stringify(data.rows.item(i).companyCode))
          }
          resolve(result);
        }).catch((error) => {
          reject(error);
          console.log("error"+error)
          console.error("Error executing SQL query:", error);
          alert("error " + JSON.stringify(error))


        });
      })
    
  }
  getMemolist(company:any): Promise<any[]> {

   
    return new Promise((resolve, reject) => {
      this.databaseObj.executeSql(`
      SELECT 
      retMom.return_memo_no as returnMemoNo, 
      retMom.return_memo_name as returnMemoName, 
      retMom.return_memo_date as returnMemoDate, 
      com.company_name as company, 
      com.company_code as companyCode 
  FROM 
      return_memo retMom 
  LEFT OUTER JOIN 
      company com ON com.company_code = retMom.company 
  WHERE 
      retMom.company = '${company}' 
      AND retMom.is_active = 'Y' 
  ORDER BY 
      retMom.modified_on DESC;
        `, []).then((data) => {
          let result = [];
          for (let i = 0; i < data.rows.length; i++) {
            result.push(data.rows.item(i));
            console.log(JSON.stringify(data.rows.item(i)))
          }
          resolve(result);
        }).catch((error) => {
          reject(error);
          console.log("error"+error)
          console.error("Error executing SQL query:", error);
          alert("error " + JSON.stringify(error))


        });
      })
    
  }

  getreasomlist(): Promise<any[]> {

   
    return new Promise((resolve, reject) => {
      this.databaseObj.executeSql(`
      SELECT reason_id AS id, reason_name AS text 
      FROM return_reason 
      ORDER BY reason_name;
            `, []).then((data) => {
          let result = [];
          for (let i = 0; i < data.rows.length; i++) {
            result.push(data.rows.item(i));
            console.log(JSON.stringify(data.rows.item(i)))
          }
          resolve(result);
        }).catch((error) => {
          reject(error);
          console.log("error"+error)
          console.error("Error executing SQL query:", error);
          alert("error " + JSON.stringify(error))


        });
      })
    
  }
  getMemoitemlist(company :any): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.databaseObj.executeSql(`
      SELECT 
      rmi.return_memo_items_code as returnMemoItemsCode, 
      rmi.return_memo_no as returnMemoNo, 
      rmi.ndcupc_code as ndcupcCode, 
      dr.description as description,
      rmi.quantity as quantity, 
      CASE WHEN rmi.full_partical_quantity THEN 'NO' ELSE 'YES' END as fullParticalProduct, 
      rmi.price as price, 
      SUM(CASE WHEN rmi.full_partical_quantity THEN (rmi.price*rmi.quantity) 
               ELSE (rmi.price/dr.pakage_size*rmi.quantity) END) as estimateval, 
      drman.manufacturer_name as manufacturerBy, 
      CASE WHEN rmi.is_returnable THEN 'YES' ELSE 'NO' END as returnable, 
      rmiman.manufacturer_name as returnTo, 
      rmi.lot_no as lotNo
  FROM 
      return_memo_items rmi
  LEFT OUTER JOIN 
      drugs dr ON dr.ndcupc_code = rmi.ndcupc_code 
  LEFT OUTER JOIN 
      dosage dos ON dos.code = dr.dosage 
  LEFT OUTER JOIN 
      manufacturer drman ON drman.manufacturer_code = dr.manufactured_by
  LEFT OUTER JOIN 
      manufacturer rmiman ON rmiman.manufacturer_code = rmi.return_to  
  WHERE 
         UPPER(TRIM(rmi.return_memo_no)) = UPPER(TRIM('${company}')) AND
         rmi.is_active = 'Y' 
  GROUP BY 
      rmi.return_memo_items_code, rmi.return_memo_no, rmi.ndcupc_code, dr.description,
      rmi.quantity, rmi.full_partical_quantity, rmi.price, dr.pakage_size, drman.manufacturer_name,
      rmi.is_returnable, rmiman.manufacturer_name, rmi.lot_no
  ORDER BY 
      rmi.entry_no DESC;
        `, []).then((data) => {
          let result = [];
          for (let i = 0; i < data.rows.length; i++) {
            result.push(data.rows.item(i));
            console.log(JSON.stringify(data.rows.item(i)))
          }
          resolve(result);
        }).catch((error) => {
          reject(error);
          console.log("error"+error)
          console.error("Error executing SQL query:", error);
          alert("error " + JSON.stringify(error))
        });
      })
    
  }

  validate(id:any): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.databaseObj.executeSql(`
      SELECT count(*) from drugs where ndcupc_code = '${id}'
        `, []).then((data) => {
          let result = [];
          for (let i = 0; i < data.rows.length; i++) {
            result.push(data.rows.item(i));
            console.log(JSON.stringify(data.rows.item(i)))
          }
          resolve(result);
        }).catch((error) => {
          reject(error);
          console.log("error"+error)
          console.error("Error executing SQL query:", error);
          alert("error " + JSON.stringify(error))
        });
      })
    
  }

  feachdtl(id:any): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const sql = `
      SELECT 
      dr.ndcupc_code as ndcupc, 
      dr.description as description, 
      dr.pakage_size as packageSize, 
      dr.strength as strength, 
      dr.my_price as myPrice, 
      dr.awp_price as awp, 
      dr.wac_price as wap, 
      dr.control_class as control, 
      dr.rx_or_otc as rxOtc, 
      dr.uom as unitOfMeasure, 
      dr.unit_per_pkg as unitPerPackage, 
      dr.is_hazardous as hazardous, 
      dr.is_unit_dose as unitDose, 
      dr.dosage as dosage, 
      dr.manufactured_by as manufacturerBy, 
      dos.description as dosageDescription, 
      dr.notes as notes, 
      CASE 
          WHEN m.bill_to='MANUFACTURER' THEN m.manufacturer_name 
          ELSE m.link_to 
      END as linkToReturn 
  FROM 
      drugs dr 
  LEFT OUTER JOIN 
      dosage dos ON dos.code=dr.dosage 
  LEFT OUTER JOIN 
      manufacturer m ON m.manufacturer_code=dr.manufactured_by 
  WHERE 
      ndcupc_code = '${id}';`
      console.log("sql "+sql)
      this.databaseObj.executeSql(sql, []).then((data) => {
          let result = [];

          console.log("dtl"+ JSON.stringify(data.rows.item))
          for (let i = 0; i < data.rows.length; i++) {
            result.push(data.rows.item(i));
            console.log(JSON.stringify(data.rows.item(i)))
          }

          console.log("dtl1"+ JSON.stringify(result[0]))

          resolve(result[0]);
        }).catch((error) => {
          reject(error);
          console.log("error"+error)
          console.error("Error executing SQL query:", error);
          alert("error " + JSON.stringify(error))
        });
      })
    
  }

  getDatabase() {
    return this.databaseObj;
  }

  getreturnItemListLoacl(): Promise<any[]> {

   
      return new Promise((resolve, reject) => {
        this.databaseObj.executeSql(`
        SELECT *
        FROM return_memo_items_local 
        ORDER BY created_local_on;
              `, []).then((data) => {
            let result = [];
            for (let i = 0; i < data.rows.length; i++) {
              result.push(data.rows.item(i));
              console.log(JSON.stringify(data.rows.item(i)))
            }
            resolve(result);
          }).catch((error: any) => {
            reject(error);
            console.log("error"+error)
            console.error("Error executing SQL query:", error);
            alert("error " + JSON.stringify(error))
  
  
          });
        })
      
  }
  
}
