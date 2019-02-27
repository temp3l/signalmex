import moment from 'moment'
import chalk from 'chalk'
import asciichart from 'asciichart'
import _ from 'lodash';
require ('ansicolor').nice // .nice for unsafe String extensions
const asTable = require ('as-table').configure ({ title: x => x.bright, delimiter: ' | '.dim.cyan, dash: '-'.bright.cyan })
const olog        = require ('ololog').configure ({ locate: false })


const log = ( str, color='white', isBold = false, isUnderline = false ) => {
 	// eat curry!
	if(isBold && isUnderline) return console.log( chalk[color].bold.underline(str) );
	if(isBold) return console.log( chalk[color].bold(str) );
	console.log( chalk[color](str) );
}

function isIncreasing(array) {
	var length = array.length;
	return array.every(function(value, index) {
		var nextIndex = index + 1;
		return nextIndex < length ? value <= array[nextIndex] : true;
	});
}
function isDecreasing(array) {
	var length = array.length;
	return array.every(function(value, index) {
		var nextIndex = index + 1;
		return nextIndex < length ? value >= array[nextIndex] : true;
	});
}
const market2ohlcv = (market) => {
	return market.close.map( (c,i) => {
		return [ new Date(market.timestamp[i]).getTime(), market.open[i], market.high[i], market.low[i], market.close[i], market.volume[i] ].map(f=>Number(f))
	});
}
const chart = (opts, market) => {
	let ohlcv = market2ohlcv(market).slice(-150);
	const lastPrice = _.last(ohlcv)[4];
  const series = ohlcv.map (x => x[4]); //close
  const bitcoinRate = ('₿ = $' + lastPrice)
  const chart = asciichart.plot (series, { height: 25, padding: '            ' })
  olog.magenta ("\n" + chart, bitcoinRate, "\n")
}

const showTable = () => {
	console.log (
		asTable ([ { foo: true,  string: 'abcde', num: 42 },
		{ foo: false, string: 'qwertyuiop'.bgMagenta.green.bright, num: 43 } ]) )
}
const sliceN = (market, start, end) => {
	end = end || market.close.length-1;
	return {
		open: market.open.slice(start, end),
		high: market.high.slice(start, end),
		close: market.close.slice(start, end),
		low: market.low.slice(start, end),
		volume: market.volume.slice(start, end),
		timestamp: market.timestamp.slice(start, end),
		date: market.date.slice(start, end),
	}
}
const slicer = (market, n) => {
	return {
		open: market.open.slice(n),
		high: market.high.slice(n),
		close: market.close.slice(n),
		low: market.low.slice(n),
		volume: market.volume.slice(n),
		timestamp: market.timestamp.slice(n),
		date: market.date.slice(n),
	}
}

module.exports = {
	green: (str, isBold, isUnderline) => log( str, 'green', isBold, isUnderline),
	red: (str, isBold, isUnderline) => log( str, 'red', isBold, isUnderline),
	blue: (str, isBold, isUnderline) => log( str, 'blue', isBold, isUnderline),
	yellow: (str, isBold, isUnderline) => log( str, 'yellow', isBold, isUnderline),
	magenta: (str, isBold, isUnderline) => log( str, 'magenta', isBold, isUnderline),
	grey: (str, isBold, isUnderline) => log( str, 'grey', isBold, isUnderline),
	log,
	DD: (date) => moment(date).format("YYYY.MM.DD HH:mm"),
	isIncreasing,
	isDecreasing,
	market2ohlcv,
	chart,
	slicer,
	sliceN,
}