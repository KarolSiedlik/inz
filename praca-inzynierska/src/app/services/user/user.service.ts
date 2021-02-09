import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { IUserData } from 'src/app/models/user-data.model';
import { APP_CONFIG } from '../../config/app.origins';
import { User } from '../../models/user.model';

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
  authSubject = new BehaviorSubject<User>(null);
  dataSubject = new BehaviorSubject<IUserData>(null);
  displayName: string;

  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  private readonly firebaseApiUrl = APP_CONFIG.firebaseApiUrl;
  private readonly firebaseProjectKey = APP_CONFIG.firebaseProjectKey;
  private readonly userDataLocalStorageKey = APP_CONFIG.userDataLocalStorageKey;

  register(email: string, password: string) {
    const registerUrl = APP_CONFIG.registerUrl + this.firebaseProjectKey;
    const body = { email, password, returnSecureToken: true };
    return this.http.post<IAuthResponseData>(registerUrl, body).toPromise();
  }

  login(email: string, password: string) {
    const loginUrl = APP_CONFIG.loginUrl + this.firebaseProjectKey;
    const body = { email, password, returnSecureToken: true };
    return this.http.post<IAuthResponseData>(loginUrl, body).toPromise();
  }

  public saveUserData(data: IUserData) {
    const body = JSON.stringify(data);
    const url = this.firebaseApiUrl + 'users/' + this.authSubject.value.id + '.json';

    return this.http.put<IUserData>(url, body).toPromise();
  }

  public getData() {
    const url = this.firebaseApiUrl + 'users/' + this.authSubject.value.id + '.json';

    return this.http.get<IUserData>(url).toPromise();
  }

  public emitUserData(data: IUserData) {
    this.dataSubject.next(data);
  }

  deteleAccount() {
    const deleteUrl = APP_CONFIG.deleteAccountUrl + this.firebaseProjectKey;
    const body = { idToken: this.authSubject.value.token }
    return this.http.post(deleteUrl, body).toPromise();
  }

  logout() {
    this.authSubject.next(null as unknown as User);
    this.dataSubject.next(null as unknown as IUserData)
    this.router.navigateByUrl('/');
    localStorage.removeItem(this.userDataLocalStorageKey);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(tokenExpirationTimer: number) {
    this.tokenExpirationTimer = tokenExpirationTimer;

    this.tokenExpirationTimer = setTimeout(() => this.logout(), tokenExpirationTimer);
  }

  handleUserAuthentication(userData: IAuthResponseData, registered?: boolean) {
    const expirationDate = new Date(new Date().getTime() + +userData.expiresIn * 1000);
    const user = new User(userData.email, userData.localId, userData.idToken, expirationDate);

    this.authSubject.next(user);
    this.autoLogout(+userData.expiresIn * 1000);
    localStorage.setItem(this.userDataLocalStorageKey, JSON.stringify(user));

    if (!registered) {
      this.getData();
    }
  }

  autoLogin() {
    const userData = localStorage.getItem(this.userDataLocalStorageKey);
    if (userData) {
      const parsedUser: {
        email: string;
        id: string;
        _token: string;
        _tokenExpirationDate: string;
      } = JSON.parse(userData);

      const loadedUser = new User(parsedUser.email, parsedUser.id, parsedUser._token, new Date(parsedUser._tokenExpirationDate));
      if (loadedUser.token) {
        this.authSubject.next(loadedUser);

        const expirationDate = new Date(parsedUser._tokenExpirationDate).getTime() - new Date().getTime()
        this.autoLogout(expirationDate);
      }
    }
  }
}
