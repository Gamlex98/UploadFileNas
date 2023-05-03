import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule , ReactiveFormsModule } from '@angular/forms'
import { AuthenticationService } from './upload-service';
import { AuthenticationComponent } from './app.component';


@NgModule({
  declarations: [
    AuthenticationComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [AuthenticationService],
  bootstrap: [AuthenticationComponent]
})
export class AppModule { }

