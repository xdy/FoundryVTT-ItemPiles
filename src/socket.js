import CONSTANTS from "./constants/constants.js";
import { debug } from "./helpers/helpers.js";
import { stringIsUuid } from "./helpers/utilities.js";
import PrivateAPI from "./API/private-api.js";
import TradeAPI from "./API/trade-api.js";
import ChatAPI from "./API/chat-api.js";

export default class ItemPileSocket {
  
  static HANDLERS = {
    /**
     * Generic sockets
     */
    CALL_HOOK: "callHook",
    
    /**
     * Chat messages
     */
    PICKUP_CHAT_MESSAGE: "pickupChatMessage",
    SPLIT_CHAT_MESSAGE: "splitChatMessage",
    DISABLE_CHAT_TRADE_BUTTON: "disableChatTradeButton",
    
    /**
     * Item pile sockets
     */
    CREATE_PILE: "createItemPile",
    UPDATE_PILE: "updateItemPile",
    UPDATED_PILE: "updatedPile",
    DELETE_PILE: "deleteItemPile",
    TURN_INTO_PILE: "turnIntoPiles",
    REVERT_FROM_PILE: "revertFromPiles",
    REFRESH_PILE: "refreshItemPile",
    SPLIT_PILE: "splitItemPileContent",
    
    /**
     * UI sockets
     */
    RENDER_INTERFACE: "renderItemPileApplication",
    RERENDER_TOKEN_HUD: "rerenderTokenHud",
    QUERY_PILE_INVENTORY_OPEN: "queryItemPileInventoryOpen",
    RESPOND_PILE_INVENTORY_OPEN: "responseItemPileInventoryOpen",
    
    /**
     * Item & attribute sockets
     */
    DROP_ITEMS: "dropItems",
    ADD_ITEMS: "addItems",
    REMOVE_ITEMS: "removeItems",
    TRANSFER_ITEMS: "transferItems",
    TRANSFER_ALL_ITEMS: "transferAllItems",
    ADD_ATTRIBUTE: "addAttributes",
    REMOVE_ATTRIBUTES: "removeAttributes",
    TRANSFER_ATTRIBUTES: "transferAttributes",
    TRANSFER_ALL_ATTRIBUTES: "transferAllAttributes",
    TRANSFER_EVERYTHING: "transferEverything",
    
    /**
     * Trading sockets
     */
    TRADE_REQUEST_PROMPT: "tradePrompt",
    TRADE_REQUEST_CANCELLED: "tradeCancelled",
    REQUEST_TRADE_DATA: "requestTradeData",
    TRADE_CLOSED: "publicTradeClosed",
    PUBLIC_TRADE_UPDATE_ITEMS: "publicTradeUpdateItems",
    PUBLIC_TRADE_UPDATE_CURRENCIES: "publicTradeUpdateCurrencies",
    PUBLIC_TRADE_STATE: "publicTradeAcceptedState",
    PRIVATE_TRADE_UPDATE_ITEMS: "privateTradeUpdateItems",
    PRIVATE_TRADE_UPDATE_CURRENCIES: "privateTradeUpdateCurrencies",
    PRIVATE_TRADE_STATE: "privateTradeAcceptedState",
    EXECUTE_TRADE: "executeTrade",
    TRADE_COMPLETED: "tradeCompleted",
  }
  
  static BINDINGS = {
    [this.HANDLERS.CALL_HOOK]: (hook, response, ...args) => callHook(hook, response, ...args),
    
    [this.HANDLERS.DROP_ITEMS]: (args) => PrivateAPI._dropItems(args),
    [this.HANDLERS.ADD_ITEMS]: (...args) => PrivateAPI._addItems(...args),
    [this.HANDLERS.REMOVE_ITEMS]: (...args) => PrivateAPI._removeItems(...args),
    [this.HANDLERS.TRANSFER_ITEMS]: (...args) => PrivateAPI._transferItems(...args),
    [this.HANDLERS.TRANSFER_ALL_ITEMS]: (...args) => PrivateAPI._transferAllItems(...args),
    [this.HANDLERS.ADD_ATTRIBUTE]: (...args) => PrivateAPI._addAttributes(...args),
    [this.HANDLERS.REMOVE_ATTRIBUTES]: (...args) => PrivateAPI._removeAttributes(...args),
    [this.HANDLERS.TRANSFER_ATTRIBUTES]: (...args) => PrivateAPI._transferAttributes(...args),
    [this.HANDLERS.TRANSFER_ALL_ATTRIBUTES]: (...args) => PrivateAPI._transferAllAttributes(...args),
    [this.HANDLERS.TRANSFER_EVERYTHING]: (...args) => PrivateAPI._transferEverything(...args),
    
    [this.HANDLERS.CREATE_PILE]: (...args) => PrivateAPI._createItemPile(...args),
    [this.HANDLERS.UPDATE_PILE]: (...args) => PrivateAPI._updateItemPile(...args),
    [this.HANDLERS.UPDATED_PILE]: (...args) => PrivateAPI._updatedItemPile(...args),
    [this.HANDLERS.DELETE_PILE]: (...args) => PrivateAPI._deleteItemPile(...args),
    [this.HANDLERS.TURN_INTO_PILE]: (...args) => PrivateAPI._turnTokensIntoItemPiles(...args),
    [this.HANDLERS.REVERT_FROM_PILE]: (...args) => PrivateAPI._revertTokensFromItemPiles(...args),
    [this.HANDLERS.SPLIT_PILE]: (...args) => PrivateAPI._splitItemPileContents(...args),
    
    [this.HANDLERS.TRADE_REQUEST_PROMPT]: (...args) => TradeAPI._respondPrompt(...args),
    [this.HANDLERS.TRADE_REQUEST_CANCELLED]: (...args) => TradeAPI._tradeCancelled(...args),
    [this.HANDLERS.PUBLIC_TRADE_UPDATE_ITEMS]: (...args) => TradeAPI._updateItems(...args),
    [this.HANDLERS.PUBLIC_TRADE_UPDATE_CURRENCIES]: (...args) => TradeAPI._updateCurrencies(...args),
    [this.HANDLERS.PUBLIC_TRADE_STATE]: (...args) => TradeAPI._updateAcceptedState(...args),
    [this.HANDLERS.PRIVATE_TRADE_UPDATE_ITEMS]: (...args) => TradeAPI._updateItems(...args),
    [this.HANDLERS.PRIVATE_TRADE_UPDATE_CURRENCIES]: (...args) => TradeAPI._updateCurrencies(...args),
    [this.HANDLERS.PRIVATE_TRADE_STATE]: (...args) => TradeAPI._updateAcceptedState(...args),
    [this.HANDLERS.TRADE_CLOSED]: (...args) => TradeAPI._tradeClosed(...args),
    
    [this.HANDLERS.EXECUTE_TRADE]: (...args) => TradeAPI._executeTrade(...args),
    [this.HANDLERS.TRADE_COMPLETED]: (...args) => TradeAPI._tradeCompleted(...args),
    [this.HANDLERS.REQUEST_TRADE_DATA]: (...args) => TradeAPI._respondActiveTradeData(...args),
    
    [this.HANDLERS.PICKUP_CHAT_MESSAGE]: (...args) => ChatAPI._outputPickupToChat(...args),
    [this.HANDLERS.SPLIT_CHAT_MESSAGE]: (...args) => ChatAPI._outputSplitToChat(...args),
    [this.HANDLERS.DISABLE_CHAT_TRADE_BUTTON]: (...args) => ChatAPI._disableTradingButton(...args),
    
    [this.HANDLERS.RENDER_INTERFACE]: (...args) => {
    },
    [this.HANDLERS.RERENDER_TOKEN_HUD]: (...args) => PrivateAPI._updateTokenHud(),
    [this.HANDLERS.QUERY_PILE_INVENTORY_OPEN]: (...args) => {
    },
    [this.HANDLERS.RESPOND_PILE_INVENTORY_OPEN]: (...args) => {
    },
  }
  
  static _socket;
  
  static initialize() {
    this._socket = socketlib.registerModule(CONSTANTS.MODULE_NAME);
    for (let [key, callback] of Object.entries(this.BINDINGS)) {
      this._socket.register(key, callback);
      debug(`Registered itemPileSocket: ${key}`);
    }
  }
  
  static executeAsGM(handler, ...args) {
    return this._socket.executeAsGM(handler, ...args);
  }
  
  static executeAsUser(handler, userId, ...args) {
    return this._socket.executeAsUser(handler, userId, ...args);
  }
  
  static executeForAllGMs(handler, ...args) {
    return this._socket.executeForAllGMs(handler, ...args);
  }
  
  static executeForOtherGMs(handler, ...args) {
    return this._socket.executeForOtherGMs(handler, ...args);
  }
  
  static executeForEveryone(handler, ...args) {
    return this._socket.executeForEveryone(handler, ...args);
  }
  
  static executeForOthers(handler, ...args) {
    return this._socket.executeForOthers(handler, ...args);
  }
  
  static executeForUsers(handler, userIds, ...args) {
    return this._socket.executeForUsers(handler, userIds, ...args);
  }
  
  static callHook(hook, ...args) {
    return this._socket.executeForEveryone(this.HANDLERS.CALL_HOOK, ...args);
  }
  
}

async function callHook(hook, response, ...args) {
  const newArgs = [];
  for (let arg of args) {
    if (stringIsUuid(arg)) {
      const testArg = await fromUuid(arg);
      if (testArg) {
        arg = testArg;
      }
    }
    newArgs.push(arg);
  }
  return Hooks.callAll(hook, ...newArgs);
}