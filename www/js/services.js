angular.module('starter.services', ['firebase'])

.factory('HouseData', function ($firebase, $firebaseArray, $q) {

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
        },

        getHouses: function (filter) {
            console.log("services...");
            var deferred = $q.defer();
            var resultQuery = ref.orderByChild("city").equalTo(filter.city).on("child_added", function(snapshot) {
              console.log(snapshot.key());
              deferred.resolve(snapshot.val());
            });
            
            /*var usersRef = ref.orderByChild("city").equalTo(filter.city);
            usersRef.on("child_added", function (snap) {
                console.log(snap.key());
                deferred.resolve(snap.val());
            });*/
            return deferred.promise;
        },
        getProducts: function (filter) {
            console.log("services...");
            var resultQuery = ref.orderByChild("city").equalTo(filter.city).on("child_added", function(snapshot) {
              console.log(snapshot.key());
            });
            for (var i = 0; i < resultQuery.length; i++) {
                console.log(products[i].id);                
            }
            
            return resultQuery;
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


