import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ManagementImportService } from './management-import-service';
import { Subscription } from 'rxjs';
import { ToastsManager, ToastOptions, Toast } from 'ng2-toastr/ng2-toastr';



@Component({
  selector: 'app-management-import',
  templateUrl: './management-import.component.html',
  styleUrls: ['./management-import.component.css'],
  providers: [ManagementImportService]
})

export class ManagementImportComponent implements OnInit {
  private errorMessage: string;
  public file: File;
  private fileName: string;
  private busy: Subscription;
  private response: string[] = [];
  private options: ToastOptions = new ToastOptions();


  constructor(public toastr: ToastsManager, vcr: ViewContainerRef, private ManagementImportService: ManagementImportService) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.options.positionClass = 'toast-bottom-left';
  }

  changeListener(fileInput: any) {
    this.file = fileInput.target;
    this.fileName = fileInput.target.files[0].name;
  }

  showSuccess() {
    this.toastr.container = null;
    this.toastr.success('Successfully inserted all data!', 'Success!')
    .then((toast: Toast) => {
        setTimeout(() => {
            this.toastr.dismissToast(toast);
        }, 10000);
    });
  }

  showError() {
    this.toastr.container = null;
    this.toastr.error('Data not submitted. Please check file and try again', 'Unable to import');
  }


  SubmitBulkInsert(filePath) {
    this.busy = this.ManagementImportService.BulkInsert(this.file)
      .subscribe (
        response => this.response = response,
        error => { this.errorMessage = <any>error; this.showError(); },
        () => this.showSuccess()
    );
  }
}
