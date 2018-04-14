"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var _0x_js_1 = require("0x.js");
var connect_1 = require("@0xproject/connect");
var utils_1 = require("@0xproject/utils");
var Web3 = require("web3");
var mainAsync = function () { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    var provider, zeroExConfig, zeroEx, relayerHttpApiUrl, relayerClient, EXCHANGE_ADDRESS, wethTokenInfo, zrxTokenInfo, WETH_ADDRESS, ZRX_ADDRESS, addresses, zrxOwnerAddress, wethOwnerAddresses, setZrxAllowanceTxHashes, setWethAllowanceTxHashes, ethToConvert, depositTxHashes;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                provider = new Web3.providers.HttpProvider('http://localhost:8545');
                zeroExConfig = {
                    networkId: 42, /* PUNEET: Kovan */ 
                };
                zeroEx = new _0x_js_1.ZeroEx(provider, zeroExConfig);
                relayerHttpApiUrl = 'http://localhost:3001/v0';
                relayerClient = new connect_1.HttpClient(relayerHttpApiUrl);
                return [4 /*yield*/, zeroEx.exchange.getContractAddress()];
            case 1:
                EXCHANGE_ADDRESS = _a.sent();
                return [4 /*yield*/, zeroEx.tokenRegistry.getTokenBySymbolIfExistsAsync('WETH')];
            case 2:
                wethTokenInfo = _a.sent();
                return [4 /*yield*/, zeroEx.tokenRegistry.getTokenBySymbolIfExistsAsync('ZRX')];
            case 3:
                zrxTokenInfo = _a.sent();
                // Check if either getTokenBySymbolIfExistsAsync query resulted in undefined
                if (wethTokenInfo === undefined || zrxTokenInfo === undefined) {
                    throw new Error('could not find token info');
                }
                WETH_ADDRESS = wethTokenInfo.address;
                ZRX_ADDRESS = zrxTokenInfo.address;
                return [4 /*yield*/, zeroEx.getAvailableAddressesAsync()];
            case 4:
                addresses = _a.sent();
                zrxOwnerAddress = addresses[0];
                
                wethOwnerAddresses = addresses.slice(1);
                return [4 /*yield*/, Promise.all(addresses.map(function (address) {
                        return zeroEx.token.setUnlimitedProxyAllowanceAsync(ZRX_ADDRESS, address);
                    }))];
            case 5:
                setZrxAllowanceTxHashes = _a.sent();
                return [4 /*yield*/, Promise.all(addresses.map(function (address) {
                        return zeroEx.token.setUnlimitedProxyAllowanceAsync(WETH_ADDRESS, address);
                    }))];
            case 6:
                setWethAllowanceTxHashes = _a.sent();
                return [4 /*yield*/, Promise.all(setZrxAllowanceTxHashes.concat(setWethAllowanceTxHashes).map(function (tx) {
                        return zeroEx.awaitTransactionMinedAsync(tx);
                    }))];
            case 7:
                _a.sent();
                // Send 1000 ZRX from zrxOwner to all other addresses
                return [4 /*yield*/, Promise.all(wethOwnerAddresses.map(function (address, index) { return __awaiter(_this, void 0, void 0, function () {
                        var zrxToTransfer, txHash;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    zrxToTransfer = _0x_js_1.ZeroEx.toBaseUnitAmount(new utils_1.BigNumber(0), zrxTokenInfo.decimals);
                                    return [4 /*yield*/, zeroEx.token.transferAsync(ZRX_ADDRESS, zrxOwnerAddress, address, zrxToTransfer)];
                                case 1:
                                    txHash = _a.sent();
                                    return [2 /*return*/, zeroEx.awaitTransactionMinedAsync(txHash)];
                            }
                        });
                    }); }))];
            case 8:
                // Send 1000 ZRX from zrxOwner to all other addresses
                _a.sent();
                ethToConvert = _0x_js_1.ZeroEx.toBaseUnitAmount(new utils_1.BigNumber(0), wethTokenInfo.decimals);
                return [4 /*yield*/, Promise.all(wethOwnerAddresses.map(function (address) {
                        return zeroEx.etherToken.depositAsync(WETH_ADDRESS, ethToConvert, address);
                    }))];
            case 9:
                depositTxHashes = _a.sent();
                return [4 /*yield*/, Promise.all(depositTxHashes.map(function (tx) {
                        return zeroEx.awaitTransactionMinedAsync(tx);
                    }))];
            case 10:
                _a.sent();
                // Generate and submit orders with increasing ZRX/WETH exchange rate
                return [4 /*yield*/, Promise.all(wethOwnerAddresses.map(function (address, index) { return __awaiter(_this, void 0, void 0, function () {
                        var exchangeRate, makerTokenAmount, takerTokenAmount, ONE_HOUR_IN_MS, feesRequest, feesResponse, order, orderHash, ecSignature, signedOrder;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    exchangeRate = (index + 1) * 1.1; 
                                    makerTokenAmount = _0x_js_1.ZeroEx.toBaseUnitAmount(new utils_1.BigNumber(0.01), wethTokenInfo.decimals);
                                    takerTokenAmount = makerTokenAmount.mul(exchangeRate);
                                    ONE_HOUR_IN_MS = 3600000;
                                    feesRequest = {
                                        exchangeContractAddress: EXCHANGE_ADDRESS,
                                        maker: address,
                                        taker: _0x_js_1.ZeroEx.NULL_ADDRESS,
                                        makerTokenAddress: WETH_ADDRESS,
                                        takerTokenAddress: ZRX_ADDRESS,
                                        makerTokenAmount: makerTokenAmount,
                                        takerTokenAmount: takerTokenAmount,
                                        expirationUnixTimestampSec: new utils_1.BigNumber(Date.now() + ONE_HOUR_IN_MS),
                                        salt: _0x_js_1.ZeroEx.generatePseudoRandomSalt(),
                                    };
                                    return [4 /*yield*/, relayerClient.getFeesAsync(feesRequest)];
                                case 1:
                                    feesResponse = _a.sent();
                                    order = __assign({}, feesRequest, feesResponse);
                                    orderHash = _0x_js_1.ZeroEx.getOrderHashHex(order);
                                    return [4 /*yield*/, zeroEx.signOrderHashAsync(orderHash, address, false)];
                                case 2:
                                    ecSignature = _a.sent();
                                    signedOrder = __assign({}, order, { ecSignature: ecSignature });
                                    // Submit order to relayer
                                    return [4 /*yield*/, relayerClient.submitOrderAsync(signedOrder)];
                                case 3:
                                    // Submit order to relayer
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 11:
                // Generate and submit orders with increasing ZRX/WETH exchange rate
                _a.sent();
                // Generate and submit orders with flat WETH/ZRX exchange rate
                return [4 /*yield*/, Promise.all(wethOwnerAddresses.map(function (address, index) { return __awaiter(_this, void 0, void 0, function () {
                        var makerTokenAmount, takerTokenAmount, ONE_HOUR_IN_MS, feesRequest, feesResponse, order, orderHash, ecSignature, signedOrder;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    makerTokenAmount = _0x_js_1.ZeroEx.toBaseUnitAmount(new utils_1.BigNumber(0.01), wethTokenInfo.decimals);
                                    takerTokenAmount = _0x_js_1.ZeroEx.toBaseUnitAmount(new utils_1.BigNumber(0.001), wethTokenInfo.decimals);
                                    ONE_HOUR_IN_MS = 3600000;
                                    feesRequest = {
                                        exchangeContractAddress: EXCHANGE_ADDRESS,
                                        maker: address,
                                        taker: _0x_js_1.ZeroEx.NULL_ADDRESS,
                                        makerTokenAddress: ZRX_ADDRESS,
                                        takerTokenAddress: WETH_ADDRESS,
                                        makerTokenAmount: makerTokenAmount,
                                        takerTokenAmount: takerTokenAmount,
                                        expirationUnixTimestampSec: new utils_1.BigNumber(Date.now() + ONE_HOUR_IN_MS),
                                        salt: _0x_js_1.ZeroEx.generatePseudoRandomSalt(),
                                    };
                                    return [4 /*yield*/, relayerClient.getFeesAsync(feesRequest)];
                                case 1:
                                    feesResponse = _a.sent();
                                    order = __assign({}, feesRequest, feesResponse);
                                    orderHash = _0x_js_1.ZeroEx.getOrderHashHex(order);
                                    return [4 /*yield*/, zeroEx.signOrderHashAsync(orderHash, address, false)];
                                case 2:
                                    ecSignature = _a.sent();
                                    signedOrder = __assign({}, order, { ecSignature: ecSignature });
                                    // Submit order to relayer
                                    return [4 /*yield*/, relayerClient.submitOrderAsync(signedOrder)];
                                case 3:
                                    // Submit order to relayer
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 12:
                // Generate and submit orders with flat WETH/ZRX exchange rate
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
mainAsync().catch(console.error);
//# sourceMappingURL=generate_initial_book.js.map
