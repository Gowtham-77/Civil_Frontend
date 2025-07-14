import { Component, OnInit, inject, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-get-all-users',
  standalone: true,
  imports: [NgClass, NgFor,FormsModule, NgIf],
  templateUrl: './get-all-users.html',
  styleUrl: './get-all-users.css'
})
export class GetAllUsers implements OnInit {
  users: any[] = [];
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  selectedUser: any = null;


  @ViewChild('statusPopup') statusPopup!: ElementRef;
  @ViewChild('popupMessage') popupMessage!: ElementRef;



  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.http.get<any[]>('http://20.55.22.52:8081/api/auth/non-admin-users')
      .subscribe({
        next: (res) => {
          console.log('Users fetched successfully:', res);
          this.users = res;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error fetching users:', err)
      });
  } 

  getRoleName(roleId: number): string {
    switch (roleId) {
      case 1: return 'Admin';
      case 2: return 'Maker';
      case 3: return 'Checker';
      default: return 'Unknown';
    }
  }

  toggleStatus(user: any) {
    const updatedStatus = user.status === 1 ? 0 : 1;
    const payload = {
      userName: user.userName,
      currentStatus: user.status,
    };

    this.http.post('http://20.55.22.52:8081/api/auth/toggle-status', payload,{responseType:'text'})
      .subscribe({
        next: () => {
          user.status = updatedStatus;
          const message = updatedStatus === 1
            ? `${user.userName} activated successfully!`
            : `${user.userName} deactivated successfully!`;
          this.showPopup(message);

        },
        error: (err) => console.error('Error updating status:', err)
      });
  }
   showPopup(message: string) {
  if (this.popupMessage?.nativeElement && this.statusPopup?.nativeElement) {
    this.popupMessage.nativeElement.textContent = message;
    this.statusPopup.nativeElement.style.display = 'block';
  } else {
    console.warn('Popup DOM element not ready.');
  }
}

  closePopup() {
    this.statusPopup.nativeElement.style.display = 'none';
  }

  editUser(user: any) {
  this.selectedUser = { ...user };
}

cancelEdit() {
  this.selectedUser = null;
}

updateUser() {
  const payload = {
    userName: this.selectedUser.userName,
    email: this.selectedUser.email,
    roleId: this.selectedUser.roleId
  };

  this.http.post('http://20.55.22.52:8081/api/auth/update-by-email', payload,{responseType:'text'})
    .subscribe({
      next: (res) => {
        console.log('User updated successfully:', res);
        const index = this.users.findIndex(u => u.userName === this.selectedUser.userName);
        if (index !== -1) {
          this.users[index] = { ...this.selectedUser };
        }

        this.showPopup(`User ${this.selectedUser.userName} updated successfully!`);
        this.selectedUser = null;
      },
      error: (err) => {
        console.error('Error updating user:', err);
        this.showPopup(`Failed to update ${this.selectedUser.userName}`);
      }
    });
}


}
