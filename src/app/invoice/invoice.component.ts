import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { InvoiceDataService } from '../services/invoice-data.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import html2canvas from 'html2canvas';


(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

//define interfaces here
interface Item {
  name: string;
  quantity: number;
  pricePerUnit: number;
}

interface ItemWithTotal extends Item {
  total: number;
}

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})

export class InvoiceComponent implements OnInit {

  @ViewChild('myElement', { static: true }) myElementRef!: ElementRef;
  
  formData : any;
  validateForm!: UntypedFormGroup;
  data: any;
  items: Item[] = [];
  subTotal: number = 0;
  grandTotal: number = 0;
  taxes: number = 0;
  discount: number = 0;
  invoiceNo: number = 0;
  todayDate: string = '';
  

  constructor(private fb: UntypedFormBuilder, private invoiceData : InvoiceDataService) { }


  ngOnInit(): void {
    this.invoiceData.currentFormData.subscribe(res => {
      this.formData = res;
      console.log(this.formData);
      console.log(this.formData.items);
      this.items = this.formData.items; 
      

    });

    //calculate totals
    this.data = this.calculateTotals(this.items)
    console.log(this.data);
    this.calculateSubTotal(this.data);
    this.calculateGrandTotal();

    //generate random number for invoice
    this.invoiceNo = this.invoiceNumber(1000, 19999);
    console.log(this.invoiceNo);

    //generate today's date
    this.todayDate = this.getTodayDate();
    console.log(this.todayDate);
    
  }

  // ngAfterViewInit() {
  //   const element = this.myElementRef.nativeElement;
  //   console.log(element);
  // }

  calculateTotals(items: Item[]): ItemWithTotal[] {
    const result: ItemWithTotal[] = [];
  
    for (const item of items) {
      const total = item.quantity * item.pricePerUnit;
      result.push({ ...item, total });
    }
  
    return result;
  }

  calculateSubTotal(items: ItemWithTotal[]): number{

  for (const item of items) {
    this.subTotal += item.total;
  }
  console.log(this.subTotal);
  return this.subTotal;
  }

  calculateGrandTotal(){
   this.grandTotal = this.subTotal + this.taxes - this.discount
   console.log(this.grandTotal);
   
  }

  invoiceNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getTodayDate(): string {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const year = today.getFullYear().toString();
    return `${month}/${day}/${year}`;
  }

  downloadPDF(){
    // Get the div to include in the PDF
    const pdfContent = document.getElementById('pdf-content')!;
    console.log(pdfContent);
    

    html2canvas(pdfContent).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const docDefinition = {
        content: [
          {
            image: imgData,
            width: 550
          },
        ],
      };
      pdfMake.createPdf(docDefinition).download('INVOICE.pdf');
      // pdfMake.createPdf(docDefinition).open();
    });
  }
}
