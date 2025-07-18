import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage {
  username = '';
  email = '';
  password = '';

  constructor(
    private http: HttpClient,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {}

  async register() {
    const data = { username: this.username, email: this.email, password: this.password };

    this.http.post<any>('https://sam.ti-zone.io/register_user.php', data).subscribe(async res => {
      if (res.success) {
        const toast = await this.toastCtrl.create({
          message: 'Registrasi berhasil, silakan login.',
          duration: 2000,
          color: 'success'
        });
        toast.present();
        this.navCtrl.navigateRoot('/login');
      } else {
        const toast = await this.toastCtrl.create({
          message: res.message || 'Gagal daftar',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }
}
