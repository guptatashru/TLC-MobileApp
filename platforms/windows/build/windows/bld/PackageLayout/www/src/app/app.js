function onBackKeyDown(event) {
    var appElement = document.querySelector('[ng-app=app]');
    if (appElement) {
        event.preventDefault();
        event.stopPropagation();
        var appScope = angular.element(appElement).scope();
        var controllerScope = appScope.$$childHead;
        controllerScope.hardwareBackButtonClicked();
    }
}

$.ajaxPrefilter(function (options, originalOptions, jqXHR) {
    options.async = true;
});
var onDeviceReady = function () {
    
    if (cordova.file === undefined) {
        // WP8
        if (device.platform === "Win32NT") {
            cordova.file = {
                dataDirectory: '///'
            }
        } else
            // Windows 8
            if (device.platform === "windows") {
                cordova.file = {
                    dataDirectory: 'ms-appdata:///local/'
                }
            }
    }
    function gotFS(fileSystem) {
        fileSystem.root.getDirectory("/pdfs", { create: true }, function (dirEntry) {
           
        });
    }
   
    var appElement = document.querySelector('[ng-app=app]');
    var appScope = angular.element(appElement).scope();
    var myCypherkey = localStorage.getItem("cypherKey");
    if (myCypherkey != undefined && myCypherkey != "")
    {
        var cypherKey = CryptoJS.AES.decrypt(myCypherkey, "telehealthcare").toString(CryptoJS.enc.Utf8)
       appScope.db = window.sqlitePlugin.openDatabase({ name: "teleHealthDetails.db", key: cypherKey, location: 1 });
        if(localStorage.getItem("ngStorage-lastDbSync") != null)
        {
            var currentDateTime = new Date();
            var lastSync = new Date(localStorage.getItem("ngStorage-lastDbSync"));
            if (Math.abs((currentDateTime - lastSync) / 86400000) > 1) {
               
            }
        }
    }
    document.addEventListener("backbutton", onBackKeyDown, false);
    
}

document.addEventListener("deviceready", onDeviceReady, false);
//

var app = angular.module('app', [                           //defining(CREATING) angular js application module  named "app" with dependencies(which modlue depends on)
'templates-app',
"ui.router",
'ui.bootstrap',
'dialogs.main',
//'dialogs',
'ngCordova',
'ngPDFViewer',
'mn',
'app.directives.loginPage.loginMenu',

'app.directives.patientSearchPage.selectPatient',


'app.directives.popover',
'app.directives.numbersOnly',
'app.directives.lettersOnly',
'angular-websql',
'angular-svg-round-progress',
'ngIdle',
'ngScrollEvent',
'highcharts-ng',
'ngStorage',
'services.urlHitService',
'services.sqlCytherDb',
'services.windowsFileDownload',
'services.pdfSaverService'

]);

app.run(['$window', function ($window) {
    FastClick.attach(angular.element($window.document.body)[0]);
}]);

app.config(['$urlRouterProvider', '$stateProvider', '$httpProvider', 'KeepaliveProvider', 'IdleProvider', function ($urlRouterProvider, $stateProvider, $httpProvider, KeepaliveProvider, IdleProvider) {

    IdleProvider.idle(7200);
    IdleProvider.timeout(7200);
    KeepaliveProvider.interval(14400);

    $urlRouterProvider.otherwise('/');                                                //for any unmatched url ,redirect to /
    $stateProvider

    .state('login', {                                                     //setting up different states in module config
        url: '/',
        templateUrl: 'templates/partials/login.html',
        controller: 'loginCtrl'
    })

    .state('patientSearch',{
        url: '/patientSearch',
            templateUrl: 'templates/partials/patientSearch.html',
            controller: 'patientSearchCtrl',
            params: {
                patientDetailsObject: {
                    patientBasicData:{
                        "siteID":null,
                        "residentID":null,
                        "IDNumber": null,
                        "age":null
                    },
                    patientAllergyData: {
                        "allergiesList": null,
                        "lastUpdateTime":null
                    },
                    patientMedicationData: null,
                    patientConsultationData: null,
                    patientObservationData: null,
                    patientObservationDataValues:[],
                    patientDemographicsData:null,
                    patientMedicalHistoryData:null,
                    patientLabData: null,
                    patientLabDataValues:[],
                    //patientLabDataValues: {
                    //    "sequence":"",
                    //    "actionStatus": "",
                    //    "status": "",
                    //    "MRN": "",
                    //    "KUB": "",
                    //    "sampleType": "",
                    //    "clinicalObservations": "",
                    //    "radiologyNumber": "",
                    //    "resultsFlag": "",
                    //    "HGB": {
                           
                    //    },
                    //    "Hematocrit": {


                    //    },
                    //    "RBC": {

                    //    },
                    //    "WBC": {

                    //    },
                    //    "Basophils": {

                    //    },
                    //    "Eosinophils": {

                    //    },
                    //    "Segmenters": {

                    //    },
                    //    "Lymphocytes": {

                    //    },
                    //    "Monocytes": {

                    //    },
                    //    "plateletCount": {

                    //    },
                    //    "MCV": {

                    //    },
                    //    "MCH": {

                    //    },
                    //    "MCHC": {

                    //    },
                    //    "RDW": {

                    //    }

                    //},
                    patientChartTypes: null,
                   
                    patientChartValues: {
                      
                   
                        "BLOOD_PRESSURE": {
                            "data": [],
                            "XAxisnames": []
                        },
                        "PULSE": {
                            "data": [],
                            "XAxisnames": []
                        },
                        "OXYGEN_SATURATION": {
                            "data": [],
                            "XAxisnames": []
                        },
                        "TEMPERATURE": {
                            "data": [],
                            "XAxisnames": []
                        },
                        "HEIGHT": {
                            "data": [],
                            "XAxisnames": []
                        },
                        "WEIGHT": {
                            "data": [],
                            "XAxisnames": []
                        },
                        "RESPIRATION": {
                            "data": [],
                            "XAxisnames": []
                        },
                        "PAIN_SCORE": {
                            "data": [],
                            "XAxisnames": []
                        },
                        "INR": {
                            "data": [],
                            "XAxisnames": []
                        },
                        "ECG": {
                            "data": [],
                            "XAxisnames": []

                        },
                        "SPIROMETER": {
                            "data": [],
                            "XAxisnames": []
                        },
                        "BMI": {
                            "data": [],
                            "XAxisnames": []
                        }
    
                    },
                    patientTimelineVal: {
                        timelineData:null,
                        width:null
                    },
                    

                },
                patientSearchResults:[]
            }
    })

   
    .state('landingPage', {
        url: '/landingPage',
        templateUrl: 'templates/partials/landingPage.html',
        controller: 'landingPageCtrl'
    })

    .state('pdfViewerPage', {
        url: '/pdfViewerPage',
        templateUrl: 'templates/partials/pdfViewer.html',
        controller: 'pdfPageCtrl',
        params: {
            
            patientListData: {
                tabSelection: "id",
                setNumber: 0,
                dataLoaded: 0,
                dataToBeLoaded: 0,
                statusText: "No patient loaded",
                patient: {
                    dob: new Date(),
                    filterText: "",
                    gender: "Gender"
                },
                data: [],
                dataApointments: []
            },
            document: {
                "documentID": null,
                "documentName": null,
                "documentMimeType": null,
                "documentCategory": null,
                "documentURL": "20-03-2015_19.03.53_1.pdf",
                "patientID": null,
                "documentUploadDate": null
            },
            patientDetailsObject: null
        }
    })
         .state('patientDetails', {
             params: {
                 patientSearchResults: [],
                 tabActive:"",
                 subTab:""
             },
             url: '/patientDetails',
    templateUrl: 'templates/partials/patientDetails.html',
    controller: 'patientDetailsCtrl'
         })
   
    .state('tabSelection', {
        url: '/patientDetails/tabSelection',
        templateUrl: 'templates/directives/patientDetailsPage/mobileTabContents/tabSelection.html',
        controller: 'tabSelectionController'
    })
      .state('pdfViewerState', {
          url: '/pdfViewerPage',
          templateUrl: 'templates/partials/pdfViewerPage.html',
          controller: 'pdfViewerController',
          params: {
              patientSearchResults: [],
              patientDetailsObject: null,
              document:null,
              tabActive:"",
              subTab:""
    }
          
      })
}]);


