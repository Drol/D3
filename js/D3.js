var app = angular.module('diablo3App', []);

app.config(function ($routeProvider) {
    $routeProvider.
        when('/heroes', { templateUrl: 'partials/heroList.html', controller: 'ProfileController' }).
        when('/hero/:heroId', { templateUrl: 'partials/heroDetail.html', controller: 'HeroDetailController' }).
        when('/gemcalc', { templateUrl: 'partials/gemCalc.html', controller: 'GemCalcController' }).
        otherwise({ redirectTo: '/heroes' });
});

app.factory('factory', function ($http, $q, $cacheFactory) {
    var baseUrl = 'http://eu.battle.net/api/d3/';
    var jsonCallbackString = '?callback=JSON_CALLBACK&name=profiles';
    var factory = {};

    var cache = $cacheFactory('d3Factory');

    factory.getProfile = function (profileId) {
        var profile = cache.get(profileId);
        if (!profile) {
            var url = baseUrl + 'profile/' + profileId + '/' + jsonCallbackString;
            profile = $http.jsonp(url);
            cache.put(profileId, profile);
        }
        return profile;
    };

    factory.getHero = function (profileId, heroId) {
        var url = baseUrl + 'profile/' + profileId + '/hero/' + heroId + '/' + jsonCallbackString;
        return $http.jsonp(url);
    };

    factory.getArtisan = function (artisan) {
        var url = baseUrl + 'data/artisan/' + artisan + jsonCallbackString;
        return $http.jsonp(url);
    };

    return factory;
});

app.controller('NavbarController', function ($scope, $location) {
    $scope.getClass = function (path) {
        if ($location.path().substr(0, path.length) === path) {
            return true;
        } else {
            return false;
        }
    };
});

app.controller('D3Controller', function ($scope) {
    // Tooltiphack
    var b = Bnet.D3.Tooltips;
    b.registerDataOld = b.registerData;
    b.registerData = function (data) {
        var c = document.body.children, s = c[c.length - 1].src;
        data.params.key = s.substr(0, s.indexOf('?')).substr(s.lastIndexOf('/') + 1);
        this.registerDataOld(data);
    };
});

app.controller('ProfileController', function ($scope, factory) {
    $scope.profileId = 'Drol-1245';

    $scope.fetch = function () {
        factory.getProfile($scope.profileId).then(function (p) {
            $scope.profile = p.data;
        });
    };
});

app.controller('HeroDetailController', function ($scope, $routeParams, factory) {
    $scope.heroId = $routeParams.heroId;
    //$scope.hero = factory.getHero($scope.profileId, $scope.heroId);
});

app.controller('GemCalcController', function ($scope, $routeParams, factory) {
    $scope.gems = [];

    factory.getArtisan('jeweler').then(function (jeweler) {
        $scope.jewelerData = jeweler.data;
        $scope.gems =  [];

        saveGem = function (recipe) {
            if (~recipe.name.indexOf("Amethyst")) {
                recipe.name = recipe.name.replace(/ Amethyst/gi, "");
                if (recipe.name === '') recipe.name = 'Normal';
                $scope.gems.push(recipe);
            }
        };

        angular.forEach(jeweler.data.training.tiers, function (tier, key) {
            angular.forEach(tier.levels[0].trainedRecipes, function (recipe) {
                saveGem(recipe);
            });
            angular.forEach(tier.levels[0].taughtRecipes, function (recipe) {
                saveGem(recipe);
            });
        });

        $scope.input.startGem = $scope.gems[6];
        $scope.input.targetGem = $scope.gems[13];
    });

    $scope.input = {};

    $scope.$watch('input', function () {
        //angular.forEach($scope.input, function (value, key) {
        //    console.log(key + ': ' + value);
        //});
        $scope.res.gems.amount = 34;
    }, true);

    $scope.res = {
        gems: {
            amount: 0, cost: 0, total: 0
        }
    };
});
