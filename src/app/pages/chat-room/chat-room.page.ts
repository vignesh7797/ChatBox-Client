import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.page.html',
  styleUrls: ['./chat-room.page.scss'],
})
export class ChatRoomPage implements OnInit {

  dpSRC:any = 'assets/images/user.svg';

  constructor() { }

  ngOnInit() {
  }

}
