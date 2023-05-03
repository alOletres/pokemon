import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Method from '../utils/method';
import { ENDPOINT } from 'src/app/globals/models/endpoint';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { IResponse, IUpdateStatus } from '../globals/interface/default';
import { IBook, IPayment, IReportPayload } from '../globals/interface/book';
import { IUser } from '../globals/interface';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  constructor(private http: HttpClient, private method: Method) {}

  async bookCottage(payload: FormData): Promise<IResponse<string>> {
    try {
      const url = this.http.post<IResponse<string>>(
        `${ENDPOINT.RESORT}/book`,
        payload,
        this.method.landingHeader()
      );
      const response = await firstValueFrom(url);
      return response;
    } catch (err) {
      console.log(err);

      throw err;
    }
  }

  async updateBookingStatus(
    payload: IUpdateStatus
  ): Promise<IResponse<string>> {
    try {
      const id = payload['id'];
      delete payload['id'];
      const url = this.http.post<IResponse<string>>(
        `${ENDPOINT.RESORT}/book/update/${id}`,
        payload,
        this.method.authorization()
      );
      const response = await firstValueFrom(url);
      return response;
    } catch (err) {
      throw err;
    }
  }

  async getReports(): Promise<IResponse<IReportPayload[]>> {
    try {
      const url = this.http.get<IResponse<IReportPayload[]>>(
        `${ENDPOINT.RESORT}/book/reports`,
        this.method.authorization()
      );
      const response = await lastValueFrom(url);
      return response;
    } catch (err) {
      throw err;
    }
  }

  async getBook(): Promise<IResponse<(IBook & IUser & IPayment)[]>> {
    try {
      const url = this.http.get<IResponse<(IBook & IUser & IPayment)[]>>(
        `${ENDPOINT.RESORT}/book/list`,
        this.method.landingHeader()
      );
      const response = await firstValueFrom(url);
      return response;
    } catch (err) {
      throw err;
    }
  }

  // lumapas park likod
}
