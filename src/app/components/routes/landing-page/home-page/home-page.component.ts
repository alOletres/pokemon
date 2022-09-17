import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICarouselImage } from './../../../../globals/interface/interface';
import { ReservationDateComponent } from '../../../../globals/dialog/reservation-date/reservation-date.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  hideFloating: boolean = false;
  hideShoreCots: boolean = false;
  hideView: boolean = true; 
	
  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

	openDialog() : void {
		this.dialog.open(ReservationDateComponent, { width: '500px' })
	}
}
