import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceDataService {

  private formData = new BehaviorSubject<any>({});
  currentFormData = this.formData.asObservable();

  constructor() { }

  updateFormData(formData: any) {
    this.formData.next(formData);
  }

}
