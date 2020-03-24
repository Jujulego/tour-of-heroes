import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { LayoutModule } from './modules/layout/layout.module';
import { LoaderModule } from './modules/loader/loader.module';
import { LoggingModule } from './modules/logging/logging.module';

import { AppComponent } from './app.component';
import { HeroesComponent } from './heroes/heroes.component';
import { HeroDetailsComponent } from './hero-details/hero-details.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InMemoryDataService } from './in-memory-data.service';
import { HeroSearchComponent } from './hero-search/hero-search.component';
import { HeroListComponent } from './hero-list/hero-list.component';
import { TestsComponent } from './tests/tests.component';
import { QrcodeComponent } from './qrcode/qrcode.component';

import { environment as env } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    HeroesComponent,
    HeroDetailsComponent,
    DashboardComponent,
    HeroSearchComponent,
    HeroListComponent,
    TestsComponent,
    QrcodeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,

    HttpClientModule,
    ...(env.memoryApi ? [
      HttpClientInMemoryWebApiModule.forRoot(
        InMemoryDataService, {
          dataEncapsulation: false,
          passThruUnknownUrl: true,
        }
      ),
    ] : []),

    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatRadioModule,

    LayoutModule,
    LoggingModule,
    LoaderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
