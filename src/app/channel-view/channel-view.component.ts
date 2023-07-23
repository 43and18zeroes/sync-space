import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '../data.service';

@Component({
  selector: 'app-channel-view',
  templateUrl: './channel-view.component.html',
  styleUrls: ['./channel-view.component.scss']
})
export class ChannelViewComponent implements OnInit {
  


  constructor(
    public dataService : DataService,
    @Inject(MAT_DIALOG_DATA) public data:any,
  private firestore: AngularFirestore) { }
  currentUser;
  currentChannel;
  editName = false;
  editDescription = false;

  ngOnInit(): void {
    this.loadChannel()
    this.loadCurrentUser()
  }

  loadChannel(){
    this.firestore
    .collection('channels')
    .doc(this.data.ChannelId)
    .valueChanges()
    .subscribe((channel) => {
      this.currentChannel = channel
    });
  }

  editDescriptionName(){
    this.editDescription = true;
  }

  editDescriptionInFirebase(){
    this.firestore
    .collection('channels')
    .doc(this.data.ChannelId)
    .update({
      description: this.currentChannel.description
    })
    this.editDescription = false;
}


  editChannelName(){
    this.editName = true;
  }

  editChannelNameInFirebase(){
      this.firestore
      .collection('channels')
      .doc(this.data.channelId)
      .update({
        Name: this.currentChannel.name
      })
      this.editName = false;
  }

  leaveChannel(){
      const currentUserIndex = this.currentChannel.members.findIndex(member => member.id === this.currentUser.id)
      this.currentChannel.members.splice(currentUserIndex, 1);
      this.firestore
      .collection('channels')
      .doc(this.data.ChannelId)
      .update({
        members: this.currentChannel.members
      })
  }

  loadCurrentUser(){
    this.firestore
    .collection('users')
    .doc(this.dataService.id)
    .valueChanges({idField: 'id'})
    .subscribe((user) => {
      this.currentUser = user

    });
  }


}
