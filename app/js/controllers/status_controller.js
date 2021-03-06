angular.module("app").controller("StatusController", function($scope, ngDialog, statusService, envDataParserService, appDataParserService, subcomponentService) {

 $scope.selectedAppsModel = [];
 statusService.get_all().then(function(data) {
  $scope.status = data;
  $scope.selectedAppsModel = angular.copy(data.applications);
 });

 $scope.predicate = 'id';
 $scope.reverse = false;

 $scope.is_app_hidden = function(id) {
  if (appDataParserService.contains($scope.selectedAppsModel, id)) {
   return false;
  }
  return true;
 };
 $scope.app_dropdown_settings = {
  enableSearch: true,
  externalIdProp: ''
 };
 $scope.app_dropdown_customtexts = {
  buttonDefaultText: 'Select Apps',
  dynamicButtonTextSuffix: 'Apps',
  checkAll: 'Show All',
  uncheckAll: 'Hide All',
  searchPlaceholder: 'Select Apps',
 };

 $scope.order = function(predicate) {
  $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
  $scope.predicate = predicate;
 };

 $scope.highlight_prod_differences = function(all_versions, current_version) {
  var prod_version = envDataParserService.get_prod_version(all_versions);
  if (current_version < prod_version) {
   return {
    color: "red"
   };
  }
 };

 $scope.subcomponents_popup = function(app_id, env_id) {
  subcomponentService.set_app_id(app_id);
  subcomponentService.set_env_id(env_id);
  ngDialog.open({
   template: 'subcomponents.html'
  });
 };

});
