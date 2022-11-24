import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ECOTTAGE_TYPE } from '../../../globals/enums/default';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { CottageMasterService } from '../cottage-master/cottage-master.service';
import { ErrorResponse } from '../../../utils/server-response';
import { ICottage } from '../../../globals/interface/cottage';
import { CommonServiceService } from '../../../globals/services/common-service.service';
import { StoreService } from '../../../store/service/store.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/model/appState.model';
import { EMage } from '../../../globals/enums/image';
import Method from '../../../utils/method';
import { IBookAndCottagePayload } from '../../../globals/interface/book';

@Component({
  selector: 'app-walkin',
  templateUrl: './walkin.component.html',
  styleUrls: ['./walkin.component.css']
})
export class WalkinComponent implements OnInit {

  isEditable = false;
  reservationForm!: FormGroup;
  userForm!: FormGroup;

	cottageType: string[] = [ECOTTAGE_TYPE.FLOATING, ECOTTAGE_TYPE.NON_FLOATING];
  base64 = EMage.BASE64_INITIAL;
  dataCottage!: ICottage[];

  cottageAddedList!: IBookAndCottagePayload[];
  cottageList!: ICottage[];

  selectedCottage!: ICottage;

  btnName="Add Cottage";

  total: number = 0;
  totalDays: number = 0;


  constructor(
    private fb: FormBuilder, 
    private snackBar: SnackBarService, 
    private http_cottage: CottageMasterService,
    private common: CommonServiceService,
    private store_method: StoreService,
    private store: Store<AppState>,
    private method: Method,
    
    ) {
    this.reservationForm = fb.group({
      selected_date_from: [null, Validators.required],
      selected_date_to: [null, Validators.required],
      type: [null, Validators.required],
      cottage_number: [null, Validators.required],
      isCottage: [null, Validators.required],
      id: null,
      images: null,
      price: null,
      is_available: null,
      capacity: null,
      description: null,
      payment_type: "cash",
    });

    this.userForm = fb.group({
      firstname: [null, Validators.required],
      lastname: [null, Validators.required],
      email: null,
      mobile_number: [null, Validators.required],
      address: [null, Validators.required],
      comment: null,
    });

    store.select("cottage").subscribe((data): void => {
      try {
        this.cottageAddedList = data;

        

        this.reservationForm.patchValue({
          selected_date_from: data[0].selected_date_from,
          selected_date_to: data[0].selected_date_to,
          type: data[0].type,
          cottage_number: data[0].cottage_number,
          isCottage: data[0].isCottage
        });

        this.selected_date_from?.disable();
        this.selected_date_to?.disable();

        this.totalDays = diff_minutes(new Date(data[0].selected_date_to), new Date(data[0].selected_date_from));

        
      } catch (err) {
        return undefined;
      }
    });
  }

  get selected_date_from() {
    return this.reservationForm.get('selected_date_from');
  }

  get  selected_date_to() {
    return this.reservationForm.get('selected_date_to');
  }

  get type() {
    return this.reservationForm.get('type');
  }

  get cottage_number() {
    return this.reservationForm.get('cottage_number');
  }

  ngOnInit(): void {
    this.getCottage(); 
    this.total = totalAmount(this.cottageAddedList);
  }

  async getCottage(): Promise<void> {
    try {
      const response = await this.http_cottage.getCottage();
      this.dataCottage = response.data as ICottage[];
    } catch (err) {
      const error = ErrorResponse(err);
      this.snackBar._showSnack(`${error.myError} ${error.status}`, "error");
    }
  }

  changeCottageType(event: string) {
    const data = [...this.dataCottage].filter((x) => (x.type === event));    
    this.cottageList = data;
  }

  changeCottageNumber(event: string) {
    const data = [...this.cottageList].filter((x) => (x.cottage_number === event));
    this.selectedCottage = data[0];
  }

  addCottage(): void {
    /**
     * step 1 patchvalue of is cottage to make sure the user click the button
     */
    this.reservationForm.patchValue({isCottage: true});

    if(this.reservationForm.invalid) {
      this.reservationForm.markAllAsTouched();
    } else {

      if(this.btnName === "Add Cottage") {

        // this.method.setLocalStorage("selected_date_from", this.selected_date_from?.value);
        // this.method.setLocalStorage("selected_date_to", this.selected_date_to?.value);

        // const startDate = this.method.getLocalStorage("selected_date_from");
        // const endDate = this.method.getLocalStorage("selected_date_to");
        

        const data = [this.reservationForm.value] as IBookAndCottagePayload[];

        const newArr = data.map((x) => {
          x.id = this.selectedCottage.id as number;
          x.images = this.selectedCottage.images;
          x.price = this.selectedCottage.price,
          x.is_available = this.selectedCottage.is_available;
          x.capacity = this.selectedCottage.capacity;
          x.description = this.selectedCottage.description
          return x;
        });

        this.store_method.addToCottage(newArr[0]);

        this.snackBar._showSnack("Cottage Successfully added", "success");
        this.ngOnInit();

      } else {
        location.reload();
      }
    }
  }

  deleteCottage(id: number) {
    this.store_method.deleteCottage(id);
    this.snackBar._showSnack("Cottage Successfully deleted!", "success");
    this.cottageAddedList.length === 0 ? this.reservationForm.patchValue({isCottage: null}) : '';
  }

  async submitBook(): Promise<void> {
    try {
      if(this.userForm.invalid) {
        this.userForm.markAllAsTouched();
      } else {
        alert('ready to submit to server');
      }
    } catch (Err) { 
      const error = ErrorResponse(Err);
      this.snackBar._showSnack(`${error.myError} ${error.status}`, "error");
    } 
  }

}

const diff_minutes = (dayTwo: Date, dayOne: Date) => {
	let diff =(dayTwo.getTime() - dayOne.getTime()) / 1000;
	diff /= 60;
	const minutes = Math.abs(Math.round(diff));
	const days = (minutes === 1440) ? minutes / 60 / 24 
						 : (minutes !== 1440 && minutes > 1440) ? minutes / 60 / 24 : 0;

  const total = Math.abs(Math.round(days));

  const x = total === 0 ? 1 : total;
  
  return  x;
}

const totalAmount = (data: IBookAndCottagePayload[]): number => {
	let total = 0;
	data.forEach((x) => (total += x.price));

	return total
}
