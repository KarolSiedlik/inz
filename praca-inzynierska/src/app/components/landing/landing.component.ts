import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {
  isAuthenticated = false;

  private userSubscription: Subscription | undefined;

  constructor(private user: UserService,
    private router: Router) { }

  ngOnInit() {
    this.userSubscription = this.user.userSubject.subscribe((user) => {
      this.isAuthenticated = !!user;
    })
  }

  loginBtnClickHandler() {
    if (this.isAuthenticated) {
      this.user.logout();
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  ngOnDestroy() {
    if (this.userSubscription && this.userSubscription.unsubscribe) {
      this.userSubscription.unsubscribe();
    }
  }

}
