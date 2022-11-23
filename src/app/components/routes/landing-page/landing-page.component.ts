import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SignUpComponent } from '../../../globals/dialog/sign-up/sign-up.component';
import Method from '../../../utils/method';
import { StoreService } from '../../../store/service/store.service';
import { IUser } from '../../../globals/interface/payload';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/model/appState.model';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  user!: IUser;
  constructor(
    private dialog: MatDialog, 
    private method: Method, 
    private store_method: StoreService,
    private store: Store<AppState>,
    ) {
      store.select("user").subscribe((data): void => {
        try {
          this.user = data[0];
        } catch (err) {
          return undefined
        }
      });

      // console.log(this.user);
      
    }

  ngOnInit(): void {
    this.getUser();
  }

  signUp(): void {
    this.dialog.open(SignUpComponent, {width: '400px', disableClose: true});
  }
  getUser(): void {
    const accessToken = this.method.getCookie("accessToken");
    const user = this.method.cookieDecode("accessToken", accessToken) as IUser;
    this.store_method.addToUser(user);
  }

}
