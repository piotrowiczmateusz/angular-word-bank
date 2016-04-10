App.controller("WordBank", function($scope, $http) {

  /* Model */

  // config
  $scope.config = {};

  // data
  $scope.languages = [];
  $scope.categories = [];
  $scope.parts = [];
  $scope.words = [];

  // to reverse the flashcard
  $scope.showTranslation = false;

  // show specific flashcards/records
  $scope.showCategory = "All";
  $scope.showPart = "All";
  $scope.showLanguage = "All";

  // section title
  $scope.sectionTitle = "Flashcards";

  // total words
  $scope.totalWords = 0;

  $scope.addWord = function() {

    var langIndex = 0;
    for (var i = 0; i < $scope.languages.length; i++) {
      if ($scope.languages[i].lang == $scope.wordLanguage) {
        langIndex = i;
      }
    }

    $scope.words.push({
      text: $scope.wordText,
      translation: $scope.wordTranslation,
      part: $scope.wordPart,
      category: $scope.wordCategory,
      language: $scope.languages[langIndex]
    });

    $scope.totalWords = $scope.words.length;
    $scope.save();
    Materialize.toast("<div class='saved'>Added: '"+$scope.wordText+"'</div>", 4000);
  };


  $scope.addCategory = function() {
    $scope.categories.push($scope.categoryText);
    $scope.save();
  };

  $scope.removeWord = function(index) {
    Materialize.toast("<div class='deleted'>Deleted: " + $scope.words[index].text + "</div>", 4000);
    if (index !== 0) {
      $scope.words.splice(index, 1);
      $scope.totalWords = $scope.words.length;
    }
    $scope.save();
  };

  $scope.saveConfig = function() {
    Materialize.toast("<div class='saved'>Config saved.</div>", 4000);
    $.post("/save-config", {
      data: angular.toJson($scope.config)
    }).done(function() {});
  };

  $scope.save = function() {
    $.post("/", {
      data: angular.toJson($scope.words)
    }).done(function() {});
  };

  $scope.loadConfig = function() {
    $http({
      method: 'GET',
      url: 'data/config/config.json'
    }).then(function(response) {
      $scope.config = angular.fromJson(response.data);

      // max per page
      $scope.perPage = $scope.config.maxPerPage;

      // default lang when add new words and display
      $scope.wordLanguage = $scope.config.defaultLang;
      $scope.wordPart = $scope.config.defaultPart;
      $scope.wordCategory = $scope.config.defaultCategory;

    });
  };

  $scope.load = function() {

    $scope.loadConfig();

    $http({
      method: 'GET',
      url: 'data/languages.json'
    }).then(function(response) {
      $scope.languages = angular.fromJson(response.data);
    });

    $http({
      method: 'GET',
      url: 'data/categories.json'
    }).then(function(response) {
      $scope.categories = angular.fromJson(response.data);
    });

    $http({
      method: 'GET',
      url: 'data/parts.json'
    }).then(function(response) {
      $scope.parts = angular.fromJson(response.data);
    });

    $http({
      method: 'GET',
      url: 'data/words.json'
    }).then(function(response) {
      $scope.words = angular.fromJson(response.data);
      $scope.totalWords = $scope.words.length;
    });

  };

  $scope.print = function() {
    window.print();
  };

  // PDF list
  $scope.pdf = function() {
    
    var doc = new jsPDF();

    doc.setFontSize(20);
    doc.text(20, 25, "Words List");
    doc.setFontSize(14);
    var lineHeight = 35;

    doc.text(25, lineHeight, "Word");
    doc.text(60, lineHeight, "Translation");
    doc.text(100, lineHeight, "Part of speech");
    doc.text(140, lineHeight, "Category");
    doc.text(170, lineHeight, "Language");
    doc.line(20, lineHeight + 2, 200, lineHeight + 2);
    lineHeight += 7;

    for (i = 0; i < $scope.words.length; i++) {
      if (($scope.words[i].part == $scope.showPart || $scope.showPart == 'All') &&
          ($scope.words[i].category == $scope.showCategory || $scope.showCategory == 'All') &&
          ($scope.words[i].language.lang == $scope.showLanguage || $scope.showLanguage == 'All')) {
        doc.text(25, lineHeight, $scope.words[i].text);
        doc.text(60, lineHeight, $scope.words[i].translation);
        doc.text(100, lineHeight, $scope.words[i].part);
        doc.text(140, lineHeight, $scope.words[i].category);
        doc.text(170, lineHeight, $scope.words[i].language.lang);
        doc.line(20, lineHeight + 2, 200, lineHeight + 2);
        lineHeight += 7;
      }
    }
    doc.save('Words list.pdf');
  };

  $scope.load();

  $scope.initModals = function() {
    $('.modal-trigger').leanModal(); // Initialize the modals
  };

});

// Directive
App.directive('repeatDone', function() {
  return function(scope, element, attrs) {
    if (scope.$last) { // all are rendered
      scope.$eval(attrs.repeatDone);
    }
  };
});
