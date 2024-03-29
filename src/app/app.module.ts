import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  CommonModule,
  HashLocationStrategy,
  LocationStrategy,
} from '@angular/common';
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
import { LandingPageComponent } from './components/routes/landing-page/landing-page.component';
import { HomePageComponent } from './components/routes/landing-page/home-page/home-page.component';
/** Angular material */
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
/** calendar events */
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
/** chart  */
import { NgChartsModule } from 'ng2-charts';

/** carousel */
import { CarouselModule } from './module/carousel/carousel.module';
import { ContactComponent } from './components/routes/landing-page/contact/contact.component';
import { BookComponent } from './components/routes/landing-page/book/book.component';
import { OnlineReservationComponent } from './components/routes/online-reservation/online-reservation.component';
import { AboutComponent } from './components/routes/landing-page/about/about.component';
import { ReservationDateComponent } from './components/dialog/reservation-date/reservation-date.component';
import { SignInComponent } from './components/dialog/sign-in/sign-in.component';
import { SignUpComponent } from './components/dialog/sign-up/sign-up.component';
import { ReportsComponent } from './components/routes/reports/reports.component';
import { SnackBarComponent } from './shared/components/snack-bar/snack-bar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';

/**
 * directive
 */
import { CottageDialogComponent } from './components/dialog/cottage-dialog/cottage-dialog.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from './../environments/environment';
import { WalkinComponent } from './components/routes/walkin/walkin.component';
import { Store, StoreConfig, StoreModule } from '@ngrx/store';
import { UserReducer } from './store/reducer/user.reducer';
import { CottageReducer } from './store/reducer/cottage.reducer';
import { StoreFeature } from '@ngrx/store/src/models';
import { ProfileComponent } from './shared/components/profile/profile.component';
import { LoadingInteceptorService } from './services/loading-inteceptor.service';
import { AuthInteceptorService } from './services/auth-inteceptor.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TableComponent } from './components/props/table/table.component';
import { ViewReservationComponent } from './components/views/view-reservation/view-reservation.component';
import { ViewHeaderComponent } from './shared/components/view-header/view-header.component';
import { CottageTableComponent } from './components/props/cottage-table/cottage-table.component';
import { BookDetailsComponent } from './components/dialog/book-details/book-details.component';
import { ChartComponent } from './shared/components/chart/chart.component';
import { BookChangesComponent } from './components/routes/book-changes/book-changes.component';
import { BookChangesDialogComponent } from './components/dialog/book-changes-dialog/book-changes-dialog.component';
import { BookChangesUpdateComponent } from './components/dialog/book-changes-update/book-changes-update.component';

const materialModules = [
  MatProgressBarModule,
  MatBadgeModule,
  MatStepperModule,
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
  MatNativeDateModule,
  MatDialogModule,
  MatTabsModule,
  MatSnackBarModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatToolbarModule,
];
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
    CalendarComponent,
    LandingPageComponent,
    HomePageComponent,
    ContactComponent,
    BookComponent,
    OnlineReservationComponent,
    AboutComponent,
    ReservationDateComponent,
    SignInComponent,
    SignUpComponent,
    ReportsComponent,
    SnackBarComponent,
    CottageDialogComponent,
    WalkinComponent,
    ProfileComponent,
    TableComponent,
    ViewReservationComponent,
    ViewHeaderComponent,
    CottageTableComponent,
    BookDetailsComponent,
    ChartComponent,
    BookChangesComponent,
    BookChangesDialogComponent,
    BookChangesUpdateComponent,
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
    CarouselModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    StoreModule.forRoot({
      user: UserReducer,
      cottage: CottageReducer,
    } as any),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
  ],
  exports: [...materialModules],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInteceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInteceptorService,
      multi: true,
    },
    BookDetailsComponent,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
