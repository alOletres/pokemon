import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/routes/auth/auth.component';
import { IndexComponent } from './components/routes/index/index.component';
import { WrapperComponent } from './components/wrapper/wrapper/wrapper.component';
import { ReservationComponent } from './components/routes/reservation/reservation.component';
import { CottageMasterComponent } from './components/routes/cottage-master/cottage-master.component';
import { UserMasterComponent } from './components/routes/user-master/user-master.component';
import { CalendarComponent } from './components/routes/calendar/calendar.component';
import { LandingPageComponent } from './components/routes/landing-page/landing-page.component';
import { HomePageComponent } from './components/routes/landing-page/home-page/home-page.component';
import { ContactComponent } from './components/routes/landing-page/contact/contact.component';
import { BookComponent } from './components/routes/landing-page/book/book.component';
import { OnlineReservationComponent } from './components/routes/online-reservation/online-reservation.component';
const routes: Routes = [
	{
		path: '',
		component: LandingPageComponent,
		children: [
			{
				path: '',
				redirectTo: '/home',
				pathMatch: 'full'
			},
			{
				path: 'home',
				component: HomePageComponent
			},
			{
				path: 'contact',
				component: ContactComponent
			},
			{
				path: 'book',
				component: BookComponent
			},
			{
				path: 'login',
				component: AuthComponent
			}
		]
	},
	{
		path: '',
		component: WrapperComponent,
		children: [
			{
				path: '',
				redirectTo: '/dash-board',
				pathMatch: 'full'
			},
			{
				path: 'dash-board',
				component: IndexComponent
			},
			{	
				path: 'reservation',
				component: ReservationComponent
			},
			{
				path: 'user-master',
				component: UserMasterComponent
			},
			{
				path: 'cottage-master',
				component: CottageMasterComponent
			},
			{
				path: 'calendar-events',
				component: CalendarComponent
			},
			{
				path: 'online-reservation',
				component: OnlineReservationComponent
			}
		]
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }