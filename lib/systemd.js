'use strict';

// https://stackoverflow.com/a/6294196
// todo: don't hard-code this
const PID_MAX = 4194304;

// > Maximum value for an object of type int.
// > Minimum Acceptable Value: 2 147 483 647
// https://man7.org/linux/man-pages/man0/limits.h.0p.html
const INT_MAX = 2_147_483_647;

// https://github.com/systemd/systemd/blob/b622e95f2f59fcb58e23ddafed745eee26a0f52f/src/systemd/sd-daemon.h#L55-L56
const SD_LISTEN_FDS_START = 3;

const getSocketActivationFds = () => {
	if (!process.env.LISTEN_PID) return null;
	// https://github.com/systemd/systemd/blob/3bdb60055e16776c8cc4d44f26abb5f2cbe197bf/src/libsystemd/sd-daemon/sd-daemon.c#L47-L61
	const r = parseInt(process.env.LISTEN_PID);
	if (r <= 0 || r > PID_MAX) {
		throw new Error('invalid $LISTEN_PID');
	}
	if (r !== process.pid) return null;

	if (!process.env.LISTEN_FDS) return null;
	const n = parseInt(process.env.LISTEN_FDS);
	if (n <= 0 || n > INT_MAX - SD_LISTEN_FDS_START) {
		throw new Error('invalid $LISTEN_FDS');
		// todo: err.code = 'EINVAL' ?
	}

	// todo:
	// for (let fd = SD_LISTEN_FDS_START; fd < SD_LISTEN_FDS_START + n; fd ++) {
	//  fd_cloexec(fd, true);
	// }

	// todo: unset env vars

	// todo:
	// > For IPv4 and IPv6 connections, the REMOTE_ADDR environment variable will contain the remote IP address, and REMOTE_PORT will contain the remote port. This is the same as the format used by CGI. For SOCK_RAW, the port is the IP protocol.
	// https://www.freedesktop.org/software/systemd/man/systemd.socket.html

	return new Array(n).fill(null).map((_, i) => SD_LISTEN_FDS_START + i);
}

const getListenArgs = (...nonSocketActivatedArgs) => {
	const fds = getSocketActivationFds();
	if (fds === null) return nonSocketActivatedArgs;

	return [{
		fd: fds[0],
	}];
}

module.exports = {
	getSocketActivationFds,
	getListenArgs,
};