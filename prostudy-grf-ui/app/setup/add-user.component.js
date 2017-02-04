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
var router_1 = require('@angular/router');
require('rxjs/add/operator/switchMap');
var AddUserComponent = (function () {
    function AddUserComponent(route, router) {
        this.route = route;
        this.router = router;
    }
    AddUserComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.switchMap(function (params) { return (params['id']); }).subscribe(function (id) {
            _this.id = id;
            console.log("this.id: " + _this.id);
        });
    };
    AddUserComponent = __decorate([
        core_1.Component({
            template: "<h2>ProERP Chapter 1</h2> received id is: {{id}}   \n    <p>You can post info and stories with Blogger. When you use\n        Blogger, make sure you comply with the Blogger Content Policy and\n        Terms of Service. Start using Blogger Make sure your browser uses\n        cookies. Turn Javascript on. Sign in to Blogger. Create a Blogger\n        profile or use your Google+ profile. Create a blog Sign in to Blogger.\n        In the top left, click the Down arrow Down Arrow. Click New blog. If\n        you haven\u2019t created a blog yet, in the bottom right, click Create new.\n        Enter a name for your blog. Choose a blog address, or URL. Choose a\n        template. Click Create blog. Change the name of your blog Sign in to\n        Blogger. In the left menu, click Settingsand thenBasic. Next to\n        \"Title,\" click Edit. Enter a new name for the blog. Click Save\n        changes. See how your blog looks To view your blog, go to the top left\n        and click View Blog. Change how your blog looks You can change the\n        design of your blog. Decide who can see or edit your blog You can\n        control who has access to your blog. Explore your blog You can use the\n        left menu to: View your posts, pages, comments, and statistics. Manage\n        earnings, campaigns, and more. Get Blogger updates To get feature\n        announcements, advice, and other info, sign up for email updates: Sign\n        in to Blogger. In the left menu, click Settingsand thenUser settings.\n        Under \"Email Notifications,\" next to \"Feature Announcements,\" choose\n        \"Yes.\" In the top right, click Save settings. Troubleshoot issues</p>"
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, router_1.Router])
    ], AddUserComponent);
    return AddUserComponent;
}());
exports.AddUserComponent = AddUserComponent;
//# sourceMappingURL=add-user.component.js.map