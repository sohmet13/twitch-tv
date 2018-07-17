var app = angular.module('TwitchApp', ['ngAnimate']);
app.controller('myCtrl', function($scope, $http) {
  $("li div:first").css('background', '#0C1b53');
  $("li div:odd").css('background', 'green');
  $scope.results = [];
  var streamers = ["freecodecamp", "ESL_SC2", "OgamingSC2", "cretetion", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"]; 
  var twitch = 'https://wind-bow.glitch.me/twitch-api/users/';
  var twitchStream = 'https://wind-bow.glitch.me/twitch-api/streams/';
  var i=0;
  function stream() {
    var url = twitch+streamers[i];
    var urlStream = twitchStream+streamers[i];
    $http.get(urlStream)
      .success(function(data) {
      $('tr').css('background', 'green').addClass('online');
      if (data.stream!==null) {
        var dataStream = data.stream.channel;
        $scope.results.push({name: dataStream.display_name, logo: dataStream.logo, href: dataStream.url, status: dataStream.game +': '+dataStream.status});
      } else {$http.get(url)
      .success(function(data1) {
       $scope.results.push({name: data1.display_name, logo: data1.logo, href: 'https://www.twitch.tv/'+data1.name, status: 'Offline'});
        });
       }
     });   
    if (i<streamers.length-1) {
      i++;
      stream();
    } else {
      i=0;
    }
  }
  stream();
  $('h1').on('click', function(){
    $('table').hide();
    stream();
    $('#online, #offline').removeClass('active');
    $('#all').addClass('active');
  });
  $('#all').on('click', function() {
    $(this).addClass('active');
    $('#online, #offline').removeClass('active');
    $('tr').show('slow');
  });
  $('#online').on('click', function(){
    $(this).addClass('active');
    $('#all, #offline').removeClass('active');
    $('tr').show('slow');
    $('tr:not([class="online"])').hide();
  });
  $('#offline').on('click', function(){
    $(this).addClass('active');
    $('#all, #online').removeClass('active');
    $('tr').hide();
    $('tr:not([class="online"])').show('slow');
  });
});
