import { Component, OnInit, Inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { currentUser } from '../models/currentUser.class';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataService } from '../data.service';
import { DirectMessage } from '../models/dm.class';
@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit {
  DM: DirectMessage = new DirectMessage({});
  
  constructor(
    public dialogRef: MatDialogRef<ProfileViewComponent>,
    private firestore: AngularFirestore,
    public dialog : MatDialog,
    public dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) { }


    UserDetail;
    CurrentUser;

  ngOnInit(): void {
    this.loadUserDetail()
    this.loadCurrentUser()
  }

 loadUserDetail() {
  this.firestore
  .collection('users')
  .doc(this.data.userID)
  .valueChanges({idField: 'id'})
  .subscribe((user) => {
    this.UserDetail = user
  });
  }

  loadCurrentUser() {
    this.firestore
    .collection('users')
    .doc(this.dataService.id)
    .valueChanges({idField: 'id'})
    .subscribe((user) => {
      this.CurrentUser = user
    });
    }


  closeDialog(){
    this.dialogRef.close(ProfileViewComponent)
  }

  createDM(){
    this.DM.members = [this.CurrentUser, this.UserDetail]
     this.firestore
     .collection('dms')
     .add(this.DM.toJSON())
     .then((docRef)=>
      this.updateUsers(this.DM.members, docRef.id))
     }
    
     updateUsers(members: any[], docID: string){
      const uniqueMembers = new Set(members.map(member => member.id));
      uniqueMembers.forEach((element: string) => { // Element-Typ auf "string" festlegen
        this.firestore
          .collection('users')
          .doc(element)
          .collection('dmsFromUser')
          .add({
            DMID: docID
          })
      });
    }
    
    
}

     