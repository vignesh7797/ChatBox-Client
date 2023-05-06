import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  loading:any;

  constructor(private loader:LoadingController, private toastController: ToastController) {

   }



  async showLoading(isLoad:boolean) {

    if(isLoad){

      this.loading = await this.loader.create({
        keyboardClose:true,
        mode:'md',
        spinner:'circular',
        showBackdrop:true
      });

      this.loading?.present();
    }else{
      this.loader?.dismiss();
    }

  }

  async showToast(message:any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      mode:'ios',
      icon : 'alert-circle-outline',
      cssClass: 'custom-toast',
      buttons:[
        {
          icon:'close-sharp',
          role:'cancel'
        }
      ]
    });

    await toast.present();
  }
}
