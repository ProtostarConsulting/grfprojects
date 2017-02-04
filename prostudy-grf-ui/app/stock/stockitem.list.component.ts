import { Component } from '@angular/core';
import { StockItem } from './stockitem.model';
import { StockItemService } from './stockitem.service';

/*export class StockItem {
    constructor(
        public itemName: string,
        public price: number,
        public unit: string ) { }
}
*/
@Component( {
    selector: 'pro-stockitem-list',
    providers: [StockItemService],
    template: `<h2>List of Fruits</h2>
   <ul>
      <li *ngFor="let myItem of itemList">
          <span *ngIf="myItem.price > 100" (click)="selectItem(myItem)">{{myItem.itemName}} - {{myItem.price | currency:'USD':true}} per {{myItem.unit}}</span>
      </li>
   </ul>
    <br>
    <button class="btn btn-default" (click)="addItem()"> Add New </button>    
    <br>
    <span *ngIf="selectedItem"> Selected item is: {{selectedItem.itemName}} 
       <pro-stockitem-add-form> </pro-stockitem-add-form>
    </span>
   `
})
export class StockItemListComponent {
    /* public itemList = [new StockItem( "Mango", 560, "kg" ),
     { itemName: "Apple", price: 170, unit: "kg" },
     { itemName: "Orange", price: 75, unit: "kg" },
     { itemName: "Grapes", price: 120, unit: "kg" }
     ];*/

   
    constructor( stockItemService: StockItemService ) {
        this.itemList = stockItemService.getStockItems();
    }

    public itemList : StockItem[];
    public selectedItem: StockItem;

    public selectItem( selectedItem: StockItem ) {
        this.selectedItem = selectedItem;
    }

    public addItem() {
        this.selectedItem = new StockItem( "", 0 );
    }
    public addItemConfirm() {
        this.itemList.push( this.selectedItem );
    }
    public updateItem() {
    }
}