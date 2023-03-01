import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URL = 'http://localhost:4000/users';
  constructor(private http: HttpClient, private router: Router) { }

  signUpUser(user) {
    return this.http.post<any>(`${this.URL}/signup`, user); 
  }

  logInUser(user) {
    return this.http.post<any>(`${this.URL}/login`, user);
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRole() {
    return firstValueFrom(this.http.get<any>(`${this.URL}/role`));
  }

  getUsers() {
    return this.http.get<any>(`${this.URL}/getUsers`);
  }

  getProfile(id) {
    return this.http.post<any>(`${this.URL}/getProfile`, { id });
  }

  getUser() {
    return this.http.get<any>(`${this.URL}/getUser`);
  }

  banUser(banInfo) {
    return this.http.post<any>(`${this.URL}/banUser`, banInfo);
  }

  isBanned() {
    return firstValueFrom(this.http.get<any>(`${this.URL}/isBanned`));
  }

  setRole(user, role) {
    return this.http.post<any>(`${this.URL}/setRole`, { user: user, role: role });
  }

  requestAccess(request) {
    return this.http.post<any>(`${this.URL}/requestAccess`, request);
  }

  getRequests() {
    return this.http.get<any>(`${this.URL}/requestList`); 
  }

  removeRequest(request) {
    return this.http.post<any>(`${this.URL}/removeRequest`, { request }); 
  }

  familyMembers() {
    return this.http.get<any>(`${this.URL}/familyMembers`); 
  }

  googleLogin(info) {
    return this.http.post<any>(`${this.URL}/google`, info); 
  }

  googleLink(user){
    return this.http.post<any>(`${this.URL}/googleLink`, user);
  }

  sendEmail(email) {
    return this.http.post<any>(`${this.URL}/sendEmail`, email); 
  }

  getAvatar() {
    return this.http.get(`${this.URL}/avatar`);
  }

  googleAvatar(url) {
    return this.http.post(`${this.URL}/gAvatar`, { url });
  }

  uploadAvatar(image: File) {
    const formData = new FormData();
    formData.append('avatar', image);

    return this.http.post(`${this.URL}/setAvatar`, formData);
  }

  requestExists(){
    return this.http.get(`${this.URL}/requestExists`)
  }

  uploadBanner(image: File){
    const formData = new FormData()
    formData.append('banner', image)

    return this.http.post(`${this.URL}/setBanner`, formData);
  }

  updateUser(changes){
    return this.http.post(`${this.URL}/updateUser`, changes);
  }

  deleteUser(){
    return this.http.get<any>(`${this.URL}/deleteUser`);
  }

  forgotPassword(email){
    return this.http.post<any>(`${this.URL}/forgotPassword`, {email: email});
  }

  recoverPassword(id){
    return this.http.post<any>(`${this.URL}/recoverPassword`, { id });
  }

  resetPassword(password){
    return this.http.post<any>(`${this.URL}/resetPassword`, password);
  }

  library(){
    return this.http.get<any>(`${this.URL}/library`);
  }

  addSocialMedia(info){
    return this.http.post<any>(`${this.URL}/addSocialMedia`, info);
  }

  delSocialMedia(siteI, accI){
    return this.http.post<any>(`${this.URL}/delSocialMedia`, [siteI, accI]);
  }

  getUserId(){
    return this.http.get<any>(`${this.URL}/id`)
  }
}