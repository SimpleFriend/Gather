


const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io").listen(server);



app.use("/css", express.static(__dirname + "/css"));
app.use("/js", express.static(__dirname + "/js"));
app.use("/assets", express.static(__dirname + "/assets"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});



server.newId = function () {
    var id = 0n;
    return function (prefix) {
        return prefix.toString() + (id++);
    }
}();



server.listen(process.env.PORT || 8081, function () {

    console.log("Listening on " + server.address().port);
});



io.on("connection", function (socket) {

    socket.on("newuser", function () {



        socket.user = {
            id: server.newId("user"),
            public: {},
            private: {}
        };

        socket.emit("allusers", getAllUsers());

        socket.broadcast.emit("newuser", socket.user);



        socket.on("msg", function (data) {

            console.log("[msg]", data);

            socket.user.public.msg = data;

            io.emit("move", { id: socket.user.id, public: socket.user.public });
        });



        socket.on("disconnect", function () {

            io.emit("remove", socket.user.id);
        });



    });

});



function getAllUsers() {

    var users = {};

    Object.keys(io.sockets.connected).forEach(function (socketID) {

        var user = io.sockets.connected[socketID].user;
        if (user) users[user.id] = user.public;
    });

    return users;
}



function rnd(low, high) {

    return Math.floor(Math.random() * (high - low) + low);
}
