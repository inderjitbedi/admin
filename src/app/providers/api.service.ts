import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
@Injectable()
export class CommonAPIService {
  constructor(private http: HttpClient) {
  }
  post(apiUrl:String, inputParam:any): Observable<any> {
    return this.http.post(environment.baseUrl + apiUrl, inputParam);
  }
  put(apiUrl:String, inputParam:any): Observable<any> {
    return this.http.put(environment.baseUrl + apiUrl, inputParam);
  }
  get(apiUrl:String): Observable<any> {
    return this.http.get(environment.baseUrl + apiUrl);
  }
  delete(apiUrl:String): Observable<any> {
    return this.http.delete(environment.baseUrl + apiUrl);
  }
}