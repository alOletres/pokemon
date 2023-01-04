import { Injectable } from '@angular/core';
import Method from '../utils/method';
import { HttpClient } from '@angular/common/http';
import { ENDPOINT } from '../globals/models/endpoint';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private method: Method, private http: HttpClient,) { }

  // async getReports() {
  //   try {
  //     const url = this.http.get(`${ENDPOINT.RESORT}/`)
  //   } catch (err) {
  //      throw err;
  //   }
  // }
}
