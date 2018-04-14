# Relayer for Tutorial "relayer_orders"

from flask import Flask, jsonify, request, render_template, json

class Order: 
    def __init__(self, order_json_str):
        #{"exchangeContractAddress":"0x90fe2af704b34e0224bf2299c838e04d4dcf1364","maker":"0x8727d175c2e3498c0dead007006d4873fa96ee45","taker":"0x0000000000000000000000000000000000000000","makerTokenAddress":"0xd0a1e359811322d97991e03f863a0c30c2cf029c","takerTokenAddress":"0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570","makerTokenAmount":"10000000000000000","takerTokenAmount":"11000000000000000","expirationUnixTimestampSec":"1523431277121","salt":"49442418397136481559564991769292039685503457472027377720261297889603727680015","feeRecipient":"0xb046140686d052fff581f63f8136cce132e857da","makerFee":"100000000000000","takerFee":"200000000000000","ecSignature":{"v":28,"r":"0xa741cd5f1720dbe6636fcba9c7a5617c991aed67ed08a7a3bceef504aac5155f","s":"0x2569cdc5382bf71b42719af5dd89d8f4f40d7588ca51935b4a797d0663d39fea"}}
        self.d = json.loads(order_json_str)
     
class OrderBook:
    def __init__(self):
        self.order_book = [] 

    def add_order(self, order): 
        self.order_book.append(order)
 
app = Flask(__name__)

order_book = OrderBook()

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
    print 'Order received'
    order = Order(request.data)
    try:
        order_book.add_order(order)     
        print 'Order added successfully'
        return render_template('page.html'), 201
    except:
        print 'FAILED: Order addition'
        return render_template('error.html'), 400 
 
@app.route('/v0/orderbook', methods = ['GET'])
def return_orderbook():
    base_token_addr = request.args.get('baseTokenAddress')
    quote_token_addr = request.args.get('quoteTokenAddress')

    bids = [] 
    for order in order_book.order_book:
        if order.d['makerTokenAddress'] == quote_token_addr:     
            bids.append(order.d)

    asks = [] 
    for order in order_book.order_book:
        if order.d['takerTokenAddress'] == base_token_addr:     
            asks.append(order.d)

    response = {"bids" : bids, "asks" : asks} 

    return jsonify(response)


if __name__ == '__main__':
    port = 3000 #the custom port you want
    app.run(host='0.0.0.0', port=port)

