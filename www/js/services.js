angular.module('starter.services', ['firebase', 'ngCordova', 'ionic.service.core'])

.factory('Cities', function() {
  
  var cities = [{
    id: 0,
    name: 'Cochabamba'
  }, {
    id: 1,
    name: 'Cobija'
  },{
    id: 2,
    name: 'La Paz'
  }, {
    id: 3,
    name: 'Oruro'
  }, {
    id: 4,
    name: 'Potosi'
  }, {
    id: 5,
    name: 'Santa Cruz'
  }, {
    id: 6,
    name: 'Sucre'
  }, {
    id: 7,
    name: 'Tarija'
  }, {
    id: 8,
    name: 'Trinidad'
  }];

  return {
    all: function() {
      return cities;
    },
    remove: function(city) {
      cities.splice(cities.indexOf(city), 1);
    },
    get: function(cityId) {
      for (var i = 0; i < cities.length; i++) {
        if (cities[i].id === parseInt(cityId)) {
          return cities[i];
        }
      }
      return null;
    }
  };
})

.factory('Zones', function() {
  
  var zones = [{
    id: 0,
    name: 'Todas',
    cityId: 0
  }, {
    id: 1,
    name: 'Alalay',
    cityId: 0
  },{
    id: 2,
    name: 'Cala Cala',
    cityId: 0
  },{
    id: 3,
    name: 'Colcapirhua',
    cityId: 0
  }, {
    id: 4,
    name: 'Jayhuayco',
    cityId: 0
  }, {
    id: 5,
    name: 'La Chimba',
    cityId: 0
  }, {
    id: 6,
    name: 'Las Cuadras',
    cityId: 0
  }, {
    id: 7,
    name: 'Mayorazgo',
    cityId: 0
  }, {
    id: 8,
    name: 'Muyurina',
    cityId: 0
  }, {
    id: 9,
    name: 'Noroeste',
    cityId: 0
  }, {
    id: 10,
    name: 'Pacata',
    cityId: 0
  }, {
    id: 11,
    name: 'Queru Queru',
    cityId: 0
  }, {
    id: 12,
    name: 'Quilacollo',
    cityId: 0
  }, {
    id: 13,
    name: 'Sacaba',
    cityId: 0
  }, {
    id: 14,
    name: 'San Pedro',
    cityId: 0
  }, {
    id: 15,
    name: 'Sarco',
    cityId: 0
  }, {
    id: 16,
    name: 'Sudoeste',
    cityId: 0
  }, {
    id: 17,
    name: 'Temporal',
    cityId: 0
  }, {
    id: 18,
    name: 'Tiquipaya',
    cityId: 0
  }, {
    id: 19,
    name: 'Ushpa Ushpa',
    cityId: 0
  }, {
    id: 20,
    name: 'Villa Bush',
    cityId: 0
  }];

  return {
    all: function() {
      return zones;
    },
    remove: function(zone) {
      zones.splice(zones.indexOf(zone), 1);
    },
    get: function(zoneId) {
      for (var i = 0; i < zones.length; i++) {
        if (zones[i].id === parseInt(zoneId)) {
          return zones[i];
        }
      }
      return null;
    },
    getZonesByCity: function(cityId) {
      var zonesCity=[{}];

      for (var i = 0; i < zones.length; i++) {
        if (zones[i].cityId === parseInt(cityId)) {
          
          zonesCity.push(zones[i]);
        }
      }

      return zonesCity;
    }
  };
})

.factory('HouseData', function ($firebase, $firebaseArray, Cities, Zones) {

    var ref = new Firebase(firebaseUrl);
    var products = $firebaseArray(ref);
    var count = 0;

    return {
        all: function () {            
            return products;
        },
        remove: function (product) {
            ref.child(product.$id).remove();
            /*products.$remove(product).then(function (ref) {
                ref.child.key() === product.$id; // true item has been removed

            });*/
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

        getCount: function () {
            return count;
        },

        getHouses: function (filter) {
            console.log("search services...");
            
            var city = Cities.get(filter.cityId);
            var zone = Zones.get(filter.zoneId);

            var queryCity;
            var queryZone;
                        
            var query = ref.orderByChild("city").equalTo(city.name);
            count = 0;
            query.on("child_added", function(snapshotCity){
              count++;
            });
            
            // Esta seccion de codigo en la variable query si recupera lo que deberia sin embaro al momento de utilizar $firebaseArray(query) da error.
            /*query.on("child_added", function(snapshotCity){
              console.log(snapshotCity.key() + " su ciudad es " + snapshotCity.val().city);
              
              //console.log(snapshotCity.key() + " su zona es " + snapshotCity.val().zone);
              if (parseInt(filter.zoneId) === 0) {
                  query = snapshotCity.val();
              }else{              
                if (snapshotCity.val().zone ===  zone.name) {
                    console.log(snapshotCity.key() + " su zona es " + snapshotCity.val().zone);
                    query = snapshotCity.val();
                }
              }
            });*/
            
            products = $firebaseArray(query);            
            return products;
        }        
    }
})

.factory('Publish', function($firebase, $firebaseArray) {
  var ref = new Firebase(firebaseUrl);  
  var publish;

  return {
    getPublish: function(userId) {
      console.log("Service... el user es " + userId);
      var query = ref.orderByChild("userId").equalTo(userId);
      publish = $firebaseArray(query);
      return publish;
    },    
    remove: function(city) {
      cities.splice(cities.indexOf(city), 1);
    },
    get: function(cityId) {
      for (var i = 0; i < cities.length; i++) {
        if (cities[i].id === parseInt(cityId)) {
          return cities[i];
        }
      }
      return null;
    }
  };
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


