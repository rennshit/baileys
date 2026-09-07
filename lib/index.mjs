import baileys from './index.js';

const makeWASocket = baileys.makeWASocket ?? baileys.default;

export { makeWASocket };
export const proto = baileys.proto;
export const DisconnectReason = baileys.DisconnectReason;
export const Browsers = baileys.Browsers;
export const useMultiFileAuthState = baileys.useMultiFileAuthState;
export const makeInMemoryStore = baileys.makeInMemoryStore;
export const makeCacheableSignalKeyStore = baileys.makeCacheableSignalKeyStore;
export const fetchLatestBaileysVersion = baileys.fetchLatestBaileysVersion;
export const jidDecode = baileys.jidDecode;
export const jidEncode = baileys.jidEncode;

export default makeWASocket;
