import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { RECAPTCHA_SETTINGS, RecaptchaSettings, RecaptchaModule } from 'ng-recaptcha'; 
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { httpInterceptorProviders } from './auth/auth-interceptor';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { DatePipe } from '@angular/common';


@NgModule({
  declarations: [AppComponent],
  imports: [ReactiveFormsModule,
    HttpClientModule,
    BrowserModule, IonicModule.forRoot(),
    AppRoutingModule,
    ],
    
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: '6LeiApIfAAAAAOBsKqX0U-EQNu3lk3O9LVByiRAA',
      } as RecaptchaSettings,
    },
    httpInterceptorProviders,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    NativeStorage,

  DatePipe],
  bootstrap: [AppComponent],

  
})
export class AppModule {}
