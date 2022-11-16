import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../components/snack-bar/snack-bar.component';
interface ISnackType {
  snackType: "success" | "error"
}
@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor( public snackBar?: MatSnackBar, ) { }

  showSnack(msg: any, errors: any) {

		return this.snackBar?.open(msg, errors, {
			
			duration: 10000,
			panelClass: ['red-snackbar']
		});

	}
  _showSnack(msg: any, snackType: "success" | "error" | "warn" | "info") {

		const _snackType: any = snackType = snackType !== undefined ? snackType : 'success';

		this.snackBar?.openFromComponent(SnackBarComponent, {
			duration: 5000,
			horizontalPosition: 'right',
			verticalPosition: 'bottom',
			panelClass: [`${snackType}-snackbar`],
			data: { message: msg, snackType: _snackType, action: 'Close' },
		});

	}
}
