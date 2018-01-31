var net = require('net');

var Server = net.Server.prototype;
var PipeWrap = process.binding('pipe_wrap');
var Pipe = PipeWrap.Pipe;

var oldListen = Server.listen;
Server.listen = function () {
    var self = this;

    if (arguments.length === 1 && arguments[0] === 'systemd') {
        if (!process.env.LISTEN_FDS || parseInt(process.env.LISTEN_FDS, 10) !== 1) {
            throw(new Error('No or too many file descriptors received.'));
        }

        if (PipeWrap.constants && typeof PipeWrap.constants.SOCKET !== 'undefined') {
            self._handle = new Pipe(PipeWrap.constants.SOCKET);
        }
        else {
            self._handle = new Pipe();
        }
        self._handle.open(3);
        self._listen2(null, -1, -1);
    } else {
        oldListen.apply(self, arguments);
    }
    return self;
};
