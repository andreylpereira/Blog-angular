import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
/* Model */
import Login from '../../models/login.model';
/* Services */
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  readonly url: string;

  private user: {
    id: number;
    firstName: string;
    lastName: string;
  } = {
    id: 0,
    firstName: '',
    lastName: '',
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.url = 'http://localhost:8080/admin/authenticate';
  }

  login(user: Login) {
    return this.http.post<Login>(this.url, user).subscribe({
      next: (data) => {
        localStorage.setItem('currentUser', JSON.stringify(data));
        this.toastr.success('Login efetuado com sucesso.', 'Sucesso!', {
          timeOut: 2000,
        });
        this.router.navigate(['/']);
      },
      error: (err) =>
        {
          console.log(err);
          this.toastr.error('Não foi possível logar no servidor!', 'Error!', {
            timeOut: 2000,
          })
        }
    });
  }

  logOut() {
    localStorage.removeItem('currentUser');
    this.toastr.success('Logout efetuado com sucesso.', 'Sucesso!', {
      timeOut: 2000,
    });
    this.router.navigate(['/home']);
  }

  getUser() {
    const session: any = localStorage.getItem('currentUser');
    const data = JSON.parse(session);
    this.user.id = data.id;
    this.user.firstName = data.firstName;
    this.user.lastName = data.lastName;
    return this.user;
  }

  options() {
    const session: any = localStorage.getItem('currentUser');
    const data = JSON.parse(session);

    if (data !== null) {
      const token = data.token;

      const options = {
        headers: new HttpHeaders()
          .set('Access-Control-Allow-Origin', '*')
          .set(
            'Access-Control-Allow-Methods',
            'GET, POST, PATCH, PUT, DELETE, OPTIONS, PUT'
          )
          .append('Authorization', `Bearer ${token}`),
      };

      return options;
    } else {
      return false;
    }
  }
}
