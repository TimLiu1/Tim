  
  
  
  
  
  
  $scope.check = function (ventureGrant, index, flag) {
        $ngBootbox.customDialog({
            title: '审核是否通过',
            templateUrl: "/html/agent/partials/checkDialog.html",
            show: false,
            backdrop: true,
            animate: true,
            buttons: {
                success: {
                    label: "OK",
                    className: "btn-primary",
                    callback: function () {
                        var status = $("input[name='checkResult']:checked").val();
                        var reason = $("#checkReason").val();
                        // console.log(ventureGrant.saleman + "//" + status);
                        console.log(ventureGrant);
                        ClerkManager.check({
                            flag: flag,
                            status: status,
                            reason: reason,
                            _id: ventureGrant._id
                        }).then(function (result) {
                            if (result.err) {
                                $scope.alert = {
                                    type: 'danger',
                                    message: data.err
                                };
                                return;
                            }
                            $scope.clerks[index].status = status;
                        })
                    }
                },
                warning: {
                    label: "Cancel",
                    className: "btn-default"
                }
            }
        });
    };