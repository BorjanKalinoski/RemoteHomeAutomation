import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppComponent} from './app.component';
import {ACRemoteComponent} from './components/acremote/acremote.component';
import {NotFoundComponent} from './components/not-found/not-found.component';
import {HomeComponent} from './components/home/home.component';

import { TVRemoteComponent } from './components/tvremote/tvremote.component';

const routes: Routes =
  [
    {path: '', component: HomeComponent},
    {path: 'tv/:deviceName', component: TVRemoteComponent},
    {path: 'ac/:deviceName', component: ACRemoteComponent},
    {path: '**', component: NotFoundComponent}
  ];

@NgModule({
  imports:
    [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
