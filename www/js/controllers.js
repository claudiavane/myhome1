angular.module('starter.controllers', ['firebase','ngCordova','ionic.service.core'])

.controller('AppCtrl', function($scope, $scope, $rootScope, $ionicModal, $timeout) {
    console.log("AppCtrl...");
    
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
})

.controller('SignInCtrl', ['$state', '$scope', '$ionicModal', '$rootScope', '$window', '$localstorage' , '$ionicUser', '$ionicHistory', 'Publish',
  function($state, $scope, $ionicModal, $rootScope, $window, $localstorage, $ionicUser, $ionicHistory, Publish) {
  console.log("SignInCtrl....");
    /* quita el boton back de la cabecera */
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      historyRoot: true
    });

    $scope.user = {
        email: "",
        password: "",
        userId:""
    };
    /* abre la modal para el registro de usuario */
    $ionicModal.fromTemplateUrl('templates/sign-up.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });   

    $scope.createUser = function () {
      
      if (!$scope.user.email || !$scope.user.password) {
        $rootScope.notify("Por favor llene los todos los datos");
        return false;
      }
      $rootScope.show('Registrando... Espere un momento por favor');
      console.log($scope.user.email);
      $rootScope.refirebase.createUser($scope.user, function (error, user) {
        console.log("Creandoo...");
        if (!error) {          
          $rootScope.hide();
          console.log("Este valor es " + user.uid);
          var newUserId = user.uid.slice(-1);

          $rootScope.refirebase.child("users").child(user.uid).set({
            provider: 'password',
            email: $scope.user.email,
            userId : newUserId
          });

          //$rootScope.token = user.token;
          //$window.location.href = ('#/');          
          $scope.modal.hide();
        }
        else {
          $rootScope.hide();
          if (error.code == 'INVALID_EMAIL') {
            $rootScope.notify('Direccion de correo inválido');
          }
          else if (error.code == 'EMAIL_TAKEN') {
            $rootScope.notify('El correo ya esta siendo utilizado');
          }
          else {
            $rootScope.notify('Ha ocurrido un error. Por favor intente despues');
          }
        }
      });
    }
    /* login user */
    $scope.validateUser = function () {
        $rootScope.show('Ingresando... Espere un momento por favor');
        var email = this.user.email;
        var password = this.user.password;
        if (!email || !password) {
           $rootScope.notify("Por favor llene los todos los datos");
           return false;
        }
        function authHandler(error, authData) {
          if (error) {
                $rootScope.hide();
                if (error.code == 'INVALID_EMAIL') {
                  $rootScope.notify('Direccion de correo inválido');
                }
                else if (error.code == 'INVALID_PASSWORD') {
                  $rootScope.notify('Contraseña invalida');
                }
                else if (error.code == 'INVALID_USER') {
                  $rootScope.notify('Usuario invalido');
                }
                else {
                  $rootScope.notify('Ha ocurrido un error. Por favor intente despues');
                }
              }
            else {
              $rootScope.hide();
              console.log(authData);
              $rootScope.token = authData.token;
              $localstorage.set('token', authData.token);
              
              $ionicUser.identify({
                user_id: authData.uid,
                email: email              
              }).then(function() {
                console.log("Success identify User");
              }, function(err) {
                  console.log("Error identify User");
                  console.log(err);
              });;

              var userId = authData.uid.slice(-1);
              //$state.go('app.publishList');
              $rootScope.userId = userId;
              $window.location.href = ('#/app/publishList');
          }
        }
        $rootScope.refirebase.authWithPassword({
          email    : email,
          password : password
        }, authHandler);
     }
  }
])

.controller('SearchCtrl', function($scope, $rootScope, $state, HouseData, Cities, Zones) {
  console.log("SearchCtrl...");

  $scope.filter = {cityId: "0", zoneId: "0", houseType: "Casa", leaseSaleType:true, minPrice: 20000, maxPrice: 150000};
  $scope.cities = Cities.all();
  $scope.zones =  Zones.all(); 

  $scope.loadZones = function(filter) {
    $scope.zones = Zones.getZonesByCity(filter.cityId);       
  }

  $scope.search = function(filter) {
    $rootScope.filter = filter;
    console.log(filter.cityId);
    if (filter.isShowMap) {
      $state.go('app.searchResultMap');           
    } 
    else{
      $state.go('app.searchResultList'); 
    };        
  }
  
})

.controller('SearchResultListCtrl', function($scope, $state, $stateParams, $rootScope, $firebaseArray, HouseData) {
  console.log("SearchResultListCtrl....");

  console.log($rootScope.filter.cityId);
  $scope.products = HouseData.getHouses($rootScope.filter);  
  $scope.titleResult = HouseData.getCount() + " Resultados encontrados";

  $scope.goSearchResultMap = function() {
      console.log("ir a map");
      $state.go('app.searchResultMap');     
  }

})

.controller('SearchResultMapCtrl', function($scope, $state, $stateParams, $rootScope, $firebaseObject, HouseData) {
  console.log("SearchResultMapCtrl....");
  var products = HouseData.all();    
  //var products = HouseData.getHouses($rootScope.filter);
  $scope.titleResult = HouseData.getCount() + " Resultados encontrados";

  for (var i=0; i < products.length; i++){    
    if (i==0) {      
      var myLatlng = new google.maps.LatLng(products[i].location.latitude, products[i].location.longitude);
      console.log("mi lat es " + products[i].location.latitude);
      var mapOptions = {
            center: myLatlng,
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    }
    
    var position = new google.maps.LatLng(products[i].location.latitude, products[i].location.longitude);

    var marker = new google.maps.Marker({
      position: position,
      map: map,
      clickable: true
    });

    map.setCenter(marker.getPosition);

    var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+      
      '<h2 id="firstHeading" class="firstHeading">'+ products[i].houseType + ' en ' + products[i].leaseType +'</h2>'+
      '<div id="bodyContent">'+
      '<p><b>Precio: '+ products[i].price +'</b>' +
      //', '+ " " +
      '</p>'+
      '</div>'+
      '<div id="contentImage" class="contentImage">'+
      '<a href="#/app/homeDetail/'+products[i].$id+'"><img src='+ products[i].image['img300x400'][0].url +'/></a>'+        
      '</div>'+
      '</div>';

    var infowindow = new google.maps.InfoWindow(); 

    google.maps.event.addListener(marker, 'click', (function(marker, contentString, infowindow) {
      return function(){
        infowindow.setContent(contentString);
        infowindow.open(map,marker);
      };
      
    }) (marker, contentString, infowindow));
  }

  $scope.goSearchResultList = function() {
      $state.go('app.searchResultList');     
  }
})

.controller('HomeDetailCtrl', function($scope, $stateParams, $firebaseObject) {
  console.log("HomeDetailCtrl...");

  var ref = new Firebase("https://sweltering-inferno-1375.firebaseio.com/inmuebles/"+$stateParams.productId);
  $scope.product = $firebaseObject(ref);
  
  /*$scope.allImages = $scope.product.image.img300x400;
  for (var i = 0; i < scope.allImages.length; i++) {
    console.log("Imagen " + i + ": " + scope.allImages[i].url);
  }*/

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
  $scope.closeModal = function() {
    $scope.modal.hide();
    $scope.modal.remove()
  };
})

.controller('HomeDetailLocationCtrl', function($scope, $rootScope, $stateParams, $firebaseObject) {
  console.log("HomeDetailLocationCtrl...");
  
  var ref = new Firebase("https://sweltering-inferno-1375.firebaseio.com/inmuebles/"+$stateParams.productId);
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
    
    var marker = new google.maps.Marker({
            position: new google.maps.LatLng($scope.product.location.latitude, $scope.product.location.longitude),
            map: map,
            title: $scope.product.zone
    });

  };
})

.controller('HomeDetailContactCtrl', function($scope, $stateParams, $firebaseObject) {
  console.log("HomeDetailContactCtrl...");
  var ref = new Firebase("https://sweltering-inferno-1375.firebaseio.com/inmuebles/"+$stateParams.productId);
  $scope.product = $firebaseObject(ref);  
})

.controller('PrePublishCtrl', function($scope, $rootScope, $state, $stateParams, HouseData, $ionicHistory) {
  console.log("PrePublishCtrl...");
  //hide back button
  $ionicHistory.nextViewOptions({
    disableAnimate: true,
    historyRoot: true
  });
  if (!$rootScope.userSignedIn()){
    $state.go('app.sign-in');
  }else{
    $state.go('app.publishList');
  }  
})

.controller('PublishListCtrl', function($scope, $rootScope, $state, $stateParams, HouseData, $ionicHistory, Publish) {
  console.log("PublishListCtrl...");
  //hide back button
  $ionicHistory.nextViewOptions({
    disableAnimate: true,
    historyRoot: true
  });
  
  //$scope.products = HouseData.all();
  $scope.products = Publish.getPublish($rootScope.userId);

  $scope.remove = function (product) {
        HouseData.remove(product);
  }
  $scope.edit = function (product) {
        HouseData.remove(product);
  }
  $scope.setIsSold = function (product) {
        HouseData.updateIsSold(product);
  }
})

.controller('PublishCtrl', function($scope, $stateParams, $firebaseObject, $firebaseArray, $rootScope, $state, $cordovaCamera, $cordovaGeolocation, Cities, Zones) {     
      console.log("Publish...");
      $scope.refire = new Firebase("https://sweltering-inferno-1375.firebaseio.com/inmuebles");

      if ($stateParams.productId) {
        console.log("Edit...");
        var ref = new Firebase("https://sweltering-inferno-1375.firebaseio.com/inmuebles/"+$stateParams.productId);
        $scope.product = $firebaseObject(ref);        
      } else {
        console.log("New...");
        $scope.product = {city: 'Cochabamba', description: '', houseId: '1', houseType: 'Casa', isBanckCredit: false, isSold: false, image:{img1080x1440:[{height:'40',url:'http://i.imgur.com/6u9VgMe.jpg',width:'40'}], img300x400:[{height:'40',url:'http://i.imgur.com/6u9VgMe.jpg',width:'40'}]}, leaseType: 'Venta', location: {latitude: -17.37, longitude: -66.15}, price: 0, registerDate: '', status: 'Activo', surface: 0, surfaceBuild: 0, userId: '', zone: ''};
      }

      $scope.cities = Cities.all();
      $scope.zones =  Zones.all(); //Zones.getZonesByCity($scope.filter.city); 

      $scope.loadZones = function(product) {
        $scope.zones = Zones.getZonesByCity(0);       
      }
    
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
              $scope.product.photo = imageData;
          }, function(error) {
              console.error(error);
          });
      }

      $scope.uploadProduct = function() {
        //validar si es un create o update
        if ($stateParams.productId) {
          console.log("update: " + $stateParams.productId);
          console.log("city: " + $scope.product.city);
          console.log("zone: " + $scope.product.zone);
          console.log("description: " + $scope.product.description);
          console.log("contact.email: " + $scope.product.contact.email);
          console.log("contact.name: " + $scope.product.contact.name);
          console.log("contact.phone: " + $scope.product.contact.phone);
          console.log("houseType: " + $scope.product.contact.phone);

          var productRef =  $scope.refire.set($scope.product);
        }else{ // es create
          console.log("create: " );
          $scope.product.registerDate = Firebase.ServerValue.TIMESTAMP;
          $scope.product.userId = $rootScope.userId;
          $scope.product.location.latitude = $rootScope.latitude;
          $scope.product.location.longitude = $rootScope.longitude;

          var productRef =  $scope.refire.push($scope.product);
          var productId = productRef.key();
        }
        $state.go('app.publishList');
      }

      $scope.goLocation = function() {
        $state.go('app.publishLocation');
      }
})

.controller('PublishLocationCtrl', function($scope, $rootScope, $state, $cordovaGeolocation) {
     
      console.log("PublishLocation...");
      //$scope.product = {city: '', description: '', houseId: '', houseType: '',image:{img1080x1440:[{height:'',url:'http://i.imgur.com/6u9VgMe.jpg',width:''}], img300x400:[{height:'',url:'http://i.imgur.com/6u9VgMe.jpg',width:''}]}, leaseType: '', location: {latitude: -17.37, longitude: -66.15}, price: '', registerDate: '', status: 'Activo', surface: '', surfaceBuild: '', userId: '1', zone: ''};

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
          
        marker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
        
      });

      google.maps.event.addListener(marker, 'dragend', function() {
          $scope.$apply(function(){
            //Stop listening changes
            watch.clearWatch();
            //var pos = marker.getPosition();                    
          });
      });

      $scope.setLocation = function() {

        var positionLtLg = marker.getPosition();
        console.log("lat " + positionLtLg.lat());
        console.log("lon " + positionLtLg.lng());

        $rootScope.latitude = positionLtLg.lat();
        $rootScope.longitude = positionLtLg.lng();
        $state.go('app.publish');
      }
})

.controller('FavoritesCtrl', function($scope, $rootScope, $state, $ionicHistory) {
  console.log("FavoritesCtrl...");

})


;
