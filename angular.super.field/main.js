'use stricts';
var app = angular.module('myApp', []);

app.directive('superFields', ['$templateCache', function ($tplCache) {
    return {
        restrict: 'E',
        template: "<div>" +
            "<script type='text/ng-template' id='super.field.input'>" +
            "   <input ng-if='item.type==\"input\"' placeholder='{{item.tips}}'" +
            "          ng-model='superFieldsModel[item.model]' ng-blur='item.onBlur(item.model)' " +
            "          ng-change='item.onChange&&item.onChange(superFieldsModel[item.model], item.model)' />" +
            "</script>" +
            "<script type='text/ng-template' id='super.field.select'>" +
            "   <select ng-options='s.value as s.text for s in item.options' ng-model='superFieldsModel[item.model]'" +
            "           ng-change='item.onChange&&item.onChange(superFieldsModel[item.model],item.model)' />" +
            "</script>" +
            "<script type='text/ng-template' id='super.field'><div class='field'>" +
            "   <span>{{field.label}}</span><span>" +
            "   <div ng-repeat='item in field.items' ng-init='type=item.type;'>" +
            "       <ng-include ng-if=\"type==\'input\'\" src='\"super.field.input\"' />" +
            "       <ng-include ng-if=\"type==\'select\'\" src='\"super.field.select\"' />" +
            "   </div></span>" +
            "</div></script>" +
            "<ng-include ng-repeat='field in fields' src='\"super.field\"' />" +
            "</div>",
        replace: true,
        link: function (scope) {

        }
    };
}]);

function DemoCtrl($scope) {
    $scope.superFieldsModel = {
        depart: 1,
        branch: 1,
        leader: 2,
    };

    $scope.onTextChanged = function (value, tag) {
        console.log(tag, value);
        console.log($scope.superFieldsModel);
    };

    $scope.onBlur = function (tag) {
        console.log('onBlur:', tag);
    };

    $scope.onLeaderChanged = function (value) {
        var items = $scope.fields[2].items;
        if (value == 3) {
            $scope.superFieldsModel.group = 1;
            items.push({
                type: 'select',
                model: 'group',
                options: [{
                        text: '家居',
                        value: 1
                    },
                    {
                        text: '服饰',
                        value: 2
                    },
                    {
                        text: '电器',
                        value: 3
                    },
                ],
                onChange: $scope.onSelectChanged
            });
        } else if (items.length === 4) {
            items.splice(3, 1);
            delete $scope.superFieldsModel.group;
        }
    };

    $scope.onBranchChanged = function (value) {
        var departOptions = $scope.fields[2].items[1].options;
        if (value === 2) {
            departOptions.splice(0, 1);
            $scope.superFieldsModel.depart = 2;
        } else {
            departOptions.splice(0, 0, {
                text: '技术部',
                value: 1
            });
            $scope.superFieldsModel.depart = 1;
        }

        $scope.superFieldsModel.leader = 1;
        $scope.onLeaderChanged($scope.superFieldsModel.leader);
    };

    $scope.onSelectChanged = function (value, tag) {
        console.log($scope.superFieldsModel);
    };



    $scope.fields = [{
        label: '姓名',
        items: [{
            type: 'input',
            model: 'name',
            onBlur: $scope.onBlur,
            onChange: $scope.onTextChanged
        }]
    }, {
        label: '年龄',
        items: [{
            type: 'input',
            model: 'age',
            onChange: $scope.onTextChanged
        }],
    }, {
        label: '部门',
        items: [{
            type: 'select',
            model: 'branch',
            options: [{
                    text: '西安分公司',
                    value: 1
                },
                {
                    text: '北京分公司',
                    value: 2
                },
            ],
            onChange: $scope.onBranchChanged
        }, {
            type: 'select',
            model: 'depart',
            options: [{
                    text: '技术部',
                    value: 1
                },
                {
                    text: '销售部',
                    value: 2
                },
                {
                    text: '运营部',
                    value: 3
                },
                {
                    text: '产品部',
                    value: 4
                },
            ],
            onChange: $scope.onSelectChanged
        }, {
            type: 'select',
            model: 'leader',
            options: [{
                    text: '张三',
                    value: 1
                },
                {
                    text: '李四',
                    value: 2
                },
                {
                    text: '王五',
                    value: 3
                },
            ],
            onChange: $scope.onLeaderChanged
        }]
    }]
}
app.controller('DemoCtrl', ['$scope', DemoCtrl]);