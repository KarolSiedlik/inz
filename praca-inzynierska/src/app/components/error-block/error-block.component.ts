import { Component, Input } from '@angular/core';
import { errorMessages } from 'src/app/common/error-messages';

@Component({
  selector: 'app-error-block',
  templateUrl: './error-block.component.html',
  styleUrls: ['./error-block.component.scss']
})
export class ErrorBlockComponent {
  @Input() errorMessage = errorMessages.DEFAULT;
}
