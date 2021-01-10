import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IUserData } from 'src/app/models/user-data.model';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  userDisplayName = '';
  isLoading = false;
  isError = false;
  userData!: IUserData;

  private userAuthSubscription: Subscription | undefined;
  private userDataSubscription: Subscription | undefined;

  constructor(private user: UserService,
    private router: Router) { }

  ngOnInit() {
    this.userAuthSubscription = this.user.authSubject.subscribe((user) => {
      this.isAuthenticated = !!user;
      if (user) {
        this.getUserData();
      }
    });
    this.userDataSubscription = this.user.dataSubject.subscribe((data) => {
      if (data) {
        this.userData = data;
        this.userDisplayName = data.info.firstName;
      }
    })
  }

  onLoginButtonClicked() {
    this.isAuthenticated ? this.user.logout() : this.router.navigateByUrl('/login');
  }

  onFirstLoginSubmit(form: NgForm) {
    if (form.valid) {
      const date = new Date().toDateString();
      const data: IUserData = {
        info: {
          firstName: form.controls.firstName.value,
          lastName: form.controls.lastName.value,
          born: form.controls.birthDate.value,
          sex: form.controls.sex.value,
          height: form.controls.height.value,
        },
        data: {
          weight: [
            { date, value: form.controls.weight.value }
          ]
        }
      };

      this.saveUserData(data);
    }
  }

  private saveUserData(data: IUserData) {
    this.isLoading = true;
    this.user.saveUserData(data).then(
      (res: IUserData) => this.handleUserDataResponse(res),
      (err) => this.handleUserDataError(err),
    )
  }

  private getUserData() {
    this.isLoading = true;
    this.user.getData().then(
      (res: IUserData) => this.handleUserDataResponse(res),
      (err) => this.handleUserDataError(err),
    )
  }

  private handleUserDataResponse(data: IUserData) {
    this.isLoading = false;
    if (data) { // with no data in db, promise will be resolved as null
      this.user.emitUserData(data);
    }
  }

  private handleUserDataError(error: any) {
    this.isLoading = false;
    this.isError = true;
    console.warn(error);
  }

  ngOnDestroy() {
    const subscriptions = [this.userAuthSubscription, this.userDataSubscription];

    subscriptions.forEach((sub) => {
      if (sub && sub.unsubscribe) {
        sub.unsubscribe();
      }
    })
  }
}
