(function(){
  angular
    .module("cookbookApp")
    .controller("SavedRecipeController", SavedRecipeController)

  SavedRecipeController.$inject = ["$scope", "$stateParams", "$speechRecognition", "$speechSynthetis", "$speechCorrection", "$http"];

  function SavedRecipeController($scope, $stateParams, $speechRecognition, $speechSynthetis, $speechCorrection, $http){
    $scope.recipe = {}
    $scope.instructions = []
    $scope.areInstructions = true;
    $scope.sourceExists = false;
    $scope.saved = true;

    $scope.firstStep = ""

    $http({
      method: 'GET',
      url: 'http://localhost:3000/saved/' + $stateParams.id
      // url: 'https://cookbook-app.herokuapp.com/saved/'
    })
    .then(function(response) {
      console.log(response.data);
      $scope.recipe = response.data;
      if ($scope.recipe.extendedInstructions.length >= 1) {
        $scope.instructions = $scope.recipe.extendedInstructions;
        $scope.instructions.unshift($scope.firstStep)
      }else{
        $scope.areInstructions = false;
      }
    });

    $scope.stepFocus = 0;
    $speechRecognition.setLang('en-US');

    $scope.open = function() {
      $scope.showModal = true;
      $speechRecognition.listen();
      $speechRecognition.onUtterance(function(utterance){
        console.log(utterance);
        if(utterance.includes("next")){
          $scope.goForward()
          $scope.$digest()
        }else if(utterance.includes("back") || utterance.includes("last") || utterance.includes("previous") || utterance ==="last"){
          $scope.goBack()
          $scope.$digest()
        }else if(utterance = "repeat"){
          $scope.$digest()
        }else{
          null
        }
      });
    };

    $scope.ok = function() {
      $scope.showModal = false;
      $speechRecognition.ignore();
    };

    $scope.goBack=function(){
      $scope.stepFocus --
    }

    $scope.goForward=function(){
      $scope.stepFocus ++
    }

  }
})();
