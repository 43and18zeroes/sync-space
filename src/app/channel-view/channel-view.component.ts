import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataService } from '../data.service';

@Component({
  selector: 'app-channel-view',
  templateUrl: './channel-view.component.html',
  styleUrls: ['./channel-view.component.scss']
})

export class ChannelViewComponent implements OnInit {

  @ViewChild('channelNameInput') channelNameInput: ElementRef;
  @ViewChild('channelDescriptionInput') channelDescriptionInput: ElementRef;

  constructor(
    public dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private firestore: AngularFirestore,
    public Dialog: MatDialog,
    public dialogRef: MatDialogRef<ChannelViewComponent>
  ) { }

  currentUser;
  currentChannel;

  editName = false;
  editDescription = false;

  ngOnInit(): void {
    this.loadChannel()
    this.loadCurrentUser()
  }

  closeDialog() {
    this.dialogRef.close(ChannelViewComponent)
  }

  loadChannel() {
    this.firestore
      .collection('channels')
      .doc(this.data.channelId)
      .valueChanges({idField: 'channelId'})
      .subscribe((channel) => {
        this.currentChannel = channel
      });
  }

  editDescriptionName() {
    this.editDescription = true;
    this.editName = false;
    this.channelDescriptionInput.nativeElement.focus();
  }

  editDescriptionInFirebase() {    
    this.firestore
      .collection('channels')
      .doc(this.data.channelId)
      .update({
        description: this.currentChannel.description
      })
    this.editDescription = false;
  }

  editChannelName() {
    this.editName = true;
    this.editDescription = false;
    this.channelNameInput.nativeElement.focus();
  }

  editChannelNameInFirebase() {    
    this.firestore
      .collection('channels')
      .doc(this.data.channelId)
      .update({
        name: this.currentChannel.name
      })
    this.editName = false;
  }

  leaveChannel() {
      this.updateChannel()
      this.updateLastChannelByUser()
      this.closeDialog()
  }
  
  updateChannel(){
    if (this.currentChannel && this.currentChannel.members) {
      const currentUserIndex = this.currentChannel.members.findIndex(member => member.id === this.currentUser.id);
      if (currentUserIndex !== -1) {
        this.currentChannel.members.splice(currentUserIndex, 1);
        this.firestore
          .collection('channels')
          .doc(this.data.channelId)
          .update({
            members: this.currentChannel.members
          });
      }
    }
  }
  
  updateLastChannelByUser(){
    this.firestore
    .collection('users')
    .doc(this.dataService.id)
    .update({
      lastChannel: 'NUhNN20heEUcN7gnJuZM'
    })
  }

  loadCurrentUser() {
    this.firestore
      .collection('users')
      .doc(this.dataService.id)
      .valueChanges({ idField: 'id' })
      .subscribe((user) => {
        this.currentUser = user
      });
  }
}