import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private URI = environment.API;

  constructor(private http:HttpClient) { }

  // Create User
  createUser(obj:any){
    return this.http.post(this.URI+'users/UserRegister/Adduser',obj)
  }

  // Send Otp
  sendOTP(email:any){
    return this.http.post(this.URI+'users/UserRegister/sendOTP', {email:email})
  }

  // LogIn User
  logInUser(obj:any){
    return this.http.post(this.URI+'users/UserRegister/logIn', obj)
  }
}

