import { Component, OnInit } from '@angular/core';
import { ICarouselImage } from './../../../../globals/interface/interface';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  hideFloating: boolean = false;
  hideShoreCots: boolean = false;
  hideView: boolean = true; 
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
