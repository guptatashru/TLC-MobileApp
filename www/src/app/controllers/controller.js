

app.controller('loginCtrl', ['$scope', '$http', '$location', '$state', 'dialogs', '$rootScope', function ($scope, $http, $location, $state, dialogs, $rootScope) {

    $scope.hardwareBackButtonClicked = function () {
        navigator.app.exitApp();
    }
    $scope.loaderGifClass = { display: "none" };

}]);


app.controller('landingPageCtrl', function ($scope, $http, $location, $state, Idle, Keepalive) {

    $scope.$on('IdleStart', function () {
        console.log("idle start");
    });

    $scope.$on('IdleEnd', function () {
        console.log("idle End");
    });

    $scope.$on('IdleTimeout', function () {

        $state.go('login');
    });

    $scope.start = function () {
        Idle.watch();
        $scope.started = true;
    };

    $scope.stop = function () {
        Idle.unwatch();
        $scope.started = false;

    };

    $scope.start();
});

app.controller('loginMenuCtrl', ['$scope', '$http', '$state', '$rootScope', '$localStorage', '$interval', '$location', 'dialogs', function ($scope, $http, $state, $rootScope, $localStorage, $interval, $location, dialogs) {
   
    
   // console.log("navigator.online " + onlineStatus);
    $scope.loginMessage = "Please login to get started.";

    $scope.createUrls = function () {

        $rootScope.urls = {};

        for (var i in $rootScope.urlTemplate.url) {

            $rootScope.urls[i] = $rootScope.urlTemplate.servers["Server"] + $rootScope.urlTemplate.url[i];

        }
    }

    $scope.createUrls();
    delete $localStorage.loginUrl;
    $scope.$storage = $localStorage.$default({

        userName: "",
        passWord: "",
        cypherKey: ""
    });

    $scope.loginMessageStyleClass = {
        "color": "black"


    };

   // $scope.password = CryptoJS.AES.decrypt($scope.$storage.passWord, "telehealthcare").toString(CryptoJS.enc.Utf8);
    $scope.username = $scope.$storage.userName;

    $scope.buttonText = "Sign In";
    $scope.loginButtonDisabled = false;

    $scope.keyDownEvent = function (e) {

        if (e.keyCode == 13) {

            if (!$scope.loginButtonDisabled)
                $scope.onLoginClicked();
        }
    }


    $scope.onLoginClicked = function () {
        var onlineStatus = navigator.onLine ? "ONLINE" : "OFFLINE";
        if (onlineStatus == "OFFLINE") {
            $scope.loginMessage = "Please connect to internet.";
            $scope.loginMessageStyleClass.color = "red";
        }
        else {
            if ($scope.username == "phildemo" && $scope.password == "phildemo123") {

               // $scope.$storage.passWord = CryptoJS.AES.encrypt($scope.password, "telehealthcare").toString();
                $scope.$storage.userName = $scope.username;
                $scope.buttonText = "LOGGED IN";
                $state.go('patientSearch');

            }
            else if ($scope.username == "" || $scope.password == "") {
                $scope.loginMessage = "Please enter the credentials.";
                $scope.loginMessageStyleClass.color = "red";
            }

            else if ($scope.username != "phildemo" || $scope.password != "phildemo123") {

                $scope.loginMessage = " Invalid Username or Password.";
                $scope.loginMessageStyleClass.color = "red";

            }
        }
        //else if ($scope.username != "phildemo" && $scope.password != "phildemo123") {
        //    $scope.loginMessage = " Invalid Username and Password.";
        //    $scope.loginMessageStyleClass.color = "red";

        //}
        

    }
}]);


app.controller('patientSearchCtrl', function ($scope, $http, $location, $filter, $state, Idle, Keepalive, $rootScope, $localStorage, dialogs, $stateParams, $q) {

    $scope.loaderGifClass = { "display": "none" };

    var menuflag = 0;
    $scope.menuSearchBtnStyle = { "background-color": "#2F434E" };
    $scope.menuOpen = function () {

        if (menuflag == 0) {
            angular.element(document.querySelector('.main-nav')).addClass('openSideBar');
            angular.element(document.querySelector('.patientSearchPagePageHeader')).addClass('movePatientSearchScreen');
            angular.element(document.querySelector('.searchPatientPageBody')).addClass('movePatientSearchScreen');
            angular.element(document.querySelector('.patientSearchPageFooter')).addClass('movePatientSearchScreen');
            menuflag = 1;
        }
        else {
            angular.element(document.querySelector('.main-nav')).removeClass('openSideBar');
            angular.element(document.querySelector('.patientSearchPagePageHeader')).removeClass('movePatientSearchScreen');
            angular.element(document.querySelector('.searchPatientPageBody')).removeClass('movePatientSearchScreen');
            angular.element(document.querySelector('.patientSearchPageFooter')).removeClass('movePatientSearchScreen');
            menuflag = 0;
        }


    }


    $scope.hardwareBackButtonClicked = function () {

        $scope.logoutClicked();
    }

    $scope.logoutUrl = $rootScope.urls.logoutUrl;

    $scope.logoutClicked = function () {

        $scope.menuLogoutBtnStyle = { "background-color": "#2F434E" };
        $scope.menuSearchBtnStyle = { "background-color": "#425563" };
        $http.get($scope.logoutUrl).
           success(function (data, status, headers, config) {

           }).
           error(function (data, status, headers, config) {

           });
        $state.go('login');                                                    //on logout go to login state
    }


});


app.controller('selectPatientCtrl', ['$scope', '$http', '$element', '$rootScope', '$state', '$localStorage', 'dialogs', '$stateParams', '$filter', function ($scope, $http, $element, $rootScope, $state, $localStorage, dialogs, $stateParams, $filter) {
    $scope.patientFilterText = "";

    $scope.patients = $stateParams.patientSearchResults;
    $scope.searchOptionsStyle = { "display": "none" };
    $scope.checkSearchParameterValue = false;
    $scope.searchParametersSet = [
        {

            "name": "Last name",
            "modelName": "Last_name"
        },
        {

            "name": "DOB (MM-dd-yyyy)",
            "modelName": "dob"
        },
        {

            "name": "Person key",
            "modelName": "Person_key"
        }


    ];


    $scope.addParameterButtonStyle = {};
    var clicked = 0;
    var searchParameterClicked = 0;
    $scope.modelname = {};
    $scope.modelname.Last_name = "";
    $scope.modelname.dob = "";
    $scope.modelname.Person_key = "";
    $scope.addParameterButtonClicked = function () {

        clicked = clicked + 1;
        if (clicked % 2 == 1) {
            $scope.searchOptionsStyle.display = "block";
            $scope.addParameterButtonStyle = { "background-color": "#425563", "border": "transparent", "color": "#00A982" };

        }
        else {
            $scope.searchOptionsStyle.display = "none";
            $scope.addParameterButtonStyle = { "background-color": "#00A982", "border-color": "white", "color": "#fff" };
        }
    }

    function isDate(txtDate) {
        var currVal = txtDate;
        if (currVal == '')
            return false;

        var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/; //Declare Regex
        var dtArray = currVal.match(rxDatePattern); // is format OK?

        if (dtArray == null)
            return false;

        //Checks for mm/dd/yyyy format.
        dtMonth = dtArray[1];
        dtDay = dtArray[3];
        dtYear = dtArray[5];

        if (dtMonth < 1 || dtMonth > 12)
            return false;
        else if (dtDay < 1 || dtDay > 31)
            return false;
        else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31)
            return false;
        else if (dtMonth == 2) {
            var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
            if (dtDay > 29 || (dtDay == 29 && !isleap))
                return false;
        }
        return true;
    }

    $scope.onSearchParameterClick = function (typeOfParameter) {
        var ind = $scope.searchParametersSet.indexOf(typeOfParameter);
        if (ind > -1) {
            $scope.searchParametersSet.splice(ind, 1);

        }

        var searchContentHeight = $('.searchContent').outerHeight();
        var searchFooterHeight = $('.patientSearchFooter').outerHeight();
        document.getElementById('patientSearchTable').style.height = "calc(100% - searchContentHeight - searchContentHeight)";
        searchParameterClicked++;
        clicked++;
        if (searchParameterClicked == 1) {
            angular.element(document.querySelector('.newInp')).removeClass('displayTextBox');
            var domElement = document.getElementById("addedInput");
            domElement.removeAttribute("class", "searchInp");
            domElement.setAttribute("class", "addedInput");
            $scope.searchOptionsStyle.display = "none";
            $scope.searchParameter1 = typeOfParameter;
            if (typeOfParameter.name == "DOB") {

            }

        }
        else if (searchParameterClicked == 2) {
            angular.element(document.querySelector('.displayThirdTextBox')).removeClass('thirdTextBox');
            $scope.searchOptionsStyle.display = "none";
            $scope.searchParameter2 = typeOfParameter;
            if (typeOfParameter.name == "DOB") {
                document.getElementById('thirdTB').type = "date";

            }

        }
        else if (searchParameterClicked == 3) {
            angular.element(document.querySelector('.displayFourthTextBox')).removeClass('fourthTextBox');
            var domElement = document.getElementById("thirdTB");
            domElement.removeAttribute("class", "displayThirdTextBox");
            domElement.setAttribute("class", "displayModifiedThirdTextBox");
            $scope.searchOptionsStyle.display = "none";
            $scope.searchParameter3 = typeOfParameter;
            $scope.checkSearchParameterValue = true;
            if (typeOfParameter.name == "DOB") {
                document.getElementById('fourthTB').type = "date";

            }
        }

    }


    $scope.searchDesabled = false;
    $scope.keyDownEvent = function (e) {
        if (e.keyCode == 13) {

            $scope.onSearchClicked();
        }
    }

    $scope.onSearchClicked = function () {
        if ($scope.patientFilterText == "" && $scope.modelname.Last_name == "" && $scope.modelname.dob == "" && $scope.modelname.Person_key == "") {
            $scope.noTextEntered = 1;
            $scope.patients = [];
            $scope.searchDesabled = false;
            $scope.numberOfPatients = "";
        }
        else {
            $scope.noTextEntered = 0;
            $scope.patients = [];
            $scope.numberOfPatients = "";

            if ($scope.modelname.dob != "") {
                if (isDate($scope.modelname.dob)) {
                    $scope.searchDesabled = true;                              //disable the search button after click
                    $scope.getPatientsList();
                }
                else {

                    $scope.dlg1 = dialogs.error('Enter date in MM/dd/yyyy format');

                    $scope.dlg1.result.then(function (btn) {
                        $scope.dlg = null;
                    });

                }
            }

            else {
                $scope.searchDesabled = true;                              //disable the search button after click
                $scope.getPatientsList();
            }
        }
    };

    $scope.getPatientsList = function () {

        $scope.$parent.loaderGifClass.display = "block";
        var postPatientsQuery = {};

        if ($scope.patientFilterText != " ") {
            postPatientsQuery.Firstname = $scope.patientFilterText;
        }

        if ($scope.modelname.Last_name != " ") {
            postPatientsQuery.Lastname = $scope.modelname.Last_name;
        }
        if ($scope.modelname.dob) {
            postPatientsQuery.DOB = $filter('date')($scope.modelname.dob, 'yyyy-MM-dd');

        }

        if ($scope.modelname.Person_key) {
            postPatientsQuery.PersonKey = $scope.modelname.Person_key;
        }

        $scope.patientSearchSuccessfull = function (data, status, headers, config) {
            if (data.length == 0) {
              //  $scope.noTextEntered = 1;
            }
            $scope.$parent.loaderGifClass.display = "none";

            $scope.searchDesabled = false;
            for (var i = 0; i < data.length; i++) {
                $scope.patients.push({
                    "name": data[i].Firstname + " " + data[i].Lastname,
                    "age": "",
                    "dateOfBirth": data[i].DOB,
                    "IDNumber": data[i].PersonKey,
                    "siteID": data[i].SiteID,
                    "residentID": data[i].ResidentID

                });


            }
            for (var i = 0; i < $scope.patients.length; i++) {
                $scope.patients[i].age = calculateAge($scope.patients[i].dateOfBirth) + " yrs.";

            }
            $scope.numberOfPatients = $scope.patients.length+ " result(s) found";
            function calculateAge(birthDate) {
                var fullBirthDate = new Date(birthDate);
                var birthDay = fullBirthDate.getDate();
                var birthMonth = fullBirthDate.getMonth() + 1;
                var birthYear = fullBirthDate.getFullYear();
                var todayFullDate = new Date();
                var todayDay = todayFullDate.getDate();
                var todayMonth = todayFullDate.getMonth() + 1;
                var todayYear = todayFullDate.getFullYear();
                var age = todayYear - birthYear;
                if (todayMonth < birthMonth) {
                    age = age - 1;
                }
                if (todayMonth == birthMonth && todayDay < birthDay) {
                    age = age - 1;
                }
                return age;
            }


            $rootScope.patientList = $scope.patients;
            $stateParams.patientSearchResults = $scope.patients;

        }
        $scope.patientSearchError = function (data, status, headers, config) {

        }

        $http.post($rootScope.urls.patientSearchUrl, postPatientsQuery).success($scope.patientSearchSuccessfull)

            .error(function (data, header, status, config) {

            });
    }

    $rootScope.patientData = $stateParams.patientDetailsObject;

    $scope.onPatientClicked = function (patientClicked) {
        $rootScope.patientData.patientBasicData.siteID = patientClicked.siteID;
        $rootScope.patientData.patientBasicData.residentID = patientClicked.residentID;
        $rootScope.patientData.patientBasicData.IDNumber = patientClicked.IDNumber;
        $rootScope.patientData.patientBasicData.age = patientClicked.age;
        $state.go('patientDetails', { patientSearchResults: $scope.patients });
    }


}]);



app.controller('patientDetailsCtrl', function ($scope, $http, $location, $state, Idle, Keepalive, $stateParams, $sce, $localStorage, dialogs, $rootScope, $filter) {

    $scope.hardwareBackButtonClicked = function () {
        $scope.backButtonClicked();
    }

    $scope.backButtonClicked = function () {
        $state.go('patientSearch', { patientSearchResults: $stateParams.patientSearchResults });
    }

    $scope.$on('IdleStart', function () {
        console.log("idle start");
    });

    $scope.$on('IdleEnd', function () {
        console.log("idle End");
    });

    $scope.$on('IdleTimeout', function () {
        $scope.logoutUrl = $rootScope.urls.logoutUrl;

        $http.get($scope.logoutUrl).
            success(function (data, status, headers, config) {      //data is the json object returned by the server and status is the http status code returned with response

                $state.go('login');
            }).
            error(function (data, status, headers, config) {                                      //error callback is called async if an error occurs

                $state.go('login');
            });

    });

    $scope.start = function () {
        Idle.watch();
        $scope.started = true;
    };

    $scope.stop = function () {
        Idle.unwatch();
        $scope.started = false;

    };

    $scope.start();
    $scope.patientProfilePic = 'assets/images/profilepic.png';
    $scope.loaderGifClass = { "display": "block" };
    $scope.basicDetails = {};
    $scope.onDemographicsDataLoaded = function (data, status, header, config) {



        $scope.demographicsFetched = 1;
        $scope.loaderGifClass.display = "none";

        if (data.IMAGE_FILE_REFERENCE == null) {
            $scope.patientProfilePic = 'assets/images/profilepic.png';

        }
        else {
            $scope.patientProfilePic = data.IMAGE_FILE_REFERENCE;

        }
        $scope.basicDetails = {
            "age": $rootScope.patientData.patientBasicData.age,
            "dob": $filter('date')(data.DATE_OF_BIRTH, "MM-dd-yyyy"),

            "residentCode": $scope.checkStringVal(data.ResidentCode),
            "doctorName": $scope.checkStringVal(data.GPFULLNAME),
            "admissionDate": $filter('date')($scope.checkStringVal(data.ADMISSION_DATE), "MM-dd-yyyy"),
            "name": $scope.checkStringVal(data.GIVEN_NAME) + " " + $scope.checkStringVal(data.FAMILY_NAME),
            "diet": $scope.checkStringVal(data.DIET_NARRATIVE),
            "bed": $scope.checkStringVal(data.BED),
            "room": $scope.checkStringVal(data.ROOM),
            "floor": $scope.checkStringVal(data.FLOOR),
            "location": $scope.checkStringVal(data.BED) + "-" + $scope.checkStringVal(data.ROOM) + "," + $scope.checkStringVal(data.FLOOR),
            "medicalCompliance": data.MEDICATION_COMPLIANCE_FLAG,
           // "patientImageSource": $sce.trustAsHtml("<img class='patientImg' src='" + data.IMAGE_FILE_REFERENCE + "' />")

            "patientImageSource": $sce.trustAsHtml("<img class='patientImg' src='" + $scope.patientProfilePic + "' />")
        };
        $rootScope.patientData.patientDemographicsData = $scope.basicDetails;
        $rootScope.patientImageSource = $sce.trustAsHtml("<img class='medicalConsltPatientImg' src='" + $scope.patientProfilePic + "' />");
    }
    $scope.onDemographicsDataLoadFailed = function (data, status, header, config) {
        $scope.loaderGifClass.display = "none";
        if (!$scope.dlg1) {
           
            $scope.dlg1 = dialogs.error('Unknown error when connecting to the server!', "There seems to be problem with your internet connection!\nCheck you connection and try again!");
            $scope.dlg1.result.then(function (btn) {
                $scope.dlg = null;
                //$state.go('login');
            });
        }

    }


    if ($rootScope.patientData.patientDemographicsData == null) {
        $scope.demographicsFetched = 0;
        $http.get($rootScope.urls.patientDemographicsUrl + "siteid=" + $rootScope.patientData.patientBasicData.siteID + "&residentid=" + $rootScope.patientData.patientBasicData.residentID).
            success($scope.onDemographicsDataLoaded).
            error($scope.onDemographicsDataLoadFailed);
    }
    else {
        $scope.demographicsFetched = 1;
        $scope.basicDetails = $rootScope.patientData.patientDemographicsData;
    }

    $scope.checkStringVal = function (val) {                //function to check whether the argument passed is null or not
        if (val == "null" || val == null || val == "") {
            return "";
        }
        else
            return val;
    }


    $scope.allergiesData = [];
    $scope.allegiesCategorydata = [];


    $scope.allergiesDataLoaded = function (data, status, header, config) {
        $scope.allergiesFetched = 1;
        if (data != null) {

            for (var i = 0; i < data.length; i++) {
                if (data[i].CATEGORY == "Allergies") {
                    $scope.allegiesCategorydata.push(data[i]);
                }
            }


            if ($scope.allegiesCategorydata[0].LAST_UPDATE_TIMESTAMP != null) {
                var recent_time = $scope.allegiesCategorydata[0].LAST_UPDATE_TIMESTAMP.valueOf();
                $scope.lastUpdateTime = $scope.allegiesCategorydata[0].LAST_UPDATE_TIMESTAMP;
            }
            else {
                var recent_time = 0;
                $scope.lastUpdateTime = "";
            }
            for (var i = 1; i < $scope.allegiesCategorydata.length; i++) {
                if ($scope.allegiesCategorydata[i].LAST_UPDATE_TIMESTAMP != null) {
                    if ($scope.allegiesCategorydata[i].LAST_UPDATE_TIMESTAMP.valueOf() > recent_time.valueOf()) {
                        recent_time = $scope.allegiesCategorydata[i].LAST_UPDATE_TIMESTAMP.valueOf();
                       // $scope.lastUpdateTime = $scope.allegiesCategorydata[i].LAST_UPDATE_TIMESTAMP.split('T')[1].split(':')[0] + ":" + $scope.allegiesCategorydata[i].LAST_UPDATE_TIMESTAMP.split('T')[1].split(':')[1] + " " + $scope.allegiesCategorydata[i].LAST_UPDATE_TIMESTAMP.split('T')[0];
                        $scope.lastUpdateTime = $scope.allegiesCategorydata[i].LAST_UPDATE_TIMESTAMP;
                    }
                }
            }

            for (var i = 0; i < $scope.allegiesCategorydata.length; i++) {
                if (i + 1 < $scope.allegiesCategorydata.length) {
                    $scope.allergiesData.push({
                        allergiesType1: $scope.allegiesCategorydata[i].DESCRIPTION + "-" + $scope.allegiesCategorydata[i].INTOLERANCE_CATEGORY,
                        allergiesType2: $scope.allegiesCategorydata[i + 1].DESCRIPTION + "-" + $scope.allegiesCategorydata[i + 1].INTOLERANCE_CATEGORY

                    });
                    i = i + 1;
                }
                else {
                    $scope.allergiesData.push({
                        allergiesType1: $scope.allegiesCategorydata[i].DESCRIPTION + "-" + $scope.allegiesCategorydata[i].INTOLERANCE_CATEGORY,
                        allergiesType2: ""
                    })
                }

            }

            $rootScope.patientData.patientAllergyData.allergiesList = $scope.allergiesData;
            $rootScope.patientData.patientAllergyData.lastUpdateTime = $scope.lastUpdateTime;

        }
    }


    $scope.allergiesDataError = function (data, status, header, config) {
        $scope.loaderGifClass.display = "none";
            if (!$scope.dlg1) {
                $scope.dlg1 = dialogs.error('Unknown error when connecting to the server!', "There seems to be problem with your internet connection!\nCheck you connection and try again!");
                $scope.dlg1.result.then(function (btn) {
                    $scope.dlg = null;
                    //$state.go('login');
                });
            }

        }


    

    if ($rootScope.patientData.patientAllergyData.allergiesList == null && $rootScope.patientData.patientAllergyData.lastUpdateTime == null) {
        $scope.allergiesFetched = 0;
        $http.get($rootScope.urls.patientAllergiesUrl + "siteId=" + $rootScope.patientData.patientBasicData.siteID + "&residentId=" + $rootScope.patientData.patientBasicData.residentID).
         success($scope.allergiesDataLoaded)
         .error($scope.allergiesDataError);
    }
    else {
        $scope.allergiesFetched = 1;
        $scope.allergiesData = $rootScope.patientData.patientAllergyData.allergiesList;
        $scope.lastUpdateTime = $rootScope.patientData.patientAllergyData.lastUpdateTime;

    }
    if ($scope.allergiesFetched == 1 && $scope.demographicsFetched == 1) {

    }
    $scope.currentMedicalHisImgSrc = 'assets/images/med-hist-icon-green.png';
    $scope.currentMedicalHistoryImage = $sce.trustAsHtml("<img class='menuIcon' src='" + $scope.currentMedicalHisImgSrc + "' /><span class='menuItemName'>Medical History</span>");
    $scope.patientMedicalHistoryStyleClass = { "color": "#30B69D", "background-color": "#F6F6F6" };
    $rootScope.menuSelectedHeader = { path: "templates/directives/patientDetailsPage/sideNavOptions/medicalHistoryDetails.html" };
    $scope.medicationImgSrc = 'assets/images/medication_icon_gray.png';
    $scope.medicationImage = $sce.trustAsHtml("<img class='menuIcon' src='" + $scope.medicationImgSrc + "' /><span class='menuItemName'>Medication</span>");
    $scope.laboratoryImgSrc = 'assets/images/lab-icon-gray.png';
    $scope.laboratoryImage = $sce.trustAsHtml("<img class='menuIcon' src='" + $scope.laboratoryImgSrc + "' /><span class='menuItemName'>Laboratory</span>");
    $scope.observationsImgSrc = 'assets/images/observations-icon-gray.png';
    $scope.observationsImage = $sce.trustAsHtml("<img class='menuIcon' src='" + $scope.observationsImgSrc + "' /><span class='menuItemName'>Observations</span>");
    $scope.timelineImgSrc = 'assets/images/timeline-icon-gray.png';
    $scope.timelinesImage = $sce.trustAsHtml("<img class='menuIcon' src='" + $scope.timelineImgSrc + "' /><span class='menuItemName'>Timeline</span>");
    $scope.medicalConsltImgSrc = 'assets/images/med-consult-icon-gray.png';
    $scope.medicalConsultationImage = $sce.trustAsHtml("<img class='menuIcon' src='" + $scope.medicalConsltImgSrc + "' /><span class='menuItemName'>Medical Consultation</span>");
    $scope.medicalChartsImgSrc = 'assets/images/medication_icon_gray.png';
    $scope.medicalChartsImage = $sce.trustAsHtml("<img class='menuIcon' src='" + $scope.medicalChartsImgSrc + "' /><span class='menuItemName'>Medical Charts</span>");

    $scope.onMenuBarClicked = function (menuItem) {
        $scope.patientMedicalHistoryStyleClass = { "color": "#666666", "background-color": "white" };
        $scope.patientMedicationStyleClass = { "color": "#666666", "background-color": "white" };
        $scope.patientLaboratoryStyleClass = { "color": "#666666", "background-color": "white" };
        $scope.patientObservationStyleClass = { "color": "#666666", "background-color": "white" };
        $scope.patientTimelineStyleClass = { "color": "#666666", "background-color": "white" };
        $scope.patientMedicalConsultationStyleClass = { "color": "#666666", "background-color": "white" };
        $scope.patientMedicalChartsStyleClass = { "color": "#666666", "background-color": "white" };

        $scope.currentMedicalHisImgSrc = 'assets/images/med-hist-icon-gray.png';
        $scope.currentMedicalHistoryImage = $sce.trustAsHtml("<img class='menuIcon' src='" + $scope.currentMedicalHisImgSrc + "' /><span class='menuItemName'>Medical History</span>");

        $scope.medicationImgSrc = 'assets/images/medication_icon_gray.png';
        $scope.medicationImage = $sce.trustAsHtml("<img class='menuIcon' src='" + $scope.medicationImgSrc + "' /><span class='menuItemName'>Medication</span>");

        $scope.laboratoryImgSrc = 'assets/images/lab-icon-gray.png';
        $scope.laboratoryImage = $sce.trustAsHtml("<img class='menuIcon' src='" + $scope.laboratoryImgSrc + "' /><span class='menuItemName'>Laboratory</span>");

        $scope.observationsImgSrc = 'assets/images/observations-icon-gray.png';
        $scope.observationsImage = $sce.trustAsHtml("<img class='menuIcon' src='" + $scope.observationsImgSrc + "' /><span class='menuItemName'>Observations</span>");


        $scope.timelineImgSrc = 'assets/images/timeline-icon-gray.png';
        $scope.timelinesImage = $sce.trustAsHtml("<img class='menuIcon' src='" + $scope.timelineImgSrc + "' /><span class='menuItemName'>Timeline</span>");


        $scope.medicalConsltImgSrc = 'assets/images/med-consult-icon-gray.png';
        $scope.medicalConsultationImage = $sce.trustAsHtml("<img class='menuIcon' src='" + $scope.medicalConsltImgSrc + "' /><span class='menuItemName'>Medical Consultation</span>");


        $scope.medicalChartsImgSrc = 'assets/images/medication_icon_gray.png';
        $scope.medicalChartsImage = $sce.trustAsHtml("<img class='menuIcon' src='" + $scope.medicalChartsImgSrc + "' /><span class='menuItemName'>Medical Charts</span>");

        if (menuItem == "medicalHistory") {

            $scope.patientMedicalHistoryStyleClass = { "color": "#30B69D", "background-color": "#F6F6F6" };

            $scope.currentMedicalHisImgSrc = 'assets/images/med-hist-icon-green.png';
            $scope.currentMedicalHistoryImage = $sce.trustAsHtml("<img class='menuIcon' src='" + $scope.currentMedicalHisImgSrc + "' /><span class='menuItemName'>Medical History</span>");

            $rootScope.menuSelectedHeader = { path: "templates/directives/patientDetailsPage/sideNavOptions/medicalHistoryDetails.html" };

        }
        else if (menuItem == "medication") {

            $scope.patientMedicationStyleClass = { "color": "#30B69D", "background-color": "#F6F6F6" };//menu bar

            $scope.medicationImgSrc = 'assets/images/medication-icon-green.png';
            $scope.medicationImage = $sce.trustAsHtml("<img class='menuIcon' src='" + $scope.medicationImgSrc + "' /><span class='menuItemName'>Medication</span>");


            $rootScope.menuSelectedHeader = { path: "templates/directives/patientDetailsPage/sideNavOptions/medicationDetails.html" };


        }
        else if (menuItem == "laboratory") {

            $scope.patientLaboratoryStyleClass = { "color": "#30B69D", "background-color": "#F6F6F6" };

            $scope.laboratoryImgSrc = 'assets/images/lab-icon-green.png';
            $scope.laboratoryImage = $sce.trustAsHtml("<img class='menuIcon' src='" + $scope.laboratoryImgSrc + "' /><span class='menuItemName'>Laboratory</span>");

            $rootScope.menuSelectedHeader = { path: "templates/directives/patientDetailsPage/sideNavOptions/laboratoryDetails.html" };




        }
        else if (menuItem == "observation") {

            $scope.patientObservationStyleClass = { "color": "#30B69D", "background-color": "#F6F6F6" };


            $scope.observationsImgSrc = 'assets/images/observations-icon-green.png';
            $scope.observationsImage = $sce.trustAsHtml("<img class='menuIcon' src='" + $scope.observationsImgSrc + "' /><span class='menuItemName'>Observations</span>");

            $rootScope.menuSelectedHeader = { path: "templates/directives/patientDetailsPage/sideNavOptions/observationDetails.html" };

        }
        else if (menuItem == "timeline") {

            $scope.patientTimelineStyleClass = { "color": "#30B69D", "background-color": "#F6F6F6" };//menu bar

            $scope.timelineImgSrc = 'assets/images/timeline-icon-green.png';
            $scope.timelinesImage = $sce.trustAsHtml("<img class='menuIcon' src='" + $scope.timelineImgSrc + "' /><span class='menuItemName'>Timeline</span>");

            $rootScope.menuSelectedHeader = { path: "templates/directives/patientDetailsPage/sideNavOptions/timelineListView.html" };



        }
        else if (menuItem == "medicalConsultation") {

            $scope.patientMedicalConsultationStyleClass = { "color": "#30B69D", "background-color": "#F6F6F6" };//menu bar


            $scope.medicalConsltImgSrc = 'assets/images/med-consult-icon-green.png';
            $scope.medicalConsultationImage = $sce.trustAsHtml("<img class='menuIcon' src='" + $scope.medicalConsltImgSrc + "' /><span class='menuItemName'>Medical Consultation</span>");

            $rootScope.menuSelectedHeader = { path: "templates/directives/patientDetailsPage/sideNavOptions/medicalConsultationDetails.html" };

        }
        else if (menuItem == "medicalCharts") {

            $scope.patientMedicalChartsStyleClass = { "color": "#30B69D", "background-color": "#F6F6F6" };//menu bar
            $scope.medicalChartsImgSrc = 'assets/images/medication-icon-green.png';
            $scope.medicalChartsImage = $sce.trustAsHtml("<img class='menuIcon' src='" + $scope.medicalChartsImgSrc + "' /><span class='menuItemName'>Medical Charts</span>");

            $rootScope.menuSelectedHeader = { path: "templates/directives/patientDetailsPage/sideNavOptions/medicalChartsDetails.html" };

        }

    }

    if ($stateParams.tabActive == "doc") {
        $scope.onMenuBarClicked('observation');
        $scope.loaderGifClass.display = "none";

    }
    else if ($stateParams.tabActive == "timeline") {
        
        $scope.onMenuBarClicked('timeline');
        if($stateParams.subTab=="calendar"){
        
            $rootScope.menuSelectedHeader = { path: "templates/directives/patientDetailsPage/sideNavOptions/timelineCalendarView.html" };

}
        $scope.loaderGifClass.display = "none";
    }
});
app.controller('medicalConsultationCtrl', ['$scope', '$filter', '$state', '$stateParams', '$http', '$rootScope', '$localStorage', 'dialogs', '$modal', function ($scope, $filter, $state, $stateParams, $http, $rootScope, $localStorage, dialogs, $modal) {

    $scope.consultationDetails = {};

    $scope.noteText = "";

    $scope.consultationDetailsLoaded = function (data, status, header, config) {
        var a = JSON.stringify(data.GP_NOTES_TEXT_ENTRY);
        data.GP_NOTES_TEXT_ENTRY = data.GP_NOTES_TEXT_ENTRY.replace(/[\r\r]/g, '\n');
        var b = data.GP_NOTES_TEXT_ENTRY.length;
        for (var i = 0; i < b; i++) {

            var a = data.GP_NOTES_TEXT_ENTRY.charAt(i);
            if (a == "(" || a == ")") {
                data.GP_NOTES_TEXT_ENTRY = data.GP_NOTES_TEXT_ENTRY.replace(a, '');
            }

        }

        var GP_NOTES_TEXT_ENTRY_DATA = angular.copy(data.GP_NOTES_TEXT_ENTRY);

        $scope.$parent.loaderGifClass.display = "none";
        $scope.consultationDetails.recordedBy = data.FULLNAME;

        $scope.consultationDetails.date = $filter('date')(data.START_TIMESTAMP.split('T')[0], "dd-MM-yyyy") + " " + data.START_TIMESTAMP.split('T')[1].split('.')[0];

        $scope.consultationDetails.text = data.GP_NOTES_TEXT_ENTRY;
        $scope.noteTextEdit = $scope.consultationDetails.text;

        $rootScope.patientData.patientConsultationData = $scope.consultationDetails;
    }
    $scope.consultationDetailsError = function (data, status, header, config) {
        $scope.$parent.loaderGifClass.display = "none";
        if (!$scope.dlg1) {
            $scope.dlg1 = dialogs.error('Unknown error when connecting to the server!', "There seems to be problem with your internet connection!\nCheck you connection and try again!");
            $scope.dlg1.result.then(function (btn) {
                $scope.dlg = null;
                //$state.go('login');
            });
        }

    }
    if ($rootScope.patientData.patientConsultationData == null) {
        $scope.$parent.loaderGifClass.display = "block";
        $http.get($rootScope.urls.patientMedicalConsultationsUrl + "siteId=" + $rootScope.patientData.patientBasicData.siteID + "&residentId=" + $rootScope.patientData.patientBasicData.residentID)

               .success($scope.consultationDetailsLoaded)
               .error($scope.consultationDetailsError);
    }
    else {
        $scope.consultationDetails = $rootScope.patientData.patientConsultationData;
    }


    $scope.onSaveClicked = function () {

        var data = $.param({
            note: $scope.noteText

        });

        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }

        $http.post($rootScope.urls.patientConsultationNotesCreate + "siteId=" + $rootScope.patientData.patientBasicData.siteID + "&residentId=" + $rootScope.patientData.patientBasicData.residentID + "&GP_NOTES_TEXT_ENTRY=" + $scope.noteText)
        .success(function (data, status, headers, config) {
            $scope.PostDataResponse = data;

            $scope.$parent.loaderGifClass.display = "block";
            $scope.noteText = "";
            $http.get($rootScope.urls.patientMedicalConsultationsUrl + "siteId=" + $rootScope.patientData.patientBasicData.siteID + "&residentId=" + $rootScope.patientData.patientBasicData.residentID)

               .success($scope.consultationDetailsLoaded)
               .error($scope.consultationDetailsError);

        })
        .error(function (data, status, header, config) {
            $scope.$parent.loaderGifClass.display = "none";
            if (!$scope.dlg1) {
                $scope.dlg1 = dialogs.error('Unknown error when connecting to the server!', "There seems to be problem with your internet connection!\nCheck you connection and try again!");
                $scope.dlg1.result.then(function (btn) {
                    $scope.dlg = null;
                    //$state.go('login');
                });
            }

        });

    }
    $scope.onCreateNewCancelClicked = function () {
        $scope.noteText = "";
    }
    $scope.onEditDoneClicked = function () {
        var data = $.param({
            note: $scope.noteTextEdit

        });

        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }
        $scope.url = $rootScope.urls.patientConsultationNotesEdit + "siteId=" + $rootScope.patientData.patientBasicData.siteID + "&residentId=" + $rootScope.patientData.patientBasicData.residentID + "&GP_NOTES_TEXT_ENTRY=" + $scope.noteTextEdit;

        $http.post($rootScope.urls.patientConsultationNotesEdit + "siteId=" + $rootScope.patientData.patientBasicData.siteID + "&residentId=" + $rootScope.patientData.patientBasicData.residentID + "&GP_NOTES_TEXT_ENTRY=" + $scope.noteTextEdit)
        .success(function (data, status, headers, config) {
            $scope.PostDataResponse = data;

            $scope.$parent.loaderGifClass.display = "block";
            $http.get($rootScope.urls.patientMedicalConsultationsUrl + "siteId=" + $rootScope.patientData.patientBasicData.siteID + "&residentId=" + $rootScope.patientData.patientBasicData.residentID)

             .success($scope.consultationDetailsLoaded)
             .error($scope.consultationDetailsError);


        })
        .error(function (data, status, header, config) {

            if (!$scope.dlg1) {
                $scope.dlg1 = dialogs.error('Unknown error when connecting to the server!', "There seems to be problem with your internet connection!\nCheck you connection and try again!");
                $scope.dlg1.result.then(function (btn) {
                    $scope.dlg = null;
                    //$state.go('login');
                });
            }

        });
    }

    $scope.onEditCancelClicked = function () {
        $scope.noteTextEdit = $scope.consultationDetails.text;
    }

}]);




app.controller('medicalHistoryDetailsController', function ($scope, $http, $location, $state, Idle, Keepalive, $stateParams, $sce, $localStorage, dialogs, $rootScope) {

    $scope.medicalHistoryDetails = {
        basicMedicalHistoryDetails: [],
        familyHistoryDetails: [],
        allergyDetails: [],
        cigarettesDetails: [],
        surgicalHistoryDetails: [],
        alcoholDetails: []

    };



    $scope.medicalHistoryLoaded = function (data, status, header, config) {
        $scope.$parent.loaderGifClass.display = "none";

        for (var i = 0; i < data.length; i++) {

            if (data[i].CATEGORY == "Allergies") {

                $scope.medicalHistoryDetails.allergyDetails.push(
                    {
                        "category": data[i].CATEGORY,
                        "description": data[i].DESCRIPTION,
                        "date": data[i].LAST_UPDATE_TIMESTAMP.split(' ')[0]



                    });
            }
            if (data[i].CATEGORY == "Medical History") {
                $scope.medicalHistoryDetails.basicMedicalHistoryDetails.push(
                 {
                     "category": data[i].CATEGORY,
                     "description": data[i].DESCRIPTION,
                     "date": data[i].LAST_UPDATE_TIMESTAMP.split(' ')[0]

                 });

            }
            if (data[i].CATEGORY == "Surgical History") {
                $scope.medicalHistoryDetails.surgicalHistoryDetails.push(
                {
                    "category": data[i].CATEGORY,
                    "description": data[i].DESCRIPTION,
                    "date": data[i].LAST_UPDATE_TIMESTAMP.split(' ')[0]

                });

            }
            if (data[i].CATEGORY == "Cigarettes") {
                $scope.medicalHistoryDetails.cigarettesDetails.push(
                {
                    "category": data[i].CATEGORY,
                    "description": data[i].DESCRIPTION,
                    "date": data[i].LAST_UPDATE_TIMESTAMP.split(' ')[0]

                });

            }
            if (data[i].CATEGORY == "Family History") {
                $scope.medicalHistoryDetails.familyHistoryDetails.push(
                {
                    "category": data[i].CATEGORY,
                    "description": data[i].DESCRIPTION.split(',')[0],
                    "relative": data[i].DESCRIPTION.split(',')[1]

                });

            }

            if (data[i].CATEGORY == "Alcohol") {
                $scope.medicalHistoryDetails.alcoholDetails.push(
                {
                    "category": data[i].CATEGORY,
                    "description": data[i].DESCRIPTION


                });

            }

        }


        $rootScope.patientData.patientMedicalHistoryData = $scope.medicalHistoryDetails;
    }
    $scope.medicalHistoryError = function (data, status, header, config) {
        $scope.$parent.loaderGifClass.display = "none";
        if (!$scope.dlg1) {
            $scope.dlg1 = dialogs.error('Unknown error when connecting to the server!', "There seems to be problem with your internet connection!\nCheck you connection and try again!");
            $scope.dlg1.result.then(function (btn) {
                $scope.dlg = null;
                //$state.go('login');
            });
        }

    }

    if ($rootScope.patientData.patientMedicalHistoryData == null) {
        $scope.$parent.loaderGifClass.display = "block";
        $http.get($rootScope.urls.patientMedicalHistoryUrl + "siteId=" + $rootScope.patientData.patientBasicData.siteID + "&residentId=" + $rootScope.patientData.patientBasicData.residentID)

               .success($scope.medicalHistoryLoaded)
               .error($scope.medicalHistoryError);
    }
    else {
        $scope.medicalHistoryDetails = $rootScope.patientData.patientMedicalHistoryData;
    }



});




app.controller('observationDetailsController', function ($scope, $http, $location, $state, Idle, Keepalive, $stateParams, $sce, $localStorage, dialogs, $rootScope) {

    //$(function () {
    //    $('.observationDetailsContainer').slimScroll({
    //        height: 'initial'
    //    });
    //});
 //   $('.observationDetailsContainer').perfectScrollbar();
    $scope.observationsDetails = [];
    $scope.observationDataValues = [];
    $scope.observationClicked = function (obsv) {

        $scope.sessionid = obsv.sessionid;
        console.log("$scope.sessionid"+$scope.sessionid);
        $scope.obsvData = {};

        $scope.patientObservationsDataLoaded = function (data, status, header, config) {
            $scope.$parent.loaderGifClass.display = "none";

            $scope.observationDataValues[$scope.sessionid] = {};
            if (obsv.type == "VITALS") {

                if (data[0].FULL_NAME == null) {
                    $scope.takenBy = "" + " " + data[0].CaptureTime.split(':')[0] + ":" + data[0].CaptureTime.split(':')[1];
                }
                else {
                    $scope.takenBy = data[0].FULL_NAME + " " + data[0].CaptureTime.split(':')[0] + ":" + data[0].CaptureTime.split(':')[1];
                }
                for (var i = 0; i < data.length; i++) {

                    switch (data[i].OBSERVATION_TYPE_ID) {

                        case 1:
                            $scope.observationDataValues[$scope.sessionid].pulse = data[i].VALUE_QUANTITY + " " + data[i].UNITS_SHORT;
                            break;

                        case 2:
                            $scope.observationDataValues[$scope.sessionid].bloodPressure = data[i].VALUE_RATIO_NUMERATOR + "/" + data[i].VALUE_RATIO_DENOMINATOR;
                            break;
                        case 3:
                            $scope.observationDataValues[$scope.sessionid].oxygenSaturation = data[i].VALUE_QUANTITY;
                            break;
                        case 4:
                            $scope.observationDataValues[$scope.sessionid].temperature = data[i].VALUE_QUANTITY;
                            $scope.observationDataValues[$scope.sessionid].temperatureMethod = data[i].OBSERVATION_METHOD;

                            break;
                        case 5:
                            $scope.observationDataValues[$scope.sessionid].height = data[i].VALUE_QUANTITY + " " + data[i].UNITS_SHORT;
                            $scope.height = data[i].VALUE_QUANTITY;
                            break;
                        case 6:
                            $scope.observationDataValues[$scope.sessionid].weight = data[i].VALUE_QUANTITY + " " + data[i].UNITS_SHORT;
                            $scope.weight = data[i].VALUE_QUANTITY;
                            break;


                    }
                    $scope.observationDataValues[$scope.sessionid].bmi = parseFloat($scope.weight / ($scope.height * $scope.height * 0.0001)).toFixed(2);
                    if ($scope.observationDataValues[$scope.sessionid].bmi >= 0 && $scope.observationDataValues[$scope.sessionid].bmi <= 16.0) {
                        $scope.observationDataValues[$scope.sessionid].bmiStatus = "Severely Underweight";
                    }
                    if ($scope.observationDataValues[$scope.sessionid].bmi > 16 && $scope.observationDataValues[$scope.sessionid].bmi <= 18.5) {
                        $scope.observationDataValues[$scope.sessionid].bmiStatus = "Underweight";
                    }
                    if ($scope.observationDataValues[$scope.sessionid].bmi > 18.5 && $scope.observationDataValues[$scope.sessionid].bmi <= 25) {
                        $scope.observationDataValues[$scope.sessionid].bmiStatus = "Normal";
                    }
                    if ($scope.observationDataValues[$scope.sessionid].bmi > 25 && $scope.observationDataValues[$scope.sessionid].bmi <= 30) {
                        $scope.observationDataValues[$scope.sessionid].bmiStatus = "Overweight";
                    }
                    if ($scope.observationDataValues[$scope.sessionid].bmi > 30 && $scope.observationDataValues[$scope.sessionid].bmi <= 35) {
                        $scope.observationDataValues[$scope.sessionid].bmiStatus = "Moderately obese";
                    }
                    if ($scope.observationDataValues[$scope.sessionid].bmi > 35) {
                        $scope.observationDataValues[$scope.sessionid].bmiStatus = "Severely obese";
                    }
                }

                $scope.obsvData = $scope.observationDataValues[$scope.sessionid];

                $rootScope.patientData.patientObservationDataValues[$scope.sessionid] = $scope.observationDataValues[$scope.sessionid];
            }
            if (obsv.type == "ECG" || obsv.type == "SPIROMETER") {

                console.log("ECG data loaded");
                $scope.pdfFileName = data[0].PDF_FILENAME;

                $state.go('pdfViewerState', { patientSearchResults: $stateParams.patientSearchResults, document: $scope.pdfFileName, patientDetailsObject: $rootScope.patientData, tabActive: "doc" });

            }

            if (obsv.type == "INR") {

                $scope.observationDataValues[$scope.sessionid].INR = data[0].VALUE_QUANTITY;
                $scope.observationDataValues[$scope.sessionid].CCT = data[0].VALUE_TIME;
                $scope.obsvData = $scope.observationDataValues[$scope.sessionid];

                $rootScope.patientData.patientObservationDataValues[$scope.sessionid] = $scope.observationDataValues[$scope.sessionid];
            }
        }
        $scope.patientObservationsDataLoadFailed = function (data, status, header, config) {
            $scope.$parent.loaderGifClass.display = "none";
            if (!$scope.dlg1) {
                $scope.dlg1 = dialogs.error('Unknown error when connecting to the server!', "There seems to be problem with your internet connection!\nCheck you connection and try again!");
                $scope.dlg1.result.then(function (btn) {
                    $scope.dlg = null;
                    //$state.go('login');
                });
            }

        }





        switch (obsv.type) {
            case "VITALS":

                $('.obsvAccordion').attr('data-target', '#myModal5');

                if (!$rootScope.patientData.patientObservationDataValues[$scope.sessionid]) {
                    $scope.$parent.loaderGifClass.display = "block";
                    $http.get($rootScope.urls.patientObservationsVitalsUrl + "siteId=" + $rootScope.patientData.patientBasicData.siteID + "&residentId=" + $rootScope.patientData.patientBasicData.residentID + "&sessionid=" + $scope.sessionid).
                    success($scope.patientObservationsDataLoaded).
                    error($scope.patientObservationsDataLoadFailed);
                }
                else {
                    $scope.obsvData = $rootScope.patientData.patientObservationDataValues[$scope.sessionid];
                }
                break;

            case "ECG":
                $('.obsvAccordion').attr('data-target', null);

                if (!$rootScope.patientData.patientObservationDataValues[$scope.sessionid]) {

                    $http.get($rootScope.urls.patientObservationsECGUrl + "siteId=" + $rootScope.patientData.patientBasicData.siteID + "&residentId=" + $rootScope.patientData.patientBasicData.residentID + "&sessionid=" + $scope.sessionid).
                        success($scope.patientObservationsDataLoaded).
                        error($scope.patientObservationsDataLoadFailed);
                }
                else {
                    $scope.obsvData = $rootScope.patientData.patientObservationDataValues[$scope.sessionid];
                }


                break;

            case "INR":

                $('.obsvAccordion').attr('data-target', '#inrModal');

                if (!$rootScope.patientData.patientObservationDataValues[$scope.sessionid]) {
                    $scope.$parent.loaderGifClass.display = "block";
                    $http.get($rootScope.urls.patientObservationsINRUrl + "siteId=" + $rootScope.patientData.patientBasicData.siteID + "&residentId=" + $rootScope.patientData.patientBasicData.residentID + "&sessionid=" + $scope.sessionid).
                        success($scope.patientObservationsDataLoaded).
                        error($scope.patientObservationsDataLoadFailed);
                }
                else {
                    $scope.obsvData = $rootScope.patientData.patientObservationDataValues[$scope.sessionid];
                }

                break;

            case "SPIROMETER":

                $('.obsvAccordion').attr('data-target', null);

                if (!$rootScope.patientData.patientObservationDataValues[$scope.sessionid]) {

                    $http.get($rootScope.urls.patientObservationsSpirometerUrl + "siteId=" + $rootScope.patientData.patientBasicData.siteID + "&residentId=" + $rootScope.patientData.patientBasicData.residentID + "&sessionid=" + $scope.sessionid).
                        success($scope.patientObservationsDataLoaded).
                        error($scope.patientObservationsDataLoadFailed);
                }
                else {
                    $scope.obsvData = $rootScope.patientData.patientObservationDataValues[$scope.sessionid];
                }

                break;


        }
    }




    $scope.observationDetailsLoaded = function (data, status, header, config) {


        for (var i = 0; i < data.length; i++) {

            $scope.observationsDetails.push({
                "type": data[i].CATEGORY_TYPE,
                "date": data[i].START_TIMESTAMP,
                "sessionid": data[i].SESSION_ID
            }
                );
        }
        $rootScope.patientData.patientObservationData = $scope.observationsDetails;
        $scope.$parent.loaderGifClass.display = "none";

    }
    $scope.observationDetailsError = function (data, status, header, config) {
        $scope.loaderGifClass.display = "none";
        if (!$scope.dlg1) {
            $scope.dlg1 = dialogs.error('Unknown error when connecting to the server!', "There seems to be problem with your internet connection!\nCheck you connection and try again!");
            $scope.dlg1.result.then(function (btn) {
                $scope.dlg = null;
                //$state.go('login');
            });
        }

    }
    if ($rootScope.patientData.patientObservationData == null) {
        $scope.$parent.loaderGifClass.display = "block";

        $http.get($rootScope.urls.patientObservationsUrl + "siteId=" + $rootScope.patientData.patientBasicData.siteID + "&residentId=" + $rootScope.patientData.patientBasicData.residentID)
               .success($scope.observationDetailsLoaded)
               .error($scope.observationDetailsError);
    }
    else {
        $scope.observationsDetails = $rootScope.patientData.patientObservationData;
    }

});


app.controller('pdfViewerController', ['$scope', '$sce', '$http', '$location', '$state', 'PDFViewerService', '$stateParams', '$rootScope', function ($scope, $sce, $http, $location, $state, pdf, $stateParams, $rootScope) {
    $scope.loaderGifClass = { display: "block" };
    $scope.backButtonClicked = function () {
        console.log("$stateParams.tabActive" + $stateParams.tabActive + "$stateParams.subTab" + $stateParams.subTab);
        $state.go('patientDetails', { patientSearchResults: $stateParams.patientSearchResults, patientDetailsObject: $stateParams.patientDetailsObject, tabActive: $stateParams.tabActive,subTab:$stateParams.subTab });     //navigates to state mentioned 
    }
    $scope.$on('pdfLoaded', function () {
        document.getElementById("pageLoadingGif").style.display = "none";
        

    });

    $scope.pdfURL = $sce.trustAsResourceUrl($stateParams.document);

    $scope.instance = pdf.Instance("viewer");
    $scope.nextPage = function () {
        $scope.instance.nextPage();
    };
    $scope.gotoPage = function (page) {
        console.log("page is" + page);
        $scope.instance.gotoPage(page);
    };
    $scope.prevPage = function () {
        $scope.instance.prevPage();
    };

    $scope.pageLoaded = function (curPage, totalPages) {
        console.log("page loaded");
        $scope.currentPage = curPage;
        $scope.totalPages = totalPages;
        console.log("current page" + $scope.currentPage + " totalpages:" + $scope.totalPages);
       
    };
    $scope.loadProgress = function (loaded, total, state) {

        console.log('loaded =', loaded, 'total =', total, 'state =', state);
    };
    $scope.zoomIn = function () {

        $scope.instance.zoomIn();
    }

    $scope.zoomOut = function () {
        $scope.instance.zoomOut();
    }
}]);




app.controller('laboratoryDetailsController', function ($scope, $http, $location, $state, Idle, Keepalive, $stateParams, $sce, $localStorage, dialogs, $rootScope) {

    $scope.labDetails = [];
    $scope.labDataValues = [];
    $scope.labTypeClicked = function (labs) {
        $scope.sessionid = labs.sessionid;

        $scope.labsData = {};
        $scope.patientLabsDataLoaded = function (data, status, header, config) {
            $scope.$parent.loaderGifClass.display = "none";
            $scope.labDataValues[$scope.sessionid] = {};
            if (labs.type == "BLOOD") {
                for (var i = 0; i < data.length; i++) {


                    if (data[i].LABORATORY_TYPE_ID == 1) {
                        $scope.labDataValues[$scope.sessionid].sequence = data[i].VALUE_STRING;
                        $scope.labDataValues[$scope.sessionid].dateImported = data[i].LAST_UPDATE_TIMESTAMP;
                        $scope.labDataValues[$scope.sessionid].testDate = data[i].CAPTURE_DATE;

                    }
                    if (data[i].LABORATORY_TYPE_ID == 2) {
                        $scope.labDataValues[$scope.sessionid].actionStatus = data[i].VALUE_STRING;

                    }
                    if (data[i].LABORATORY_TYPE_ID == 3) {
                        $scope.labDataValues[$scope.sessionid].status = data[i].VALUE_STRING;

                    }
                    if (data[i].LABORATORY_TYPE_ID == 4) {
                        $scope.labDataValues[$scope.sessionid].MRN = data[i].VALUE_STRING;

                    }
                    if (data[i].LABORATORY_TYPE_ID == 5) {
                        $scope.labDataValues[$scope.sessionid].KUB = data[i].VALUE_STRING;

                    }
                    if (data[i].LABORATORY_TYPE_ID == 6) {
                        $scope.labDataValues[$scope.sessionid].sampleType = data[i].VALUE_STRING;

                    }
                    if (data[i].LABORATORY_TYPE_ID == 7) {
                        $scope.labDataValues[$scope.sessionid].clinicalObservations = data[i].VALUE_STRING;

                    }
                    if (data[i].LABORATORY_TYPE_ID == 8) {
                        $scope.labDataValues[$scope.sessionid].radiologyNumber = data[i].VALUE_QUANTITY;

                    }
                    if (data[i].LABORATORY_TYPE_ID == 9) {
                        $scope.labDataValues[$scope.sessionid].resultsFlag = data[i].VALUE_STRING;

                    }
                   
                    if (data[i].LABORATORY_TYPE_ID == 10) {
                        $scope.labDataValues[$scope.sessionid].HGB= {
                            "results": data[i].VALUE_QUANTITY,
                            "unit": data[i].UNITS_SHORT,
                            "referenceRange": data[i].VALUE_RANGE_LOW + " - " + data[i].VALUE_RANGE_HIGH
                        }
                        console.log("$scope.labDataValues[$scope.sessionid].HGB"+JSON.stringify($scope.labDataValues[$scope.sessionid].HGB));
                    }

                    if (data[i].LABORATORY_TYPE_ID == 11) {
                        $scope.labDataValues[$scope.sessionid]["Hematocrit"] = {
                            "results": data[i].VALUE_QUANTITY,
                            "unit": data[i].UNITS_SHORT,
                            "referenceRange": data[i].VALUE_RANGE_LOW + " - " + data[i].VALUE_RANGE_HIGH
                        }

                    }
                    if (data[i].LABORATORY_TYPE_ID == 12) {
                        $scope.labDataValues[$scope.sessionid]["RBC"] = {
                            "results": data[i].VALUE_QUANTITY,
                            "unit": data[i].UNITS_SHORT,
                            "referenceRange": data[i].VALUE_RANGE_LOW + " - " + data[i].VALUE_RANGE_HIGH
                        }

                    }
                    if (data[i].LABORATORY_TYPE_ID == 13) {
                        $scope.labDataValues[$scope.sessionid]["WBC"] = {
                            "results": data[i].VALUE_QUANTITY,
                            "unit": data[i].UNITS_SHORT,
                            "referenceRange": data[i].VALUE_RANGE_LOW + " - " + data[i].VALUE_RANGE_HIGH
                        }

                    }
                    if (data[i].LABORATORY_TYPE_ID == 14) {
                        $scope.labDataValues[$scope.sessionid]["Basophils"] = {
                            "results": data[i].VALUE_QUANTITY,
                            "unit": data[i].UNITS_SHORT,
                            "referenceRange": data[i].VALUE_RANGE_LOW + " - " + data[i].VALUE_RANGE_HIGH
                        }

                    }

                    if (data[i].LABORATORY_TYPE_ID == 15) {
                        $scope.labDataValues[$scope.sessionid]["Eosinophils"] = {
                            "results": data[i].VALUE_QUANTITY,
                            "unit": data[i].UNITS_SHORT,
                            "referenceRange": data[i].VALUE_RANGE_LOW + " - " + data[i].VALUE_RANGE_HIGH
                        }

                    }
                    if (data[i].LABORATORY_TYPE_ID == 16) {
                        $scope.labDataValues[$scope.sessionid]["Segmenters"] = {
                            "results": data[i].VALUE_QUANTITY,
                            "unit": data[i].UNITS_SHORT,
                            "referenceRange": data[i].VALUE_RANGE_LOW + " - " + data[i].VALUE_RANGE_HIGH
                        }

                    }
                    if (data[i].LABORATORY_TYPE_ID == 17) {
                        $scope.labDataValues[$scope.sessionid]["Lymphocytes"] = {
                            "results": data[i].VALUE_QUANTITY,
                            "unit": data[i].UNITS_SHORT,
                            "referenceRange": data[i].VALUE_RANGE_LOW + " - " + data[i].VALUE_RANGE_HIGH
                        }

                    }
                    if (data[i].LABORATORY_TYPE_ID == 18) {
                        $scope.labDataValues[$scope.sessionid]["Monocytes"] = {
                            "results": data[i].VALUE_QUANTITY,
                            "unit": data[i].UNITS_SHORT,
                            "referenceRange": data[i].VALUE_RANGE_LOW + " - " + data[i].VALUE_RANGE_HIGH
                        }

                    }
                    if (data[i].LABORATORY_TYPE_ID == 19) {
                        $scope.labDataValues[$scope.sessionid]["plateletCount"] = {
                            "results": data[i].VALUE_QUANTITY,
                            "unit": data[i].UNITS_SHORT,
                            "referenceRange": data[i].VALUE_RANGE_LOW + " - " + data[i].VALUE_RANGE_HIGH
                        }

                    }
                    if (data[i].LABORATORY_TYPE_ID == 20) {
                        $scope.labDataValues[$scope.sessionid]["MCV"] = {
                            "results": data[i].VALUE_QUANTITY,
                            "unit": data[i].UNITS_SHORT,
                            "referenceRange": data[i].VALUE_RANGE_LOW + " - " + data[i].VALUE_RANGE_HIGH
                        }

                    }
                    if (data[i].LABORATORY_TYPE_ID == 21) {
                        $scope.labDataValues[$scope.sessionid]["MCH"] = {
                            "results": data[i].VALUE_QUANTITY,
                            "unit": data[i].UNITS_SHORT,
                            "referenceRange": data[i].VALUE_RANGE_LOW + " - " + data[i].VALUE_RANGE_HIGH
                        }

                    }
                    if (data[i].LABORATORY_TYPE_ID == 22) {
                        $scope.labDataValues[$scope.sessionid]["MCHC"] = {
                            "results": data[i].VALUE_QUANTITY,
                            "unit": data[i].UNITS_SHORT,
                            "referenceRange": data[i].VALUE_RANGE_LOW + " - " + data[i].VALUE_RANGE_HIGH
                        }

                    }
                    if (data[i].LABORATORY_TYPE_ID == 23) {
                        $scope.labDataValues[$scope.sessionid]["RDW"] = {
                            "results": data[i].VALUE_QUANTITY,
                            "unit": data[i].UNITS_SHORT,
                            "referenceRange": data[i].VALUE_RANGE_LOW + " - " + data[i].VALUE_RANGE_HIGH
                        }

                    }


                    //$scope.labDataValues[$scope.sessionid].push({
                    //    "valueResult": data[i].VALUE_QUANTITY,
                    //    "unit": data[i].UNITS_SHORT,
                    //    "referenceRangeLow": data[i].VALUE_RANGE_LOW,
                    //    "referenceRangeHigh": data[i].VALUE_RANGE_HIGH,
                    //    "valueName": data[i].VALUE_STRING
                    //});

                }
                $scope.labsData = $scope.labDataValues[$scope.sessionid];
                $rootScope.patientData.patientLabDataValues[$scope.sessionid] = $scope.labDataValues[$scope.sessionid];

            }

        }
        $scope.patientLabsDataLoadFailed = function (data, status, header, config) {
            $scope.loaderGifClass.display = "none";
            if (!$scope.dlg1) {
                $scope.dlg1 = dialogs.error('Unknown error when connecting to the server!', "There seems to be problem with your internet connection!\nCheck you connection and try again!");
                $scope.dlg1.result.then(function (btn) {
                    $scope.dlg = null;
                    //$state.go('login');
                });
            }
        }
        switch (labs.type) {
            case "BLOOD":

                $('.labsAccordion').attr('data-target', '#myModal1');

                if (!$rootScope.patientData.patientLabDataValues[$scope.sessionid]) {
                    $scope.$parent.loaderGifClass.display = "block";
                    console.log($rootScope.urls.patientLabDetailsUrl + "siteId=" + $rootScope.patientData.patientBasicData.siteID + "&residentId=" + $rootScope.patientData.patientBasicData.residentID + "&sessionid=" + $scope.sessionid);
                    $http.get($rootScope.urls.patientLabDetailsUrl + "siteId=" + $rootScope.patientData.patientBasicData.siteID + "&residentId=" + $rootScope.patientData.patientBasicData.residentID + "&sessionid=" + $scope.sessionid).
                        success($scope.patientLabsDataLoaded).
                        error($scope.patientLabsDataLoadFailed);
                }
                else {
                    $scope.labsData = $rootScope.patientData.patientLabDataValues[$scope.sessionid];
                }

                break;



        }
    }



    $scope.labDetailsLoaded = function (data, status, header, config) {

        for (var i = 0; i < data.length; i++) {

            $scope.labDetails.push({
                "type": data[i].CATEGORY_TYPE,
                "date": data[i].START_TIMESTAMP,
                "sessionid": data[i].SESSION_ID
            }
                );
        }
        $rootScope.patientData.patientLabData = $scope.labDetails;
        $scope.$parent.loaderGifClass.display = "none";

    }
    $scope.labDetailsError = function (data, status, header, config) {
        $scope.loaderGifClass.display = "none";
        if (!$scope.dlg1) {
            $scope.dlg1 = dialogs.error('Unknown error when connecting to the server!', "There seems to be problem with your internet connection!\nCheck you connection and try again!");
            $scope.dlg1.result.then(function (btn) {
                $scope.dlg = null;
                //$state.go('login');
            });
        }
    }
    if ($rootScope.patientData.patientLabData == null) {

        $scope.$parent.loaderGifClass.display = "block";

        $http.get($rootScope.urls.patientLabUrl + "siteId=" + $rootScope.patientData.patientBasicData.siteID + "&residentId=" + $rootScope.patientData.patientBasicData.residentID)
               .success($scope.labDetailsLoaded)
               .error($scope.labDetailsError);
    }
    else {

        $scope.labDetails = $rootScope.patientData.patientLabData;
    }


});


app.controller('medicalChartsController', function ($scope, $http, $location, $state, Idle, Keepalive, $stateParams, $sce, $localStorage, dialogs, $rootScope, $filter) {
    $scope.chartSelected = {
        "chartType": "BLOOD_PRESSURE",
        "chartId": "2"
    };
    $scope.XAxisnames = [];
    $scope.chartConfig = {
        options: {
            chart: {

                type: 'line',

                marginRight: 100,
                height: 400,

            },
            legend: {
                align: 'left',
                verticalAlign: 'top',
                layout: 'horizontal',
                x: 70,
                marginBottom: 50

            },



            plotOptions: {
                series: {
                    marker: {


                        states: {
                            hover: {
                                enabled: false,


                            }
                        }
                    },

                }
            }
        },
        colors: ['#C0272C', '#20D0BB'],
        title: {
            text: ''
        },
        xAxis: {

            lineWidth: 1,
            gridLineWidth: 1,
            tickLength: 0,
            minPadding: 0,
            startOnTick: true,
            tickInterval: 1,
            tickmarkPlacement: 'on',
            maxPadding: 0,

            labels: {
                x: -5,
                y: 30,
                align: 'center',
                formatter: function () {
                    if ($scope.XAxisnames[this.value] != null)
                        return $scope.XAxisnames[this.value].toString().replace('\n', '<br/>');
                }
            }
        },


        yAxis: {
           // tickPixelInterval: 45,
            title: {
                text: ''
            },
          // tickInterval:5,
            lineWidth: 1,
            gridLineWidth: 1
            //,
            //,
          // min: '',
          //  max:''

        },




    }

    $scope.chartTypes = [];
    $scope.onChartsTypesLoaded = function (data, status, header, config) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].OBSERVATION_TYPE != "BMI") {
                $scope.chartTypes.push({
                    chartType: data[i].OBSERVATION_TYPE,
                    chartId: data[i].OBSERVATION_TYPE_ID
                });

            }
        }
        $rootScope.patientData.patientChartTypes = $scope.chartTypes;
    }
    $scope.onChartTypesError = function (data, status, header, config) {
        console.log("chart types loading error");
    }
    if ($rootScope.patientData.chartTypes == null) {

        $http.get($rootScope.urls.chartTypesUrl).success($scope.onChartsTypesLoaded).error($scope.onChartTypesError);
    }
    else {
        $scope.chartTypes = $rootScope.patientData.patientChartTypes;

    }

    $scope.calculateMaxMin = function () {
      //  console.log("$scope.chartConfig.series[0].data)" + $scope.chartConfig.series[0].data);
        var j = 0;
        $scope.temp = [];
        for (j = 0; j < $scope.chartConfig.series[0].data.length; j++) {
            $scope.temp[j] = angular.copy(parseInt($scope.chartConfig.series[0].data[j]));
        }

      //  console.log("temp" + $scope.temp);
        var temp1 = [];
         temp1 = $scope.temp;
        temp1.sort();
         temp1.sort(function (a, b) { return a - b; });
    
       $scope.chartConfig.yAxis.min = parseInt(temp1[0]);
       $scope.chartConfig.yAxis.max = parseInt(temp1[temp1.length - 1])+1;
       console.log(" $scope.chartConfig.yAxis.min" + $scope.chartConfig.yAxis.min + "\n$scope.chartConfig.yAxis.max" + $scope.chartConfig.yAxis.max);
      

    }
    $scope.setGraphValues = function (chartSelected) {

       
        $scope.XAxisnames = [];
        $scope.chartConfig = {
            options: {
                chart: {

                    type: 'line',

                    marginRight: 100,
                    height: 400,

                },
                legend: {
                    align: 'left',
                    verticalAlign: 'top',
                    layout: 'horizontal',
                    x: 70,
                    marginBottom: 50

                },



                plotOptions: {
                    series: {
                        marker: {


                            states: {
                                hover: {
                                    enabled: false,


                                }
                            }
                        },

                    }
                }
            },
            colors: ['#C0272C', '#20D0BB'],
            title: {
                text: ''
            },
            xAxis: {

                lineWidth: 1,
                gridLineWidth: 1,
                tickLength: 0,
                minPadding: 0,
                startOnTick: true,
                tickInterval: 1,
                tickmarkPlacement: 'on',
                maxPadding: 0,

                labels: {
                    x: -5,
                    y: 30,
                    align: 'center',
                    formatter: function () {
                        if ($scope.XAxisnames[this.value] != null)
                            return $scope.XAxisnames[this.value].toString().replace('\n', '<br/>');
                    }
                }
            },


            yAxis: {
                // tickPixelInterval: 45,
                title: {
                    text: ''
                },
                // tickInterval:5,
                lineWidth: 1,
                gridLineWidth: 1,
                //,
                //,
                 min: 0,
                 max:200

            },




        }
        $scope.chartConfig.series = [];
        $scope.chartConfig.series.push({
            color: '#C0272C',
            data: [],

            marker: {
                fillColor: '#FFFFFF',
                lineColor: '#C0272C',
                lineWidth: 2,
                symbol: 'circle',
                radius: 10,
                states: {
                    hover: {
                        enabled: false,


                    }
                }
            },


        });

        if (chartSelected.chartId == "2") {
            $scope.chartConfig.series.push({
                data: [],

                color: '#20D0BB',
                marker: {
                    lineColor: '#20D0BB',
                    lineWidth: 2,
                    symbol: 'circle',

                    fillColor: '#ffffff',
                    radius: 10,
                    states: {
                        hover: {
                            enabled: false,
                            height: 33,
                            width: 14

                        }
                    }
                }
            }

            );


        }


        if ($rootScope.patientData.patientChartValues[chartSelected.chartType].data.length == 0) {

            $http.post($rootScope.urls.chartValuesUrl + "siteId=" + $rootScope.patientData.patientBasicData.siteID + "&residentId=" + $rootScope.patientData.patientBasicData.residentID + "&observationTypeId=" + chartSelected.chartId).
                        success(function (data, status, config, header) {


                            var i;
                            if (chartSelected.chartId == "2") {
                                for (i = 0; i < data.length; i++) {
                                    $scope.chartConfig.series[0].data.push(data[i].VALUE_RATIO_NUMERATOR);
                                    $scope.chartConfig.series[1].data.push(data[i].VALUE_RATIO_DENOMINATOR);


                                    $scope.XAxisnames.push($filter('date')(new Date(data[i].LOAD_TIMESTAMP), 'HH:mm') + "\n" + $filter('date')(new Date(data[i].LOAD_TIMESTAMP), 'dd/MM'));

                                }
                             //   $scope.calculateMaxMin();
                            }
                            else {
                                for (i = 0; i < data.length; i++) {
                                    $scope.chartConfig.series[0].data.push(data[i].VALUE_QUANTITY);


                                    $scope.XAxisnames.push($filter('date')(new Date(data[i].LOAD_TIMESTAMP), 'HH:mm') + "\n" + $filter('date')(new Date(data[i].LOAD_TIMESTAMP), 'dd/MM'));
                                   
                                }
                                
                                $scope.calculateMaxMin();
                            }



                            for (var i = 0; i < $scope.chartConfig.series.length; i++) {


                                $rootScope.patientData.patientChartValues[chartSelected.chartType].data[i] = $scope.chartConfig.series[i].data;
                            }

                            $rootScope.patientData.patientChartValues[chartSelected.chartType].XAxisnames = $scope.XAxisnames;


                        })

                        .error(function (data, status, config, header) {

                            $scope.$parent.loaderGifClass.display = "none";
                            if (!$scope.dlg1) {
                                $scope.dlg1 = dialogs.error('Unknown error when connecting to the server!', "There seems to be problem with your internet connection!\nCheck you connection and try again!");
                                $scope.dlg1.result.then(function (btn) {
                                    $scope.dlg = null;
                                    //$state.go('login');
                                });
                            }
                        });


        }
        else {
            for (var i = 0; i < $scope.chartConfig.series.length; i++) {
                $scope.chartConfig.series[i].data = $rootScope.patientData.patientChartValues[chartSelected.chartType].data[i];

            }

            $scope.XAxisnames = $rootScope.patientData.patientChartValues[chartSelected.chartType].XAxisnames;
            if (chartSelected.chartId != "2")
            $scope.calculateMaxMin();
        }
        switch (chartSelected.chartType) {

            case "BLOOD_PRESSURE":
                $scope.chartConfig.title.text = "Blood Pressure (mmHg)";
                $scope.chartConfig.series[0].name = "BP Systolic";
                $scope.chartConfig.series[1].name = "BP Diastolic";


                break;
            case "PULSE":
                $scope.chartConfig.title.text = "Pulse (bpm)";
                $scope.chartConfig.series[0].name = "Pulse";

                break;

            case "ECG":
                $scope.chartConfig.title.text = "ECG";
                $scope.chartConfig.series[0].name = "ECG";
                break;

            case "SPIROMETER":
                $scope.chartConfig.title.text = "Spirometer";
                $scope.chartConfig.series[0].name = "Spirometer";
                break;

            case "BMI":
                $scope.chartConfig.title.text = "BMI (kg/m^2)";
                $scope.chartConfig.series[0].name = "BMI";

                break;

            case "OXYGEN_SATURATION":
                $scope.chartConfig.title.text = "Oxygen Saturation (%)";
                $scope.chartConfig.series[0].name = "Oxygen Saturation";

                break;

            case "TEMPERATURE":
                $scope.chartConfig.title.text = "Temperature (C)";
                $scope.chartConfig.series[0].name = "Temperature";

                break;

            case "HEIGHT":
                $scope.chartConfig.title.text = "Height (cm)";
                $scope.chartConfig.series[0].name = "Height";

                break;

            case "WEIGHT":
                $scope.chartConfig.title.text = "Weight (kg)";
                $scope.chartConfig.series[0].name = "Weight";

                break;

            case "RESPIRATION":
                $scope.chartConfig.title.text = "Respiration (per min)";
                $scope.chartConfig.series[0].name = "Respiration";
                break;

            case "PAIN_SCORE":
                $scope.chartConfig.title.text = "Pain score";
                $scope.chartConfig.series[0].name = "Pain score";
                break;


            case "INR":
                $scope.chartConfig.title.text = "INR";
                $scope.chartConfig.series[0].name = "INR";
                break;

        }
        $scope.chartConfig.yAxis.title.text = $scope.chartConfig.title.text;



    }

    $scope.onChartTypeClicked = function (chartClicked) {

        $scope.chartSelected = chartClicked;
        $scope.setGraphValues($scope.chartSelected);


    }

    $scope.setGraphValues($scope.chartSelected);

});


app.controller('timelineDetailsController1', function ($scope, $http, $location, $state, Idle, Keepalive, $stateParams, $sce, $localStorage, dialogs, $rootScope) {
    $scope.observationsDetails = [];
    $scope.observationDataValues = [];
   
    $scope.labDetails = [];
    $scope.labDataValues = [];

    function call(day) {
       // debugger
        var myDate = new Date(day);

        var n = myDate.getDay();

        if (n == 1) {
            return "Monday"
        }
        if (n == 2) {
            return "Tuesday"
        }
        if (n == 3) {
            return "Wednesday"
        }
        if (n == 4) {
            return "Thursday"
        }
        if (n == 5) {
            return "Friday"
        }
        if (n == 6) {
            return "Saturday"
        }
        if (n == 0) {
            return "Sunday"
        }
    }

    console.log("call date" + call(2010 - 08 - 01));
    $scope.onListViewBtnClicked = function () {
        $rootScope.menuSelectedHeader.path = "templates/directives/patientDetailsPage/sideNavOptions/timelineListView.html";
        $rootScope.subTab = "list";
        console.log("$scope.subTab" + $scope.subTab);

    }
    $scope.onCalendarViewBtnClicked = function () {
        $rootScope.menuSelectedHeader.path = "templates/directives/patientDetailsPage/sideNavOptions/timelineCalendarView.html";
        $rootScope.subTab = "calendar";
        console.log("$scope.subTab" + $scope.subTab);

    }


    $scope.observationClicked = function (timeline) {
        console.log("clicked"+timeline.CATEGORY_TYPE);
        $scope.sessionid = timeline.SESSION_ID;


        $scope.labsData = {};

        $scope.obsvData = {};

        $scope.patientObservationsDataLoaded = function (data, status, header, config) {

            $scope.$parent.loaderGifClass.display = "none";


            $scope.labDataValues[$scope.sessionid] = [];
            if (timeline.CATEGORY_TYPE == "BLOOD") {
             



              
                    for (var i = 0; i < data.length; i++) {


                        if (data[i].LABORATORY_TYPE_ID == 1) {
                            $scope.labDataValues[$scope.sessionid].sequence = data[i].VALUE_STRING;
                            $scope.labDataValues[$scope.sessionid].dateImported = data[i].LAST_UPDATE_TIMESTAMP;
                            $scope.labDataValues[$scope.sessionid].testDate = data[i].CAPTURE_DATE;

                        }
                        if (data[i].LABORATORY_TYPE_ID == 2) {
                            $scope.labDataValues[$scope.sessionid].actionStatus = data[i].VALUE_STRING;

                        }
                        if (data[i].LABORATORY_TYPE_ID == 3) {
                            $scope.labDataValues[$scope.sessionid].status = data[i].VALUE_STRING;

                        }
                        if (data[i].LABORATORY_TYPE_ID == 4) {
                            $scope.labDataValues[$scope.sessionid].MRN = data[i].VALUE_STRING;

                        }
                        if (data[i].LABORATORY_TYPE_ID == 5) {
                            $scope.labDataValues[$scope.sessionid].KUB = data[i].VALUE_STRING;

                        }
                        if (data[i].LABORATORY_TYPE_ID == 6) {
                            $scope.labDataValues[$scope.sessionid].sampleType = data[i].VALUE_STRING;

                        }
                        if (data[i].LABORATORY_TYPE_ID == 7) {
                            $scope.labDataValues[$scope.sessionid].clinicalObservations = data[i].VALUE_STRING;

                        }
                        if (data[i].LABORATORY_TYPE_ID == 8) {
                            $scope.labDataValues[$scope.sessionid].radiologyNumber = data[i].VALUE_QUANTITY;

                        }
                        if (data[i].LABORATORY_TYPE_ID == 9) {
                            $scope.labDataValues[$scope.sessionid].resultsFlag = data[i].VALUE_STRING;

                        }

                        if (data[i].LABORATORY_TYPE_ID == 10) {
                            $scope.labDataValues[$scope.sessionid].HGB = {
                                "results": data[i].VALUE_QUANTITY,
                                "unit": data[i].UNITS_SHORT,
                                "referenceRange": data[i].VALUE_RANGE_LOW + " - " + data[i].VALUE_RANGE_HIGH
                            }
                            console.log("$scope.labDataValues[$scope.sessionid].HGB" + JSON.stringify($scope.labDataValues[$scope.sessionid].HGB));
                        }

                        if (data[i].LABORATORY_TYPE_ID == 11) {
                            $scope.labDataValues[$scope.sessionid]["Hematocrit"] = {
                                "results": data[i].VALUE_QUANTITY,
                                "unit": data[i].UNITS_SHORT,
                                "referenceRange": data[i].VALUE_RANGE_LOW + " - " + data[i].VALUE_RANGE_HIGH
                            }

                        }
                        if (data[i].LABORATORY_TYPE_ID == 12) {
                            $scope.labDataValues[$scope.sessionid]["RBC"] = {
                                "results": data[i].VALUE_QUANTITY,
                                "unit": data[i].UNITS_SHORT,
                                "referenceRange": data[i].VALUE_RANGE_LOW + " - " + data[i].VALUE_RANGE_HIGH
                            }

                        }
                        if (data[i].LABORATORY_TYPE_ID == 13) {
                            $scope.labDataValues[$scope.sessionid]["WBC"] = {
                                "results": data[i].VALUE_QUANTITY,
                                "unit": data[i].UNITS_SHORT,
                                "referenceRange": data[i].VALUE_RANGE_LOW + " - " + data[i].VALUE_RANGE_HIGH
                            }

                        }
                        if (data[i].LABORATORY_TYPE_ID == 14) {
                            $scope.labDataValues[$scope.sessionid]["Basophils"] = {
                                "results": data[i].VALUE_QUANTITY,
                                "unit": data[i].UNITS_SHORT,
                                "referenceRange": data[i].VALUE_RANGE_LOW + " - " + data[i].VALUE_RANGE_HIGH
                            }

                        }

                        if (data[i].LABORATORY_TYPE_ID == 15) {
                            $scope.labDataValues[$scope.sessionid]["Eosinophils"] = {
                                "results": data[i].VALUE_QUANTITY,
                                "unit": data[i].UNITS_SHORT,
                                "referenceRange": data[i].VALUE_RANGE_LOW + " - " + data[i].VALUE_RANGE_HIGH
                            }

                        }
                        if (data[i].LABORATORY_TYPE_ID == 16) {
                            $scope.labDataValues[$scope.sessionid]["Segmenters"] = {
                                "results": data[i].VALUE_QUANTITY,
                                "unit": data[i].UNITS_SHORT,
                                "referenceRange": data[i].VALUE_RANGE_LOW + " - " + data[i].VALUE_RANGE_HIGH
                            }

                        }
                        if (data[i].LABORATORY_TYPE_ID == 17) {
                            $scope.labDataValues[$scope.sessionid]["Lymphocytes"] = {
                                "results": data[i].VALUE_QUANTITY,
                                "unit": data[i].UNITS_SHORT,
                                "referenceRange": data[i].VALUE_RANGE_LOW + " - " + data[i].VALUE_RANGE_HIGH
                            }

                        }
                        if (data[i].LABORATORY_TYPE_ID == 18) {
                            $scope.labDataValues[$scope.sessionid]["Monocytes"] = {
                                "results": data[i].VALUE_QUANTITY,
                                "unit": data[i].UNITS_SHORT,
                                "referenceRange": data[i].VALUE_RANGE_LOW + " - " + data[i].VALUE_RANGE_HIGH
                            }

                        }
                        if (data[i].LABORATORY_TYPE_ID == 19) {
                            $scope.labDataValues[$scope.sessionid]["plateletCount"] = {
                                "results": data[i].VALUE_QUANTITY,
                                "unit": data[i].UNITS_SHORT,
                                "referenceRange": data[i].VALUE_RANGE_LOW + " - " + data[i].VALUE_RANGE_HIGH
                            }

                        }
                        if (data[i].LABORATORY_TYPE_ID == 20) {
                            $scope.labDataValues[$scope.sessionid]["MCV"] = {
                                "results": data[i].VALUE_QUANTITY,
                                "unit": data[i].UNITS_SHORT,
                                "referenceRange": data[i].VALUE_RANGE_LOW + " - " + data[i].VALUE_RANGE_HIGH
                            }

                        }
                        if (data[i].LABORATORY_TYPE_ID == 21) {
                            $scope.labDataValues[$scope.sessionid]["MCH"] = {
                                "results": data[i].VALUE_QUANTITY,
                                "unit": data[i].UNITS_SHORT,
                                "referenceRange": data[i].VALUE_RANGE_LOW + " - " + data[i].VALUE_RANGE_HIGH
                            }

                        }
                        if (data[i].LABORATORY_TYPE_ID == 22) {
                            $scope.labDataValues[$scope.sessionid]["MCHC"] = {
                                "results": data[i].VALUE_QUANTITY,
                                "unit": data[i].UNITS_SHORT,
                                "referenceRange": data[i].VALUE_RANGE_LOW + " - " + data[i].VALUE_RANGE_HIGH
                            }

                        }
                        if (data[i].LABORATORY_TYPE_ID == 23) {
                            $scope.labDataValues[$scope.sessionid]["RDW"] = {
                                "results": data[i].VALUE_QUANTITY,
                                "unit": data[i].UNITS_SHORT,
                                "referenceRange": data[i].VALUE_RANGE_LOW + " - " + data[i].VALUE_RANGE_HIGH
                            }

                        }


                        //$scope.labDataValues[$scope.sessionid].push({
                        //    "valueResult": data[i].VALUE_QUANTITY,
                        //    "unit": data[i].UNITS_SHORT,
                        //    "referenceRangeLow": data[i].VALUE_RANGE_LOW,
                        //    "referenceRangeHigh": data[i].VALUE_RANGE_HIGH,
                        //    "valueName": data[i].VALUE_STRING
                        //});

                    }
                    $scope.labsData = $scope.labDataValues[$scope.sessionid];
                    $rootScope.patientData.patientLabDataValues[$scope.sessionid] = $scope.labDataValues[$scope.sessionid];

                















            }




            $scope.observationDataValues[$scope.sessionid] = {};
            if (timeline.CATEGORY_TYPE == "VITALS") {


                if (data[0].FULL_NAME == null) {
                    $scope.takenBy = "" + " " + data[0].CaptureTime.split(':')[0] + ":" + data[0].CaptureTime.split(':')[1];
                }
                else {
                    $scope.takenBy = data[0].FULL_NAME + " " + data[0].CaptureTime.split(':')[0] + ":" + data[0].CaptureTime.split(':')[1];
                }
                for (var i = 0; i < data.length; i++) {



                    switch (data[i].OBSERVATION_TYPE_ID) {

                        case 1:
                            $scope.observationDataValues[$scope.sessionid].pulse = data[i].VALUE_QUANTITY + " " + data[i].UNITS_SHORT;
                            break;

                        case 2:
                            $scope.observationDataValues[$scope.sessionid].bloodPressure = data[i].VALUE_RATIO_NUMERATOR + "/" + data[i].VALUE_RATIO_DENOMINATOR;
                            break;
                        case 3:
                            $scope.observationDataValues[$scope.sessionid].oxygenSaturation = data[i].VALUE_QUANTITY;
                            break;
                        case 4:
                            $scope.observationDataValues[$scope.sessionid].temperature = data[i].VALUE_QUANTITY;
                            $scope.observationDataValues[$scope.sessionid].temperatureMethod = data[i].OBSERVATION_METHOD;

                            break;
                        case 5:
                            $scope.observationDataValues[$scope.sessionid].height = data[i].VALUE_QUANTITY + " " + data[i].UNITS_SHORT;
                            $scope.height = data[i].VALUE_QUANTITY;
                            break;
                        case 6:
                            $scope.observationDataValues[$scope.sessionid].weight = data[i].VALUE_QUANTITY + " " + data[i].UNITS_SHORT;
                            $scope.weight = data[i].VALUE_QUANTITY;
                            break;


                    }
                    $scope.observationDataValues[$scope.sessionid].bmi = parseFloat($scope.weight / ($scope.height * $scope.height * 0.0001)).toFixed(2);
                    if ($scope.observationDataValues[$scope.sessionid].bmi >= 0 && $scope.observationDataValues[$scope.sessionid].bmi <= 16.0) {
                        $scope.observationDataValues[$scope.sessionid].bmiStatus = "Severely Underweight";
                    }
                    if ($scope.observationDataValues[$scope.sessionid].bmi > 16 && $scope.observationDataValues[$scope.sessionid].bmi <= 18.5) {
                        $scope.observationDataValues[$scope.sessionid].bmiStatus = "Underweight";
                    }
                    if ($scope.observationDataValues[$scope.sessionid].bmi > 18.5 && $scope.observationDataValues[$scope.sessionid].bmi <= 25) {
                        $scope.observationDataValues[$scope.sessionid].bmiStatus = "Normal";
                    }
                    if ($scope.observationDataValues[$scope.sessionid].bmi > 25 && $scope.observationDataValues[$scope.sessionid].bmi <= 30) {
                        $scope.observationDataValues[$scope.sessionid].bmiStatus = "Overweight";
                    }
                    if ($scope.observationDataValues[$scope.sessionid].bmi > 30 && $scope.observationDataValues[$scope.sessionid].bmi <= 35) {
                        $scope.observationDataValues[$scope.sessionid].bmiStatus = "Moderately obese";
                    }
                    if ($scope.observationDataValues[$scope.sessionid].bmi > 35) {
                        $scope.observationDataValues[$scope.sessionid].bmiStatus = "Severely obese";
                    }
                }

                $scope.obsvData = $scope.observationDataValues[$scope.sessionid];

                $rootScope.patientData.patientObservationDataValues[$scope.sessionid] = $scope.observationDataValues[$scope.sessionid];
            }

            if (timeline.CATEGORY_TYPE == "ECG" || timeline.CATEGORY_TYPE == "SPIROMETER") {


                $scope.pdfFileName = data[0].PDF_FILENAME;
                console.log("$scope.subTab" + $rootScope.subTab);
                $state.go('pdfViewerState', { patientSearchResults: $stateParams.patientSearchResults, document: $scope.pdfFileName, patientDetailsObject: $rootScope.patientData, tabActive: "timeline", subTab: $rootScope.subTab });

            }

            if (timeline.CATEGORY_TYPE == "INR") {

                $scope.observationDataValues[$scope.sessionid].INR = data[0].VALUE_QUANTITY;
                $scope.observationDataValues[$scope.sessionid].CCT = data[0].VALUE_TIME;
                $scope.obsvData = $scope.observationDataValues[$scope.sessionid];

                $rootScope.patientData.patientObservationDataValues[$scope.sessionid] = $scope.observationDataValues[$scope.sessionid];
            }


        }
        $scope.patientObservationsDataLoadFailed = function (data, status, header, config) {
            $scope.$parent.loaderGifClass.display = "none";
            if (!$scope.dlg1) {
                $scope.dlg1 = dialogs.error('Unknown error when connecting to the server!', "There seems to be problem with your internet connection!\nCheck you connection and try again!");
                $scope.dlg1.result.then(function (btn) {
                    $scope.dlg = null;
                    //$state.go('login');
                });
            }
        }





        switch (timeline.CATEGORY_TYPE) {

            case "VITALS":

                $('.obsvAccordion').attr('data-target', '#myModal5');

                if (!$rootScope.patientData.patientObservationDataValues[$scope.sessionid]) {
                    $scope.$parent.loaderGifClass.display = "block";
                    $http.get($rootScope.urls.patientObservationsVitalsUrl + "siteId=" + $rootScope.patientData.patientBasicData.siteID + "&residentId=" + $rootScope.patientData.patientBasicData.residentID + "&sessionid=" + $scope.sessionid).
                    success($scope.patientObservationsDataLoaded).
                    error($scope.patientObservationsDataLoadFailed);
                }
                else {
                    $scope.obsvData = $rootScope.patientData.patientObservationDataValues[$scope.sessionid];
                }
                break;
            case "BLOOD":

                $('.obsvAccordion').attr('data-target', '#myModal1');

                if (!$rootScope.patientData.patientLabDataValues[$scope.sessionid]) {
                    $scope.$parent.loaderGifClass.display = "block";
                    $http.get($rootScope.urls.patientLabDetailsUrl + "siteId=" + $rootScope.patientData.patientBasicData.siteID + "&residentId=" + $rootScope.patientData.patientBasicData.residentID + "&sessionid=" + $scope.sessionid).
                        success($scope.patientObservationsDataLoaded).
                        error($scope.patientObservationsDataLoadFailed);
                }
                else {
                    $scope.labsData = $rootScope.patientData.patientLabDataValues[$scope.sessionid];
                }
                break;

            case "ECG":
                $('.obsvAccordion').attr('data-target', null);


                if (!$rootScope.patientData.patientObservationDataValues[$scope.sessionid]) {

                    $http.get($rootScope.urls.patientObservationsECGUrl + "siteId=" + $rootScope.patientData.patientBasicData.siteID + "&residentId=" + $rootScope.patientData.patientBasicData.residentID + "&sessionid=" + $scope.sessionid).
                        success($scope.patientObservationsDataLoaded).
                        error($scope.patientObservationsDataLoadFailed);
                }
                else {
                    $scope.obsvData = $rootScope.patientData.patientObservationDataValues[$scope.sessionid];
                }


                break;

            case "INR":

                $('.obsvAccordion').attr('data-target', '#inrModal');

                if (!$rootScope.patientData.patientObservationDataValues[$scope.sessionid]) {
                    $scope.$parent.loaderGifClass.display = "block";
                    $http.get($rootScope.urls.patientObservationsINRUrl + "siteId=" + $rootScope.patientData.patientBasicData.siteID + "&residentId=" + $rootScope.patientData.patientBasicData.residentID + "&sessionid=" + $scope.sessionid).
                        success($scope.patientObservationsDataLoaded).
                        error($scope.patientObservationsDataLoadFailed);
                }
                else {
                    $scope.obsvData = $rootScope.patientData.patientObservationDataValues[$scope.sessionid];
                }

                break;

            case "SPIROMETER":
                $('.obsvAccordion').attr('data-target', null);

                if (!$rootScope.patientData.patientObservationDataValues[$scope.sessionid]) {

                    $http.get($rootScope.urls.patientObservationsSpirometerUrl + "siteId=" + $rootScope.patientData.patientBasicData.siteID + "&residentId=" + $rootScope.patientData.patientBasicData.residentID + "&sessionid=" + $scope.sessionid).
                        success($scope.patientObservationsDataLoaded).
                        error($scope.patientObservationsDataLoadFailed);
                }
                else {
                    $scope.obsvData = $rootScope.patientData.patientObservationDataValues[$scope.sessionid];
                }
                break;


        }
    }
    $scope.allDataArray = [];
    $scope.osvDataArray = [];
    $scope.labDataArray = [];
    $scope.obsvDataLoaded = function (data, status, header, config) {
        for (var i = 0; i < data.length; i++) {
            $scope.osvDataArray.push(data[i]);
        }
        console.log("osvDataArray" + $scope.osvDataArray + "\nlength:" + $scope.osvDataArray.length);
        $http.get($rootScope.urls.patientLabUrl + "siteId=" + $rootScope.patientData.patientBasicData.siteID + "&residentId=" + $rootScope.patientData.patientBasicData.residentID)

          .success($scope.labDataLoaded)
          .error($scope.timelineDataError);
    }
    $scope.labDataLoaded = function (data, status, header, config) {
        for (var i = 0; i < data.length; i++) {
            $scope.labDataArray.push(data[i]);
        }
        console.log("labDataArray" + $scope.labDataArray + "\nlength:" + $scope.labDataArray.length);
        $scope.allDataArray = $scope.osvDataArray.concat($scope.labDataArray);
        console.log("allDataArray" + $scope.allDataArray + "\nlength:" + $scope.allDataArray.length);

        groupingDates();
       
       // $scope.dateContainerWidth = { "width": "" };
    }

    function groupingDates() {
        var j = 0;
        var uniqueDates = [];
        $scope.datesArray = [];
        for (j = 0; j < $scope.allDataArray.length; j++) {
            $scope.datesArray.push($scope.allDataArray[j].START_TIMESTAMP.split('T')[0]);

        }
        console.log("dates are\n" + $scope.datesArray);
        var uniqueDates = $scope.datesArray.filter(function (elem, index, self) {
            return index == self.indexOf(elem);
        })
        console.log("unique dates" + uniqueDates);
        $scope.newObj = [];
        
        for (var i = 0; i < uniqueDates.length; i++) {
            var currDate = uniqueDates[i];
            var arrayVals = [];
           // $scope.newObj.push(currDate);
          //  $scope.newObj[currDate] = [];

           

            for (var k = 0; k < $scope.allDataArray.length; k++) {
                if ($scope.allDataArray[k].START_TIMESTAMP.split('T')[0] == currDate) {
                    arrayVals.push($scope.allDataArray[k]);
                }
            }
            $scope.newObj.push(
               {
                   dateValue: currDate,
                   dayValue:call(currDate),
                   dataValues:arrayVals
               }
               );
            for (var y = 0; y < $scope.newObj.length; y++)
                console.log("date:" + $scope.newObj[y].dateValue+"\nday:" + $scope.newObj[y].dayValue+ "Data" + $scope.newObj[y].dataValues.length);
            console.log("$$$$$$$$$$$$$$$");
            
        }
        
        console.log("length of newobj is" + $scope.newObj.length);


        console.log("unique lenght" + uniqueDates.length);
        $scope.width = 202 * (uniqueDates.length);
        $scope.width = $scope.width + "px";
        //var myElement1 = document.querySelector("#dateContainer");
        //myElement1.style.width = width + "px";
        //var myElement2 = document.querySelector("#issueContainer");
        //myElement2.style.width = width + "px";
        $scope.dateContainerWidth = { "width": $scope.width };
        $scope.issueContainerWidth = { "width": $scope.width };
        $rootScope.patientData.patientTimelineVal.timelineData = $scope.newObj;
        $rootScope.patientData.patientTimelineVal.width = $scope.width;
        $scope.$parent.loaderGifClass.display = "none";

    }
    

    $scope.timelineDataError = function (data, status, header, config) {
        console.log("ERROR!!");
    }
    if ($rootScope.patientData.patientTimelineVal.timelineData == null) {
        $scope.$parent.loaderGifClass.display = "block";
        $http.get($rootScope.urls.patientObservationsUrl + "siteId=" + $rootScope.patientData.patientBasicData.siteID + "&residentId=" + $rootScope.patientData.patientBasicData.residentID)

                  .success($scope.obsvDataLoaded)
                  .error($scope.timelineDataError);

    } else {

        $scope.newObj = $rootScope.patientData.patientTimelineVal.timelineData;
        $scope.width = $rootScope.patientData.patientTimelineVal.width;
        $scope.dateContainerWidth = { "width": $scope.width };
        $scope.issueContainerWidth = { "width": $scope.width };
        
    }
   

});






app.controller('medicationDetailsController', function ($scope, $http, $location, $state, Idle, Keepalive, $stateParams, $sce, $localStorage, dialogs, $rootScope) {

    $scope.medicationDetails = [];

    $scope.prescSelectedDate = "Prescription Start Date";
    $scope.prescDateClicked = function (selectedDate) {
        $scope.prescSelectedDate = selectedDate;
        $scope.medicationDetails = [];
        if ($scope.prescSelectedDate == "No date selected") {
            $scope.medicationDetails = $rootScope.patientData.patientMedicationData;
        }
        else {
            for (var i = 0; i < $rootScope.patientData.patientMedicationData.length; i++) {
                if ($rootScope.patientData.patientMedicationData[i].start == $scope.prescSelectedDate) {
                    $scope.medicationDetails.push($rootScope.patientData.patientMedicationData[i]);
                }
            }
        }
    }
    $scope.medicationDetailsDataLoaded = function (data, status, config, header) {

        for (var i = 0; i < data.length; i++) {
            $scope.medicationDetails.push(
                {
                    "genericName": data[i].GENERIC_DRUG_NAME,
                    "drugName": data[i].DRUG_NAME,
                    "dose": data[i].DOSE_QUANTITY + " " + data[i].DOSE_UNIT,
                    "start": data[i].DATE_DRUG_STARTED.split('T')[0],
                    "duration": data[i].INTENDED_DURATION,
                    "method": data[i].ROUTE,
                    "PNR_Medication": data[i].PRN_MEDICATION,
                    "Special_Course": data[i].SPECIAL_COURSE,
                    "Regular_Prescription_drug": data[i].REGULAR_PRESCRIPTION_DRUG,
                    "started_flag": data[i].DRUG_STARTED,
                    "stopped_flag": data[i].DRUG_STOPPED,
                    "compliance_flag": data[i].SCRIPT_COMPLIANCE_FLAG,
                    "status": [],
                    "direction": data[i].Direction,
                    "TOD1": data[i].TOD1.split(':')[0] + ":" + data[i].TOD1.split(':')[1],
                    "TOD2": data[i].TOD2.split(':')[0] + ":" + data[i].TOD2.split(':')[1],
                    "TOD3": data[i].TOD3.split(':')[0] + ":" + data[i].TOD3.split(':')[1],
                    "TOD4": data[i].TOD4.split(':')[0] + ":" + data[i].TOD4.split(':')[1],
                    "TOD5": data[i].TOD5.split(':')[0] + ":" + data[i].TOD5.split(':')[1],
                    "TOD6": data[i].TOD6.split(':')[0] + ":" + data[i].TOD6.split(':')[1],
                }
                );
        }
        $scope.medicationDetails.sort(function (a, b) {

            var medicationDate1 = a.start;

            var medicationDate2 = b.start;


            return new Date(medicationDate2).valueOf() - new Date(medicationDate1).valueOf();

        }
);




        for (var i = 0; i < $scope.medicationDetails.length; i++) {

            if ($scope.medicationDetails[i].started_flag == "true") {
                $scope.medicationDetails[i].status.push("started");
            }
            if ($scope.medicationDetails[i].stopped_flag == "true") {
                $scope.medicationDetails[i].status.push("stopped");
            }
            if ($scope.medicationDetails[i].compliance_flag == "false") {
                $scope.medicationDetails[i].status.push("not_compliant");
            }
            if ($scope.medicationDetails[i].start.valueOf() > new Date().valueOf()) {
                $scope.medicationDetails[i].status.push("future");
            }

        }
        $rootScope.patientData.patientMedicationData = $scope.medicationDetails;
        for (var i = 0; i < $scope.medicationDetails.length; i++) {
            $scope.medicationDetails[i].isOpen = "false";

        }
        $scope.prescDatesArray = [];
        $scope.prescDatesArray.push("No date selected");
        for (var i = 0; i < $scope.medicationDetails.length; i++) {


            if ($scope.prescDatesArray.indexOf($scope.medicationDetails[i].start) == -1)
                $scope.prescDatesArray.push($scope.medicationDetails[i].start);
        }

        $rootScope.prescriptionDates = $scope.prescDatesArray;


        $scope.$parent.loaderGifClass.display = "none";
    }
    $scope.medicationDetailsDataError = function (data, status, config, header) {
        $scope.$parent.loaderGifClass.display = "none";
        if (!$scope.dlg1) {
            $scope.dlg1 = dialogs.error('Unknown error when connecting to the server!', "There seems to be problem with your internet connection!\nCheck you connection and try again!");
            $scope.dlg1.result.then(function (btn) {
                $scope.dlg = null;
                //$state.go('login');
            });
        }
    }


    if ($rootScope.patientData.patientMedicationData == null) {
        $scope.$parent.loaderGifClass.display = "block";
        $http.get($rootScope.urls.patientMedicationsUrl + "siteid=" + $rootScope.patientData.patientBasicData.siteID + "&residentid=" + $rootScope.patientData.patientBasicData.residentID).
       // $http.get("http://tlcdev.cloudapp.net/api/getMedication?siteid=887&residentid=2").
            success($scope.medicationDetailsDataLoaded)
            .error($scope.medicationDetailsDataError);

    }
    else {
        $scope.medicationDetails = $rootScope.patientData.patientMedicationData;

        $scope.prescDatesArray = $rootScope.prescriptionDates;
    }



    $scope.onPlusClicked = function (position) {

        if ($scope.medicationDetails[position].isOpen == "false") {
            $scope.medicationDetails[position].isOpen = "true";

        }
        else {

            $scope.medicationDetails[position].isOpen = "false";

        }

    }
    $scope.setDisplayDetailsStyle = function (position) {
        if ($scope.medicationDetails[position].isOpen == "true") {
            return {
                display: "block"

            }
        }
        else {

            return {
                display: "none"

            }
        }
    }
    $scope.setPlusMinusSymbolClass = function (position) {
        if ($scope.medicationDetails[position].isOpen == "true") {
            return "glyphicon glyphicon-minus glyphiconFullHeightWidth";
        }
        else {
            return "glyphicon glyphicon-plus glyphiconFullHeightWidth";
        }
    }
    $scope.setPlusMinusButtonStyle = function (position) {
        if ($scope.medicationDetails[position].isOpen == "true") {
            return {
                "color": "white",
                "background-color": "#cccccc"



            }
        }
        else {

            return {
                "color": "#cccccc",
                "background-color": "white"

            }
        }
    }

});



app.controller('loadingGifController', ['$scope', '$modalInstance', 'data', function ($scope, $modalInstance, data) {

    $scope.message = data["message"];
    $scope.done = function () {
        $modalInstance.dismiss('canceled');
    }
}]);

