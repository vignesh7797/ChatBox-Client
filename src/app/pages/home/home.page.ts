import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
 dpObj:any;
 isSearch:boolean = false;

  usersList = Array(20)

  constructor(private router:Router) {
    window.addEventListener('offline',  (e) =>{ alert('offline'); });

    window.addEventListener('online',  (e) =>{ alert('online'); });
  }

  ngOnInit() {
  }


  openDpModal(src:any, e:any){
    e.stopPropagation();
    this.dpObj = {
      src: src,
      name : 'VigneshWaran',
    }
  }

  openChatRoom(){
    this.router.navigate(['/chatRoom'])
  }

}
