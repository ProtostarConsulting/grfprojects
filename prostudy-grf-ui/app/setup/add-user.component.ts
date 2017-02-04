import { Component, Optional, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

@Component( {
    template: `<h2>Add User</h2> received id is: {{id}}   
    <p>You can post info and stories with Blogger. When you use
        Blogger, make sure you comply with the Blogger Content Policy and
        Terms of Service. Start using Blogger Make sure your browser uses
        cookies. Turn Javascript on. Sign in to Blogger. Create a Blogger
        profile or use your Google+ profile. Create a blog Sign in to Blogger.
        In the top left, click the Down arrow Down Arrow. Click New blog. If
        you haven’t created a blog yet, in the bottom right, click Create new.
        Enter a name for your blog. Choose a blog address, or URL. Choose a
        template. Click Create blog. Change the name of your blog Sign in to
        Blogger. In the left menu, click Settingsand thenBasic. Next to
        "Title," click Edit. Enter a new name for the blog. Click Save
        changes. See how your blog looks To view your blog, go to the top left
        and click View Blog. Change how your blog looks You can change the
        design of your blog. Decide who can see or edit your blog You can
        control who has access to your blog. Explore your blog You can use the
        left menu to: View your posts, pages, comments, and statistics. Manage
        earnings, campaigns, and more. Get Blogger updates To get feature
        announcements, advice, and other info, sign up for email updates: Sign
        in to Blogger. In the left menu, click Settingsand thenUser settings.
        Under "Email Notifications," next to "Feature Announcements," choose
        "Yes." In the top right, click Save settings. Troubleshoot issues</p>`
})
export class AddUserComponent implements OnInit {
    id: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {    
        this.route.params.switchMap(( params: Params ) => ( params['id'] ) ).subscribe(( id: string ) => {
            this.id = id;
            console.log("this.id: " + this.id)});
    }

}
