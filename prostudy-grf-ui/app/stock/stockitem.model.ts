import { Component } from '@angular/core';

export class StockItem {
    constructor(
        public itemName: string,
        public price: number,
        public unit?: string ) { }
}