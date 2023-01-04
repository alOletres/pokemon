import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENDPOINT } from 'src/app/globals/models/endpoint';
import Method from '../utils/method';
import { firstValueFrom } from 'rxjs';
import { IResponse } from '../globals/interface/default';
import { IBook } from '../globals/interface/book';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private http: HttpClient, private method: Method,) { }

  async getBook(): Promise<IResponse<IBook[]>> {
    try {
      const url = this.http.get<IResponse<IBook[]>>(`${ENDPOINT.RESORT}/book/list`, this.method.authorization());
      const response = await firstValueFrom(url);
      return response;
    } catch (err) {
      throw err;
    }
  }
}
