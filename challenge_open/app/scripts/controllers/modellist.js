'use strict';

/* global _ */

angular.module('challengeOpenApp')
  .controller('ModellistCtrl', function ($scope, robot) {
    $scope.models = robot.ed.models;

    robot.ed.on('models', function (models) {
      $scope.$apply(function() {
        $scope.models = _.mapValues(models, function (v, k) {
          v.name = _.last(_.words(k, /\w+/g))
            .replace('_', ' ');
          return v;
        });
      });

      $scope.camera_src = null;

      function update(time_diff) {
        var waiting_time = time_diff;
        if (time_diff < 66) {
          waiting_time = 66;
        } else if (time_diff > 500) {
          waiting_time = 500;
        }

        console.log(waiting_time);
        _.delay(function () {
          var resolution = +location.search.substr(1,location.search.length) || 640;
          // console.time('getImage');
          robot.head.getImage(resolution, function (url, _, time_diff) {
            // console.timeEnd('getImage');
            $scope.$apply(function () {
              if (url) {
                $scope.camera_src = url;
              }

              update(time_diff);
            });
          });
        }, time_diff * 2);
      }

      update(200);
    });
  });
