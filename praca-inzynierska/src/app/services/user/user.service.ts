import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface IRegisterResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

interface ILoginResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  isLoggedIn = false;

  constructor(private http: HttpClient) { }

  // private firebaseApiUrl = 'https://ng-inz-778b1-default-rtdb.europe-west1.firebasedatabase.app/';

  private readonly firebaseProjectKey = 'AIzaSyBYuQ6eIYLmBc1YnPAi1ItN3TrTjX0Pk78';
  private registerApiPath = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + this.firebaseProjectKey;
  private loginApiPath = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + this.firebaseProjectKey;

  // post(data: any) {
  //   return this.http.post(this.firebaseApiUrl, data).toPromise();
  // }

  register(email: string, password: string) {
    const body = { email, password, returnSecureToken: true };
    return this.http.post<IRegisterResponse>(this.registerApiPath, body).toPromise();
  }

  login(email: string, password: string) {
    const body = { email, password, returnSecureToken: true };
    return this.http.post<ILoginResponse>(this.loginApiPath, body).toPromise();
  }
}
