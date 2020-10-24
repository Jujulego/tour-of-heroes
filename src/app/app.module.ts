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
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { AppRoutingModule } from './app-routing.module';
import { LayoutModule } from './modules/layout/layout.module';
import { LoaderModule } from './modules/loader/loader.module';
import { LoggingModule } from './modules/logging/logging.module';
import { QrCodeModule } from './modules/qr-code/qr-code.module';
import { SelectModule } from './modules/select/select.module';

import { AppComponent } from './app.component';
import { CircularProgressComponent } from './components/circular-progress/circular-progress.component';
import { HeroesComponent } from './components/heroes/heroes.component';
import { HeroDetailsComponent } from './components/hero-details/hero-details.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InMemoryDataService } from './services/in-memory-data.service';
import { HeroSearchComponent } from './components/hero-search/hero-search.component';
import { HeroListComponent } from './components/hero-list/hero-list.component';
import { TestsComponent } from './components/tests/tests.component';

import { environment as env } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    CircularProgressComponent,
    DashboardComponent,
    HeroesComponent,
    HeroDetailsComponent,
    HeroListComponent,
    HeroSearchComponent,
    TestsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,

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

    AppRoutingModule,
    LayoutModule,
    LoggingModule,
    LoaderModule,
    QrCodeModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    SelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
