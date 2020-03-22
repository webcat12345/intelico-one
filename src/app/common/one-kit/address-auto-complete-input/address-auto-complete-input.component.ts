import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'one-admin-address-auto-complete-input',
  templateUrl: './address-auto-complete-input.component.html',
  styleUrls: ['./address-auto-complete-input.component.scss']
})
export class AddressAutoCompleteInputComponent implements OnInit {

  @Input() postalCode: string;
  @Input() address: string;
  @Output() addressChange: EventEmitter<{ data: any, address: string }> = new EventEmitter<{ data: any, address: string }>();

  constructor(
    private http: HttpClient
  ) {
  }

  ngOnInit() {
  }

  myListFormatter(item: any): string {
    return `${item.line_1 ? item.line_1 + ', ' : ''}${item.line_2 ? item.line_2 + ', ' : ''} ${item.district}, ${item.ward}, ${item.county}, United Kingdom, ${item.postcode}`;
  }

  myValueFormatter(item: any): string {
    return `${item.postcode}`;
  }

  addToAddrs(e) {
    if (e.postcode) {
      this.address = `${e.line_1 ? e.line_1 + ', ' : ''}${e.line_2 ? e.line_2 + ', ' : ''} ${e.district}, ${e.ward}, ${e.county}, United Kingdom, ${e.postcode}`;
      this.addressChange.emit({data: e, address: this.address});
    }
  }

  observableSource = (keyword: string): Observable<string[]> => {
    if (keyword) {
      return this.http.get(`${environment.idealPostalCode.baseUrl}/${this.postalCode}?api_key=${environment.idealPostalCode.apiKey}`)
        // return of(result)
        .pipe(
          map((res: any) => res.result.map(item => {
            // return `${item.line_1} ${item.line_2} ${item.ward} ${item.county} United Kingdom ${item.postcode}`;
            return item;
          })),
          catchError(error => {
            return of([]);
          })
        );
    } else {
      return of([]);
    }
  }

}
