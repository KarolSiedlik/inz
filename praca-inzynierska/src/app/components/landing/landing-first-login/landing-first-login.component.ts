import { Component, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-landing-first-login',
  templateUrl: './landing-first-login.component.html',
  styleUrls: ['./landing-first-login.component.scss']
})
export class LandingFirstLoginComponent {
  @Output() firstLoginSubmit: EventEmitter<NgForm> = new EventEmitter();

  onFirstLoginSubmit(form: NgForm) {
    this.firstLoginSubmit.emit(form);
  }

}
