import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../services/auth';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  
  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: Auth,
    @Inject(PLATFORM_ID) private platformId: Object) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  };

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (res) => {
        console.log('Login successful:', res);
         if (res.status === 0) {
        this.showAccessDeniedPopup(); 
        return;
      }
        if (!res.token) {
          alert('Invalid credentials. Please try again.');
          return;
        }
        localStorage.setItem('token', res.token);
        localStorage.setItem('userName', res.userName);
        localStorage.setItem('roleId', res.roleId);

        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        alert(
          error.status === 401
            ? 'Invalid credentials. Please try again.'
            : 'Something went wrong. Please try again later.'
        );
      },
      complete: () => {
        this.isLoading = false;
        this.loginForm.reset();
      }
    });
  }

  async showAccessDeniedPopup() {
  if (isPlatformBrowser(this.platformId)) {
    const modalElement = document.getElementById('accessDeniedModal');
    if (modalElement) {
      const bootstrap = await import('bootstrap'); 
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}




}
