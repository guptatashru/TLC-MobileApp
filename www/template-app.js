angular.module('templates-app', [
    "login/urls",
    "templates/directives/loginPage/loginPage-loginMenu.html",
 
    "templates/directives/patientSearchPage/patientSearchPage-selectPatient.html",
    "templates/directives/patientSearchPage/filterType-datePicker.html",
    
   
    "templates/dialogs"
]);

angular.module("login/urls", []).run(["$rootScope", "$http", function ($rootScope, $http) {
    $http.get("src/common/source/urlSources.json")
        .success(function (data, status, headers, config) {
           
            $rootScope.urlTemplate = data;
           
        })
    .error(function (data, status, headers, config) {
        console.log("error Loading data");
    });
}]);

angular.module("templates/partials", []).run(["$templateCache", "$http", function ($templateCache, $http) {
    $http.get('templates/partials/landingPage.html', { cache: $templateCache });
    $http.get('templates/partials/login.html', { cache: $templateCache });
    $http.get('templates/partials/patientDetails.html', { cache: $templateCache });
    $http.get('templates/partials/patientSearch.html', { cache: $templateCache });
  
}]);
angular.module("templates/directives/loginPage/loginPage-loginMenu.html", []).run(["$templateCache", "$http", function ($templateCache, $http) {
    $http.get('templates/directives/loginPage/loginPage-loginMenu.html', { cache: $templateCache });
}]);

angular.module("templates/directives/patientSearchPage/patientSearchPage-selectPatient.html", []).run(["$templateCache", "$http", function ($templateCache, $http) {
    $http.get('templates/directives/patientSearchPage/patientSearchPage-selectPatient.html', { cache: $templateCache });
}]);
angular.module("templates/directives/patientSearchPage/filterType-datePicker.html", []).run(["$templateCache", "$http", function ($templateCache, $http) {
    $http.get('templates/directives/patientSearchPage/filterType-datePicker.html', { cache: $templateCache });
}]);



angular.module("templates/dialogs", []).run(["$templateCache", "$http", function ($templateCache, $http) {
    $http.get('templates/dialogs/datePicker.html', { cache: $templateCache });
  
}]);