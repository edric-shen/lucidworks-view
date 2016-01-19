angular.module('fusionSeedApp.services.config', [])

  /** Default config options **/
  .constant('CONFIG_DEFAULT', {
    host: 'http://' + window.location.hostname,
    port:'8764',
    authorizationHeader: {headers: {'Authorization': 'Basic ' + btoa('admin:password123')}},
    AllowAnonymousAccess: true,
    user: 'admin',
    password: 'password123',
    collection: 'Coll',
    queryPipelineIdList: ['POI-default','POI-signals'],
    queryProfilesIdList: ['default'],
    requestHandlerList: ['select','autofilter'],
    use_query_profiles: true,
    addl_params: '', //We might not need this
    searchAppTitle: "Fusion Search Seed App",
    head_field: 'name',
    head_url_field: '',
    thumbnail_field: '',
    thumbnail_enabled: true,
    image_field: '',
    image_enabled: true,
    labels: {
    }
  })
  /** Config overrides from FUSION_CONFIG.js **/
  .constant('CONFIG_OVERRIDE', window.appConfig)

  .service('ConfigApiService', function($log, CONFIG_DEFAULT, CONFIG_OVERRIDE, _){
    var appConfig;

    /* initialize on first load */
    init();

    return {
      init: init, //TODO: Only for test env
      config: appConfig,
      getFusionUrl: getFusionUrl,
      getQueryProfile: getQueryProfile,
      getCollectionName: getCollectionName,
      getQueryPipeline: getQueryPipeline,
      getLoginCredentials: getLoginCredentials,
      getAuthHeader: getAuthHeader,
      getFields: {
        all: getAllFields,
        get: getSpecificField
      }
    };
    
    /**
     * Extend config with the defaults
     */
    function init(){
      appConfig = _.assign({}, CONFIG_DEFAULT, CONFIG_OVERRIDE);
    }

    function getFusionUrl(){
      return appConfig.host + ':' + appConfig.port;
    }

    function getQueryPipeline(){
      return appConfig.queryPipelineIdList[0];
    }

    function getQueryProfile(){
      return appConfig.queryProfilesIdList[0];
    }

    function getLoginCredentials(){
      return {
        username: appConfig.user,
        passowrd: appConfig.password
      };
    }

    function getCollectionName(){
      return appConfig.collection;
    }

    function getLabels(){ //TODO: Decide whether defined labels will be the only ones shown
      return appConfig.labels;
    }

    /**
     * Returns all the config properties that
     * ends with a `_field` which is not a blank string
     * and is toggled by explicit enable-ment by `_enabled` of the same type
     */
    function getAllFields(){
      var fieldsMap = {};
      _.keys(appConfig).filter(function(item){
        return item.match(/\_field$/);
      }).filter(function(item){
        var key = item.split('_')[0]+'_enabled';
        return _.has(appConfig, key)?appConfig[key]:true;
      }).filter(function(item){
        return _.trim(appConfig[item])!=='';
      }).forEach(function(keyName){
        fieldsMap[keyName] = appConfig[keyName];
      });
      return fieldsMap;
    }


    /**
     * [function Returns specific field of given type]
     * @param  {[string]} fieldType [the type of field that needs to be fetch from the config]
     * @return {[type]}           [the value of the said field or null if not found]
     */
    function getSpecificField(fieldType){
      var allFields = getAllFields();
      if(!fieldType.match(/\_field$/)){
        fieldType += '_field';
      }
      return allFields[fieldType]?allFields[fieldType]:null;
    }

    function getAuthHeader(){
      return appConfig.authorizationHeader;
    }
  });