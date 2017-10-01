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
                let imei=viewInfo.imei
                socketViewInfo[imei] = socketViewInfo[imei] || {};
                socketViewInfo[imei] = {
                    ...viewInfo,
                    socketId: socket.id
                };
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

        socket.on("unsubscribe", viewInfo => {
            removeSubscription(viewInfo);
        })

    });
    callback();

}

var emitUpdates = (imei, params) => {
    for (var id in socketViewInfo) {
        let {imei, socketId} = socketViewInfo[id];
        console.log({imei, socketId});
        if (imei === imei) {
            io.to(socketId).emit("updateInRow", params);
            return;
        }
    }
};



var removeSubscription = (viewInfo) => {
    for(var  id in socketViewInfo){
        let {socketId} = socketViewInfo[id];
        if(viewInfo.imei===socketId){
            delete  socketViewInfo[viewInfo.imei];
            return;
        }
    }

}


module.exports = {
    configure,
    emitUpdates
}