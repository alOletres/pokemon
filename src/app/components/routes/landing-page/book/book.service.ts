import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Method from '../../../../utils/method';
import { ENDPOINT } from 'src/app/globals/models/endpoint';
import { firstValueFrom } from 'rxjs';
import { IResponse } from '../../../../globals/interface/default';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient, private method: Method,) {}

  async bookCottage(payload: FormData): Promise<IResponse<string>> {
    try {
      const url = this.http.post<IResponse<string>>(`${ENDPOINT.RESORT}/book`, payload, this.method.landingHeader());
      const response = await firstValueFrom(url);
      return response;
    } catch (err) {
      throw err;
    }
  }
}
