import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  constructor(private http: HttpClient) { }
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`http://20.55.22.52:8081/api/auth/login`, credentials);
  };

  registerUser(user: {
    userName: string;
    email: string;
    password: string;
    mobile: string;
    roleId: number;
    designation: string;
  }): Observable<any> {
    return this.http.post(`http://20.55.22.52:8081/api/auth/register`, user);
  }


  logout(): void {
    localStorage.removeItem('token');
  };

  setToken(token: string): void {
    localStorage.setItem('token', token);
  };

  getToken(): string | null {
    return localStorage.getItem('token');
  };
  isLoggedIn(): boolean {
    return !!this.getToken();
  };

  getRole(): string | null {
    return localStorage.getItem('userRole');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

}
