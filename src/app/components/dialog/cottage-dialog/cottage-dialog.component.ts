import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-cottage-dialog',
  templateUrl: './cottage-dialog.component.html',
  styleUrls: ['./cottage-dialog.component.css']
})
export class CottageDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CottageDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
      console.log(data);
      
    }

  ngOnInit(): void {
  }

}
