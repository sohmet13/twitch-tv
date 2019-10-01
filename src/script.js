import angular from 'angular';
import { forkJoin } from 'rxjs';
import { take } from "rxjs/operators";

import './style.scss';

const app = angular.module('TwitchApp', []);
app.controller('myCtrl', ($scope, $http) => {
  const loading = 'Loading...';
  $scope.title = loading;
  //массив с будущими результатами
  $scope.results = [];
  $scope.activeTab = "all";
  //массив с именами стримеров
  const streamers = ["freecodecamp", "ESL_SC2", "OgamingSC2", "cretetion", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
  //загружаем данные со ссылки по стримерам
  streamers.forEach(getStreamers);
  //перезагружаем данные при нажатии на заголовок
  $scope.reload = () => {
    if ($scope.results.length === streamers.length) {
      $scope.title = loading;
      $scope.results = [];
      streamers.forEach(getStreamers);
      $scope.activeTab = 'all';
    }
  };
  
  function getStreamers(streamer) {
    forkJoin(
      $http.get(`https://wind-bow.glitch.me/twitch-api/users/${streamer}`),
      $http.get(`https://wind-bow.glitch.me/twitch-api/streams/${streamer}`)
    ).pipe(
      take(1)
    ).subscribe(
      ([users, streams]) => ($scope.results.push({
        name: users.data.display_name,
        logo: users.data.logo,
        href: `https://www.twitch.tv/${users.data.name}`,
        status: (streams.data.stream) ? `${streams.data.stream.channel.game}: ${streams.data.stream.channel.status}` : 'Offline'
      })),
      () => {
        const errorText = `Can't get information about streamer ${streamer}`;
        alert(errorText);
        console.warn(errorText);
        $scope.results.push(null);
      },
      () => {
        if ($scope.results.length === streamers.length) {
          $scope.title = 'TWITCH STREAMERS';
        }
      }
    )
  }
});