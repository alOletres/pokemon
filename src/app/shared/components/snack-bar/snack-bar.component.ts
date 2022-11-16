import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.css']
})
export class SnackBarComponent implements OnInit {
	
  constructor( 
		private snackBarRef: MatSnackBarRef<SnackBarComponent>,
		@Inject(MAT_SNACK_BAR_DATA) public data: any ) { }

  ngOnInit(): void {
  }

	get getIcon() : any {
		switch (this.data.snackType) {
		case 'success':
			return 'check';
		case 'error':
			return 'error';
		case 'warn':
			return 'warning';
		case 'info':
			return 'info';
		}
	}	
	
	get color () :any {
		switch (this.data.snackType) {
			case 'success':
				return 'bg-green-600';
			case 'error':
				return 'bg-red-600';
			case 'warn':
				return 'bg-red-600';
			case 'info':
				return 'bg-orange-600';
		}
	}

	dismiss() {
		this.snackBarRef.dismiss();
	}

}
