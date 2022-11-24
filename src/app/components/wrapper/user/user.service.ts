import { Injectable } from '@angular/core';
import Method from '../../../utils/method';
import { Router } from '@angular/router';
import { SnackBarService } from '../../../shared/services/snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private method: Method, private router: Router, private snackBar: SnackBarService,) { }

  signOut() {
    localStorage.clear();
    this.method.deleteAllCookie();
    this.router.navigate(['/login']).then(() => (location.reload()));
    this.snackBar._showSnack("Successfully logout", "success");
  }
}
