import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface ISignUpResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  isUserLoggedIn = false;

  constructor(private http: HttpClient) { }

  // private firebaseApiUrl = 'https://ng-inz-778b1-default-rtdb.europe-west1.firebasedatabase.app/';
  private singUpApiPath = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBYuQ6eIYLmBc1YnPAi1ItN3TrTjX0Pk78'

  // post(data: any) {
  //   return this.http.post(this.firebaseApiUrl, data).toPromise();
  // }

  register(email: string, password: string) {
    const body = { email, password, returnSecureToken: true };
    return this.http.post<ISignUpResponse>(this.singUpApiPath, body).toPromise();
  }
}
