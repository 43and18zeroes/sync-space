import { Component, Inject, OnInit, HostListener, ElementRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from '../data.service';

@Component({
  selector: 'app-add-member-after-add-channel',
  templateUrl: './add-member-after-add-channel.component.html',
  styleUrls: ['./add-member-after-add-channel.component.scss']
})
export class AddMemberAfterAddChannelComponent implements OnInit {



  constructor(
    public dialogRef: MatDialogRef<AddMemberAfterAddChannelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private firestore: AngularFirestore,
    public dataservice: DataService,
    private _eref: ElementRef) { }

  currentUser

  buttonActive = false;

  inputParticipants: string;
  filteredUsers: any[] = [];
  certainPeople = false;
  allUsers;
  checked = false;
  indeterminate = false;
  disabled = false;

  ngOnInit() {
    this.loadAllUsers()
    this.loadCurrentUser()
  }

  closeDialog() {
    this.dialogRef.close(AddMemberAfterAddChannelComponent)
  }

  loadCurrentUser() {
    this.firestore
      .collection('users')
      .doc(this.dataservice.id)
      .valueChanges({ idField: 'id' })
      .subscribe((user) => {
        this.currentUser = user
      });
  }


  loadAllUsers() {
    this.firestore
      .collection('users')
      .valueChanges({ idField: 'id' })
      .subscribe((user: any) => {
        this.allUsers = user
      })
  }



  createChannel() {
    this.data.founder = this.currentUser
    if (!this.certainPeople) {
      this.data.members = this.allUsers;
      this.data.isOpenToAll = true;
      this.addChannelToFirebase()
    } // alle user wurde ausgewählz
    else (
      this.addChannelToFirebase()
    )
    this.closeDialog()
  }

  addChannelToFirebase() {
    this.firestore
      .collection('channels')
      .add(this.data.toJSON())
  }

  channelWithCertainPeople() {
    this.buttonActive = true;
    this.certainPeople = false;
  }

  channelWithoutCertainPeople() {
    this.buttonActive = true;
    this.certainPeople = true;
  }

  filterUser() {

    if (this.inputParticipants.length > 0) {
      this.filteredUsers = this.allUsers.filter(user =>
        user.name.toLowerCase().includes(this.inputParticipants.toLowerCase()),
      );
    } else {
      this.filteredUsers = [];
    }
  }

  deleteMember(user) {
    this.allUsers.push(user);
    const userIndex = this.data.members.indexOf(user);
    this.data.members.splice(userIndex, 1);
  }

  pushUserToMember(user) {
    this.data.members.push(user);
    const userIndex1 = this.allUsers.indexOf(user)
    const userIndex2 = this.filteredUsers.indexOf(user)
    this.allUsers.splice(userIndex1, 1)
    this.filteredUsers.splice(userIndex2, 1) 
    this.filteredUsers = [];
    this.inputParticipants = '';
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (this._eref.nativeElement.contains(event.target)) {
      this.filteredUsers = [];
      this.inputParticipants = '';
    }
  }

  disableBtn() {
    this.buttonActive = false;
  }

} 
