import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProductionDataReportComponent } from './production-data-report/production-data-report.component';
import { ProductionDataViewComponent } from './production-data-view/production-data-view.component';
import { ProductionMetricsAddComponent } from './production-metrics-add/production-metrics-add.component';
import { ProductionMetricsEditComponent } from './production-metrics-edit/production-metrics-edit.component';
import { ManagementImportComponent } from './management-import/management-import.component';
import { ManagementExportComponent } from './management-export/management-export.component';
import { ProductionStatusViewComponent } from './production-status-view/production-status-view.component';


const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'production-data-report', component: ProductionDataReportComponent },
  { path: 'production-data-view', component: ProductionDataViewComponent },
  { path: 'production-metrics-add', component: ProductionMetricsAddComponent },
  { path: 'production-metrics-edit', component: ProductionMetricsEditComponent },
  { path: 'management-import', component: ManagementImportComponent },
  { path: 'management-export', component: ManagementExportComponent },
  { path: 'production-status-view', component: ProductionStatusViewComponent }
  ];


@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routableComponents = [
    HomeComponent,
    LoginComponent,
    ProductionDataReportComponent,
    ProductionDataViewComponent,
    ManagementImportComponent,
    ManagementExportComponent,
    ProductionStatusViewComponent,
    ProductionMetricsEditComponent,
    ProductionMetricsAddComponent
   ];
