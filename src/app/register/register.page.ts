import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { SwiperSlideDirective } from 'swiper/angular';
import { UserRegister } from '../modals/user-register';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common/common.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegisterPage implements OnInit {

  @ViewChild('swiperRef') swiperRef?: IonSlides;
  @ViewChild(SwiperSlideDirective) directiveRef?: SwiperSlideDirective;
  slideIndex: any = this.swiperRef?.getActiveIndex();

  registerForm !: FormGroup;
  imgSRC: any = 'assets/images/user.svg';
  isConfirm = false;
  showPass = false

  constructor(private fb: FormBuilder, private common: CommonService, private router: Router, private api: ApiService) {
    this.registerForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      otp: new FormControl('', [Validators.required, Validators.maxLength(4)]),
      firstName: new FormControl('', [Validators.required, Validators.maxLength(25), Validators.minLength(4)]),
      lastName: new FormControl('', [Validators.maxLength(25), Validators.minLength(4)]),
      username: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      password: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      phone: new FormControl('',),
      img: new FormControl('', [Validators.required])
    })

    this.registerForm.valueChanges.subscribe(() => {
      if (this.slideIndex > 0 && this.registerForm.errors) {
        this.swiperRef?.lockSwipeToNext(true)
      } else {
        this.swiperRef?.lockSwipeToNext(false)
      }
    })
  }

  ngOnInit() {

  }

  onSlideDone(e: any) {
    console.log(e)
    this.slideIndex = e.target.swiper.activeIndex;
    // if(this.slideIndex > 0) this.swiperRef?.lockSwipeToNext(true)
  }

  changeNxt(key: any) {
    if (this.registerForm.get(key)?.errors) {
      // this.swiperRef?.slideNext()
      return;
    }

    switch (key) {
      case 'email':
        this.common.showLoading(true);
        this.api.sendOTP(this.registerForm.get('email')?.value).subscribe({
          next: (res:any) => {
            this.common.showLoading(false);
            if(res.isSend){
              sessionStorage.setItem('otp', JSON.stringify(res));

              this.swiperRef?.slideNext()
              let logoutTimer = setTimeout(function () { sessionStorage.removeItem('otp'); }, (1000 * 60 * 5));
            }else{
              this.common.showToast(res.value)
            }

          },
          error: (err) => {
            // alert('Something wrong Please try again');
            this.common.showLoading(false);
          }
        });
        break;
        case 'otp':
          this.verifyOTP();
        break;
      default:
        this.swiperRef?.slideNext()
        break;
    }

  }

  verifyOTP(): any {
    if(this.registerForm.get('otp')?.value?.toString().length != 4){
      return
    }
    if(sessionStorage.getItem('otp')){
      let otp = JSON.parse(sessionStorage.getItem('otp') || '');
      if(otp === this.registerForm.get('otp')?.value?.toString()){
        this.swiperRef?.slideNext()
      }else{
        this.common.showToast('Enter valid OTP')
      }

    }else{
      this.common.showToast('Otp expired! click resend')
    }
  }

  onAddImage(e: any) {
    if (e.target.files && e.target.files[0]) {
      let reader = new FileReader()

      reader.onload = (event: any) => {
        this.imgSRC = event.target.result;
        this.imgSRC ? this.registerForm.get('img')?.patchValue(this.imgSRC) : null;
      }

      reader.readAsDataURL(e.target.files[0])
    }

  }

  onConfirmPassword(confirm: any) {
    if (this.registerForm.get('password')?.value === confirm) {
      this.isConfirm = true;
    } else {
      this.isConfirm = false;
    }
  }

  onSubmit() {
    if (this.registerForm.status == 'INVALID') {
      this.swiperRef?.slideNext();
      return
    }
    this.common.showLoading(true);
    let obj: UserRegister = {
      email: this.registerForm.get('email')?.value,
      firstName: this.registerForm.get('firstName')?.value,
      lastName: this.registerForm.get('lastName')?.value,
      userName: this.registerForm.get('username')?.value,
      img: this.registerForm.get('img')?.value,
      story: '',
      password: this.registerForm.get('password')?.value,
      isOnline: true
    }

    this.api.createUser(obj).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', JSON.stringify(res?.token))
        this.common.showLoading(false);
        this.router.navigate(['home'])
      },
      error: (err: any) => {
        alert(err);
        this.common.showLoading(false);
      }
    })

  }

  onLogIn(){
    let obj = {
      email : this.registerForm.get('email')?.value,
      password : this.registerForm.get('password')?.value
    }
    this.api.logInUser(obj).subscribe({
      next:(res:any)=>{
        if(res.status){
            localStorage.setItem('token', res.token);
            this.router.navigate(['/home'])
        }
      },
      error:(err) =>{

      },
    })
  }

}
