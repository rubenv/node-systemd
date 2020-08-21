var net = require('net');

var Server = net.Server.prototype;
var PipeWrap = process.binding('pipe_wrap');
var Pipe = PipeWrap.Pipe;

var oldListen = Server.listen;
Server.listen = function () {
    var self = this;
    var backlog;
    var callback;

    if (arguments[0] === 'systemd') {
        if (typeof arguments[1] === 'function') {
            callback = arguments[1];
        } else if (typeof arguments[1] === 'number') {
            backlog = arguments[1];
            callback = arguments[2];
        }

        if (!process.env.LISTEN_FDS || parseInt(process.env.LISTEN_FDS, 10) !== 1) {
            throw(new Error('No or too many file descriptors received.'));
        }

        if (callback) {
            self.once('listening', callback);
        }

        if (PipeWrap.constants && typeof PipeWrap.constants.SOCKET !== 'undefined') {
            self._handle = new Pipe(PipeWrap.constants.SOCKET);
        }
        else {
            self._handle = new Pipe();
        }
        self._handle.open(3);
        self._listen2(null, -1, -1, backlog);
    } else {
        oldListen.apply(self, arguments);
    }
    return self;
};
