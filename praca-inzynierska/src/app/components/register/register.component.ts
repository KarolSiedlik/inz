import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registeredSucessfully = false;
  isLoading = false;

  constructor(private user: UserService,
    private router: Router) { }

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

    this.isLoading = true;
    this.user.register(email, password).then(() => {
      this.registeredSucessfully = true;
      this.isLoading = false;
    });

    form.reset();
  }
}
