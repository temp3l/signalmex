import { stochasticrsi as STOCHRSI } from 'technicalindicators' // PDM, MDM,  => not exported ...
import talib from 'talib'
import config from '../config';
const debug = require('debug')('b0t:'); 
const llog = (obj) => debug('%o', obj);	


const stoch = (market, binSize) => {
	let conf = {
		'1m': { rsiPeriod: 12, stochasticPeriod: 12 },
		'5m': { rsiPeriod: 14, stochasticPeriod: 14 },
		'1h': { rsiPeriod: 24, stochasticPeriod: 24 },
		'1d': { rsiPeriod: 12, stochasticPeriod: 12 }
	}
	// talib.execute({name: "RSI", startIdx: 0, endIdx: market.close.length-1, inReal: market.close, optInTimePeriod: 18	}, function (err, res) {
	// 	console.log(res.result.outReal.slice(-10));
	// });
	return returnRSITrend(  STOCHRSI(Object.assign({ values: market.close},  config.stochRSI, conf[binSize]) ), binSize );
}

const returnRSITrend = (arr, binSize) => {
	// the Stoch RSI's primary function is identifying crossovers as well as overbought and oversold conditions.
	let config = {
		high: 80,
		low: 20,
		ignoreFirst: 1
	}

	return arr.map( (s,i) => {
		let last = arr[i-1]
		let ta = { mood: 'none', }
		let lastValue;
		ta.value =  Number( ((s.stochRSI+s.k+s.d)/3).toFixed(2) );
		if(binSize === '5m') ta.value =  Number( (s.d).toFixed(2) );

		
		if(last && last.k){
			lastValue = Number( ((last.stochRSI+last.k+last.d)/3).toFixed(2) );
		} 
		if(ta.value >= config.high){
			ta.mood = 'overbought';
			if(lastValue <= config.high) ta.cross = 'bear';
		}
		else if(ta.value < config.low){ 
			ta.mood = 'oversold'
			if(lastValue > config.low) ta.cross = 'bull';
		};
		
		return ta
	});
}




export default stoch