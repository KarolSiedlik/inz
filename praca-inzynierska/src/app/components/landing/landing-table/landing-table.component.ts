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
  userBmi!: number;
  bmiIndicator!: string;
  bmiColor = 'black';
  bmiBackgroundColor = 'white';

  userData!: IUserData;

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
      if (this.userData.data.weight.length > 1) {
        this.userData.data.weight.splice(rowIndexInUserData, 1)
      } else {
        alert('Ostatni rekord nie może zostać usunięty, spróbuj go edytować.');
        return;
      }

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

    this.updateUserBmi();
  }

  private updateUserBmi() {
    const userHeight = this.userData.info.height;
    const latestUserWeight = this.userData.data.weight[this.userData.data.weight.length - 1].value;
    this.userBmi = +(+latestUserWeight / ((+userHeight / 100) * (+userHeight / 100))).toFixed(2);

    if (this.userBmi < 16) {
      this.bmiIndicator = 'Wygłodzenie';
      this.bmiBackgroundColor = '#082E79';
      this.bmiColor = 'white';
    }
    if (this.userBmi >= 16 && this.userBmi <= 16.99) {
      this.bmiIndicator = 'Wychudzenie'
      this.bmiBackgroundColor = '#4169E1';
      this.bmiColor = 'white';
    }
    if (this.userBmi >= 17 && this.userBmi <= 18.49) {
      this.bmiIndicator = 'Niedowaga'
      this.bmiBackgroundColor = '#ACE1AF';
      this.bmiColor = 'black';
    }
    if (this.userBmi >= 18.5 && this.userBmi <= 24.99) {
      this.bmiIndicator = 'Właściwa waga'
      this.bmiBackgroundColor = '#CDEBA7';
      this.bmiColor = 'black';
    }
    if (this.userBmi >= 25 && this.userBmi <= 29.99) {
      this.bmiIndicator = 'Nadwaga'
      this.bmiBackgroundColor = '#FFFF99';
      this.bmiColor = 'black';
    }
    if (this.userBmi >= 30 && this.userBmi <= 34.99) {
      this.bmiIndicator = 'Otyłość I stopnia'
      this.bmiBackgroundColor = '#FDE456';
      this.bmiColor = 'black';
    }
    if (this.userBmi >= 35 && this.userBmi <= 39.99) {
      this.bmiIndicator = 'Otyłość II stopnia'
      this.bmiBackgroundColor = '#CF2929';
      this.bmiColor = 'black';
    }
    if (this.userBmi >= 40) {
      this.bmiIndicator = 'Otyłość III stopnia'
      this.bmiBackgroundColor = '#801818';
      this.bmiColor = 'white';
    }
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