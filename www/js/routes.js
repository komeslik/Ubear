angular.module('app.routes', ['ionicUIRouter'])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  /*
    The IonicUIRouter.js UI-Router Modification is being used for this route.
    To navigate to this route, do NOT use a URL. Instead use one of the following:
      1) Using the ui-sref HTML attribute:
        ui-sref='tabsController.create'
      2) Using $state.go programatically:
        $state.go('tabsController.create');
    This allows your app to figure out which Tab to open this page in on the fly.
    If you're setting a Tabs default page or modifying the .otherwise for your app and
    must use a URL, use one of the following:
      /page1/tab1/page3
      /page1/tab2/page3
  */
  .state('tabsController.create', {
    url: '/page3',
    views: {
      'tab1': {
        templateUrl: 'templates/available.html',
        controller: 'availableCtrl'
      },
      'tab2': {
        templateUrl: 'templates/create.html',
        controller: 'createCtrl'
      },
      'tab3': {
        templateUrl: 'templates/myCar.html',
        controller: 'myCarCtrl'
      }
    }
  })

  .state('tabsController.available', {
    url: '/page4',
    views: {
      'tab1': {
        templateUrl: 'templates/available.html',
        controller: 'availableCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('tabsController.example', {
    url: '/page5',
    views: {
      'tab1': {
        templateUrl: 'templates/example.html',
        controller: 'exampleCtrl'
      },
      'tab3': {
        templateUrl: 'templates/example.html',
        controller: 'exampleCtrl'
      }
    },
    params: {
       info : null
   }
  })

  .state('login', {
    url: '/page6',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('signup', {
    url: '/page7',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })

  .state('createProfile', {
    url: '/page8',
    templateUrl: 'templates/createProfile.html',
    controller: 'createProfileCtrl'
  })

  .state('edit', {
    url: '/page9',
    templateUrl: 'templates/edit.html',
    controller: 'editCtrl'
  })

  .state('chat', {
    url: '/page10',
    templateUrl: 'templates/chat.html',
    controller: 'chatCtrl',
    params: {
       carInfo : null
   }
  })

  .state('tabsController.myCar', {
    url: '/page11',
    views: {
      'tab3': {
        templateUrl: 'templates/myCar.html',
        controller: 'myCarCtrl'
      }
    }
  })

  .state('verify', {
    url: '/page12',
    templateUrl: 'templates/verify.html',
    controller: 'verifyCtrl'
  })


$urlRouterProvider.otherwise('/page6')


});
