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
        console.log(currentUrl);
    });
  }
}
