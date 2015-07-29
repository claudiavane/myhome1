.controller('myListCtrl', function($rootScope, $scope, $window, $ionicModal, $firebase) {
  $rootScope.show("Please wait... Processing");
  $scope.list = [];
  var bucketListRef = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail));
  bucketListRef.on('value', function(snapshot) {
    var data = snapshot.val();
 
    $scope.list = [];
 
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        if (data[key].isCompleted == false) {
          data[key].key = key;
          $scope.list.push(data[key]);
        }
      }
    }
 
    if ($scope.list.length == 0) {
      $scope.noData = true;
    } else {
      $scope.noData = false;
    }
    $rootScope.hide();
  });
 
  $ionicModal.fromTemplateUrl('templates/newItem.html', function(modal) {
    $scope.newTemplate = modal;
  });
 
  $scope.newTask = function() {
    $scope.newTemplate.show();
  };
 
  $scope.markCompleted = function(key) {
    $rootScope.show("Please wait... Updating List");
    var itemRef = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail) + '/' + key);
    itemRef.update({
      isCompleted: true
    }, function(error) {
      if (error) {
        $rootScope.hide();
        $rootScope.notify('Oops! something went wrong. Try again later');
      } else {
        $rootScope.hide();
        $rootScope.notify('Successfully updated');
      }
    });
  };
 
  $scope.deleteItem = function(key) {
    $rootScope.show("Please wait... Deleting from List");
    var itemRef = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail));
    bucketListRef.child(key).remove(function(error) {
      if (error) {
        $rootScope.hide();
        $rootScope.notify('Oops! something went wrong. Try again later');
      } else {
        $rootScope.hide();
        $rootScope.notify('Successfully deleted');
      }
    });
  };
})