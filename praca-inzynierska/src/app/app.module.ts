import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LandingComponent } from './components/landing/landing.component';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { ErrorBlockComponent } from './components/error-block/error-block.component';
import { InterceptorService } from './services/interceptor/interceptor.service';
import { LandingFirstLoginComponent } from './components/landing/landing-first-login/landing-first-login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LandingTableComponent } from './components/landing/landing-table/landing-table.component';
import { MatTableModule } from '@angular/material/table'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalComponent } from './components/modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    LandingComponent,
    SpinnerComponent,
    ErrorBlockComponent,
    LandingFirstLoginComponent,
    LandingTableComponent,
    ModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    BrowserAnimationsModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
