angular.module('app.services', [])

.factory("Items", function($firebaseArray) {
  var itemsRef = new Firebase("https://test-7422a.firebaseio.com/cars");
  return $firebaseArray(itemsRef);
})

.factory("Users", function($firebaseArray) {
  return {
    get: function(id) {
      var usersRef = new Firebase("https://test-7422a.firebaseio.com/cars/"+id+"/users");
      return $firebaseArray(usersRef);
    }
  }
})
.factory("Profiles", function($firebaseArray) {
  var profiles = new Firebase("https://test-7422a.firebaseio.com/users");
  return $firebaseArray(profiles);
})
.service('UserService', [function(){
  this.isLoggedIn = function(){
    if(document.getElementById('sign-in-status').textContent == 'Signed in'){
      var app = firebase.app();
      var user = app.database().ref('users/' + firebase.auth().currentUser.uid);
      return true;
    } else {
      return false;
    }
  }
}]);
