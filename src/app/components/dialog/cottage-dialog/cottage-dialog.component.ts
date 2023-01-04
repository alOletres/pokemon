import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICottage } from '../../../globals/interface/cottage';

@Component({
  selector: 'app-cottage-dialog',
  templateUrl: './cottage-dialog.component.html',
  styleUrls: ['./cottage-dialog.component.css']
})
export class CottageDialogComponent implements OnInit {
  url!: string | ArrayBuffer;
  constructor(
    public dialogRef: MatDialogRef<CottageDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: ICottage) {
      this.url = data.images as string; 
    }

  ngOnInit(): void {
  }

}
