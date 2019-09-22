import angular from 'angular';

import './style.scss';

var app = angular.module('TwitchApp', []);
app.controller('myCtrl', function($scope, $http) {
  //данные об активных и неактивных вкладках
  $scope.allClick = true;
  $scope.onClick = false;
  $scope.offClick = false;
  //массив с будущими результатами
  $scope.results = [];
  //переменная для запрета перезагрузки данных в процессе их загрузки
  let check = false;
  //массив с именами стримеров
  const streamers = ["freecodecamp", "ESL_SC2", "OgamingSC2", "cretetion", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"]; 
  //функция загрузки данных
  function getData() {
    //запрещаем нажимать кнопку(звголовок) для перезагрузки данных
    check = !check;
    //загружаем данные со ссылки по стримерам
    streamers.forEach(function(streamer) { 
      $http.get('https://wind-bow.glitch.me/twitch-api/streams/'+streamer)
      .success(function(data) {
        let status;
        //если стример онлайн, запоминаем его игру
        if (data.stream) { 
          let stream = data.stream.channel;
          status= stream.game +': '+stream.status;
        }
        //берем остальную информауию по стримеру
        $http.get('https://wind-bow.glitch.me/twitch-api/users/'+streamer)
         .success(function(results) {
          //заносим все данные по стримеру в массив
          $scope.results.push({name: results.display_name, logo: results.logo, href: 'https://www.twitch.tv/'+ results.name, status: (status) ?status :'Offline'});
          //говорим кнопке о том, что можно включаться
          checked($scope.results.length);
         }); 
      });
    });
  };
  //после загрузки всех данных разрешаем перезагружать данные
  function checked(length) {
    if (length === streamers.length){
      check = !check;
    }
  }
  getData();
  //перезагружаем данные при нажатии на заголовок
  $scope.reload = () => {
    if (!check) {
      $scope.results = [];
      getData();
      $scope.allClick = true;
      $scope.onClick = false;
      $scope.offClick = false; 
    }
  };
  //переключения между вкладками
  //показываем всех стримеров
  $scope.all = () => {
    $scope.allClick = true;
    $scope.onClick = false;
    $scope.offClick = false; 
  };
  //показываем только тех стримеров, которые онлайн
  $scope.online = () => {
    $scope.allClick = false;
    $scope.onClick = true;
    $scope.offClick = false;
  };
  //опказываем только тех, кто оффлайн
  $scope.offline = () => {
    $scope.allClick = false;
    $scope.onClick = false;
    $scope.offClick = true;
  };
});