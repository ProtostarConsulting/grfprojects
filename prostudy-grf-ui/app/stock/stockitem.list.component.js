"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var stockitem_model_1 = require('./stockitem.model');
var stockitem_service_1 = require('./stockitem.service');
/*export class StockItem {
    constructor(
        public itemName: string,
        public price: number,
        public unit: string ) { }
}
*/
var StockItemListComponent = (function () {
    /* public itemList = [new StockItem( "Mango", 560, "kg" ),
     { itemName: "Apple", price: 170, unit: "kg" },
     { itemName: "Orange", price: 75, unit: "kg" },
     { itemName: "Grapes", price: 120, unit: "kg" }
     ];*/
    function StockItemListComponent(stockItemService) {
        this.itemList = stockItemService.getStockItems();
    }
    StockItemListComponent.prototype.selectItem = function (selectedItem) {
        this.selectedItem = selectedItem;
    };
    StockItemListComponent.prototype.addItem = function () {
        this.selectedItem = new stockitem_model_1.StockItem("", 0);
    };
    StockItemListComponent.prototype.addItemConfirm = function () {
        this.itemList.push(this.selectedItem);
    };
    StockItemListComponent.prototype.updateItem = function () {
    };
    StockItemListComponent = __decorate([
        core_1.Component({
            selector: 'pro-stockitem-list',
            providers: [stockitem_service_1.StockItemService],
            template: "<h2>List of Fruits</h2>\n   <ul>\n      <li *ngFor=\"let myItem of itemList\">\n          <span *ngIf=\"myItem.price > 100\" (click)=\"selectItem(myItem)\">{{myItem.itemName}} - {{myItem.price | currency:'USD':true}} per {{myItem.unit}}</span>\n      </li>\n   </ul>\n    <br>\n    <button class=\"btn btn-default\" (click)=\"addItem()\"> Add New </button>    \n    <br>\n    <span *ngIf=\"selectedItem\"> Selected item is: {{selectedItem.itemName}} \n       <pro-stockitem-add-form> </pro-stockitem-add-form>\n    </span>\n   "
        }), 
        __metadata('design:paramtypes', [stockitem_service_1.StockItemService])
    ], StockItemListComponent);
    return StockItemListComponent;
}());
exports.StockItemListComponent = StockItemListComponent;
//# sourceMappingURL=stockitem.list.component.js.map