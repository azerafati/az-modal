app.controller('alertModalCtrl', ['$scope', 'bsModal', 'msg','title', function ($scope, bsModal, msg, title) {

    $scope.msg = msg || '';
    $scope.title = title || 'خطا';
}]);
