const  _ = require('lodash');
const SwaggerClient = require("swagger-client");
const BitMEXAPIKeyAuthorization = require('./lib/BitMEXAPIKeyAuthorization');
const debug = require('debug')('b0t:'); 
const llog = (obj) => debug('%o', obj);	
require ('ansicolor').nice 

import macd from './lib/indicators2/macd'
import adx from './lib/indicators2/adx'
import stoch from './lib/indicators2/stochRSI'

import {DD, getCandles, toOhlc, inspect} from './lib/indicators2/lib'

let opts;
let tas = {}
new SwaggerClient({ url: 'https://testnet.bitmex.com/api/explorer/swagger.json', usePromise: true }).then( client => {
	client.clientAuthorizations.add("apiKey", new BitMEXAPIKeyAuthorization('key', 'pass'));


	Promise.all([
		getCandles(client,  {binSize:'1m'}).then( short => runTA(short, {binSize:'1m'}).combi.slice(-300) ),
		getCandles(client,  {binSize:'5m'}).then( short => runTA(short, {binSize:'5m'}).combi.slice(-60) ),
		getCandles(client,  {binSize:'1h'}).then( short => runTA(short, {binSize:'1h'}).combi.slice(-5) ),
	]).then(signals => { //
	//recurseTA(signals)
		console.log();
		let [ones,fives,hours] = signals;

		let lastHour =  _.last(hours), last5min = _.last(fives), last1min = _.last(ones);

		let hourTrend = checkTrend( lastHour, '1h' );
		let fiveTrend = checkTrend( last5min, '5m' );
		let minTrend  = checkTrend( last1min, '1m' );
		
		console.log('######## hour');
		llog(lastHour);

		console.log('######## 5min');
		llog(last5min);

		console.log('######## 1min');
		llog(last1min);
		
		
	});
});




const recurseTA = (signals) => {
	let [one,five,hour] = signals;

	let mins_5=0, mins_1=0, hourly, fives, hourlies,ones, trend;
	hour.forEach( (h,i) => {
		hourlies = checkTrend(h, '1h');

		five.splice(0,12).forEach( (f,n) => {
			fives = checkTrend(f, '5m');

			one.splice(0,5).forEach( (o,m)=>{
				ones = checkTrend(o, '1m');

				if(ones === fives && fives === hourlies && hourlies !== false){
					trend = ones;
					if(trend === 'bear')
						llog(o)
				}
			});
		});
	});
}


const checkTrend = (signal, binSize) => {
	const [_adx, _macd, _rsi ] = signal;
	let tab='';
	if(binSize==='5m'){tab='\t';}
	if(binSize==='1m'){tab='\t\t';}

	if(_adx.trend === _macd.trend && _adx.adx > 25 ){
		if(_adx.trend==='bear') console.log( tab + (binSize + ' Trend says: ' + _adx.trend).red + '  ' + _adx.adx);
		if(_adx.trend==='bull') console.log( tab + (binSize + ' Trend says: ' + _adx.trend).green  + '  ' + _adx.adx);
		return _adx.trend
	}
	else {
		console.log( tab + ( binSize + ' ' +  _adx.trend + ' ' +  _macd.trend + ' ' +  _adx.adx ).red  + '  ' + _adx.adx);
	}
	return false
}






const runTA = (ohlc, opts) => {
	let combi=[];
	let ta_macd = macd(ohlc).slice(-700); //ta_macd.slice(-10).map(llog);
	let ta_adx = adx(ohlc).slice(-700); //ta_adx.slice(-10).map(llog);
	let ta_rsi = stoch(ohlc, opts.binSize).slice(-701);// ta_rsi.slice(-10).map(llog);
	let ta_close = ohlc.close.slice(-700)
	let ta_date = ohlc.date.slice(-700)


	for (let i=0; i< 700; i++){
		let candle = [ta_date[i], ta_close[i],  ];
		combi.push([ ta_adx[i], ta_macd[i], ta_rsi[i-1], 	candle])
	}
	return {
		//macd: ta_macd,adx: ta_adx,rsi: ta_rsi,
		combi: combi
	}
}


