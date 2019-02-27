import moment from 'moment'
const toOhlc = (candles) => {
	const market = { open: [], close: [], high: [], low: [], volume: [], trades:[], timestamp:[], date:[] };
	candles.reverse().forEach(candle => {
		market.open.push(candle.open);
		market.high.push(candle.high);
		market.low.push(candle.low);
		market.close.push(candle.close);
		market.volume.push(candle.volume);
		market.trades.push(candle.trades);
		market.timestamp.push( new Date(candle.timestamp).getTime() );
		market.date.push(candle.timestamp);
	});
	return market
}


const getCandles = (client, opts) => {
	let options = Object.assign({}, {symbol: 'XBTUSD', partial: true, reverse: true, count: 750, columns: [ 'open','high','low','close', 'volume', 'trades' ]}, opts)
	return client.Trade.Trade_getBucketed(options).then( response => {
		return toOhlc(response.obj);
	}).catch(e => {
		console.log(e.statusText)
	});
}
function inspect(client) {
	console.log("Inspecting BitMEX API...");
	Object.keys(client).forEach(function(model) {
		if (!client[model].operations) return;
		console.log("Available methods for %s: %s", model, Object.keys(client[model].operations).join(', '));
	});
	console.log("------------------------\n");
}

module.exports = {
	getCandles,
	toOhlc,
	inspect,
	DD: (date) => moment(date).format("YYYY.MM.DD HH:mm"),
}