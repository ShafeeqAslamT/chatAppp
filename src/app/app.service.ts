import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import io from 'socket.io-client';
@Injectable({
  providedIn: 'root'
})
export class AppService {

  baseUrl = 'http://192.168.0.124:5000';
  socketUrl = 'http://192.168.0.124:5000';
  socket: any;
  // tslint:disable-next-line: variable-name
  chat_socket: EventEmitter<any>;
  constructor(private http: HttpClient) {
    this.chat_socket = new EventEmitter();
    this.socket_Connect();
  }
  socket_Connect() {
    this.socket = io(this.socketUrl);
    this.socket.on('connect', () => {
      console.log('connected');
    });
    this.socket.on('event', (data) => {
      // console.log(data);
    });
    this.socket.on('RECEIVE_MESSAGE', data => {
      this.chat_socket.emit(data);
    });
  }
  SendChat(data) {
    this.socket.emit('SEND_MESSAGE', data);
  }
  public getHeader() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return headers;
  }
  getChatAll() {
    return this.http.get(this.baseUrl + '/chat', {
      headers: this.getHeader()
    }).pipe(map((data: any) => {
      return data;
    }));
  }
  chat(body) {

    return this.http.post(this.baseUrl + '/chat/chat', body, {
      headers: this.getHeader()
    }).pipe(map((data: any) => {
      return data;
    }));
  }
  uploadImage(files: Array<File>) {
    const formData: any = new FormData();
    formData.append('photo', files[0], files[0].name);

    return this.http.post(this.baseUrl + '/chat/uploadImage', formData, {
      headers: this.getHeader()
    }).pipe(map((data: any) => {
      return data;
    }));
  }
}
