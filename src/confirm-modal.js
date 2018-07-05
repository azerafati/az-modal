app.controller('confirmModalCtrl', ['$scope', 'bsModal', 'msg','confirmBtn', function ($scope, bsModal, msg, confirmBtn) {
    $scope.confirm = function () {
        bsModal.hide(true);
    };
    $scope.msg = msg || 'آیا مطمئن هستید؟';
    $scope.confirmBtn = confirmBtn || 'بله';
}]);
