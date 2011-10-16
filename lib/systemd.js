var systemd = require('../build/default/binding');
var net = require('net');

var Server = net.Server.prototype;

var oldListen = Server.listen;
Server.listen = function () {
    var self = this;

    if (arguments.length == 1 && arguments[0] == 'systemd') {
        var fd = systemd.get_fd();
        if (typeof fd === "undefined") {
            throw('No or too many file descriptors received.');
        }

        process.nextTick(function () {
            self.listenFD(fd, 'unix');
        });
    } else {
        oldListen.apply(self, arguments);
        console.log(self);
    }
}
