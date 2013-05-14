angular.module('D3', [])

function D3Controller($scope) {
    // Tooltiphack
    var b = Bnet.D3.Tooltips;
    b.registerDataOld = b.registerData;
    b.registerData = function(data) {
    var c = document.body.children, s = c[c.length-1].src;
        data.params.key=s.substr(0,s.indexOf('?')).substr(s.lastIndexOf('/')+1);
        this.registerDataOld(data);
    }
}

function ProfileController($scope, $http) {
    $scope.profileId = 'Drol-1245';

    $scope.fetch = function () {
        var url = 'http://eu.battle.net/api/d3/profile/' + $scope.profileId + '/?callback=JSON_CALLBACK&name=profiles';

        $http.jsonp(url)
            .success(function (data, status) {
                $scope.profile = data;
                $scope.status = status;
            })
            .error(function (data, status) {
                $scope.profile = data || "Request failed";
                $scope.status = status;
            });
    },

    $scope.fetch();
};


//ProfileController.$inject = ['$scope'];