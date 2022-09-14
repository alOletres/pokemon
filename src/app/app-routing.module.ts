import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/routes/auth/auth.component';
import { IndexComponent } from './components/routes/index/index.component';
import { WrapperComponent } from './components/wrapper/wrapper/wrapper.component';
import { ReservationComponent } from './components/routes/reservation/reservation.component';
import { CottageMasterComponent } from './components/routes/cottage-master/cottage-master.component';
import { UserMasterComponent } from './components/routes/user-master/user-master.component';
import { CalendarComponent } from './components/routes/calendar/calendar.component';
const routes: Routes = [
	{
		path: '',
		component: AuthComponent
	},
	{
		path: '',
		component: WrapperComponent,
		children: [
			{
				path: '',
				redirectTo: '/dash',
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
			}
		]
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }