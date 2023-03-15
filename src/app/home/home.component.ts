import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InvoiceDataService } from '../services/invoice-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  invoiceForm!: FormGroup;


  constructor(
    private formBuilder: FormBuilder,
    private invoiceData : InvoiceDataService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.invoiceForm = this.formBuilder.group({
      sellerName:new FormControl('', [<any>Validators.required]),
      sellerAddress:new FormControl('', [<any>Validators.required]),
      sellerEmail:new FormControl('', [<any>Validators.required]),
      sellerPhoneNumber:new FormControl('', [<any>Validators.required]),
      buyerName:new FormControl('', [<any>Validators.required]),
      buyerAddress:new FormControl('', [<any>Validators.required]),
      buyerPhoneNumber:new FormControl('', [<any>Validators.required]),
      buyerEmail:new FormControl('', [<any>Validators.required]),
      paymentDueDate:new FormControl('', [<any>Validators.required]),
      items: this.formBuilder.array([this.createItem()])
    });
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      item: ['', Validators.required],
      quantity: [null, Validators.required],
      pricePerUnit: [null, Validators.required]
    });
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  submitForm(){
    this.invoiceData.updateFormData(this.invoiceForm.value);
    this.router.navigate(['/invoice']);
  }
}
