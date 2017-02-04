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
var StockItemAddFormComponent = (function () {
    function StockItemAddFormComponent() {
        this.model = new stockitem_model_1.StockItem("", 0);
        this.submitted = false;
    }
    StockItemAddFormComponent.prototype.onSubmit = function () { this.submitted = true; };
    StockItemAddFormComponent.prototype.newItem = function () { this.model = new stockitem_model_1.StockItem("", 0); };
    Object.defineProperty(StockItemAddFormComponent.prototype, "diagnostic", {
        // TODO: Remove this when we're done
        get: function () { return JSON.stringify(this.model); },
        enumerable: true,
        configurable: true
    });
    StockItemAddFormComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'pro-stockitem-add-form',
            templateUrl: './stockitem.add.form.component.html',
            styleUrls: ['./input-form-example.css']
        }), 
        __metadata('design:paramtypes', [])
    ], StockItemAddFormComponent);
    return StockItemAddFormComponent;
}());
exports.StockItemAddFormComponent = StockItemAddFormComponent;
//# sourceMappingURL=stockitem.add.form.component.js.map