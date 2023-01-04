import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { ENDPOINT } from './../globals/models/endpoint';
import { lastValueFrom } from 'rxjs';
import { IDBPayment, IResponse } from 'src/app/globals/interface';
import Method from '../utils/method';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

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
}
