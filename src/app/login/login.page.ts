import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  email = '';
  password = '';

  constructor(
    private http: HttpClient,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {}

  async login() {
    const data = { email: this.email, password: this.password };

    this.http.post<any>('https://sam.ti-zone.io/login_user.php', data).subscribe(
      async res => {
        if (res.success) {
          // Simpan data user ke localStorage
          localStorage.setItem('user_id', res.user.id);
          localStorage.setItem('user_name', res.user.username);
          localStorage.setItem('user_login', 'true'); // <== status login

          // Navigasi ke tab utama
          this.navCtrl.navigateRoot('/tabs/tab1');
        } else {
          const toast = await this.toastCtrl.create({
            message: 'Login gagal. Email atau password salah.',
            duration: 2000,
            color: 'danger'
          });
          toast.present();
        }
      },
      async error => {
        const toast = await this.toastCtrl.create({
          message: 'Terjadi kesalahan saat menghubungi server.',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      }
    );
  }
}
