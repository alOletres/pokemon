import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isOpenSubMenu = false;
  isExpanded = true;
	isShowing = false;
  constructor() { }

  ngOnInit(): void {
  }
  openUiElements() {
		this.isOpenSubMenu = !this.isOpenSubMenu;
	}
}
