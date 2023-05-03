import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  baseUrl = 'http://172.16.1.24:8095/cgi-bin/authLogin.cgi?';

  constructor(private http: HttpClient) { }

  authenticate(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const body = `user=${username}&pwd=${password}`;

    return this.http.post(this.baseUrl, body, { headers, responseType: 'text' }).pipe(
      map(response => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response, 'text/xml');
        const authSid = xmlDoc.getElementsByTagName('authSid')[0].childNodes[0].nodeValue;
        return authSid;
      })
    );
  }
}