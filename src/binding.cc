#include <v8.h>
#include <node.h>
#include <unistd.h>
#include <fcntl.h>
#include "sd-daemon.h"

using namespace v8;

static Handle<Value> GetFd (const Arguments& args) {
    HandleScope scope;

    if (sd_listen_fds(0) != 1) {
            return Undefined();
    }

    int fd = SD_LISTEN_FDS_START + 0;
    fcntl(fd, F_SETFL, O_NONBLOCK); // Node needs non-blocking sockets.
    return scope.Close(Number::New(fd));
}

extern "C" void
init (Handle<Object> target) {
    HandleScope scope;
    NODE_SET_METHOD(target, "get_fd", GetFd);
}
