var d3App = angular.module('diablo3App', []);

d3App.config(function ($routeProvider) {
    $routeProvider.
        when('/heroes', { templateUrl: 'hero-list.html', controller: 'ProfileController' }).
        when('/heroes/:heroId', { templateUrl: 'hero-detail.html', controller: 'HeroDetailController' }).
        otherwise({ redirectTo: '/heroes' });
});

d3App.factory('profileFactory', function ($http, $q, $rootScope) {
    var factory = {};

    factory.getProfile = function (profileId) {
        var url = 'http://eu.battle.net/api/d3/profile/' + profileId + '/?callback=JSON_CALLBACK&name=profiles';
        var def = $q.defer();

        $http.jsonp(url)
            .success(function (data, status) {
                def.resolve(data);
                console.log(data);
            })
            .error(function (data, status) {
                return data || "Request failed";
                //$scope.status = status;
            });

        return def.promise;
    };

    return factory;
});

d3App.controller('D3Controller', function ($scope) {
    // Tooltiphack
    var b = Bnet.D3.Tooltips;
    b.registerDataOld = b.registerData;
    b.registerData = function (data) {
        var c = document.body.children, s = c[c.length - 1].src;
        data.params.key = s.substr(0, s.indexOf('?')).substr(s.lastIndexOf('/') + 1);
        this.registerDataOld(data);
    }
});

d3App.controller('ProfileController', function ($scope, profileFactory) {
    $scope.profileId = 'Drol-1245';

    $scope.fetch = function () {
        $scope.profile = profileFactory.getProfile($scope.profileId);

        //var url = 'http://eu.battle.net/api/d3/profile/' + $scope.profileId + '/?callback=JSON_CALLBACK&name=profiles';

        //$http.jsonp(url)
        //    .success(function (data, status) {
        //        $scope.profile = data;
        //        $scope.status = status;
        //    })
        //    .error(function (data, status) {
        //        $scope.profile = data || "Request failed";
        //        $scope.status = status;
        //    });
    };
});

d3App.controller('HeroListController', function ($scope, $http) {
    $scope.heroes = new Array();

    $scope.fetch = function (profileId, heroId) {
        var url = 'http://eu.battle.net/api/d3/profile/' + profileId + '/hero/' + heroId + '/?callback=JSON_CALLBACK&name=profiles';

        $http.jsonp(url)
            .success(function (data, status) {
                $scope.heroes[heroId] = data;
                $scope.status = status;
            })
            .error(function (data, status) {
                $scope.heroes[heroId] = data || "Request failed";
                $scope.status = status;
            });
    };
});

d3App.controller('HeroDetailController', function ($scope, $routeParams) {
    $scope.heroId = $routeParams.heroId;
});

