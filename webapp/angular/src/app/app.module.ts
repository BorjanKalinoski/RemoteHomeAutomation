import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { ACRemoteComponent } from './components/acremote/acremote.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HomeComponent } from './components/home/home.component';
import { TVRemoteComponent } from './components/tvremote/tvremote.component';
import {DeviceService} from './services/device.service';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    ACRemoteComponent,
    NotFoundComponent,
    HomeComponent,
    TVRemoteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FontAwesomeModule
  ],
  providers: [
    {provide: NZ_I18N, useValue: en_US},
    DeviceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
