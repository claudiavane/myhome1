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


.controller('PublishListCtrl', function($scope, $firebaseArray) {

  //$scope.ref = new Firebase("https://shining-inferno-7335.firebaseio.com/products");
  $scope.ref = new Firebase("https://sweltering-inferno-1375.firebaseio.com");
  $scope.products = $firebaseArray($scope.ref);


  $scope.addItems = function() {
    var product = {'name':'Iphone', 'sale_price': 78.10, 'img':'http://www.att.com/wireless/iphone/assets/207138-iPhone6-device2.jpg'};
    var product2 = {'name':'Android', 'sale_price': 78.10, 'img':'http://www.att.com/wireless/iphone/assets/207138-iPhone6-device2.jpg'};
    $scope.products.push(product);
    $scope.products.push(product2);

    $scope.$broadcast('scroll.infiniteScrollComplete')
  }

  $scope.doRefresh = function() {
    var product = {'name':'Iphone', 'sale_price': 78.10, 'img':'http://www.att.com/wireless/iphone/assets/207138-iPhone6-device2.jpg'};
    var product2 = {'name':'Android', 'sale_price': 78.10, 'img':'http://www.att.com/wireless/iphone/assets/207138-iPhone6-device2.jpg'};
    $scope.products.push(product);
    $scope.products.push(product2);

    //$scope.$broadcast('scroll.infiniteScrollComplete')
  }

})


.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PublishCtrl', function($scope, $firebaseArray, $rootScope, $state, $cordovaCamera, $cordovaGeolocation) {
     
      console.log("Publish...");
      //if (!$rootScope.userSignedIn()){
        //$state.go('sign-in');
      //} 

      $scope.refire = new Firebase("https://sweltering-inferno-1375.firebaseio.com");
      //$scope.product = {name: '', sale_price: '', content: {description: ''}, photo: '', lat: -17.37, long: -66.15};
      //$scope.product = {city: '', description: '', houseId: '', houseType: '', leaseType: '', location: {latitude: -17.37, longitude: -66.15}, price: '', registerDate: '', status: 'Activo', surface: '', surfaceBuild: '', userId: '1', zone: ''};
      $scope.product = {city: '', description: '', houseId: '', houseType: '',image:{img1080x1440:[{height:'',url:'http://i.imgur.com/6u9VgMe.jpg',width:''}], img300x400:[{height:'',url:'http://i.imgur.com/6u9VgMe.jpg',width:''}]}, leaseType: '', location: {latitude: -17.37, longitude: -66.15}, price: '', registerDate: '', status: 'Activo', surface: '', surfaceBuild: '', userId: '1', zone: ''};

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
              options: { draggable: true }
      });

      var posOptions = {timeout: 10000, enableHighAccuracy: false};

      $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        console.log(position);
        $scope.product.location.latitude  = position.coords.latitude
        $scope.product.location.longitude = position.coords.longitude

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
          console.log(position);
          $scope.product.location.latitude  = position.coords.latitude;
          $scope.product.location.longitude = position.coords.longitude;

          marker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));

    });

    google.maps.event.addListener(marker, 'dragend', function() {
        $scope.$apply(function(){
          //Stop listening changes
          watch.clearWatch();
          var pos = marker.getPosition();
          console.log(pos);
          $scope.product.location.latitude  = pos.A;
          $scope.product.location.longitude = pos.F;
        });
    });


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

      var productRef =  $scope.refire.push($scope.product);
      console.log($scope.product.location.latitude);

      var productId = productRef.key();
      console.log(productId);
      $state.go('app.publishList');
    }
})


.controller('PlaylistCtrl', function($scope, $stateParams) {
});
