


var Client = {};
Client.socket = io.connect();



Client.askNewUser = function () {

    Client.socket.emit("newuser");
};



Client.send = function (data) {

    Client.socket.emit("msg", { time: Date.now(), data: data });
};



Client.socket.on("newuser", function (data) {

    console.log("[newuser]", data);
});



Client.socket.on("allusers", function (data) {

    console.log("[allusers]", data);

    Client.socket.on("move", function (data) {

        console.log("[move]", data);
    });

    Client.socket.on("remove", function (id) {

        Game.removeUser(id);
    });
});


