import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  notifications: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getNotifications();
  }

  getNotifications() {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    this.http.get<any[]>(`https://sam.ti-zone.io/get_notifications.php?user_id=${userId}`)
      .subscribe(res => {
        this.notifications = res;
      });
  }
}
