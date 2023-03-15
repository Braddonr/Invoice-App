import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { InvoiceDataService } from '../services/invoice-data.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  
  formData : any;
  validateForm!: UntypedFormGroup;
  

  constructor(private fb: UntypedFormBuilder, private invoiceData : InvoiceDataService) { }

  ngOnInit(): void {
    this.invoiceData.currentFormData.subscribe(res => {
      this.formData = res;
      console.log(this.formData);
      
    });
  }


  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }

}
}
