import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ViewChild, ElementRef, Input,AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { Navigation } from '../services/navigation';

@Component({
  selector: 'app-welder-performance-qualification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './welder-performance-qualification.html',
  styleUrl: './welder-performance-qualification.css'
})
export class WelderPerformanceQualification implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('pdfContent') pdfContent!: ElementRef;
  @Input() editCertNo: string | null = null;
@ViewChild('successModal') successModalRef!: ElementRef;

modalReady = false;

  ngAfterViewInit(): void {
    this.modalReady = true;
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editCertNo'] && changes['editCertNo'].currentValue) {
      const certNo = changes['editCertNo'].currentValue;
      console.log('ngOnChanges received editCertNo:', certNo, typeof certNo);
      if (typeof certNo === 'string') {
        this.fetchAndPatchForm(certNo);
      } else {
        console.error('Invalid editCertNo received in ngOnChanges:', certNo);
      }
    }
  }


  welderForm!: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  reviewMode = false;
  remarks = '';
  createdBy: string = '';
  isBrowser: boolean= false;



  constructor(private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private router: Router,
    private navigation: Navigation,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) { 
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.buildForm();

    const storedEditCertNo = localStorage.getItem('editCertNo');
    const storedReviewCertNo = localStorage.getItem('reviewCertNo');
    const storedCreatedBy = localStorage.getItem('createdBy');

    if (storedCreatedBy) {
      this.createdBy = storedCreatedBy;
      console.log('✅ Loaded createdBy from localStorage:', this.createdBy);
    }

    if (!this.editCertNo) {
      if (storedEditCertNo) {
        this.editCertNo = storedEditCertNo;
        console.log('✅ Loaded editCertNo from localStorage:', this.editCertNo);
      } else if (storedReviewCertNo) {
        this.editCertNo = storedReviewCertNo;
        this.reviewMode = true;
        console.log('✅ Loaded reviewCertNo from localStorage:', this.editCertNo);
      }
    }

    if (this.editCertNo) {
      this.fetchAndPatchForm(this.editCertNo);
    }
  }





  buildForm(): void {
    this.welderForm = this.fb.group({
      certificateNo: ['', Validators.required],
      jobNo: [''],
      welderName: [''],
      testDate: [''],
      welderStampNo: [''],
      welderIdNo: [''],
      passportNo: [''],
      wpsNo: [''],
      iqamaNo: [''],
      baseMeterial: [''],
      nationality: [''],
      thickness: [''],
      clientOrContractor: [''],
      inspectorNameCertNo: [''],
      clientRepName: [''],

      weldingProcess: this.fb.group({
        actual: [''],
        rangeQualified: ['']
      }),

      baseMaterial: this.fb.group({
        specificationNo: this.fb.group({
          actual: [''],
          rangeQualified: ['']
        }),
        classificationNo: this.fb.group({
          actual: [''],
          rangeQualified: ['']
        })
      }),

      joint: this.fb.group({
        pipeOrPlate: this.fb.group({
          actual: [''],
          rangeQualified: ['']
        }),
        typeOfJoint: this.fb.group({
          actual: [''],
          rangeQualified: ['']
        }),
        typeOfWeld: this.fb.group({
          actual: [''],
          rangeQualified: ['']
        }),
        consumableInserts: this.fb.group({
          actual: [''],
          rangeQualified: ['']
        }),
        backing: this.fb.group({
          actual: [''],
          rangeQualified: ['']
        }),
        pipeDiameter: this.fb.group({
          actual: [''],
          rangeQualified: ['']
        })
      }),

      fillerMetal: this.fb.group({
        specification: this.fb.group({
          actual: [''],
          rangeQualified: ['']
        }),
        classification: this.fb.group({
          actual: [''],
          rangeQualified: ['']
        }),
        fNumber: this.fb.group({
          actual: [''],
          rangeQualified: ['']
        })
      }),

      depositedThickness: this.fb.group({
        gtawSmaw: this.fb.group({
          actual: [''],
          rangeQualified: ['']
        }),
        specification: this.fb.group({
          actual: [''],
          rangeQualified: ['']
        })
      }),

      weldingParameters: this.fb.group({
        position: this.fb.group({
          actual: [''],
          rangeQualified: ['']
        }),
        progression: this.fb.group({
          actual: [''],
          rangeQualified: ['']
        }),
        gasBacking: this.fb.group({
          actual: [''],
          rangeQualified: ['']
        }),
        currentPolarity: this.fb.group({
          actual: [''],
          rangeQualified: ['']
        })
      }),

      testsConducted: this.fb.group({
        bendTest: this.fb.group({
          selected: [false],
          description: [''],
          result: ['']
        }),
        radiography: this.fb.group({
          selected: [false],
          description: [''],
          result: ['']
        }),
        ultrasonic: this.fb.group({
          selected: [false],
          description: [''],
          result: ['']
        }),
        macroEtch: this.fb.group({
          selected: [false],
          description: [''],
          result: ['']
        }),
        fracture: this.fb.group({
          selected: [false],
          description: [''],
          result: ['']
        }),
        other: this.fb.group({
          selected: [false],
          description: [''],
          result: ['']
        })
      })
    });
  } 

  onFileSelected(event: Event): void {
    if (isPlatformBrowser(this.platformId)) {
      const fileInput = event.target as HTMLInputElement;
      if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result;
          this.cdr.detectChanges();
        };
        reader.readAsDataURL(file);
      }
    }
  }



  onSubmit(): void {
    if (this.welderForm.valid) {
      const formData = this.welderForm.getRawValue();
      const userName = localStorage.getItem('userName');


      if (!userName) {
        alert('User not identified. Please login again.');
        return;
      }

      const payload = {
        ...formData,
      };

      if (this.editCertNo) {
        payload['updatedBy'] = userName;
        payload['updatedDate'] = new Date().toISOString().split('T')[0];
        payload['createdBy'] = this.createdBy;
        console.log(payload)
      } else {
        payload['createdBy'] = userName;
      }


      this.http.post('http://20.55.22.52:8081/api/reports/wqt/save', payload).subscribe({
        next: (response) => {
          const msg = this.editCertNo ? 'Form updated successfully!' : 'Form submitted successfully!';
          console.log('Modal ref:', this.successModalRef);

          this.showSuccessModal();

          setTimeout(() => {
            this.welderForm.reset();
            this.imagePreview = null;
            localStorage.removeItem('editCertNo');
            localStorage.removeItem('createdBy');
          }, 1000); 
        },
        error: (error) => {
          console.error('Submission failed:', error);
          alert('Failed to submit form. Please try again.');
        }
      });

    } else {
      alert('Please fill out all required fields.');
    }
  }



  downloadAsPDF() {
    import('html2pdf.js').then(html2pdf => {
      const element = this.pdfContent.nativeElement;

      const opt = {
        margin: 0.5,
        filename: 'welder-qualification.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      html2pdf.default().from(element).set(opt).save();
    });
  }

  setFormDisabledRecursive(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.disable({ emitEvent: false });

      if (control instanceof FormGroup) {
        this.setFormDisabledRecursive(control);
      }
    });
  }


  fetchAndPatchForm(certNo: string): void {
    if (typeof certNo !== 'string') {
      console.error('Invalid certNo passed to fetchAndPatchForm:', certNo);
      return;
    }

    const url = `http://20.55.22.52:8081/api/reports/${certNo}`;
    this.http.get<any>(url).subscribe({
      next: (formData) => {
        console.log('Received data:', formData);

        const fallback = { selected: false, description: '', result: '' };
        formData.testsConducted = {
          bendTest: formData.testsConducted?.bendTest ?? fallback,
          radiography: formData.testsConducted?.radiography ?? fallback,
          ultrasonic: formData.testsConducted?.ultrasonic ?? fallback,
          macroEtch: formData.testsConducted?.macroEtch ?? fallback,
          fracture: formData.testsConducted?.fracture ?? fallback,
          other: formData.testsConducted?.other ?? fallback
        };

        this.welderForm.patchValue(formData);
        console.log('Form patched with data:', formData);

        if (this.reviewMode) {
          this.setFormDisabledRecursive(this.welderForm);
        } else {
          this.welderForm.get('certificateNo')?.disable();
          this.welderForm.get('testDate')?.disable();
        }
      },
      error: (err) => {
        console.error('Failed to load report data:', err);
        alert('Unable to load report. Please try again.');
      }
    });
  }

  submitReview(status: 'APPROVED' | 'REJECTED'): void {
    if (!this.remarks.trim()) {
      alert('Please enter remarks before submitting.');
      return;
    }

    const certificateNo = this.welderForm.get('certificateNo')?.value;
    const verifiedBy = localStorage.getItem('userName');
    const verifiedDate = new Date().toISOString().split('T')[0];

    if (!verifiedBy) {
      alert('Logged in user not found. Please log in again.');
      return;
    }

    const payload = {
      certificateNo: certificateNo,
      remarks: this.remarks,
      verifiedBy: verifiedBy,
      verifiedDate: verifiedDate
    };
    console.log('Submitting review with payload:', payload);

    const url = `http://20.55.22.52:8081/api/reports/form/${status === 'APPROVED' ? 'approve' : 'reject'}`;

    this.http.post(url, payload, { responseType: 'text' }).subscribe({
      next: (res) => {
        this.showSuccessModal();
        //alert(`Report ${status === 'APPROVED' ? 'approved' : 'rejected'} successfully.`);
        localStorage.removeItem('reviewCertNo');
        this.remarks = ''
      },
      error: (err) => {
        console.error('Failed to submit review:', err);
        alert('Failed to submit review. Please try again.');
      }
    });
  }
showSuccessModal(): void {
  if (this.isBrowser && this.successModalRef?.nativeElement) {
    console.log("✅ Modal element found:", this.successModalRef.nativeElement);
    import('bootstrap').then(({ Modal }) => {
      const modal = new Modal(this.successModalRef.nativeElement);
      modal.show();
    });
  } else {
    console.warn("⚠️ Modal element not available yet");
  }
}









 goToUserHome(): void {
  if (this.isBrowser) {
    window.location.href = '/home'; // 
  }
}


}


