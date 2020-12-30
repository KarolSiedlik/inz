import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from './user.model';

export interface IAuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userSubject = new BehaviorSubject<User>(null as unknown as User);

  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  // private firebaseApiUrl = 'https://ng-inz-778b1-default-rtdb.europe-west1.firebasedatabase.app/';

  private readonly firebaseProjectKey = 'AIzaSyBYuQ6eIYLmBc1YnPAi1ItN3TrTjX0Pk78';
  private registerApiPath = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + this.firebaseProjectKey;
  private loginApiPath = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + this.firebaseProjectKey;

  // post(data: any) {
  //   return this.http.post(this.firebaseApiUrl, data).toPromise();
  // }

  register(email: string, password: string) {
    const body = { email, password, returnSecureToken: true };
    return this.http.post<IAuthResponseData>(this.registerApiPath, body).toPromise();
  }

  login(email: string, password: string) {
    const body = { email, password, returnSecureToken: true };
    return this.http.post<IAuthResponseData>(this.loginApiPath, body).toPromise();
  }

  logout() {
    this.userSubject.next(null as unknown as User);
    this.router.navigateByUrl('/');
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(tokenExpirationTimer: number) {
    this.tokenExpirationTimer = tokenExpirationTimer;

    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, tokenExpirationTimer);
  }

  handleUserAuthentication(userData: IAuthResponseData) {
    const expirationDate = new Date(new Date().getTime() + +userData.expiresIn * 1000);
    const user = new User(userData.email, userData.localId, userData.idToken, expirationDate)

    this.userSubject.next(user);
    this.autoLogout(+userData.expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  autoLogin() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedUser: {
        email: string;
        id: string;
        _token: string;
        _tokenExpirationDate: string;
      } = JSON.parse(userData);

      const loadedUser = new User(parsedUser.email, parsedUser.id, parsedUser._token, new Date(parsedUser._tokenExpirationDate));
      if (loadedUser.token) {
        this.userSubject.next(loadedUser);

        const expirationDate = new Date(parsedUser._tokenExpirationDate).getTime() - new Date().getTime()
        this.autoLogout(expirationDate);
      }
    }
  }
}
