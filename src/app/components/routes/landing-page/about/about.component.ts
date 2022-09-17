import { Component, OnInit } from '@angular/core';
import { ICarouselImage } from 'src/app/globals/interface/interface';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
	images: ICarouselImage[] = [
		{
			imageSrc : 'assets/front-view.jpg',
			imageAlt : 'front view'
		},
		{
			imageSrc : 'assets/p2.jpg',
			imageAlt : 'side view'
		},
		{
			imageSrc : 'assets/pic1.jpg',
			imageAlt : 'side view'
		},
		{
			imageSrc : 'assets/p3.jpg',
			imageAlt : 'side view'
		},
		{
			imageSrc : 'assets/p4.jpg',
			imageAlt : 'side view'
		},
		{
			imageSrc : 'assets/p5.jpg',
			imageAlt : 'side view'
		}
	]
  constructor() { }

  ngOnInit(): void {
  }

}
