import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './../../../store/model/appState.model';
import { IUser } from '../../../globals/interface/payload';
import Method from '../../../utils/method';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isOpenSubMenu = false;
  isExpanded = true;
	isShowing = false;
  user!: IUser
  constructor(private store: Store<AppState>, private method: Method) {
    this.store.select("user").subscribe((data): void => {
      try {
        
        if(data.length  === 1) {
        
          const newArr = data.map((x) => {
            x.role = JSON.parse(x.role as string);
            return x; 
          });

          console.log(newArr);
          
          // this.user = newArr[0];

        } 

      } catch (err) {
        return undefined
      }
    })
  }

  ngOnInit(): void {
    
  }
  openUiElements() {
		this.isOpenSubMenu = !this.isOpenSubMenu;
	}
}
