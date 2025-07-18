import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
  standalone: false,
})
export class Tab4Page implements OnInit {
  username = localStorage.getItem('user_name') || 'User';
  userId = localStorage.getItem('user_id');
  orders: any[] = [];
  reviews: { [id: number]: { rating: number, comment: string } } = {};

  constructor(
    private http: HttpClient,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.http.get<any[]>(`https://sam.ti-zone.io/get_user_reservations.php?user_id=${this.userId}`)
      .subscribe(res => {
        this.orders = res.filter(o => o.status === 'selesai');
      });
  }
getReview(orderId: number) {
  if (!this.reviews[orderId]) {
    this.reviews[orderId] = { rating: 0, comment: '' };
  }
  return this.reviews[orderId];
}

  setRating(orderId: number, rating: number) {
    if (!this.reviews[orderId]) {
      this.reviews[orderId] = { rating: 0, comment: '' };
    }
    this.reviews[orderId].rating = rating;
  }

  submitReview(orderId: number, serviceId: number) {
  const review = this.reviews[orderId];
  if (!review || !review.rating || !review.comment) {
    this.showToast('Mohon isi semua data ulasan!', 'warning');
    return;
  }

  const payload = {
    user_id: this.userId,
    order_id: orderId,
    service_id: serviceId, // ✅ gunakan serviceId dari parameter
    rating: review.rating,
    komentar: review.comment
  };

  this.http.post<any>('https://sam.ti-zone.io/add_review.php', payload).subscribe(async res => {
    this.showToast(res.success ? 'Ulasan dikirim!' : 'Gagal mengirim ulasan', res.success ? 'success' : 'danger');
  });
}


  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color
    });
    toast.present();
  }
}
