var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

//script paths
var jsFiles = 'src/main/webapp/app/**/js/*.js';
//var jsFiles = 'src/main/webapp/app.ctr.js';
var jsDest = 'dist';

gulp.task('build', function() {
    return gulp.src(jsFiles)
		.pipe( uglify({ mangle: {reserved: ['$scope',
						'$rootScope', '$window', '$log', '$q', '$filter', '$timeout', '$mdToast', '$mdSidenav', '$mdUtil', '$mdDialog', '$state', '$stateParams',
						'$http', '$location', '$anchorScroll', '$cacheFactory', '$mdDateLocaleProvider', '$stateProvider', '$urlRouterProvider', '$logProvider', '$mdThemingProvider', '$mdMedia', '$mdBottomSheet', '$routeParams', '$mdColors', '$mdpDatePicker', '$mdpTimePicker',
						'$localStorage', 'noDataErrorMsg', 'salutationList',
						'ajsCache', 'Upload','monthList', 'CalcService', 'objectFactory', 'appEndpointSF', 'tableTestDataFactory',
						'localDBServiceFactory', 'objectFactoryFn', 'googleEndpointSF', 'AutoCompleteUIService', 'AddressAutoCompleteService', 'UserServiceFactory', 'StockServiceFactory', 'ProductionServiceFactory', 'TaskServiceFactory', 'TaxServiceFactory', 'ProadminServiceFactory', 'HRServiceFactory', 'InvoiceServiceFactory', 'CustomerServiceFactory', 'SupplierServiceFactory', 'WarehouseManagementServiceFactory', 'ProjectsServiceFactory', 'VisitorServiceFactory','AuditManagementFactory', 'MachineMaintenanceServiceFactory', 'WebsiteMasterFactory', 'SurveyServiceFactory', 'UtilServiceFactory', 'SiteServiceFactory', 'ScmFactory', 'OrderServiceFactory', 'LocalUtilService', 'BrowserAsyncCacheService', 'cropsData'
					]} }) )
        .pipe(concat('proerp.min.js'))
        .pipe(gulp.dest(jsDest));
});