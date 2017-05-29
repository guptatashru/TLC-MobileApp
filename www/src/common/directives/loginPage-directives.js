


angular.module('app.directives.loginPage.loginMenu', [])
    .directive('loginMenu', function () {
        return {
            restrict: 'EA',
            scope: {
                
            },
            templateUrl: 'templates/directives/loginPage/loginPage-loginMenu.html',
            controller: 'loginMenuCtrl'
        }
    });

