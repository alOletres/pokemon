import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Method from '../../../utils/method';
import { ENDPOINT } from 'src/app/globals/models/endpoint';
import { lastValueFrom, firstValueFrom } from 'rxjs';
import { IDBPayment, IResponse } from 'src/app/globals/interface';
import { IUpdateStatus } from 'src/app/globals/interface/default';

@Injectable({
  providedIn: 'root'
})
export class ViewReservationService {

  constructor(private http: HttpClient, private method: Method) { }

  async getPayment(): Promise<IResponse<IDBPayment[]>> {
    try {
      const url = this.http.get<IResponse<IDBPayment[]>>(`${ENDPOINT.RESORT}/book/payments`, this.method.authorization());
      const response = await lastValueFrom(url);
      return response;
    } catch (err) {
      throw err;
    }
  }

  async updateBookingStatus(payload: IUpdateStatus): Promise<IResponse<string>> {
    try {
      const id = payload["id"];
      delete payload["id"];
      const url = this.http.post<IResponse<string>>(`${ENDPOINT.RESORT}/book/update/${id}`, payload, this.method.authorization());
      const response = await firstValueFrom(url);
      return response;
      
    } catch (err) {
      throw err;
    }
  }
}
