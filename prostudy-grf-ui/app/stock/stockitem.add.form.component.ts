import { Component } from '@angular/core';
import { StockItem } from './stockitem.model';

@Component( {
    moduleId: module.id,
    selector: 'pro-stockitem-add-form',
    templateUrl: './stockitem.add.form.component.html',
    styleUrls: ['./input-form-example.css']
})
export class StockItemAddFormComponent  {
    model = new StockItem("", 0);
    submitted = false;
    onSubmit() { this.submitted = true; }
    newItem() {this.model = new StockItem("", 0);}
    // TODO: Remove this when we're done
    get diagnostic() { return JSON.stringify(this.model); }
}
