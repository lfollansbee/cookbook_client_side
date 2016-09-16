(function(){
  angular
    .module("cookbookApp")
    .controller("RecipeController", RecipeController)
    .filter('encodeURIComponent', function() {
    return window.encodeURIComponent;
});

  RecipeController.$inject = ["$scope", "$http", "$stateParams", "$q"];

  function RecipeController($scope, $http, $stateParams, $q){
    $scope.recipe = {}
    $scope.instructions = [];
    $scope.recipeId = $stateParams.id;
    $scope.areInstructions = true;

    $scope.checkInstructions = function(array){
      if (array.length === 0){
        $scope.areInstructions = false;
      }
    }

    // $scope.speech = function(line){
    //   SpeechService.textToSpeech(line)
    //   $scope.audio = SpeechService.getAudio
    // }

    $q.all([
      $http({
        method: 'GET',
        params:{
          id: $scope.recipeId
        },
        url: 'http://localhost:3000/recipeId/'
        // url: 'https://cookbook-server.herokuapp.com/recipeId/'
      }),
      $http({
        method: 'GET',
        params:{
          id: $scope.recipeId
        },
        url: 'http://localhost:3000/recipeInstructions/'
        // url: 'https://cookbook-server.herokuapp.com/recipeInstructions/'
      })
    ]).then(function(response) {
      $scope.recipe = (response[0].data)
      $scope.instructions = (response[1].data[0].steps)
      $scope.checkInstructions($scope.instructions)
      console.log($scope.recipe, $scope.instructions);
    });

  }
})();
