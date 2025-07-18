import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  services: any[] = [];
  searchTerm = '';
  showForm = false;
  selectedService: any = null;
  allReviews: any[] = [];
  reviews: any[] = [];

  username: string = ''; // ✅ tampilkan user login di header

  form = {
    nama: '',
    no_hp: '',
    tanggal_reservasi: '',
    jam_reservasi: '',
    catatan: '',
    metode_pembayaran: 'COD'
  };

  constructor(
    private http: HttpClient,
    private toastCtrl: ToastController,
    private navCtrl: NavController // ✅ untuk navigasi logout
  ) {}

  ngOnInit() {
    this.loadServices();
    this.username = localStorage.getItem('user_name') || 'User'; // ✅ ambil nama dari localStorage
    this.loadAllReviews();
    
  
  }
loadAllReviews() {
  this.http.get<any[]>('https://sam.ti-zone.io/get_reviews.php').subscribe(res => {
    console.log('Review response:', res); // ✅ Debug log
    this.reviews = res;
  }, err => {
    console.error('Gagal memuat review:', err);
  });
}

  loadServices() {
    this.http.get<any[]>('https://sam.ti-zone.io/get_services.php').subscribe(res => {
      this.services = res;
    });
  }

  filteredServices() {
    const term = this.searchTerm.toLowerCase();
    return this.services.filter(s => s.nama_layanan.toLowerCase().includes(term));
  }

  openForm(service: any) {
    this.selectedService = service;
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.form = {
      nama: '',
      no_hp: '',
      tanggal_reservasi: '',
      jam_reservasi: '',
      catatan: '',
      metode_pembayaran: 'COD'
    };
  }

  async submitReservation() {
  const userId = localStorage.getItem('user_id');

  // Validasi input form
  if (
    !this.form.nama ||
    !this.form.no_hp ||
    !this.form.tanggal_reservasi ||
    !this.form.jam_reservasi ||
    !this.form.metode_pembayaran
  ) {
    const toast = await this.toastCtrl.create({
      message: 'Mohon isi semua kolom yang diperlukan.',
      duration: 2000,
      color: 'warning'
    });
    toast.present();
    return;
  }

  const data = {
    user_id: userId,
    service_id: this.selectedService.id,
    ...this.form
  };

  this.http.post<any>('https://sam.ti-zone.io/order_service.php', data).subscribe(async res => {
    const toast = await this.toastCtrl.create({
      message: res.success ? 'Reservasi berhasil dikirim!' : 'Gagal melakukan reservasi.',
      duration: 2000,
      color: res.success ? 'success' : 'danger'
    });
    toast.present();
    if (res.success) {
      this.closeForm();
    }
  });
}


  logout() {
    localStorage.clear();
    this.navCtrl.navigateRoot('/login'); // ✅ redirect ke login
  }
}