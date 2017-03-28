'use stricts';
var app = angular.module('myApp', []);

app.directive('va', function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: '<a href="javascript:void(0)" ng-transclude></a>',
    };
});

app.directive('superTable', ['$templateCache', function ($tplCache) {
    return {
        restrict: 'E',
        template: "<table>" +
            "<tr ng-init='sorts={inc:\"dec\",dec:\"inc\", none:\"dec\"};'>" +
            "<th ng-repeat='hdr in headers' ng-init='filter=hdr.filter;sort=hdr.sort;'>" +
            "   <span ng-if='!filter && !sort'>{{hdr.text}}</span>" +
            "   <span ng-if='!filter && sort' " +
            "         ng-click='sort.value=sorts[sort.value];sortChanged&&sortChanged(sort.name,sort.value)'>" +
            "      {{hdr.text}}<img ng-if='sort' class='col-sort' ng-src='{{\"sort.\" + sort.value + \".png\"}}'/>" +
            "   </span>" +
            "   <select ng-if='filter' ng-model='filters[filter.name]' " +
            "           ng-options='o.value as o.text for o in filter.options' " +
            "           ng-change='filterChanged&&filterChanged(filter.name, filters[filter.name])' />" +
            "</th>" +
            "</tr>" +
            "<tr ng-repeat='$row in data' ng-include='\"super.table.row.html\"'></tr>" +
            "</table>",
        replace: true,
        link: function (scope) {
            var tpl = '';
            scope.$extra = scope.extra;
            scope.headers.forEach(function (e, i) {
                if (e.filter) {
                    scope.filters = scope.filters || {};
                    scope.filters[e.filter.name] = e.filter.selected;
                }
                if (e.raw) {
                    tpl += '<td>' + e.raw + '</td>';
                } else if (e.actions) {
                    var exp = e.exception;
                    if (exp && exp.raw) {
                        tpl += "<td ng-if='!(" + exp.exp + ")'>";
                        e.actions.forEach(function (a) {
                            tpl += '<va ng-click="' + a.action + '($index)">' + a.text + '</va>';
                        });
                        tpl += "</td>";
                        tpl += "<td ng-if='" + exp.exp + "'>" + exp.raw + "</td>";
                    } else {
                        tpl += "<td>";
                        e.actions.forEach(function (a) {
                            tpl += '<va ng-click="' + a.action + '($index)">' + a.text + '</va>';
                        });
                        tpl += "</td>";
                    }
                } else {
                    tpl += '<td>{{$row.' + e.key + '}}</td>';
                }
            });
            $tplCache.put('super.table.row.html', tpl);
        }
    };
}]);

function DemoCtrl($scope, $interval) {
    $scope.extra = {
        level: ['一级', '二级', '三级']
    };

    $scope.filterChanged = function (name, value) {
        console.log($scope.filters);
        console.log('filter changed', 'name:', name, 'value:', value)
    };

    $scope.sortChanged = function (name, value) {
        console.log('sort changed:', name, value);
    };

    $scope.expIndex = 0;

    var dir = 1;
    $interval(function () {
        if ($scope.expIndex === 0) {
            dir = 1;
        } else if ($scope.expIndex === $scope.data.length - 1) {
            dir = -1;
        }
        $scope.expIndex += dir;
    }, 1000);

    $scope.headers = [{
            key: 'name',
            text: '名称'
        },
        {
            key: 'value',
            text: '数值',
            sort: {
                name: 'star',
                value: 'none',
            }
        },
        {
            raw: '{{$row.value > 5 ? "true": "false"}}',
            text: '大于5',
        },
        {
            key: 'tips.text',
            text: '温馨提示'
        },
        {
            raw: '{{$extra.level[$row.level]}}',
            text: '级别',
            filter: {
                name: 'level',
                selected: 3,
                options: [{
                        text: '一级',
                        value: 1
                    },
                    {
                        text: '二级',
                        value: 2
                    },
                    {
                        text: '三级',
                        value: 3
                    }
                ]
            },
        },
        {
            text: '操作',
            actions: [{
                action: 'modify',
                text: "修改",
            }, {
                action: 'add',
                text: "增加",
            }],
            exception: {
                // exp: "expIndex === $index",
                exp: "expect($index)",
                raw: "<span style='color: red;'>登录用户</span>"
            }
        },
    ];

    $scope.expect = function(index) {
        if (index % 2 ) {
            return true;
        }
    }

    $scope.modify = function (id) {
        $scope.showDemo = true;
        $scope.demoText = $scope.data[id];
    };

    $scope.add = function (id) {
        $scope.showDemo = false;
    };

    $scope.data = [{
            name: 'R1',
            value: 8.2,
            tips: {
                text: '啊哈'
            },
            level: 1,
        },
        {
            name: 'R2',
            value: 6.2,
            tips: {
                text: '啊哈'
            },
            level: 0,
        },
        {
            name: 'R3',
            value: 5.2,
            tips: {
                text: '啊哈'
            },
            level: 2,
        },
        {
            name: 'R4',
            value: 1.5,
            tips: {
                text: '啊哈'
            },
            level: 1,
        },
    ];
}
app.controller('DemoCtrl', ['$scope', '$interval', DemoCtrl]);