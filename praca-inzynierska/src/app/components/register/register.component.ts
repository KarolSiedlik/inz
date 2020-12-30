import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { errorMessages } from 'src/app/common/error-messages';
import { IAuthResponseData, UserService } from 'src/app/services/user/user.service';
import { couldStartTrivia } from 'typescript';

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
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;
    const checkPassword = form.value.checkPassword;

    if (password !== checkPassword) {
      alert('Hasła nie są jednakowe.');
      return;
    }

    this.registerNewUser(email, password);

    form.reset();
  }

  private registerNewUser(email: string, password: string) {
    this.isLoading = true;
    this.isError = false;

    this.user.register(email, password).then(
      (response: IAuthResponseData) => {
        this.user.handleUserAuthentication(response);
        this.registeredSucessfully = true;
        this.isLoading = false;
      },
      (error) => {
        this.isError = true;
        this.isLoading = false
        if (error.error.message = 'EMAIL_EXISTS') {
          this.errorMessage = errorMessages.EMAIL_EXISTS;
        } else {
          console.warn(error);
          this.errorMessage = errorMessages.DEFAULT;
        }
      }
    );
  }
}
