app.factory('bsModal', ['$timeout', '$compile', '$rootScope', '$controller', '$templateRequest', '$q', function ($timeout, $compile, $rootScope, $controller, $templateRequest, $q) {

    var show = function (params) {
        var q = $q.defer();

        //  If we have provided any inputs, pass them to the controller.
        $templateRequest(params.templateUrl, true).then(function (template) {
            var $scope = $rootScope.$new();
            var compiledModal = $compile(template)($scope);
            var locals = {
                $scope: $scope,
                bsModal: {
                    hide: function (result) {
                        compiledModal.modal('hide');
                        q.resolve(result);
                    },
                    show: show,
                    confirm: function (confirmBtn, msg, size) {

                        return show({
                            templateUrl: "/assets/admin/app/service/modal/confirm-modal.html",
                            controller: "confirmModalCtrl",
                            locals: {msg: msg, confirmBtn: confirmBtn}
                        });

                    },
                    alert: function (msg, title) {

                        return show({
                            templateUrl: "/assets/admin/app/service/modal/alert-modal.html",
                            controller: "alertModalCtrl",
                            locals: {msg: msg, title: title}
                        });

                    },
                    onHide: function (onHide) {
                        compiledModal.on('hidden.bs.modal', function () {
                            try {
                                var res = onHide();
                                q.resolve(res);
                            } catch (e) {
                                console.error(e);
                            }
                        });
                    },
                    element: compiledModal
                }
            };
            if (params.locals) angular.extend(locals, params.locals);
            $controller(params.controller, locals, false);
            $('body').append(compiledModal);

            $timeout(function () {
                var anotherModal = $('body>div.modal.fade.show').length > 0;
                compiledModal.modal('show').focus().on('hidden.bs.modal', function (e) {
                    compiledModal.remove();
                    $scope.$destroy();
                    if (anotherModal)
                        $('body').addClass('modal-open');
                    //return q.reject(new Error('modal closed'));
                    //I guess it's better to stop the promise chain here and instead use onHide for cases when you need to default close action
                });
                if (compiledModal.hasClass('sidebar')) compiledModal.on('click', 'a,button', function () {
                    //compiledModal.modal('hide');
                });
            }, 50);

        });

        return q.promise;
    };

    $rootScope.$on('$locationChangeStart', function () {
        $('body>.modal').modal('hide');
    });

    return {

        show: show,
        confirm: function (confirmBtn, msg, size) {

            return show({
                templateUrl: "/assets/admin/app/service/modal/confirm-modal.html",
                controller: "confirmModalCtrl",
                locals: {msg: msg, confirmBtn: confirmBtn}
            });

        },
        alert: function (msg, title) {

            return show({
                templateUrl: "/assets/admin/app/service/modal/alert-modal.html",
                controller: "alertModalCtrl",
                locals: {msg: msg, title: title}
            });

        }
    }


}]);