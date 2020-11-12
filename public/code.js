$(function () {
    var user;
    var socket = io();
    
    $('form').submit(function(e){
      e.preventDefault(); // prevents page reloading
      $('#m').val((index, value) => {return value.replace(':)', '😁'); })
      $('#m').val((index, value) => {return value.replace(':(', '🙁'); })
      $('#m').val((index, value) => {return value.replace(':o', '😲'); })
      socket.emit('chat message', $('#m').val());
      $('#messages').stop(true, true).animate({scrollTop: $('#messages')[0].scrollHeight}, 1000);
      $('#m').val('');
      return false;
    });

    socket.on('if first time user', () => {
        document.cookie != "" ? socket.emit('returningUser', document.cookie): socket.emit('firstTimeUser');
    });

    socket.on('replace message log', (msgLog) => {
        $('#usernameList').html('');
        $('#messages').html('');

        for (var i=0; i<msgLog.length; i++) {
            if (msgLog[i].name === user)
                { $('#messages').append($('<li>').html(`<b>${msgLog[i].timestamp}<span style="color:${msgLog[i].color}">${msgLog[i].name}</span>: ${msgLog[i].msg}</b>`)); }
            else 
                { $('#messages').append($('<li>').html(`${msgLog[i].timestamp}<span style="color:${msgLog[i].color}">${msgLog[i].name}</span>: ${msgLog[i].msg}`)); }
                $('#messages').stop(true, true).animate({scrollTop: $('#messages')[0].scrollHeight}, 1000);
                scrollToBottom();
        }
    });

    socket.on('display current username', (name, color) => {
        user = name;
        $('#messages').append($('<li>').html(`<span style="font-size: 20px; color:>${color}">You are ${name}</span>.`));
    });

    socket.on('update users list', (usersList) => {
        $('#usernameList').html('');
        for (var i=0; i<usersList.length; i++) {
            if (usersList[i].name === user) {
                $('#usernameList').append($('<li>').html(`<b><span>${usersList[i].name} (you)</span></b>`));
            } else {
                $('#usernameList').append($('<li>').html(`<span>${usersList[i].name}</span>`));
            }
        }
    });

    socket.on('cookieSaved', (name, color) => {
        user = name;
        document.cookie = name + color;
    });

    socket.on('chat message', (timestamp, color, name, msg) => {
        $('#messages').append($('<li>').html(`${timestamp}<span style="color:${color}">${name}</span>: ${msg}`));
        $('#messages').animate({scrollTop: $('#messages').prop('scrollHeight')}, 1000);
        scrollToBottom();
    });

    socket.on('bold message', (timestamp, color, name, msg) => {
        $('#messages').append($('<li>').html(`<b>${timestamp}<span style="color:${color}">${name}</span>: ${msg}</b>`));
        scrollToBottom();
    });
});

function scrollToBottom() {
    if ($('#messages').height() >= $('.chatWindow').height() - 26) {
        $('#messages').css("height", "calc(100%-25px)");
        $('#messages').css("overflow-y", "auto");
    }
}