var app = angular.module('TwitchApp', []);
app.controller('myCtrl', function($scope, $http) {
  //массив с результатами
  $scope.results = [];
  //переменная для запрета перезагрузки данных в процессе их загрузки
  let check = false;
  //массив с именами стримеров
  const streamers = ["freecodecamp", "ESL_SC2", "OgamingSC2", "cretetion", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"]; 
  //функция загрузки данных
  function getData() {
    //запрещаем нажимать кнопку(звголовок) для перезагрузки данных
    check = !check;
    streamers.forEach(function(streamer) { 
      let url = 'https://wind-bow.glitch.me/twitch-api/streams/'+streamer;
      $http.get(url)
      .success(function(data) {
        //если стрим активный, добавляем его в таблицу
        if (data.stream) { 
          let stream = data.stream.channel;
          $scope.results.push({name: stream.display_name, logo: stream.logo, href: stream.url, status: stream.game +': '+stream.status});
          //передаем длину массива в функцию для проверки, можно ли активировать заг
          checked($scope.results.length);
          //выделяем зеленым активный стрим
          green($('#status'));
        } else {
          //если стрим неактивный, ищем стример по другой ссылке
          getOffline(streamer);
        }
      });
    })
  };
  //функция по которой ищем данные о неактивных стримерах
  function getOffline(streamer) {
      let url = 'https://wind-bow.glitch.me/twitch-api/users/'+streamer; 
      $http.get(url)
          .success(function(data) {
           $scope.results.push({name: data.display_name, logo: data.logo, href: 'https://www.twitch.tv/'+data.name, status: 'Offline'});
        //передаем длину массива в функцию для проверки, можно ли активировать заг
        checked($scope.results.length);
        //выделяем зеленым активный стрим
        green($('#status'));
       });
  }
  //функция выделения зеленым активных стримов
  function green(status) {
    console.log(status.text())
    if(status.text() && status.text()!=='Offline') {
      status.parent().addClass('green');
    }
  }
  //после загрузки всех данных разрешаем перезагружать данные
  function checked(length) {
    if (length === streamers.length){
      check = !check;
    }
  }
  getData();
  //перезагружаем данные при нажатии на заголовок
  $('h1').on('click', function(){
    if (!check) {
      $scope.results = [];
      getData();
      $('li').removeClass('active');
      $('#all').addClass('active');
    }
  });
  //функции пеерключения между вкладками
  //показываем всех стримеров
  $('#all').on('click', function() {
    $('li').removeClass('active');
    $(this).addClass('active');  
    $('tr').show();
  });
  //показываем только тех стримеров, которые онлайн
  $('#online').on('click', function(){
    $('li').removeClass('active');
    $(this).addClass('active');
    $('tr').show();
    $('tr:not([class="green"])').hide();
  });
  //опказываем только тех, кто оффлайн
  $('#offline').on('click', function(){
    $('li').removeClass('active');
    $(this).addClass('active');
    $('tr').hide();
    $('tr:not([class="green"])').show();
  });
});
