import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  urlNas = 'http://172.16.1.24:8095/cgi-bin/authLogin.cgi?';

  constructor(private http: HttpClient) { }

  authenticate(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const body = `user=${username}&pwd=${password}`;

    return this.http.post(this.urlNas, body, { headers, responseType: 'text' }).pipe(
      map(response => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response, 'text/xml');
        const authSid = xmlDoc.getElementsByTagName('authSid')[0].childNodes[0].nodeValue;
        return authSid;
      })
    );
  }

  getList(sid : string): Observable<any> {
    const url = `http://172.16.1.24:8095/cgi-bin/filemanager/utilRequest.cgi?func=get_list&sid=${sid}&is_iso=0&list_mode=all&path=/Intranet/prueba&dir=ASC&limit=1000&sort=filename&start=0`;
    return this.http.get(url).pipe(
      map((response: any) => {
        return response.datas;
      }),
      catchError(error => {
        console.error('Error al obtener la lista de archivos', error);
        return throwError(error);
      })
    );
  }
}