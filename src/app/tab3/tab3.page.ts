import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit {
  // Login
  username: string = '';
  password: string = '';
  adminLogin = false;

  // Menu Aktif
  menu: string = 'pesanan';

  // Data reservasi
  orders: any[] = [];

  // Form tambah layanan
  layanan = {
    nama_layanan: '',
    kategori: '',
    deskripsi: '',
    durasi: '',
    harga: null,
    gambar: '',
    jam_tersedia: ''
  };

  constructor(private http: HttpClient, private toastCtrl: ToastController) {}

  ngOnInit() {
    this.checkAdminLogin();
  }

  checkAdminLogin() {
    const status = localStorage.getItem('admin_login');
    if (status === 'true') {
      this.adminLogin = true;
      this.loadPesanan();
    }
  }

  loginAdmin() {
    if (this.username === 'admin' && this.password === 'admin123') {
      this.adminLogin = true;
      localStorage.setItem('admin_login', 'true');
      this.loadPesanan();
      this.showToast('Login berhasil', 'success');
    } else {
      this.showToast('Username / password salah', 'danger');
    }
  }

  logoutAdmin() {
    this.adminLogin = false;
    localStorage.removeItem('admin_login');
    this.orders = [];
    this.menu = 'pesanan';
  }

  loadPesanan() {
    this.http.get<any[]>('https://sam.ti-zone.io/get_reservasi.php')
      .subscribe(res => this.orders = res);
  }

  konfirmasiPesanan(id: number) {
    this.http.post<any>('https://sam.ti-zone.io/admin_confirm_reservations.php', { id })
      .subscribe(async res => {
        if (res.success) {
          this.loadPesanan();
          this.showToast('Pesanan dikonfirmasi', 'success');
        }
      });
  }

  isSubmitting = false;

tambahLayanan() {
  if (this.isSubmitting) return;
  this.isSubmitting = true;

  this.http.post<any>('https://sam.ti-zone.io/add_service_admin.php', this.layanan)
    .subscribe(async res => {
      this.isSubmitting = false;
      if (res.success) {
        this.resetForm();
        this.showToast('Layanan ditambahkan', 'success');
      } else {
        this.showToast('Gagal menambahkan layanan', 'danger');
      }
    }, err => {
      this.isSubmitting = false;
      this.showToast('Terjadi kesalahan saat mengirim.', 'danger');
    });
}


  resetForm() {
    this.layanan = {
      nama_layanan: '',
      kategori: '',
      deskripsi: '',
      durasi: '',
      harga: null,
      gambar: '',
      jam_tersedia: ''
    };
  }

  async showToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color: color,
    });
    toast.present();
  }
}
