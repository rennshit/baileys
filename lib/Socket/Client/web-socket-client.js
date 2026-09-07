"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketClient = void 0;
const ws_1 = __importDefault(require("ws"));
const Defaults_1 = require("../../Defaults");
const abstract_socket_client_1 = require("./abstract-socket-client");
class WebSocketClient extends abstract_socket_client_1.AbstractSocketClient {
    constructor() {
        super(...arguments);
        this.socket = null;
    }
    get isOpen() {
        var _a;
        return ((_a = this.socket) === null || _a === void 0 ? void 0 : _a.readyState) === ws_1.default.OPEN;
    }
    get isClosed() {
        var _a;
        return this.socket === null || ((_a = this.socket) === null || _a === void 0 ? void 0 : _a.readyState) === ws_1.default.CLOSED;
    }
    get isClosing() {
        var _a;
        return this.socket === null || ((_a = this.socket) === null || _a === void 0 ? void 0 : _a.readyState) === ws_1.default.CLOSING;
    }
    get isConnecting() {
        var _a;
        return ((_a = this.socket) === null || _a === void 0 ? void 0 : _a.readyState) === ws_1.default.CONNECTING;
    }
    async connect() {
        var _a, _b;
        if (this.socket) {
            return;
        }
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept': '*/*',
            'DNT': '1',
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-GPC': '1',
            ...((_a = this.config.options) === null || _a === void 0 ? void 0 : _a.headers)
        };
        this.socket = new ws_1.default(this.url, {
            origin: Defaults_1.DEFAULT_ORIGIN,
            headers,
            handshakeTimeout: this.config.connectTimeoutMs || 30000,
            timeout: this.config.connectTimeoutMs || 30000,
            agent: this.config.agent,
            perMessageDeflate: false,
            maxPayload: 100 * 1024 * 1024,
            rejectUnauthorized: false,
            keepalive: true,
            keepaliveInterval: 25000,
        });
        this.socket.setMaxListeners(0);
        const events = ['close', 'error', 'upgrade', 'message', 'open', 'ping', 'pong', 'unexpected-response'];
        for (const event of events) {
            (_b = this.socket) === null || _b === void 0 ? void 0 : _b.on(event, (...args) => this.emit(event, ...args));
        }
    }
    async close() {
        if (!this.socket) {
            return;
        }
        this.socket.close();
        this.socket = null;
    }
    send(str, cb) {
        var _a;
        (_a = this.socket) === null || _a === void 0 ? void 0 : _a.send(str, cb);
        return Boolean(this.socket);
    }
}
exports.WebSocketClient = WebSocketClient;
