import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
/** routing module */
import { AppRoutingModule } from './app-routing.module';
/** components */
import { AppComponent } from './app.component';
import { IndexComponent } from './components/routes/index/index.component';
import { AuthComponent } from './components/routes/auth/auth.component';
import { HeaderComponent } from './components/wrapper/header/header.component';
import { FooterComponent } from './components/wrapper/footer/footer.component';
import { UserComponent } from './components/wrapper/user/user.component';
import { SidebarComponent } from './components/wrapper/sidebar/sidebar.component';
import { WrapperComponent } from './components/wrapper/wrapper/wrapper.component';
import { ReservationComponent } from './components/routes/reservation/reservation.component';
import { UserMasterComponent } from './components/routes/user-master/user-master.component';
import { CottageMasterComponent } from './components/routes/cottage-master/cottage-master.component';
import { CalendarComponent } from './components/routes/calendar/calendar.component';
/** Angular material */
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {HttpClientModule} from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatMenuModule} from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
/** calendar events */
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
/** chart  */
import { NgChartsModule } from 'ng2-charts';

const materialModules = [
  MatSelectModule,
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatMenuModule,
  MatListModule,
  MatSidenavModule,
  MatIconModule,
  MatButtonToggleModule,
  MatExpansionModule,
  MatDatepickerModule,
  MatNativeDateModule
]
@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    AuthComponent,
    HeaderComponent,
    FooterComponent,
    UserComponent,
    SidebarComponent,
    WrapperComponent,
    ReservationComponent,
    UserMasterComponent,
    CottageMasterComponent,
    CalendarComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    AppRoutingModule,
    HttpClientModule,
    ...materialModules,
    NgChartsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    })
  ],
  exports: [
    ...materialModules
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
