import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { environment as env } from '../environments/environment';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeroDetailsComponent } from './components/hero-details/hero-details.component';
import { HeroesComponent } from './components/heroes/heroes.component';
import { TestsComponent } from './components/tests/tests.component';

// Routes
const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'details/:id', component: HeroDetailsComponent },
  { path: 'heroes', component: HeroesComponent },
  ...(env.production ? [] : [{ path: 'tests', component: TestsComponent }])
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
