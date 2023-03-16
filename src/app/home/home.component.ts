import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InvoiceDataService } from '../services/invoice-data.service';
import { getISOWeek } from 'date-fns';
import { en_US, NzI18nService, zh_CN } from 'ng-zorro-antd/i18n';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  invoiceForm!: FormGroup;
  date = null;
  isEnglish = false;

  constructor(
    private formBuilder: FormBuilder,
    private invoiceData : InvoiceDataService,
    private router: Router,
    private i18n: NzI18nService
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
    this.i18n.setLocale(en_US);
  }

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

  
  changeLanguage(): void {
    this.i18n.setLocale(this.isEnglish ? zh_CN : en_US);
    this.isEnglish = !this.isEnglish;
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
