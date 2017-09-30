import socket from "socket.io";
var socketViewInfo = {};
var io = void 0;

process.on('uncaughtException', (err) => {
    console.log("error>>>", err);

});
var configure = (server,callback) => {
    io = socket(server);
    console.log("io");
    io.on('connection', function (socket) {
        socket.on("subscribe", function (viewInfo) {
            if (viewInfo) {
                socketViewInfo.socketId = socketViewInfo.socketId || {};
                socketViewInfo.socketId =viewInfo
                /*in view info imei , source destination, speed,*/

            }
        })

        /*when user close the tab all the registered socket info should be removed from memory @sunil*/
        socket.on("disconnect", _ => {
            removeSubscription(socket.id);
        });

        socket.on("error", err => {
            removeSubscription(socket.id);
        })

        socket.on("unsubscribe", _ => {
            removeSubscription(socket.id);
        })

    });
    callback();

}

var emitUpdates = (socketId, params) => {
    io.to(socketId).emit("updateInRow", params);
}



var removeSubscription = (socketId) => {
    delete  socketViewInfo.socketId;
}


module.exports = {
    configure,
    emitUpdates
}