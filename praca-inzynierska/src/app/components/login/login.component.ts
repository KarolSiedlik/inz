import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { errorMessages } from 'src/app/common/error-messages';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  isLoading = false;
  isError = false;
  errorMessage = errorMessages.DEFAULT;

  constructor(private user: UserService,
    private router: Router) { }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    this.loginUser(email, password);

    form.reset();
  }

  private loginUser(email: string, password: string) {
    this.isLoading = true;
    this.isError = false;

    this.user.login(email, password).then(
      () => {
        this.isLoading = false;
        this.user.isLoggedIn = true;
        this.router.navigateByUrl('/');
      },
      (error) => {
        this.isError = true;
        this.isLoading = false;

        const errMsg = error.error.error.message;

        if (errMsg && errMsg === 'INVALID_EMAIL') {
          this.errorMessage = errorMessages.INVALID_EMAIL;
        } else if (errMsg && errMsg === 'INVALID_PASSWORD') {
          this.errorMessage = errorMessages.INVALID_PASSWORD;
        } else if (errMsg && errMsg === 'EMAIL_NOT_FOUND') {
          this.errorMessage = errorMessages.EMAIL_NOT_FOUND;
        } else {
          console.warn(error);
          this.errorMessage = errorMessages.DEFAULT;
        }
      }
    )
  }
}
