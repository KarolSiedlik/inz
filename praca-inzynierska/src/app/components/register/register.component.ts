import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { errorMessages } from 'src/app/common/error-messages';
import { IAuthResponseData, UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registeredSucessfully = false;
  isLoading = false;
  isError = false;
  errorMessage = errorMessages.DEFAULT;

  constructor(private user: UserService) { }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const email = form.value.email;
      const password = form.value.password;
      const checkPassword = form.value.checkPassword;

      if (password !== checkPassword) {
        alert('Podane hasła nie są jednakowe.');
        return;
      }

      this.registerNewUser(email, password);
    }
  }

  private registerNewUser(email: string, password: string) {
    this.isLoading = true;
    this.isError = false;

    this.user.register(email, password).then(
      (res: IAuthResponseData) => this.handleUserRegistrationSuccess(res),
      (err) => this.handleUserRegistrationError(err),
    )
  }

  private handleUserRegistrationSuccess(data: IAuthResponseData) {
    this.user.handleUserAuthentication(data, true);
    this.isLoading = false;
    this.registeredSucessfully = true;
  }

  private handleUserRegistrationError(error: { error: { message: string; } }) {
    this.isError = true;
    this.isLoading = false
    if (error.error.message = 'EMAIL_EXISTS') {
      this.errorMessage = errorMessages.EMAIL_EXISTS;
    } else {
      console.warn(error);
      this.errorMessage = errorMessages.DEFAULT;
    }
  }
}
