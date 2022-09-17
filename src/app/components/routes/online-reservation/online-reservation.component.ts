import { Component, OnInit } from '@angular/core';
const moment = (dayTwo: Date, dayOne: Date) => {
  // const day = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"][new Date(dayOne).getDay()]
	let diff =(dayTwo.getTime() - dayOne.getTime()) / 1000; 
	diff /= 60; /** minutes */

  /**
   * 0mins = seconds
   * less than 60 mins = minutes  
   * 60 mins to 1440 mins = hours
   * greater than 1440 = days
   */

  const minutes = Math.abs(Math.round(diff));
  const minuteValue = (minutes < 60 ) ? minutes : '' ;

  return (minutes === 0) ? "a few seconds ago"  
       : (minutes !== 0 && minutes < 60) ? (minutes === 1) ? `${ minuteValue } minute ago` : `${ minuteValue } minutes ago` 
       : (minutes > 60 && minutes < 120) ? `${ Math.abs(Math.round(minutes / 60)) } hour ago` 
       : (minutes >= 120 ) ? (minutes !== 119 && minutes < 1440) ? `${  Math.abs(Math.round(minutes / 60)) } hours ago` : (minutes === 1440) ? `${ Math.round(minutes / 60 / 24) } day ago` : (minutes !== 1440 && minutes > 1440) ? `${ Math.round(minutes / 60 / 24) } days ago` : ''  
       : ''
}
@Component({
  selector: 'app-online-reservation',
  templateUrl: './online-reservation.component.html',
  styleUrls: ['./online-reservation.component.scss']
})
export class OnlineReservationComponent implements OnInit {
	dateNow = moment(new Date(), new Date());
  constructor() { }

  ngOnInit(): void {
  }

}
