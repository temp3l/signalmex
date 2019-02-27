'use strict';
const SwaggerClient = require("swagger-client");
const  _ = require('lodash');
const debug = require('debug')('b0t');
const BitMEXAPIKeyAuthorization = require('./lib/BitMEXAPIKeyAuthorization');
const bookDepth = 2;
const log = (...args) => debug('%o',...args);

// (1) Maximum 200 open orders per contract per account;
// (2) Maximum 10 stop orders per contract per account;
// (3) Maximum 10 contingent orders per contract per account.


new SwaggerClient({ url: 'https://testnet.bitmex.com/api/explorer/swagger.json', usePromise: true }).then(function(client) {
  client.clientAuthorizations.add("apiKey", new BitMEXAPIKeyAuthorization('key', 'pass'));
 // inspect(client.apis);

  getMarginBalance(client).then(marginBalance => {
    console.log('\nMargin Balance:', marginBalance, 'XBT');

    getBook(client, bookDepth).then(prices => {
      const {lowestAsk, highestBid, midPrice} = prices;
      log({ lowestAsk, highestBid, midPrice });

      //let oo = getOrders(client);
      let openPositions = getPosition(client);
      if(!openPositions.length){

        // submitOrders(client, scalpShort(midPrice, 100, 25))
      //  submitOrders(client, scalpLong(midPrice, 100, 15))
      }

    }).catch(e=>console.log); //end book
  }).catch(e=>console.log);; //end balance
})
.catch(e=>console.log(e))

function inspect(client) {
  console.log("Inspecting BitMEX API...");
  Object.keys(client).forEach(function(model) {
    if (!client[model].operations) return;
    console.log("Available methods for %s: %s", model, Object.keys(client[model].operations).join(', '));
  });
  console.log("------------------------\n");
}

const getBook = ( client, depth=2 ) => {
  return client.OrderBook.OrderBook_getL2({symbol: 'XBT', depth}).then( response => {
    let book = response.obj;
    let asks = book.slice(0, book.length/2);
    let bids = book.slice(book.length/-2);
    let lowestAsk = _.last(asks).price;   // kleinster Verkäufer
    let highestBid = _.first(bids).price;  // höchster Käufter
    let midPrice = (Number(lowestAsk)+Number(highestBid))/2
    //log({ lowestAsk, highestBid, midPrice, asks: asks.length, bids:bids.length });
    return { lowestAsk, highestBid, midPrice, asks: asks.length, bids: bids.length }
  })
}
const getMarginBalance = (client, next) => {
  return client.User.User_getMargin().then(function(response) {
    let margin = response.obj;
    let marginBalance = (margin.marginBalance / 1e8).toFixed(4);
    return marginBalance //console.log('\nMargin Balance:', marginBalance, 'XBT');
  }).catch(console.error);
}

const scalpShort = (price, orderQty, minPips = 15) => {
  let orders = [];
  price =  Math.round(price)
  let stopM = Math.round(price) + minPips;
  let profit = Math.round(price) - minPips;
  orders.push({ "text":"openL","symbol":"XBTUSD","side":"Sell", orderQty, ordType: "Limit", price: Math.round(price-3), });
  //STOP LOSS
  orders.push({ "text":"STOPM","symbol":"XBTUSD","side":"Buy", orderQty, ordType: "StopMarket", stopPx: stopM, execInst: 'LastPrice'}); 
  //TAKE PROFIT
  orders.push({ "text":"takeProfit","symbol":"XBTUSD","side":"Buy", orderQty, ordType: "LimitIfTouched", price: profit, stopPx: profit, execInst: 'LastPrice' });
  return orders
}

const scalpLong = (price, orderQty, minPips = 15) => {
  let orders = [];
  price =  Math.round(price)
  let stopM = Math.round(price) - minPips;
  let profit = Math.round(price) + minPips;
  orders.push({ "text":"openL","symbol":"XBTUSD","side":"Buy", orderQty, ordType: "Limit", price: Math.round(price+3), });
  //STOP LOSS
  orders.push({ "text":"STOPM","symbol":"XBTUSD","side":"Sell", orderQty, ordType: "StopMarket", stopPx: stopM, execInst: 'LastPrice'}); 
  //TAKE PROFIT
  orders.push({ "text":"takeProfit","symbol":"XBTUSD","side":"Sell", orderQty, ordType: "LimitIfTouched", price: profit, stopPx: profit, execInst: 'LastPrice' });
  return orders
}

const submitOrders = (client, orders) => {
  console.log('Submitting orders: ');
  orders.map(d => log(d) )
  return client.Order.Order_newBulk({ orders: JSON.stringify(orders) }).then(res=>{
    return res.obj
  }).catch( e => {
    console.log(e.data);
  })
}

const getOrders = (client) => {
  // i don't get it here! cannot find open orders
  return client.Order.Order_getOrders().then(response=> {
    return response.obj.map(order => {
      if(order.price === 3626 || order.stopPx === 3626) console.log(order)
        if(order.ordStatus !== 'Filled'  && order.ordStatus !== 'Canceled'){
          console.log(order);
        }
      })
  }).catch(log)
}

const getPosition = (client) => {
  return client.Position.Position_get().then(res => {
    let positions = res.obj;
    positions.map(position =>{
      let { currentQty, isOpen, avgEntryPrice, liquidationPrice } = position;  
      return {currentQty, isOpen, avgEntryPrice, liquidationPrice }
    });
  }).catch(e=>console.log)
}
