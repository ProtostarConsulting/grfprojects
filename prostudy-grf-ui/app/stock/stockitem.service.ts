import { Injectable } from '@angular/core';
import { STOCKITEMS }     from './mock.stockitems.model';

@Injectable()
export class StockItemService {
  getStockItems() { return STOCKITEMS;  }
}