import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {

  constructor(private _router: Router) { }

   reset(form: any) {
		form.reset();
		form.setValidators(null);
		form.setErrors({ 'invalid' : true })
		Object.keys(form.controls).forEach(key => {
			form.get(key).setErrors(null)
		});	
	}

	validateOnlyNumbers(evt: any) {
		var theEvent = evt || window.event;
		var key = theEvent.keyCode || theEvent.which;
		key = String.fromCharCode( key );
		var regex = /[0-9]|\./;
		if( !regex.test(key) ) {
		  	theEvent.returnValue = false;
		  	if(theEvent.preventDefault) theEvent.preventDefault();
		}
	}

	resetArray ( array :any ) {
		while (array.length > 0) {
			array.pop();
		}
	}

	reloadCurrentRoute() {
    let currentUrl = this._router.url;
    this._router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this._router.navigate([currentUrl]);
    });
  }

	
 	diff_minutes (dayTwo: Date, dayOne: Date) {
		let diff =(dayTwo.getTime() - dayOne.getTime()) / 1000;
		diff /= 60;
		const minutes = Math.abs(Math.round(diff));
		const days = (minutes === 1440) ? minutes / 60 / 24 
							: (minutes !== 1440 && minutes > 1440) ? minutes / 60 / 24 : 0;

		const total = Math.abs(Math.round(days));

		const x = total === 0 ? 1 : total;

		return  x;
	}

	


}


