import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { IUserData } from 'src/app/models/user-data.model';
import { UserService } from 'src/app/services/user/user.service';
import { ModalComponent } from '../../modal/modal.component';

interface IDataTableRow {
  position: number;
  date: any;
  weight: string;
}

@Component({
  selector: 'app-landing-table',
  templateUrl: './landing-table.component.html',
  styleUrls: ['./landing-table.component.scss']
})
export class LandingTableComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading = false;
  isError = false;
  userDisplayName!: string;

  private userData!: IUserData;

  elementData: IDataTableRow[] = [];
  displayedColumns: string[] = ['position', 'date', 'weight'];
  dataSource = new MatTableDataSource<any>(this.elementData);

  selectOptions = [
    { value: 'weight', displayValue: 'Waga' }
  ]

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private modalRef!: MatDialogRef<ModalComponent>;

  private userDataSubscription: Subscription | undefined;

  constructor(private user: UserService,
    private modalService: MatDialog) { }

  ngOnInit() {
    this.userDataSubscription = this.user.dataSubject.subscribe((data) => {
      if (data) {
        this.userData = data;
        this.userDisplayName = data.info.firstName;
        this.updateDataTable();
      }
    })
  }

  onRowModify(row: any) {
    this.modalRef = this.modalService.open(ModalComponent, { width: '400px' });
    this.modalRef.afterClosed().subscribe(result => {
      if (result) {
        this.modifyRowValue(row, result);
      }
    })
  }

  private modifyRowValue(row: IDataTableRow, newValue: string) {
    const rowIndex = this.elementData.indexOf(row);
    const rowIndexInUserData = this.userData.data.weight.length - rowIndex - 1;

    if (newValue === 'delete') {
      this.userData.data.weight.splice(rowIndexInUserData, 1)
    } else {
      this.userData.data.weight[rowIndexInUserData].value = newValue;
    }

    this.saveUserData();
    this.updateDataTable();
  }

  onAddNewValue(form: NgForm) {
    if (form.valid) {
      const key = form.controls.key.value;
      const value = form.controls.value.value;
      const date = new Date().toDateString()

      this.userData.data[key].push({ date, value })
      this.saveUserData();
    }
  }

  private saveUserData() {
    this.isLoading = true;
    this.user.saveUserData(this.userData).then(
      (res) => this.handleAddNewDataSuccess(res),
      (err) => this.handleAddNewDataError(err),
    )
  }

  private handleAddNewDataSuccess(data: IUserData) {
    this.user.emitUserData(data);
    this.isLoading = false;
  }

  private handleAddNewDataError(error: any) {
    console.warn(error)
    this.isError = true;
  }

  private updateDataTable() {
    this.elementData = [];

    this.userData.data.weight.forEach((el) => { // low perfomance 
      const index = this.elementData.length + 1;
      this.elementData.push({
        position: index,
        date: el.date,
        weight: el.value,
      });
    })

    this.elementData.reverse();

    this.dataSource = new MatTableDataSource<any>(this.elementData);
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    const subscriptions = [this.userDataSubscription];

    subscriptions.forEach((sub) => {
      if (sub && sub.unsubscribe) {
        sub.unsubscribe();
      }
    })
  }
}