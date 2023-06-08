import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICarouselImage } from './../../../../globals/interface/interface';
import { ReservationDateComponent } from '../../../dialog/reservation-date/reservation-date.component';
import { CottageMasterService } from '../../../../services/cottage-master.service';
import { SnackBarService } from '../../../../shared/services/snack-bar.service';
import { ErrorResponse } from '../../../../utils/server-response';
import { MatTableDataSource } from '@angular/material/table';
import { ICottage } from '../../../../globals/interface/cottage';
import { Observable } from 'rxjs';
import { EMage } from '../../../../globals/enums/image';
import { HomePageService } from './home-page.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/model/appState.model';
import {
  IBook,
  IBookAndCottagePayload,
  IPayment,
} from '../../../../globals/interface/book';
import { BookService } from 'src/app/services/book.service';
import { IUser } from 'src/app/globals/interface';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  hideFloating: boolean = false;
  hideShoreCots: boolean = false;
  hideView: boolean = true;
  dataCottageBook!: IBookAndCottagePayload[];
  dataCottage: MatTableDataSource<ICottage> = new MatTableDataSource<ICottage>(
    []
  );
  data!: Observable<ICottage[]>;
  base64: string = EMage.BASE64_INITIAL;
  data_book_list: (IBook & IUser & IPayment)[] = [];

  constructor(
    private dialog: MatDialog,
    private http_cottage: CottageMasterService,
    private snackBar: SnackBarService,
    private changeDetectorRef: ChangeDetectorRef,
    private http_home: HomePageService,
    private store: Store<AppState>,
    private book: BookService
  ) {
    store.select('cottage').subscribe((data): void => {
      try {
        this.dataCottageBook = data;
      } catch (err) {
        return undefined;
      }
    });
  }

  async ngOnInit() {
    await Promise.resolve().then(() => {
      this.getCottage();
    });
  }

  async applyFilter(event: Event) {
    this.changeDetectorRef.detectChanges();

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataCottage.filter = filterValue.trim().toLowerCase();
    this.data = this.dataCottage.connect();
  }

  async getCottage() {
    try {
      this.changeDetectorRef.detectChanges();

      const response = await this.http_home.getCottage();
      this.dataCottage.data = response.data as ICottage[];

      this.data = this.dataCottage.connect();
    } catch (err) {
      const error = ErrorResponse(err);
      this.snackBar._showSnack(`${error.myError} ${error.status}`, 'error');
    }
  }

  openDialog(element: ICottage): void {
    this.dialog.open(ReservationDateComponent, {
      width: '500px',
      data: element,
    });
  }
}
