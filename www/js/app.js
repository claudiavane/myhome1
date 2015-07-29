var firebaseUrl = "https://sweltering-inferno-1375.firebaseio.com";
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'firebase', 'ionic.service.core'])

.run(function($ionicPlatform, $ionicLoading, $rootScope, $ionicLoading, $window, $localstorage) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      //cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    $rootScope.token = null;
    $rootScope.refirebase = new Firebase("https://shining-inferno-7335.firebaseio.com");
    $rootScope.firebaseUrl = firebaseUrl;
    console.log($rootScope.firebaseUrl);

    $rootScope.show = function(text) {
      $rootScope.loading = $ionicLoading.show({
        template: text ? text : 'Loading..',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
    };

    $rootScope.hide = function() {
      $ionicLoading.hide();
    };

    $rootScope.notify = function(text) {
      $rootScope.show(text);
      $window.setTimeout(function() {
        $rootScope.hide();
      }, 1999);
    };

    $rootScope.logout = function() {
      $rootScope.refirebase.unauth();
      $rootScope.checkSession();
    };

    $rootScope.authHandler = function(error, authData) {
      console.log(authData);
      if (error) {
        $rootScope.token = null;
      }
      else {
          $rootScope.token = authData.token;
          $localstorage.set('token', authData.token);
      }
    }
    $rootScope.initSession = function(){
      var token = '';//$localstorage.get('token');
      console.log(token);

      if(token){
        $rootScope.refirebase.authWithCustomToken(token, $rootScope.authHandler);
      }
    }
    $rootScope.userSignedIn = function(){
        return($rootScope.token != null)
    }
    $rootScope.checkSession = function() {
      //var authData = $rootScope.refirebase.getAuth();
      //if (authData) {
      if(!$rootScope.token){
        $state.go('sign-in');
        //$window.location.href = '#/';
        //console.log("User " + authData.uid + " is logged in with " + authData.provider);
      }      
    }

  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
      url: '/search',
      views: {
        'menuContent': {
          templateUrl: 'templates/search.html',
          controller: 'SearchCtrl'
        }
      }
  })

  .state('app.searchResultList', {
    url: '/searchResultList',
    views: {
      'menuContent': {
        templateUrl: 'templates/searchResultList.html',
        controller: 'SearchResultListCtrl'
      }
    }
  })

  .state('app.homeDetail', {
    url: '/homeDetail/:itemId',
    views: {
      'menuContent': {
        templateUrl: 'templates/homeDetail.html',
        controller: 'HomeDetailCtrl'
      }
    }
  })

  .state('app.homeDetailLocation', {
    url: '/homeDetailLocation/:itemId',
    views: {
      'menuContent': {
        templateUrl: 'templates/homeDetailLocation.html',
        controller: 'HomeDetailLocationCtrl'
      }
    }
  })

  .state('app.homeDetailContact', {
    url: '/homeDetailContact/:itemId',
    views: {
      'menuContent': {
        templateUrl: 'templates/homeDetailContact.html',
        controller: 'HomeDetailContactCtrl'
      }
    }
  })  

  .state('app.searchResultMap', {
    url: '/searchResultMap',
    views: {
      'menuContent': {
        templateUrl: 'templates/searchResultMap.html',
        controller: 'SearchResultMapCtrl'
      }
    }
  })

  .state('app.publishList', {
    url: '/publishList',
    views: {
      'menuContent': {
        templateUrl: 'templates/publishList.html',
        controller: 'PublishListCtrl'
      }
    }
  })

  .state('app.publish', {
    url: '/publish',
    views: {
      'menuContent': {
        templateUrl: 'templates/publish.html',
        controller: 'PublishCtrl'
      }
    }
  })

  .state('app.publish-edit', {
    url: '/publish/:productId',
    views: {
      'menuContent': {
        templateUrl: 'templates/publish.html',
        controller: 'PublishCtrl'
      }
    }
  })

  .state('app.publishLocation', {
    url: '/publishLocation',
    views: {
      'menuContent': {
        templateUrl: 'templates/publishLocation.html',
        controller: 'PublishLocationCtrl'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
  })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/search');
});
