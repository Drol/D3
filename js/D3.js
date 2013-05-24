var app = angular.module('diablo3App', []);

app.config(function ($routeProvider) {
    $routeProvider.
        when('/heroes', { templateUrl: 'partials/heroList.html', controller: 'ProfileController' }).
        when('/hero/:heroId', { templateUrl: 'partials/heroDetail.html', controller: 'HeroDetailController' }).
        otherwise({ redirectTo: '/heroes' });
});

app.factory('factory', function ($http, $q, $cacheFactory) {
    var baseUrl = 'http://eu.battle.net/api/d3/';
    var jsonCallbackString = '/?callback=JSON_CALLBACK&name=profiles';
    var factory = {};

    var cache = $cacheFactory('d3Factory');

    factory.jsonpSync = function (url) {
        var def = $q.defer();

        $http.jsonp(url)
            .success(function (data, status) {
                def.resolve(data);
                console.log(data);
            })
            .error(function (data, status) {
                alert("getProfile() - Request failed");
            });

        return def.promise;
    };

    factory.getProfile = function (profileId) {
        var profile = cache.get(profileId);
        if (!profile) {
            var url = baseUrl + 'profile/' + profileId + jsonCallbackString;
            profile = this.jsonpSync(url);
            cache.put(profileId, profile);
        }
        return profile;
    };

    factory.getHero = function (profileId, heroId) {
        var url = baseUrl + 'profile/' + profileId + '/hero/' + heroId + jsonCallbackString;
        return this.jsonpSync(url);
    };

    return factory;
});

app.controller('NavbarController', function ($scope, $location) {
    $scope.getClass = function (path) {
        if ($location.path().substr(0, path.length) == path) {
            return true
        } else {
            return false;
        }
    }
});

app.controller('D3Controller', function ($scope) {
    // Tooltiphack
    var b = Bnet.D3.Tooltips;
    b.registerDataOld = b.registerData;
    b.registerData = function (data) {
        var c = document.body.children, s = c[c.length - 1].src;
        data.params.key = s.substr(0, s.indexOf('?')).substr(s.lastIndexOf('/') + 1);
        this.registerDataOld(data);
    }
});

app.controller('ProfileController', function ($scope, factory) {
    $scope.profileId = 'Drol-1245';

    $scope.fetch = function () {
        $scope.profile = factory.getProfile($scope.profileId);
    };
});

app.controller('HeroDetailController', function ($scope, $routeParams, factory) {
    $scope.heroId = $routeParams.heroId;
    $scope.hero = factory.getHero($scope.profileId, $scope.heroId);
});

