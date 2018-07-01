angular.module('app.controllers', [])

  .controller('menuCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams) {


    }
  ])

  .controller('verifyCtrl', function($scope, $state) {
    $scope.logout = function() {
      firebase.auth().signOut();
      window.location = "/#/page6";
      document.getElementById('sign-in-status').textContent = 'Signed out';
      document.getElementById('account-details').textContent = 'null';
    }
    $scope.$on('$ionicView.beforeEnter', function(event, viewData) {
      viewData.enableBack = false;
    });
  })

  .controller('myCarCtrl', function($scope, $state, $firebaseObject, $firebaseArray) {
    // delete from own copy of my cars after its expired
    var curr = firebase.auth().currentUser;

    var currentCars = new Firebase("https://test-7422a.firebaseio.com/users/" + curr.uid + "/currentCars");
    $scope.items = $firebaseArray(currentCars);
    $scope.goToState = function(info) {
      $scope.id = info["$id"];
      $state.go('tabsController.example', { info });
    }
  })

  .controller("availableCtrl", function($scope, Items, $state, $stateParams, Users, $firebaseObject, $firebaseArray) {
    $scope.$on('$ionicView.beforeEnter', function(event) {
      Items.forEach(function(entry) {
        var curr = new Date();
        var timestamp = new Date(entry.timestamp);
        var leaving_time_compare = new Date(curr.toLocaleDateString() + " " + entry.when);
        var car_firebase = new Firebase("https://test-7422a.firebaseio.com/cars/" + entry.$id);
        if (leaving_time_compare > timestamp) { // same day
          if (curr > leaving_time_compare) {
            car_firebase.update({ 'active': false });
          }
        } else { // tomorrow
          var today = new Date();
          curr.setDate(curr.getDate() - 1);
          if (curr.toLocaleDateString() == timestamp.toLocaleDateString()) { // is it tomorrow yet?
            if (today > leaving_time_compare) {
              car_firebase.update({ 'active': false });
            }
          }
        }
      });
    });

    $scope.$on('$locationChangeStart', function(event) {
      Items.forEach(function(entry) {
        var curr = new Date();
        var timestamp = new Date(entry.timestamp);
        var leaving_time_compare = new Date(curr.toLocaleDateString() + " " + entry.when);
        var car_firebase = new Firebase("https://test-7422a.firebaseio.com/cars/" + entry.$id);
        if (leaving_time_compare > timestamp) { // same day
          if (curr > leaving_time_compare) {
            car_firebase.update({ 'active': false });
          }
        } else { // tomorrow
          var today = new Date();
          curr.setDate(curr.getDate() - 1);
          if (curr.toLocaleDateString() == timestamp.toLocaleDateString()) { // is it tomorrow yet?
            if (today > leaving_time_compare) {
              car_firebase.update({ 'active': false });
            }
          }
        }
      });
    });
    var playersRef = new Firebase("https://test-7422a.firebaseio.com/").child("cars");
    var query = playersRef.orderByChild("active").equalTo(true).limitToLast(20);
    var list = $firebaseArray(query);
    $scope.items = list;
    // $scope.items = Items;
    $scope.new = {};
    $scope.params = $stateParams;
    // var curr = JSON.parse(document.getElementById('account-details').textContent);
    var curr = firebase.auth().currentUser;
    $scope.addItem = function() {
      if (Object.keys($scope.new).length != 0) {
        var time = new Date($scope.new.when);
        time = time.format("shortTime");

        var date = new Date();
        var timestamp = date.toLocaleString();

        var curr = firebase.auth().currentUser;
        var ref = new Firebase("https://test-7422a.firebaseio.com/users/" + curr.uid);
        var user = $firebaseObject(ref);

        var name = user.name;
        var venmo = user.venmo;
        var phone = user.phone;
        var school = user.school;
        var desc = user.desc;
        var year = user.year;

        $scope.items.$add({
          "when": time,
          "from": $scope.new.from,
          "to": $scope.new.to,
          "active": true,
          "timestamp": timestamp,
          "owner": curr.uid,
          "users": {}
        }).then(function(ref) {
          var id = ref.key();
          var car_ref = new Firebase("https://test-7422a.firebaseio.com/cars/" + id + "/users/" + curr.uid);
          var curr_user_ref = new Firebase("https://test-7422a.firebaseio.com/users/" + curr.uid);
          var user = $firebaseObject(curr_user_ref);
          var users = $firebaseObject(car_ref);
          firebase.database().ref('users/' + curr.uid).once('value').then(function(snapshot) {
            var user = snapshot.val();
            users.name = user.name;
            users.venmo = user.venmo;
            users.phone = user.phone;
            users.school = user.school;
            users.desc = user.desc;
            users.year = user.year;
            users.img = "img/1.png",
              users.$save().then(function() {
                console.log(user);
              });

          });

          var currentCars = new Firebase('https://test-7422a.firebaseio.com/users/' + curr.uid + '/currentCars');
          firebase.database().ref('cars/' + id).once('value').then(function(snapshot) {
            var jsonVariable = {};
            jsonVariable[id] = snapshot.val();
            var newCurrentCarRef = currentCars.update(jsonVariable);
          });

        });
        $state.go('tabsController.available');
      } else {
        alert("Please fill out the form.");
      }
    };

    $scope.goToState = function(info) {
      $scope.id = info["$id"];
      $state.go('tabsController.example', { info });
    }
  })

  .controller('createCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams) {


    }
  ])

  .controller('exampleCtrl', function($scope, $stateParams, Users, $state, $firebaseObject, $firebaseArray) {
    $scope.params = $stateParams;
    $scope.title = $scope.params.info.from + " -> " + $scope.params.info.to;
    $scope.details = $scope.params.info.when;
    // set up
    var curr = firebase.auth().currentUser;
    firebase.database().ref('cars/' + $scope.params["info"]["$id"]).once('value').then(function(snapshot) {
      $scope.users = Users.get($scope.params["info"]["$id"]);
      $scope.showJoin = false;
      $scope.showLeave = false;
      $scope.showDelete = false;
      $scope.title = $scope.params.info.from + " - " + $scope.params.info.to;
      var car = snapshot.val();
      var owner = car.owner;
      // show or hide button
      firebase.database().ref('cars/' + $scope.params["info"]["$id"] + '/users').once('value').then(function(snapshot) {
        var numPeople = snapshot.numChildren();
        if (!car.active) {
          $scope.showDelete = true;
          return;
        }
        var user = snapshot.val();

        for (var key in user) {
          if (key == curr.uid) {
            $scope.showLeave = true;
            return;
          }
        }

        if (numPeople < 3) {
          $scope.showJoin = true;
        }
      });
    });
    //

    $scope.openChat = function(carInfo) {
      $state.go('chat', { carInfo });
    };

    $scope.join = function() {
      var curr = firebase.auth().currentUser;
      var user = null;
      firebase.database().ref('users/' + curr.uid).once('value').then(function(snapshot) {
        user = snapshot.val();
      }).then(function() {
        var randomizer = Math.floor((Math.random() * 3) + 1);
        var car_ref = new Firebase("https://test-7422a.firebaseio.com/cars/" + $scope.params["info"]["$id"] + "/users/" + curr.uid);
        var addUser = $firebaseObject(car_ref);
        addUser.name = user.name;
        addUser.venmo = user.venmo;
        addUser.phone = user.phone;
        addUser.school = user.school;
        addUser.desc = user.desc;
        addUser.year = user.year;
        addUser.img = "img/" + randomizer + ".png",
          addUser.$save().then(function() {
            $scope.showJoin = false;
            $scope.showLeave = true;
          });

        var currentCars = new Firebase('https://test-7422a.firebaseio.com/users/' + curr.uid + '/currentCars');
        firebase.database().ref('cars/' + $scope.params["info"]["$id"]).once('value').then(function(snapshot) {
          var id = $scope.params["info"]["$id"];
          var jsonVariable = {};
          jsonVariable[id] = snapshot.val();
          var newCurrentCarRef = currentCars.update(jsonVariable);
        });
      });
    }

    $scope.leave = function() {
      var curr = firebase.auth().currentUser;
      var car_ref = new Firebase("https://test-7422a.firebaseio.com/cars/" + $scope.params["info"]["$id"] + "/users/" + curr.uid);
      var car = $firebaseObject(car_ref);
      car.$remove().then(function(ref) {
        $scope.showLeave = false;
        $scope.showJoin = true;
        $scope.showDelete = false;
      });

      var user_firebase = new Firebase("https://test-7422a.firebaseio.com/users/" + curr.uid + "/currentCars/" + $scope.params["info"]["$id"]);
      var user_obj = $firebaseObject(user_firebase);
      user_obj.$remove();
    }

    $scope.delete = function() {
      var user_ref = new Firebase("https://test-7422a.firebaseio.com/users/" + curr.uid + "/currentCars/" + $scope.params["info"]["$id"]);
      var user = $firebaseObject(user_ref);
      user.$remove();
      $state.go('tabsController.myCar');
    }

  })

  .controller('loginCtrl', ['$scope', '$stateParams', '$ionicSideMenuDelegate', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams, $ionicSideMenuDelegate) {
      $ionicSideMenuDelegate.canDragContent(false);
    }
  ])

  .controller('signupCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams) {


    }
  ])

  .controller('createProfileCtrl', ['$state', '$scope', '$stateParams', 'Profiles', '$firebaseObject', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($state, $scope, $stateParams, Profiles, $firebaseObject) {
      $scope.profiles = Profiles;
      $scope.new_profile = {};

      $scope.addProfile = function() {
        if (Object.keys($scope.new_profile).length != 0) {
          var curr = firebase.auth().currentUser;
          var ref = new Firebase("https://test-7422a.firebaseio.com/users/" + curr.uid);
          var user = $firebaseObject(ref);
          user.name = $scope.new_profile.name;
          user.venmo = $scope.new_profile.venmo;
          user.phone = $scope.new_profile.phone,
            user.school = $scope.new_profile.school,
            user.desc = $scope.new_profile.desc,
            user.year = $scope.new_profile.year,
            user.img = null,
            user.$save().then(function() {
              $state.go('tabsController.available');
            });
        } else {
          alert("Please fill out the form.");
        }
      };
    }
  ])

  .controller('editCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams) {


    }
  ])

  .controller('chatCtrl', function($scope, $state, $stateParams, $firebaseObject, $firebaseArray) {
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        viewData.enableBack = true;
      });
    $scope.params = $stateParams;
    var carId = $stateParams.carInfo.info.$id;
    console.log($stateParams.carInfo.info.$id);
    $scope.sendChat = function(newChat) {
      var carId = $stateParams.carInfo.info.$id;
      console.log($stateParams.carInfo.info.$id);
      var curr = firebase.auth().currentUser;
      console.log(curr);
      var chatRef = new Firebase("https://test-7422a.firebaseio.com/chats/" + carId);
      var newMessageRef = chatRef.push();
      newMessageRef.set({
        'content': newChat,
        'sender': curr.displayName
      });
      document.getElementById('newChatInput').value = '';
    };

    var curr = firebase.auth().currentUser;
    firebase.database().ref('users/' + curr.uid).once('value').then(function(snapshot) {
      var carId = $stateParams.carInfo.info.$id;
      var chat_firebase = new Firebase("https://test-7422a.firebaseio.com/chats/" + carId);
      $scope.chats = $firebaseArray(chat_firebase);
    });

    $scope.$on('$locationChangeStart', function(event) {
      firebase.database().ref('users/' + curr.uid).once('value').then(function(snapshot) {
        console.log($stateParams);
        var carId;
        var carInfoHere = $stateParams.carInfo;
        if(carInfoHere==null){
          carId = $stateParams.info.$id;
        }else{
          carId = $stateParams.carInfo.info.$id;
        }
        var chat_firebase = new Firebase("https://test-7422a.firebaseio.com/chats/" + carId);
        $scope.chats = $firebaseArray(chat_firebase);
      });
    });

  })
