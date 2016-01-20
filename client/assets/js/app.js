(function(){
  'use strict';

  angular.module('application', [
    'ui.router',
    'ngAnimate',

    // Foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations',

    // Libraries
    'ngOrwell',

    // Fusion Seed App
    'fusionSeedApp.components',
    'fusionSeedApp.services',
  ])
    .constant('_', window._)
    .config(config)
    .run(run)
  ;

  config.$inject = ['$urlRouterProvider', '$httpProvider','$locationProvider', 'ApiBaseProvider', 'ConfigServiceProvider'];
  run.$inject = ['$log', 'ConfigService', 'ApiBase', 'QueryService'];

  function config($urlProvider, $httpProvider, $locationProvider, ApiBaseProvider, ConfigServiceProvider) {
    $urlProvider.otherwise('/');
    $httpProvider.interceptors.push('SessionInjector');

    $locationProvider.html5Mode({
      enabled:false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');
    ApiBaseProvider.setEndpoint(ConfigServiceProvider.getFusionUrl());
  }

  function run($log, ConfigService, ApiBase, QueryService) {
    QueryService.getQuery({'q':'hello'}); //DEBUG: Remove in production
    FastClick.attach(document.body);
  }
})();
