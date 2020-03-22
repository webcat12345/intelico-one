import { Injectable } from '@angular/core';

import { ApiService } from '../interceptors/api.service';

export interface IProduct {
  id: number;
  tenantKey?: string;
  name: string;
  description?: string;
}

export interface IProductList {
  data: IProduct[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService extends ApiService {

}
