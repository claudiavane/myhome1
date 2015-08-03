angular.module('starter.controllers', ['firebase','ngCordova','ionic.service.core'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('SignInCtrl', function($scope, $ionicModal, $state, $firebaseAuth, $stateParams, $rootScope) {
  console.log("SignInCtrl....");

  var ref = new Firebase($scope.firebaseUrl);
  var auth = $firebaseAuth(ref);

      //var ref = new Firebase(firebaseUrl);
      //var products = $firebaseArray(ref);

  $ionicModal.fromTemplateUrl('templates/sign-up.html', {
        scope: $scope
  }).then(function (modal) {
      $scope.modal = modal;
  }); 

  $scope.createUser = function (user) {
      console.log("Create User Function called");
      if (user && user.email && user.password && user.displayname) {
          $ionicLoading.show({
              template: 'Registrando...'
          });

          auth.$createUser({
              email: user.email,
              password: user.password
          }).then(function (userData) {
              alert("Usuario creado");
              ref.child("users").child(userData.uid).set({
                  email: user.email,
                  displayName: user.displayname
              });
              $ionicLoading.hide();
              $scope.modal.hide();
          }).catch(function (error) {
              alert("Error: " + error);
              $ionicLoading.hide();
          });
      } else
          alert("Por favor llene todos los datos");
  }

  $scope.signIn = function (user) {

      if (user && user.email && user.pwdForLogin) {
          $ionicLoading.show({
              template: 'Signing In...'
          });
          auth.$authWithPassword({
              email: user.email,
              password: user.pwdForLogin
          }).then(function (authData) {
              console.log("Logged in as:" + authData.uid);
              ref.child("users").child(authData.uid).once('value', function (snapshot) {
                  var val = snapshot.val();
                  // To Update AngularJS $scope either use $apply or $timeout
                  $scope.$apply(function () {
                      $rootScope.displayName = val;
                  });
              });
              $ionicLoading.hide();
              $state.go('tab.rooms');
          }).catch(function (error) {
              alert("Authentication failed:" + error.message);
              $ionicLoading.hide();
          });
      } else
          alert("Please enter email and password both");
  }

})

.controller('SearchCtrl', function($scope, $state, HoseData) {
  console.log("SearchCtrl...");
  
  /*$scope.slider = {};
  $scope.slider.price = 200000;
    
  $scope.$watch('slider.price',function(val,old){
     $scope.slider.price = parseInt(val);
     console.log('range=' + $scope.slider.price)
      
  });*/

  $scope.search = function(filter) {
    if (filter.isShowMap) {
      $state.go('app.searchResultMap'); 
    } 
    else{
      $state.go('app.searchResultList'); 
    };
    
  }
  
})

.controller('SearchResultListCtrl', function($scope, $stateParams, $rootScope, HoseData) {
  console.log("SearchResultListCtrl....");
  $scope.products = HoseData.all(); 

})

.controller('SearchResultMapCtrl', function($scope, $stateParams) {
  var ref = new Firebase("https://sweltering-inferno-1375.firebaseio.com/"+$stateParams.productId);
  $scope.product = $firebaseObject(ref);

})

.controller('HomeDetailCtrl', function($scope, $stateParams, $firebaseObject) {
  console.log("HomeDetailCtrl...");
  var ref = new Firebase("https://sweltering-inferno-1375.firebaseio.com/"+$stateParams.productId);
  $scope.product = $firebaseObject(ref);
  console.log($scope.product);

  

  $scope.allImages = $scope.product.image['img300x400'];

  /*[{
    src: 'img/pic1.jpg'
  }, {
    src: 'img/pic2.jpg'
  }, {
    src: 'img/pic3.jpg'
  }];*/

  $scope.showImages = function(index) {
    $scope.activeSlide = index;
    $scope.showModal('templates/imageViewer.html');
  }

  $scope.showModal = function(templateUrl) {
    $ionicModal.fromTemplateUrl(templateUrl, {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });
  }
  // Close the modal
  $scope.closeModal = function() {
    $scope.modal.hide();
    $scope.modal.remove()
  };
})

.controller('HomeDetailLocationCtrl', function($scope, $rootScope, $stateParams, $firebaseObject) {
  console.log("HomeDetailLocationCtrl...");
  var ref = new Firebase("https://sweltering-inferno-1375.firebaseio.com/"+$stateParams.productId);
  $scope.product = $firebaseObject(ref);

  $scope.product.$loaded().then(function() {
    $scope.loadMap();
  });

  $scope.loadMap = function(){
    var myLatlng = new google.maps.LatLng($scope.product.location.latitude, $scope.product.location.longitude);
    var mapOptions = {
        center: myLatlng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    console.log($scope.product.location.latitude);

    var marker = new google.maps.Marker({
            position: new google.maps.LatLng($scope.product.location.latitude, $scope.product.location.longitude),
            map: map,
            title: $scope.product.zone
    });
  }
})

.controller('HomeDetailContactCtrl', function($scope, $stateParams, $firebaseObject) {
  console.log("HomeDetailContactCtrl...");
  var ref = new Firebase("https://sweltering-inferno-1375.firebaseio.com/"+$stateParams.productId);
  $scope.product = $firebaseObject(ref);
  console.log($scope.product);
  
})

.controller('PublishListCtrl', function($scope, $rootScope, HoseData, $firebaseArray) {
  console.log("PublishListCtrl...");
  $scope.products = HoseData.all();  

  $scope.remove = function (product) {
        HoseData.remove(product);
  }
  $scope.edit = function (product) {
        HoseData.remove(product);
  }
  $scope.setIsSold = function (product) {
        HoseData.updateIsSold(product);
  }
})

.controller('PublishCtrl', function($scope, $stateParams, $firebaseObject, $firebaseArray, $rootScope, $state, $cordovaCamera, $cordovaGeolocation) {     
      console.log("Publish...");
      //if (!$rootScope.userSignedIn()){
        //$state.go('sign-in');
      //} 
      $scope.refire = new Firebase("https://sweltering-inferno-1375.firebaseio.com");

      console.log($stateParams.productId);
      if ($stateParams.productId) {
        console.log("Edit...");
        var ref = new Firebase("https://sweltering-inferno-1375.firebaseio.com/"+$stateParams.productId);
        $scope.product = $firebaseObject(ref);
        
      } else {
        console.log("New...");
        $scope.product = {city: '', description: '', houseId: '', houseType: '',image:{img1080x1440:[{height:'',url:'http://i.imgur.com/6u9VgMe.jpg',width:''}], img300x400:[{height:'',url:'http://i.imgur.com/6u9VgMe.jpg',width:''}]}, leaseType: '', location: {latitude: -17.37, longitude: -66.15}, price: '', registerDate: '', status: 'Activo', surface: '', surfaceBuild: '', userId: '1', zone: ''};         
      }

      //$scope.product = {name: '', sale_price: '', content: {description: ''}, photo: '', lat: -17.37, long: -66.15};
      //$scope.product = {city: '', description: '', houseId: '', houseType: '', leaseType: '', location: {latitude: -17.37, longitude: -66.15}, price: '', registerDate: '', status: 'Activo', surface: '', surfaceBuild: '', userId: '1', zone: ''};
      
      //console.log($scope.product.location.latitude);
      //console.log($scope.product.location.longitude);

    //document.addEventListener("deviceready", function () {
    $scope.takePicture = function() {
          var options = {
              quality : 75,
              destinationType : Camera.DestinationType.DATA_URL,
              sourceType : Camera.PictureSourceType.CAMERA,
              allowEdit : true,
              encodingType: Camera.EncodingType.JPEG,
              popoverOptions: CameraPopoverOptions,
              targetWidth: 500,
              targetHeight: 500,
              saveToPhotoAlbum: false
          };
          $cordovaCamera.getPicture(options).then(function(imageData) {
              //syncArray.$add({image: imageData}).then(function() {
              //    alert("Image has been uploaded");
              //});
              console.log(imageData);
              $scope.product.photo = imageData;

          }, function(error) {
              console.error(error);
          });
      }

    $scope.uploadProduct = function() {

      console.log($scope.product.location.latitude);
      console.log($scope.product.location.longitude);

      var productRef =  $scope.refire.push($scope.product);
      var productId = productRef.key();
      $state.go('app.publishList');
    }

    $scope.goLocation = function() {
      $state.go('app.publishLocation');
    }

})

.controller('PublishLocationCtrl', function($scope, $rootScope, $state, $cordovaGeolocation) {
     
      console.log("PublishLocation...");
      //if (!$rootScope.userSignedIn()){
        //$state.go('sign-in');
      //} 
      $scope.product = {city: '', description: '', houseId: '', houseType: '',image:{img1080x1440:[{height:'',url:'http://i.imgur.com/6u9VgMe.jpg',width:''}], img300x400:[{height:'',url:'http://i.imgur.com/6u9VgMe.jpg',width:''}]}, leaseType: '', location: {latitude: -17.37, longitude: -66.15}, price: '', registerDate: '', status: 'Activo', surface: '', surfaceBuild: '', userId: '1', zone: ''};
      //var posLat = $scope.product.location.latitude;
      //var posLon = $scope.product.location.longitude;

      var positionLtLg;
      var myLatlng = new google.maps.LatLng(-17.37, -66.15);
      var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      var map = new google.maps.Map(document.getElementById("map"), mapOptions);

      var marker = new google.maps.Marker({
              position: new google.maps.LatLng(-17.37, -66.15),
              map: map,
              title: "Mi locacion",
              animation: google.maps.Animation.DROP,
              options: { draggable: true }
      });
      
      var posOptions = {timeout: 10000, enableHighAccuracy: false};

      $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);
        //$scope.product.location.latitude  = position.coords.latitude
        //$scope.product.location.longitude = position.coords.longitude
        map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));

        marker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));

      }, function(err) {
          console.log(err);
      });

      var watchOptions = {
        frequency : 1000,
        timeout : 3000,
        enableHighAccuracy: false // may cause errors if true
      };

      var watch = $cordovaGeolocation.watchPosition(watchOptions);
      watch.then(
        null,
        function(err) {
          console.log(err);
        },
        function(position) {
          
          //$scope.product.location.latitude  = position.coords.latitude;
          //$scope.product.location.longitude = position.coords.longitude;
          marker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
      });

      google.maps.event.addListener(marker, 'dragend', function() {
          $scope.$apply(function(){
            //Stop listening changes
            watch.clearWatch();
            //var pos = marker.getPosition();
            positionLtLg = marker.getPosition();
            //console.log(pos);
            //$scope.product.location.latitude  = pos.A;
            //$scope.product.location.longitude = pos.F;
            console.log(positionLtLg.A);
            console.log(positionLtLg.F);
          });
      });

      $scope.setLocation = function() {

        positionLtLg = marker.getPosition();

        $scope.product.location.latitude  = positionLtLg.A;
        $scope.product.location.longitude = positionLtLg.F;
        console.log($scope.product.location.latitude);
        console.log($scope.product.location.longitude);
    
        $state.go('app.publish');
      }
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
