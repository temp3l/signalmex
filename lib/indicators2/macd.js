import {VolumeProfile as VP, EMA, KST, MACD, ADX, stochasticrsi, MFI, PatternDetector, isTrendingUp, isTrendingDown, OBV} from 'technicalindicators' // PDM, MDM,  => not exported ...
import config from '../config';
const debug = require('debug')('b0t:'); 
const llog = (obj) => debug('%o', obj);	

const macd = (market) => {
	let data = MACD.calculate(Object.assign({values: market.close},  config.macd));
	return returnMacTrend(data)
}

const returnMacTrend = (arr) => {
	// https://www.daytrading.com/macd 	 // consider bearish Price-move for reversals ! 	// A MACD crossover of the zero line may be interpreted as the trend changing direction entirely.
	let returnTrend = function(macd, signal, histogram, prev){
		let trend = '', zCross='', sCross=''; //The histogram will interpret whether the trend is becoming more positive or more negative, not whether it may be changing itself.
		let ta = {macd: 0, trend: 'none', sCross: 'none', zCross: 'none' };
		if(macd>0 && macd>signal) ta.trend = 'bull';
		else if(macd<0 && macd<signal) ta.trend = 'bear';
		if(prev){
			if(prev.histogram < 0 && histogram > 0) ta.sCross = 'bull';	 //A bullish signal occurs when the histogram goes from negative to positive.
			else if(prev.histogram > 0 && histogram < 0) ta.sCross = 'bear';
			if(prev.MACD < 0 && macd > 0) ta.zCross = 'bull'; //If the MACD series runs from positive to negative, this may be interpreted as a bearish 
			else if(prev.MACD > 0 && macd < 0) ta.zCross = 'bear';
			
			ta.macd = Number(macd.toFixed(1))
			return ta //return [ Number(macd.toFixed(1)), trend, sCross, zCross ]
		}
	}
	return arr.map( (m,i) => returnTrend( Number(m.MACD.toFixed(1)), m.signal, m.histogram, arr[i-1]));
}



export default macd