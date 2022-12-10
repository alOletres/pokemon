import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Method from '../../../utils/method';
import { StoreService } from '../../../store/service/store.service';
import { IUser } from './../../../globals/interface';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/model/appState.model';
import { ProgressBarService } from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() isMenuOpened: boolean | undefined;
	@Output() isShowSidebar = new EventEmitter<boolean>();
  user!: IUser;
  constructor(
    private method: Method, 
    private store_method: StoreService,
    public progressBarService: ProgressBarService,) { }

  ngOnInit(): void {
    this.getUser();
  }

  public openMenu(): void {
    this.isMenuOpened = !this.isMenuOpened;
    this.isShowSidebar.emit(this.isMenuOpened);
  }

   getUser(): void {
    const accessToken = this.method.getCookie("accessToken");
    const user = this.method.cookieDecode("accessToken", accessToken) as IUser;
    this.user = user;
    
    this.store_method.addToUser(user);
  }

}
