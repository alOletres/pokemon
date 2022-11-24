import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/model/appState.model';
import { IUser } from '../../../globals/interface/payload';
import { Router } from '@angular/router';
import Method from '../../../utils/method';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { UserService } from './user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user!: IUser;
  constructor(
    private store: Store<AppState>, 
    private http_user: UserService,
    ) {
    store.select("user").subscribe((data): void => {
      try {
        this.user = data[0];
      } catch (err) {
        return undefined;
      }
    });
  }

  ngOnInit(): void {
  }

  signOut(): void {
    this.http_user.signOut();
  }

}
