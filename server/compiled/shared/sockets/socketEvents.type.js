"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketCallEvents = exports.SocketChatEvents = exports.SocketEvents = void 0;
var SocketEvents;
(function (SocketEvents) {
    SocketEvents["CONNECT"] = "connect";
    SocketEvents["DISCONNECT"] = "disconnect";
    SocketEvents["MATCH_FIND"] = "match find";
    SocketEvents["MATCH_FIND_CANCEL"] = "match find cancel";
    SocketEvents["MATCH_FOUND"] = "match found";
    SocketEvents["MATCH_CANCEL"] = "cancel match";
    SocketEvents["CHAT_MESSAGE"] = "chat message";
    SocketEvents["NOTIFICATION"] = "notification";
})(SocketEvents || (exports.SocketEvents = SocketEvents = {}));
var SocketChatEvents;
(function (SocketChatEvents) {
    SocketChatEvents["MESSAGE_SEND"] = "message send";
})(SocketChatEvents || (exports.SocketChatEvents = SocketChatEvents = {}));
var SocketCallEvents;
(function (SocketCallEvents) {
    SocketCallEvents["PEER_ID"] = "peer-id";
    SocketCallEvents["MATCH_FIND"] = "call-match:find";
    SocketCallEvents["MATCH_FIND_CANCEL"] = "call-match:find-cancel";
    SocketCallEvents["MATCH_FOUND"] = "call-match:found";
    SocketCallEvents["MATCH_CANCEL"] = "call-cancel:match";
})(SocketCallEvents || (exports.SocketCallEvents = SocketCallEvents = {}));
