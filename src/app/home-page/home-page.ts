import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AddUserForm } from '../components/add-user-form/add-user-form';
import { WelderPerformanceQualification } from '../welder-performance-qualification/welder-performance-qualification';
import { ReportStatus } from '../components/report-status';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { GetAllUsers } from '../components/get-all-users/get-all-users';
import { Navigation } from '../services/navigation';
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule, AddUserForm,
    WelderPerformanceQualification,
    ReportStatus, GetAllUsers,NgIf],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage implements OnInit {
  isSidebarCollapsed = false;
  activeComponent: string | null = null;
  isBrowser: boolean;
  roleId: number = 0;
  username = '';
  editCertNo: string | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router,
    private navService: Navigation) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      const storedRoleId = localStorage.getItem('roleId');
      this.roleId = storedRoleId ? +storedRoleId : 0;
    }
  }


  ngOnInit(): void {
    if (this.isBrowser) {
    const storedUsername = localStorage.getItem('userName');
    const storedRoleId = localStorage.getItem('roleId');
    const savedComponent = localStorage.getItem('navigateToComponent');

    const editCertNo = localStorage.getItem('editCertNo');
    const reviewCertNo = localStorage.getItem('reviewCertNo');

    this.roleId = storedRoleId ? +storedRoleId : 0;
    this.username = storedUsername || '';

    if (editCertNo) {
      this.editCertNo = editCertNo;
      this.activeComponent = 'create-welder';
      localStorage.removeItem('editCertNo');
      return;
    }

    if (reviewCertNo) {
      this.editCertNo = reviewCertNo;
      this.activeComponent = 'create-welder';
      localStorage.removeItem('reviewCertNo');
      return;
    }


      if (savedComponent) {
      this.activeComponent = savedComponent;
      localStorage.removeItem('navigateToComponent');
    } else {
      if (this.roleId === 1) {
        this.activeComponent = 'get-all-users';
      } else if (this.roleId === 2 || this.roleId === 3) {
        this.activeComponent = 'report-status';
      }
    }
  
    
  }

    this.navService.componentToLoad$.subscribe(name => {
      if (name) {
        this.activeComponent = name;
      }
    });

  };

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }


  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  };


  loadComponent(componentName: string, certNo?: string): void {
    this.activeComponent = componentName;

    if (componentName === 'create-welder' && certNo) {
      console.log('Edit certificate number received:', certNo);
      this.editCertNo = certNo;
    } else {
      this.editCertNo = null;
    }
  }


}
