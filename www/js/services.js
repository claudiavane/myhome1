angular.module('starter.services', ['firebase'])

.factory('HoseData', function ($firebase, $firebaseArray) {

    var ref = new Firebase(firebaseUrl);
    var products = $firebaseArray(ref);

    return {
        all: function () {
            return products;
        },
        remove: function (product) {
            products.$remove(product).then(function (ref) {
                ref.key() === product.$id; // true item has been removed
            });
        },
        updateIsSold: function (product) {
            products.$remove(product).then(function (ref) {
                ref.key() === product.$id; // true item has been removed
            });
        },
        get: function (productId) {
            for (var i = 0; i < products.length; i++) {
                if (products[i].id === parseInt(productId)) {
                    return products[i];
                }
            }
            return null;
        }        
    }
})

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);


