import { Injectable } from '@angular/core';
import { JSEncrypt } from 'jsencrypt/lib/JSEncrypt';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class CedService {
  publicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCz1zqQHtHvKczHh58ePiRNgOyiHEx6lZDPlvwBTaHmkNlQyyJ06SIlMU1pmGKxILjT7n06nxG7LlFVUN5MkW/jwF39/+drkHM5B0kh+hPQygFjRq81yxvLwolt+Vq7h+CTU0Z1wkFABcTeQQldZkJlTpyx0c3+jq0o47wIFjq5fwIDAQAB";
  privateKey = "MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBALPXOpAe0e8pzMeHnx4+JE2A7KIcTHqVkM+W/AFNoeaQ2VDLInTpIiUxTWmYYrEguNPufTqfEbsuUVVQ3kyRb+PAXf3/52uQczkHSSH6E9DKAWNGrzXLG8vCiW35WruH4JNTRnXCQUAFxN5BCV1mQmVOnLHRzf6OrSjjvAgWOrl/AgMBAAECgYAgA0YHdZUFL7mmIvwuE/2+Vh7JVKRAhfM7ILNHQBx7wHkOqro9eWp8mGQhUeDvitWb1C4yizJK0Znkx/pqQtFZuoatUsggocjXFl86FElQwrBp08DvfKfd0bGgy0VTFQVmCtxiqhpAmC7xmXNZXfBD41rl9CKbFfZw05QC5BoQ0QJBAO7LSku97NgFBJQ+vbmVDonuvgnQjVNb7SnwrcpJHEUAGbaVq1a50jz+s6n39TOagASaW6pcY0uwiygYu6xDnkMCQQDAzIGNKFKomTI6djcOyHfQ1ZXqyDQ3guX6nHhzZnNHFF8ZD3fPyyIRSZ3JvPK5iEzJLhB7FRtyWkGcdXgJTWoVAkBfx9zKGqkYUJLwn2XcPWRygPdq2mMFb5bmPqqGu+KB7rNhoBD0nV4tpwALifCpPSxiLEPeRmZxoqN+dsU4KHsfAkAyQt4fK3zpAQ8MGJdf3jkGEzhC/bBHLHPB8pqgEvxIcnIcOWEVpbIa6aMd3Yk1fuftpnmbbLQ8CnWCUUlau3jFAkEAk6bOZIWhTYRwIZcwBdkpyLlbatQFoTTM3i444YutXt3FrFfaWBxge+eYKId+J4dCrt/EmHhSfWKEzHibf6N5Sg==";
 
  constructor() { }

  encryptingProcess(value: string): string {
    let RSAEncrypt = new JSEncrypt();
    RSAEncrypt.setPublicKey(this.publicKey);
    let rtnencryptedValue = RSAEncrypt.encrypt(value);
    if(rtnencryptedValue){
      return rtnencryptedValue;

    }else{
      return ""
    }
  }

  decryptingProcess(value: string): string {
    let RSAEncrypt = new JSEncrypt();
    RSAEncrypt.setPrivateKey(this.privateKey);
    let rtndecryptedValue = RSAEncrypt.decrypt(value);
    
    if(rtndecryptedValue){
      return rtndecryptedValue;

    }else{
      return ""
    }
  }


  
  encryptAesToString(stringToEncrypt: any, key: string): string {
    const stringToEncryptStr = stringToEncrypt.toString();
    const key2 = CryptoJS.enc.Utf8.parse(key);
    const iv = CryptoJS.enc.Utf8.parse(key);
    const encrypted = CryptoJS.AES.encrypt(stringToEncryptStr, key2, {
      keySize: 16,
      iv: iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    let eHex = CryptoJS.enc.Hex.stringify(encrypted.ciphertext);
    return encrypted.toString();
  }

  decryptAesformString(value: string , keys: string): string {
    var key = CryptoJS.enc.Utf8.parse(keys);
    var iv = CryptoJS.enc.Utf8.parse(keys);
    var decrypted = CryptoJS.AES.decrypt(value, key, {
      keySize: 16,
      iv: iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }



}
