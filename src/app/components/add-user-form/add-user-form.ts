import { CommonModule } from '@angular/common';
import { Component,OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
@Component({
  selector: 'app-add-user-form',
  standalone:true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './add-user-form.html',
  styleUrl: './add-user-form.css'
})
export class AddUserForm implements OnInit {
userForm!: FormGroup;
showPassword: boolean = false;

  constructor(private fb: FormBuilder,private auth:Auth) {}

  ngOnInit() {
    this.userForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      mobile: ['', Validators.required],
      roleId: ['', Validators.required],
      designation: ['', Validators.required]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
   onSubmit() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;

      const payload = {
        userName: formValue.userName,
        email: formValue.email,
        password: formValue.password,
        mobile: formValue.mobile,
        roleId: Number(formValue.roleId),
        designation: formValue.designation
      };

      this.auth.registerUser(payload).subscribe({
        next: (res) => {
          alert('User registered successfully');
          this.userForm.reset();
        },
        error: (err) => {
          console.error('Registration failed', err);
          alert('Failed to register user. Please try again.');
        }
      });
    }
  }
  
}
