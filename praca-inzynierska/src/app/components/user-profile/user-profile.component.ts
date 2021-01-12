import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IUserData } from 'src/app/models/user-data.model';
import { UserService } from 'src/app/services/user/user.service';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  isLoading = false;
  isError = false;
  userData: IUserData;

  private userSubscription: Subscription;

  private modalRef!: MatDialogRef<DeleteModalComponent>;

  constructor(private user: UserService,
    private modalService: MatDialog,
    private router: Router) { }

  ngOnInit(): void {
    this.userSubscription = this.user.dataSubject.subscribe((data: IUserData) => {
      data ? this.userData = data : this.router.navigateByUrl('/');
    })
  }

  onEditUserInfoSubmit(form: NgForm) {
    if (form.valid) {
      const data: IUserData = {
        info: {
          firstName: form.controls.firstName.value[0].toUpperCase() + form.controls.firstName.value.slice(1),
          lastName: form.controls.lastName.value,
          born: form.controls.birthDate.value,
          sex: form.controls.sex.value,
          height: form.controls.height.value,
        },
        data: {
          ...this.userData.data
        }
      }

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


  onDeleteAccount() {
    this.modalRef = this.modalService.open(DeleteModalComponent, { width: '400px' });
    this.modalRef.afterClosed().subscribe(result => {
      if (result && result === 'delete') {
        this.user.deteleAccount().then(
          (res) => this.handleAccountDeleteResponse(res),
          (err) => this.handleAccountDeleteError(err)
        )
      }
    })


  }

  handleAccountDeleteResponse(response: any) {
    this.user.authSubject.next(null);
    this.user.logout();
    this.router.navigateByUrl('/');
  }

  handleAccountDeleteError(error: any) {
    //tbd
  }

  ngOnDestroy() {
    if (this.userSubscription && this.userSubscription.unsubscribe) {
      this.userSubscription.unsubscribe();
    }
  }

}
