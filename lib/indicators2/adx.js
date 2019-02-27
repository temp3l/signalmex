import { ADX } from 'technicalindicators' // PDM, MDM,  => not exported ...
import config from '../config';

const adx = (market) => {
	let data = ADX.calculate( Object.assign({}, market, config.adx));
	return returnAdxTrend(data)
}

const returnAdxTrend = (arr) => { 
	return arr.map( (d,i) => {
		let last = arr[i-1];
		let cross=''; 
		let ta = { adx: Number(d.adx.toFixed(2)), trend: 'bear', cross: 'none' }
		if(last){
			if( last.pdi <= last.mdi){ // was bearish!
				if(d.pdi > d.mdi) ta.cross = 'bull'; //now
			}
			else if ( last.pdi >= last.mdi ){
				if(d.pdi < d.mdi) ta.cross = 'bear'; //now
			}
			if(d.pdi>=d.mdi) ta.trend = 'bull';
			
			return ta
			//return [ d.adx, d.pdi>d.mdi?'bullish':'bearish', cross ];
		}
	})	
}
export default adx