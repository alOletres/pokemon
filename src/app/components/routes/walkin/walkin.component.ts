import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ECOTTAGE_TYPE } from '../../../globals/enums/default';

@Component({
  selector: 'app-walkin',
  templateUrl: './walkin.component.html',
  styleUrls: ['./walkin.component.css']
})
export class WalkinComponent implements OnInit {

  isEditable = false;
  reservationForm!: FormGroup;
	cottageType: string[] = [ECOTTAGE_TYPE.FLOATING, ECOTTAGE_TYPE.NON_FLOATING];
  
  constructor() { }

  ngOnInit(): void {
  }

}
