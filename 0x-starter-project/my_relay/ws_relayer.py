# Relayer for tutorial relayer_websockets.  

from flask import Flask
from flask_sockets import Sockets
from flask import jsonify, request, render_template, json
from relayer import Order

class Order: 
    def __init__(self, order_json_str):
        #{"exchangeContractAddress":"0x90fe2af704b34e0224bf2299c838e04d4dcf1364","maker":"0x8727d175c2e3498c0dead007006d4873fa96ee45","taker":"0x0000000000000000000000000000000000000000","makerTokenAddress":"0xd0a1e359811322d97991e03f863a0c30c2cf029c","takerTokenAddress":"0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570","makerTokenAmount":"10000000000000000","takerTokenAmount":"11000000000000000","expirationUnixTimestampSec":"1523431277121","salt":"49442418397136481559564991769292039685503457472027377720261297889603727680015","feeRecipient":"0xb046140686d052fff581f63f8136cce132e857da","makerFee":"100000000000000","takerFee":"200000000000000","ecSignature":{"v":28,"r":"0xa741cd5f1720dbe6636fcba9c7a5617c991aed67ed08a7a3bceef504aac5155f","s":"0x2569cdc5382bf71b42719af5dd89d8f4f40d7588ca51935b4a797d0663d39fea"}}
        self.d = json.loads(order_json_str)

class OrderBook:
    def __init__(self):
        self.entries = []  # Contains Orders

    def add(self, order):
        self.entries.append(order)

    def get_bids_asks(self, base_token_addr, quote_token_addr): 
        bids = [] 
        for order in self.entries: 
            if order.d['makerTokenAddress'] == quote_token_addr:     

                bids.append(order.d)
        asks = [] 
        for order in self.entries:
            if order.d['takerTokenAddress'] == base_token_addr:     
                asks.append(order.d)

        return (bids, asks)

class Subscription:
    def __init__(self, ws,  request_id, base_token_addr, quote_token_addr, 
                 snapshot, limit):
        self.request_id = request_id
        self.base_token_addr = base_token_addr 
        self.quote_token_addr = quote_token_addr
        self.snapshot = snapshot
        self.limit = limit
        self.ws = ws # Websocket session 

app = Flask(__name__)
sockets = Sockets(app)

Order_book = OrderBook()
UserSubscription = None # Not yet assigned, right now only for one user assumed

@app.route('/v0/fees', methods = ['POST'])
def send_fee_structure():
    data = {
        "feeRecipient": "0xb046140686d052fff581f63f8136cce132e857da",
        "makerFee": "100000000000000",
        "takerFee": "200000000000000"
    }
    return jsonify(data)

@app.route('/v0/order', methods = ['POST'])
def receive_order():
    global UserSubscription
    print 'Order received'
    order = Order(request.data)
    try:
        Order_book.add(order)
        print 'Order added successfully'
        if UserSubscription:
            response = {} 
            response["type"] = "update"
            response["channel"] = "orderbook"
            response["requestId"] = UserSubscription.request_id
            response["payload"] = order.d 
            UserSubscription.ws.send(json.dumps(response))
            print 'New order sent back to client'
        return render_template('page.html'), 201
    except:
        raise
        print 'FAILED: Order addition'
        return render_template('error.html'), 400 
 
@app.route('/v0/orderbook', methods = ['GET'])
def return_orderbook():
    base_token_addr = request.args.get('baseTokenAddress')
    quote_token_addr = request.args.get('quoteTokenAddress')
    bids, asks = Order_book.get_bids_asks(base_token_addr, quote_token_addr)

    response = {"bids" : bids, "asks" : asks} 

    return jsonify(response)

####  Websockets part 

@sockets.route('/v0')
def handle_ws_msg(ws): 
    global UserSubscription
    while not ws.closed:
        msg = ws.receive()
        msg = json.loads(msg)
        if msg["type"] == "subscribe" and msg["channel"] == "orderbook":
            request_id = msg["requestId"]
            base_addr = msg["payload"]["baseTokenAddress"]
            quote_addr = msg["payload"]["quoteTokenAddress"]
            send_snapshot = msg["payload"]["snapshot"]
            limit  = msg["payload"]["limit"]
            UserSubscription = Subscription(ws, request_id, base_addr, 
                                            quote_addr, send_snapshot, limit) 
    def __init__(self, ws,  request_id, base_token_addr, quote_token_addr, 
                 snapshot, limit):
            print UserSubscription
            if send_snapshot == False: 
                ws.send('')
                print 'Empty response send for subscribe'
            else:
                bids, asks = Order_book.get_bids_asks(base_addr, quote_addr)
                response = {
                    "type" : "snapshot",
                    "channel" : "orderbook",
                    "requestId" : request_id,
                    "payload" : {"bids"  : bids,
                                 "asks" : asks}
                }
                ws.send(json.dumps(response))
                print 'Reponse sent'

    print 'WS closed'

if __name__ == '__main__':
    from gevent import pywsgi
    from geventwebsocket.handler import WebSocketHandler

    # NOTE: Both HTTP and Websocket run on same port 
    server = pywsgi.WSGIServer(('', 3001), app, handler_class=WebSocketHandler)
    server.serve_forever()
