var app = angular.module('StarterApp', ['ngMaterial', 'ngMdIcons']);

app.controller('AppCtrl', ['$scope', '$mdBottomSheet','$mdSidenav', '$mdDialog', function($scope, $mdBottomSheet, $mdSidenav, $mdDialog){
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  

  };
  
  $scope.alert = '';
  $scope.showListBottomSheet = function($event) {
    $scope.alert = '';
    $mdBottomSheet.show({
      template: '<md-bottom-sheet class="md-list md-has-header"> <md-subheader>Settings</md-subheader> <md-list> <md-item ng-repeat="item in items"><md-item-content md-ink-ripple flex class="inset"> <a flex aria-label="{{item.name}}" ng-click="listItemClick($index)"> <span class="md-inline-list-icon-label">{{ item.name }}</span> </a></md-item-content> </md-item> </md-list></md-bottom-sheet>',
      controller: 'ListBottomSheetCtrl',
      targetEvent: $event
    }).then(function(clickedItem) {
      $scope.alert = clickedItem.name + ' clicked!';
    });
  };
  
  $scope.showAdd = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      template: '<md-dialog aria-label="Mango (Fruit)"> <md-content class="md-padding"> <form name="userForm"> <div><centre><h1><b>Contact Us Form</b></h1></centre><p>Enter your request details below and submit. We will get back to you within 3 business days.</p></div><div layout layout-sm="column"><md-input-container flex> <label>First Name</label> <input ng-model="user.firstName" placeholder="Placeholder text"> </md-input-container></div> <div layout layout-sm="column"><md-input-container flex> <label>Last Name</label> <input ng-model="theMax"> </md-input-container> </div><div layout layout-sm="column"> <md-input-container flex> <label>Contact no.</label> <input ng-model="user.contactno" placeholder="Placeholder text"> </md-input-container></div> <md-input-container flex> <label>Message</label> <textarea ng-model="user.message" columns="1" md-maxlength="150"></textarea> </md-input-container> </form> </md-content> <div class="md-actions" layout="row"> <span flex></span> <md-button ng-click="answer(\'not useful\')"> Cancel </md-button> <md-button ng-click="answer(\'useful\')" class="md-primary"> Save </md-button> </div></md-dialog>',
      targetEvent: ev,
    })
    .then(function(answer) {
      $scope.alert = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.alert = 'You cancelled the dialog.';
    });
  };
  
  
  
  $scope.showReseller = function(ev) {
	    $mdDialog.show({
	      controller: DialogController,
	      template: '<md-dialog aria-label="Mango (Fruit)"> <md-content class="md-padding"> <form name="ResellerForm"> <div><centre><h1><b>ResellerApply</b></h1></centre><p>Fill the following details and submit. We will get back to you in 3 business day. </p></div><div layout layout-sm="column"><md-input-container flex> <label>Firm or Individual Full Name</label> <input ng-model="user.name" placeholder="Placeholder text"> </md-input-container></div> <div layout layout-sm="column"><md-input-container flex> <label>Firm Address/Location</label> <input ng-model="theMax"> </md-input-container> </div> <div layout layout-sm="column"> <md-input-container flex> <label>Contact No1 </label> <input ng-model="user.contactno1" placeholder="Placeholder text"> </md-input-container></div> <md-input-container flex> <label>Contact No2</label> <input ng-model="user.contactno2" placeholder="Placeholder text"></md-input-container> <md-input-container flex> <label>Email Address</label> <input ng-model="user.mail" placeholder="Placeholder text"></md-input-container> <md-input-container flex> <label>Brief information about firm/individual</label> <textarea ng-model="user.info" columns="1" md-maxlength="150"></textarea> </md-input-container> </form> </md-content> <div class="md-actions" layout="row"> <span flex></span> <md-button ng-click="answer(\'useful\')" class="md-primary"> Submit </md-button> </div></md-dialog>',
	      targetEvent: ev,
	    })
	    .then(function(answer) {
	      $scope.alert = 'You said the information was "' + answer + '".';
	    }, function() {
	      $scope.alert = 'You cancelled the dialog.';
	    });
	  };
}]);

app.controller('ListBottomSheetCtrl', function($scope, $mdBottomSheet) {
  $scope.items = [
    { name: 'Share', icon: 'share' },
    { name: 'Upload', icon: 'upload' },
    { name: 'Copy', icon: 'copy' },
    { name: 'Print this page', icon: 'print' },
  ];
  
  $scope.listItemClick = function($index) {
    var clickedItem = $scope.items[$index];
    $mdBottomSheet.hide(clickedItem);
  };
});

function DialogController($scope, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
};
app.config(function($mdThemingProvider) {
  var customBlueMap = 		$mdThemingProvider.extendPalette('grey', {
    'contrastDefaultColor': 'dark',
    'contrastDarkColors': ['50'],
    '50': 'ffffff'
  });
  $mdThemingProvider.definePalette('grey', customBlueMap);
  $mdThemingProvider.theme('default')
    .primaryPalette('grey', {
      'default': '500',
      'hue-1': '50'
    })
    .accentPalette('pink');
  $mdThemingProvider.theme('input', 'default')
        .primaryPalette('grey')
});
