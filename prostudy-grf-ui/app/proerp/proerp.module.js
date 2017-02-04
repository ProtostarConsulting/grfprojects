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
var forms_1 = require('@angular/forms');
var feature_component_1 = require('./feature.component');
var ch1_component_1 = require('./ch1.component');
var ch2_component_1 = require('./ch2.component');
var proerp_routing_module_1 = require('./proerp-routing.module');
var ProERPModule = (function () {
    function ProERPModule() {
    }
    ProERPModule = __decorate([
        core_1.NgModule({
            imports: [forms_1.FormsModule, forms_1.FormsModule, proerp_routing_module_1.ProERPRoutingModule],
            declarations: [feature_component_1.ProERPComponent, ch1_component_1.Ch1Component, ch2_component_1.Ch2Component]
        }), 
        __metadata('design:paramtypes', [])
    ], ProERPModule);
    return ProERPModule;
}());
exports.ProERPModule = ProERPModule;
//# sourceMappingURL=proerp.module.js.map