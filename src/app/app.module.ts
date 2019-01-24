import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BlockUIModule } from 'ng-block-ui';

import { CookieService } from 'ngx-cookie-service';

import { RootComponent } from './component/root/root.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { AddComponent } from './component/add/add.component';

@NgModule({
  declarations: [
    DashboardComponent,
    AddComponent,
    RootComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    CollapseModule.forRoot(),
    BlockUIModule.forRoot()
  ],
  providers: [
    CookieService
  ],
  bootstrap: [RootComponent]
})
export class AppModule { }
