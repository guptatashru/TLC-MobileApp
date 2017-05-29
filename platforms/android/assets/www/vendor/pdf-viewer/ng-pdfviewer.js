


angular.module('ngPDFViewer', []).
directive('pdfviewer', ['$parse', function ($parse) {
    var canvas = null;
    var instance_id = null;

    return {
        restrict: "E",
        template: '<canvas id="pdfCanvas"></canvas>',
        scope: {
            onPageLoad: '&',
            loadProgress: '&',
            src: '@',
            id: '='
        },
        controller: ['$rootScope', '$scope', 'dialogs', '$state', '$stateParams', function ($rootScope, $scope, dialogs, $state, $stateParams) {
            $scope.pageNum = 1;
            $scope.pdfDoc = null;
            $scope.scale = 1.0;

            $scope.documentProgress = function (progressData) {
                if ($scope.loadProgress) {
                    $scope.loadProgress({ state: "loading", loaded: progressData.loaded, total: progressData.total });
                }
            };

            $scope.loadPDF = function (path) {

                PDFJS.getDocument(path, null, null, $scope.documentProgress).then(function (_pdfDoc) {
                    $scope.pdfDoc = _pdfDoc;
                    $rootScope.$broadcast('pdfLoaded');
                    $scope.renderPage($scope.pageNum, function (success) {
                        if ($scope.loadProgress) {
                            $scope.loadProgress({ state: "finished", loaded: 0, total: 0 });
                        }
                    });
                }, function (message, exception) {
                    console.log("PDF load error: " + message);

                    if ($scope.loadProgress) {
                        $scope.loadProgress({ state: "error", loaded: 0, total: 0 });
                    }
                    $scope.$parent.loaderGifClass.display = "none";
                    $scope.dlg = dialogs.error('Unable to load pdf! Switching you to patient details !');
                    $scope.dlg.result.then(function (btn) {
                        $state.go('patientDetails', { patientSearchResults: $stateParams.patientSearchResults, patientDetailsObject: $stateParams.patientDetailsObject, tabActive: "doc" });     //navigates to state mentioned 

                     //   $state.go('patientDetails', { patientListData: $stateParams.patientListData, patientDetailsObject: $stateParams.patientDetailsToBeDisplayed, tabState: "doc" });     //navigates to state mentioned 
                    });
                });
            };

            $scope.renderPage = function (num, callback) {

                $scope.pdfDoc.getPage(num).then(function (page) {
                    var viewport = page.getViewport($scope.scale);
                    var ctx = canvas.getContext('2d');

                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    page.render({ canvasContext: ctx, viewport: viewport }).promise.then(
						function () {
						    if (callback) {
						        callback(true);
						    }
						    $scope.$apply(function () {
						        $scope.onPageLoad({ page: $scope.pageNum, total: $scope.pdfDoc.numPages });
						    });
						},
						function () {
						    if (callback) {
						        callback(false);
						    }
						    console.log('page.render failed');
						}
					);
                });
            };

            $scope.$on('pdfviewer.nextPage', function (evt, id) {
                if (id !== instance_id) {
                    return;
                }

                if ($scope.pageNum < $scope.pdfDoc.numPages) {
                    $scope.pageNum++;
                    $scope.renderPage($scope.pageNum);
                }
            });

            $scope.$on('pdfviewer.prevPage', function (evt, id) {
                if (id !== instance_id) {
                    return;
                }

                if ($scope.pageNum > 1) {
                    $scope.pageNum--;
                    $scope.renderPage($scope.pageNum);
                }
            });

            $scope.$on('pdfviewer.gotoPage', function (evt, id, page) {
                if (id !== instance_id) {
                    return;
                }

                if (page >= 1 && page <= $scope.pdfDoc.numPages) {
                    $scope.pageNum = page;
                    $scope.renderPage($scope.pageNum);
                }
            });


            $scope.$on('pdfviewer.zoomIn', function (evt, id) {
			   
                			    if (id !== instance_id) {
			        
                			        return;
                			    }
			    
                			   // $scope.scale = parseFloat($scope.scale) + 0.4;
		
                			    $scope.renderPage($scope.pageNum);
			    
                			    document.getElementById("pdfCanvas").style.width = "200%";
                			    document.getElementById("pdfCanvas").style.height = "200%";
                			    return;
                			});

                			$scope.$on('pdfviewer.zoomOut', function (evt, id) {
			    
                			    if (id !== instance_id) {
			        
                			        return;
                			    }
                			    //$scope.scale = parseFloat($scope.scale) - 0.4;
			    

                			    $scope.renderPage($scope.pageNum);
                			    document.getElementById("pdfCanvas").style.width = "100%";
                			    document.getElementById("pdfCanvas").style.height = "100%";
                			    return;
                			});



        }],
        link: function (scope, iElement, iAttr) {
            canvas = iElement.find('canvas')[0];
            instance_id = iAttr.id;

            iAttr.$observe('src', function (v) {

                if (v !== undefined && v !== null && v !== '') {
                    scope.pageNum = 1;
                    scope.loadPDF(scope.src);
                }
            });
        }
    };
}]).
service("PDFViewerService", ['$rootScope', function ($rootScope) {

    var svc = {};
    svc.nextPage = function () {
        $rootScope.$broadcast('pdfviewer.nextPage');
    };

    svc.prevPage = function () {
        $rootScope.$broadcast('pdfviewer.prevPage');
    };
    svc.zoomIn = function () {
        	    $rootScope.$broadcast('pdfviewer.zoomIn');
        	};

        	svc.zoomOut = function () {
        	    $rootScope.$broadcast('pdfviewer.zoomOut');
        	};

    svc.Instance = function (id) {
        var instance_id = id;

        return {
            prevPage: function () {
                $rootScope.$broadcast('pdfviewer.prevPage', instance_id);
            },
            nextPage: function () {
                $rootScope.$broadcast('pdfviewer.nextPage', instance_id);
            },
            gotoPage: function (page) {
                $rootScope.$broadcast('pdfviewer.gotoPage', instance_id, page);
            },
            zoomIn: function () {
               		    $rootScope.$broadcast('pdfviewer.zoomIn', instance_id);
               		},
         zoomOut: function () {
                		    $rootScope.$broadcast('pdfviewer.zoomOut', instance_id);
       }
        };
    };

    return svc;
}]);