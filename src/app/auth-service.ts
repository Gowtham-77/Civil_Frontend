import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }
   login(credentials: { emailOrPhone: string; password: string }): Observable<any> {
    return this.http.post(``, credentials).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem('authToken', res.token);
          localStorage.setItem('userId', res.userId);
        }
      })
    );
  };
}
