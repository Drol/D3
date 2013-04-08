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
	var profile = 'Drol-1245';
	var url = 'http://eu.battle.net/api/d3/profile/' + profile  + '/?callback=JSON_CALLBACK&name=profiles';
	
	$http.jsonp(url)
		.success(function(data, status) {
			$scope.data = data;
			$scope.status = status;
		})
		.error(function(data, status) {
			$scope.data = data || "Request failed";
			$scope.status = status;
		});
}
