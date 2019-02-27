import _ from 'lodash';
import {DD,slicer} from './utils';
import config from './config';
import {returnMfiTrend,returnMacTrend, returnAdxTrend,returnRSITrend,returnVPrend} from './analyzers'
import {VolumeProfile as VP, EMA, KST, MACD, ADX, stochasticrsi, MFI, PatternDetector, isTrendingUp, isTrendingDown, OBV} from 'technicalindicators' // PDM, MDM,  => not exported ...
require('technicalindicators').setConfig('precision', 4);
require ('ansicolor').nice 
const debug = require('debug')('b0t:'); 
const llog = (obj) => debug('%o', obj);	
const log = require ('ololog').configure ({ concat: { separator: '' }})

const asTable = require ('as-table').configure({ 
	left: true,
	print: obj => (typeof obj === 'date') ? (obj ? 'yes' : 'no') : String (obj),
	title: x => x.bright, delimiter: ' | '.dim.cyan, dash: '-'.bright.cyan ,
})
//http://www.tradinggeeks.net/2014/05/technical-analysis-in-excel-part-ii/

let tma = require('./indicators/tma')

class Signal {
	constructor(initBalance) {
		this.ohlcv = { '1m': {},'5m': {},'1h': {},'1d': {},	};
		this.signals = { '1m': {},'5m': {},'1h': {},'1d': {},	};
		this.trades = 0;
	}
	getSignals(binSize, name){
		
		return this.signals[binSize][name] 
	}
	get(name,binSize='1d'){

		return this.signals[binSize][name]
	}
	async createSignal(opts, ohlcv, next){
		const {symbol, binSize} = opts;
		if( ohlcv.close.length<10) throw Error('Need more candles!');
		let start = _.first( ohlcv.timestamp ), end = _.last( ohlcv.timestamp ), now = Date.now(), top400 = ohlcv.close.slice(-400)
		console.log(JSON.stringify({start: DD(start), end: DD(end), symbol, binSize, candles: ohlcv.close.length }).magenta);


		this.signals[binSize]['ADX'] = ADX.calculate(Object.assign({period: 14}, ohlcv,  config.adx));
		this.signals[binSize]['MACD']= MACD.calculate(Object.assign({values: ohlcv.close},  config.macd));
		this.signals[binSize]['MFI'] = MFI.calculate(Object.assign({period: 14}, ohlcv,  config.mfi));
		//makeModule
		this.signals[binSize]['RSI'] = stochasticrsi(Object.assign({values: ohlcv.close},  config.stochRSI));
		//this.signals[binSize]['OBV'] = OBV.calculate(ohlcv);
		//this.signals[binSize]['KST'] = new KST(Object.assign({}, {values: ohlcv.close}, config.kst)).getResult();
		this.signals[binSize]['VP']  = new VP.calculate(Object.assign({noOfBars: 20}, ohlcv)); // => SUPPORT & RESISTANCCE!!!! needs TimeFrame 	//https://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:volume_by_price

		this.ohlcv[binSize] = ohlcv;

		let bin = this.signals[binSize];
		let sigs = Object.keys(bin).map( name => bin[name].length).reduce( (a,b) => a + b, 0);
		//this.signals[binSize]['PATTERN400'] = {	prediction: await PatternDetector.predictPattern({values:top400}),trendingUp: await isTrendingUp({values: top400}),	trendingDown: await isTrendingDown({values: top400}),		} 
		if(next) return next(null, sigs);
	}

	checkTrade(data,i){
		let { close, date, adx, macd, rsi, mfi } = data;
		let [ strength, sentiment,  cross ] = adx;
		let [ trend, direction, signalCross, zeroCross  ] = macd;
		let [ RSIosc, condition, rsiCross  ] = rsi;
		if(strength >= 25){
			if(sentiment === 'bullish' && cross === 'bullCross'){		//ADX: Long!
				if(condition === 'oversold' && direction === 'bullish' ) {	// RSI && MACD: Long!

					console.log(' might long here ! '.green, date,close);
					if(signalCross === 'signalBull' || zeroCross === 'zeroBull'){	// MACD: superLong!
						console.log('\t suppppper  looooooong  !!!!!!!!!!!!!!!!!!!!' .green + date + '  ' ,close)
						//log({ RSIosc, condition, mood, rsiCross, mfi});
						this.trades++
					}
				}
			}
			else if(sentiment === 'bearish' && cross === 'bearCross'){ //ADX: Short!
					if(condition === 'overbought' && direction === 'bearish' ) {	// MACD: Short!
						console.log('might short here! '.red, date, close)
					if(signalCross === 'signalBear' || zeroCross === 'zeroBear'){	// MACD: superLong!
						console.log('\t suppppper  shoooooooort  !!!!!!!!!!!!!!!!!!!!'.red + date + '   ' , close)
						//log({RSIosc, condition, mood, rsiCross, mfi});
						//console.log('\n');
						this.trades++	
					}
				}
			}
		}
	}
	
	async ananlyzeTrend(binSize,next){
		let mfi =  this.get('MFI', binSize);
		let macd = returnMacTrend( this.get('MACD', binSize) );
		let adx = returnAdxTrend( this.get('ADX', binSize) );
		let rsi = returnRSITrend( this.get('RSI', binSize) );
		let VP = returnVPrend( this.get('VP', binSize));
		let ohlcv = slicer(this.ohlcv[binSize], adx.length*-1);
		rsi = [null,null,null,null,...rsi];

		//console.log(ohlcv.date);
		
		let signals = adx.map( (a,i) => {
			return Object.assign({
				date: DD(ohlcv.date[i]),
				close: ohlcv.close[i],
			},{ adx: adx[i], macd: macd[i], rsi: rsi[i], mfi:mfi[i] })
		});
		signals.forEach( (data,i ) => {
			if(i<5) return false;
				this.checkTrade(data,i)
		})		

		console.table(signals.slice(-80));
		//llog(asTable(signals.slice(-20)));
		//olog.bright.magenta('this is something:'.yellow, [ "595da547d9b22f23d8228643", "595da547d9b22f23d822863f", "595da547d9b22f23d8228641" ])

	///	log(asTable(signals.slice(-20)))
		return next(null, { trades: this.trades, signals: adx.length})
	}
}

export default Signal
