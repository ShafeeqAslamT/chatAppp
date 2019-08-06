import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'chatapp';
  constructor(private app: AppService) { }
  users: any = [];
  user: any;
  model: any;
  chats: any = [];
  loading = false;
  showAttachment = false;
  localUrl: string;
  showPreview = false;
  files: any;
  previewData: any;
  ngOnInit() {
    this.loadData();
    this.model = { userName: this.user.name, message: '', ip: '192.168.0.124', time: new Date(), status: 'send', image: '' };
    this.app.chat_socket.subscribe((res: any) => {
      const i = res;
      i.current = i.userName === this.user.name;
      // tslint:disable-next-line: triple-equals
      i.image = this.users.find((x: { name: string; }) => x.name == i.userName).image;
      this.chats.push(i);
      // this.scrollBottom();
      this.timerTick();
    });
    // console.log(this.isMial('shafeeq@ipossoft.com'));
  }
  loadChat() {
    this.loading = true;
    this.app.getChatAll().subscribe(res => {
      // console.log(res);
      // this.chats = [];
      this.chats = res;
      // this.chats.push(res[res.length - 1])
      for (const i of this.chats) {
        // tslint:disable-next-line: triple-equals
        i.current = i.userName == this.user.name;
        // tslint:disable-next-line: triple-equals
        i.image = this.users.find((x: { name: string; }) => x.name == i.userName).image;
      }
      this.loading = false;
    });
  }
  scrollBottom() {
    const el: any = document.getElementById('msgBody');
    const bottom = Math.max(0, el.scrollHeight - el.offsetHeight);
    // console.log(bottom)
    el.scrollTop = bottom;
  }
  timerTick() {
    const source = timer(200, 5000);
    const sub = source.subscribe(res => {
      this.scrollBottom();
      sub.unsubscribe();
    });
  }
  sendChat() {
    // tslint:disable-next-line: triple-equals
    if (this.showPreview) {
      this.model.document = this.previewData._id;
    }
    if (this.model.message.trim() == '' && this.model.document.trim() == '') {
      return;
    }
    this.model.userName = this.user.name;
    this.model.time = new Date();
    this.app.chat(this.model).subscribe(res => {
      console.log(res);
      res.documents = [];
      res.documents.push(this.previewData);
      this.app.SendChat(res);
      this.model.message = '';
      this.model.image = '';
      this.model.document = '';
      this.showPreview = false;
      this.previewData = {};
    });
  }
  selectUser(i: any) {
    this.user = i;
    this.loadChat();
    // this.scrollBottom();
    this.timerTick();
  }
  trimText(text: string) {
    // debugger
    // tslint:disable-next-line: variable-name
    let check_val = '';
    for (const i of text.trim().split(/\n|\t| /)) {
      check_val = this.checkMail(i);
      if (check_val) {
        // message = message + ' ' + check_val;
        text = text.replace(i, check_val);
        continue;
      }
      // message = message + ' ' + i;
    }
    return text.trim();
  }
  imagePreview(documents) {
    // if(documents[0]){

    // }
    const path = this.app.baseUrl + '/' + documents[0].path;
    return '<div class="message_document img"" > <img src="' + path + '" alt=""> </div>';
  }
  checkMail(email) {
    // tslint:disable-next-line: max-line-length
    const mail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const ftp = /^(ftp:\/\/ftp\.|ftp:\/\/ftp\.|ftp:\/\/|ftp:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    const http = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    if (mail.test(String(email).toLowerCase())) {
      return '<a href="mailto:' + email + ' target="_blank">' + email + '</a>';
    } else if (ftp.test(String(email).toLowerCase())) {
      return '<a href="' + email + ' target="_blank">' + email + '</a>';
    } else if (http.test(String(email).toLowerCase())) {
      return '<a href="' + email + ' target="_blank">' + email + '</a>';
    } else {
      return undefined;
    }
  }
  attachmentShow() {
    this.showAttachment = !this.showAttachment;
  }
  keyDown(e) {
    // console.log(e)
    if (e.ctrlKey && e.keyCode == 13) {
      this.sendChat();
    }
  }
  uploadFile(e) {
    console.log(e);
    if (e.target.files && e.target.files[0]) {
      this.files = e.target.files;
      this.showPreview = true;
      this.app.uploadImage(this.files).subscribe(res => {
        this.previewData = res;
        this.previewData.url = this.app.baseUrl + '/' + res.path;
      });
    }
    this.showAttachment = false;
  }
  uploadImage() {
    this.app.uploadImage(this.files).subscribe(res => {
      console.log(res);
    });
  }
  loadData() {
    this.users = [
      {
        id: 1,
        name: 'Manuel',
        image: 'https://robohash.org/quicommodirerum.png?size=50x50&set=set1',
        description: 'is online',
        online: true
      }, {
        id: 2,
        name: 'Katherina',
        image: 'https://robohash.org/atquaevel.jpg?size=50x50&set=set1',
        description: 'is online',
        online: true
      }, {
        id: 3,
        name: 'Marybeth',
        image: 'https://robohash.org/ametautemdeleniti.jpg?size=50x50&set=set1',
        description: 'left 30 mins ago',
        online: false
      }, {
        id: 4,
        name: 'Isidro',
        image: 'https://robohash.org/expeditavoluptatemomnis.png?size=50x50&set=set1',
        description: 'left 50 mins ago',
        online: false
      }, {
        id: 5,
        name: 'Edee',
        image: 'https://robohash.org/autemsimiliquererum.png?size=50x50&set=set1',
        description: 'left 7 mins ago',
        online: false
      }
    ];
    this.selectUser(this.users[0]);

  }
}
