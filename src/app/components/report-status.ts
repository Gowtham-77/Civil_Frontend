import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { Navigation } from '../services/navigation';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-report-status',
  standalone: true,
  imports: [CommonModule, RouterModule,],
  templateUrl: './report-status.html',
  styleUrl: './report-status.css'
})
export class ReportStatus implements OnInit {
  pendingCerts: any[] = [];
  showPendingTable = false;
  approvedCerts: any[] = [];
  showApprovedTable = false;
  selectedCard: string = '';
  rejectedCerts: any[] = [];
  showRejectedTable = false;


  @Input() roleId: number = 0;


  constructor(private http: HttpClient,
    private navService: Navigation,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    console.log('Role set in ngOnInit:', this.roleId);

  }

  loadApprovedReports() {
    this.selectedCard = 'approved';
    this.http.get<any[]>('http://20.55.22.52:8081/api/reports/approved-certificates')
      .subscribe({
        next: (data) => {
          console.log("Approved reports received:", data);
          this.approvedCerts = data;
          this.showApprovedTable = true;
          this.showPendingTable = false;
          this.showRejectedTable = false;
          this.cdr.detectChanges();

        },
        error: (err) => console.error('Failed to load approved reports', err)
      });
  }



  loadPendingReports() {
    this.selectedCard = 'pending';
    const storedRoleId = localStorage.getItem('roleId');
    this.roleId = storedRoleId ? parseInt(storedRoleId, 10) : 0;
    console.log('RoleId inside loadPendingReports():', this.roleId);
    this.http.get<any[]>('http://20.55.22.52:8081/api/reports/pending-certificates')
      .subscribe({
        next: (data) => {
          console.log("Pending reports received:", data);
          this.pendingCerts = data;
          this.showPendingTable = true;
          this.showApprovedTable = false;
          this.showRejectedTable = false;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Failed to load reports', err)
      });
  }

  loadRejectedReports() {
  this.selectedCard = 'rejected';
  this.http.get<any[]>('http://20.55.22.52:8081/api/reports/rejected-certificates')
    .subscribe({
      next: (data) => {
        this.rejectedCerts = data;
        this.showRejectedTable = true;
        this.showApprovedTable = false;
        this.showPendingTable = false;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load rejected reports', err)
    });
}

  viewReport(certNo: string): void {
    const url = `http://20.55.22.52:8081/api/reports/wqt/view/${certNo}`;

    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (pdfBlob) => {
        const blob = new Blob([pdfBlob], { type: 'application/pdf' });
        const blobUrl = window.URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
      },
      error: (error) => {
        console.error('Error viewing PDF:', error);
        alert('Failed to load PDF.');
      }
    });
  }


  editReport(certNo: string,createdBy:string): void {
    localStorage.setItem('editCertNo', certNo);
    localStorage.setItem('createdBy',createdBy);
    this.navService.setComponent('create-welder');
  }


  downloadPDF(certNo: string): void {
    const url = `http://20.55.22.52:8081/api/reports/wqt/download/${certNo}`;
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (pdfBlob) => {
        const blob = new Blob([pdfBlob], { type: 'application/pdf' });
        saveAs(blob, `${certNo}.pdf`);
      },
      error: (error) => {
        console.error('Download error:', error);
        alert('Failed to download PDF.');
      }
    })

  };

  reviewReport(certNo: string): void {
    localStorage.setItem('reviewCertNo', certNo);
    this.navService.setComponent('create-welder');

  }


  


}
