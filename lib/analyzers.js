import moment from 'moment'
import chalk from 'chalk'
import asciichart from 'asciichart'
import _ from 'lodash';
const tech = require('technicalindicators');
let Highest    = tech.Highest;
const log = require ('ololog').configure ({ concat: { separator: '' }})
require ('ansicolor').nice // .nice for unsafe String extensions
const asTable = require ('as-table').configure({ 
	title: x => x.bright, delimiter: ' | '.dim.cyan, dash: '-'.bright.cyan 
})

const returnMfiTrend = (arr , target ) => {
	return arr
}

const returnMacTrend = (arr , target ) => {
	// https://www.daytrading.com/macd 	 // consider bearish Price-move for reversals !
	// A MACD crossover of the zero line may be interpreted as the trend changing direction entirely.
	let returnTrend = function(macd, signal, histogram, prev){
		let trend = '      ', zeroCross='       ', signalCross='          '; //The histogram will interpret whether the trend is becoming more positive or more negative, not whether it may be changing itself.
		if(macd>0 && macd>signal) trend = 'bullish';
		else if(macd<0 && macd<signal) trend = 'bearish';
		if(prev){
			if(prev.histogram < 0 && histogram > 0) signalCross = 'signalBull';	 //A bullish signal occurs when the histogram goes from negative to positive.
			else if(prev.histogram > 0 && histogram < 0) signalCross = 'signalBear';
			if(prev.MACD < 0 && macd > 0) zeroCross = 'zeroBull'; //If the MACD series runs from positive to negative, this may be interpreted as a bearish 
			else if(prev.MACD > 0 && macd < 0) zeroCross = 'zeroBear';
			
			return [ Number(macd.toFixed(1)), trend, signalCross, zeroCross ]
			//return [ Number(macd.toFixed(1)), trend, signalCross, zeroCross, histogram ]
			//return {macd: Number(macd.toFixed(1)),trend,	signalCross,	zeroCross,	histogram	}
		}
	}
	return arr.map( (m,i) => returnTrend( Number(m.MACD.toFixed(1)), m.signal, m.histogram, arr[i-1]));
}

const returnAdxTrend = (arr) => { 
	return arr.map( (d,i) => {
		let last = arr[i-1];
		let cross='         '; 
		if(last)
				if( last.pdi <= last.mdi){ // was bearish!
					if(d.pdi > d.mdi) cross = 'bullCross'; //now
				}
				else if ( last.pdi >= last.mdi ){
					if(d.pdi < d.mdi) cross = 'bearCross'; //now
				}

				return [ d.adx, d.pdi>d.mdi?'bullish':'bearish', cross ];
			})	
}

const returnRSITrend = (arr,target) => {
	// the Stoch RSI's primary function is identifying crossovers as well as overbought and oversold conditions.
	let config = {
		high:80,
		low: 20,
		ignoreFirst: 1
	}
	return arr.map( (s,i) => {
		let crossover='';
		let condition = '';
		let last = arr[i-1]
		
		if(s.stochRSI > config.high) condition = 'overbought';
		else if(s.stochRSI < config.low) condition = 'oversold';

		return [ s.stochRSI, condition,  crossover  ]
	})
}

const returnVPrend = (arr,target) =>{

//	let table = asTable.configure ({ print: obj => (typeof obj === 'number') ? (obj ? obj.toFixed(0) : 'no') : String (obj) }) (arr)
}

module.exports = {
	returnMacTrend,
	returnAdxTrend,
	returnRSITrend,
	returnVPrend,
	returnMfiTrend,
}


	// %K is the percentage of the price at closing (K) within the price range of the number of bars used in the look-back period.
	// %D is a smoothed average of %K, to minimize whipsaws while remaining in the larger trend.
	// 		http://www.ta-guru.com/Book/TechnicalAnalysis/TechnicalIndicators/Stochastic.php5
	// 		Buying and selling signals can also be generated when lines %K and %D are intersected: 
	// 		when %K crosses above %D, buying signal is generated and when the %K crosses below %D, selling signal is generated.
	// 		If price of security falls to new low, but K%D fails to reach new low, downward trend is losing its power and we could expect 
	// 		trend reversal in the near future. 
	// 		Similar goes for upward trend: if K%D fails to reach new high when price hits new high, upward trend is losing its power.

	//https://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:volume_by_price

// arr.forEach( bar => {
// 	let {rangeStart, rangeEnd, priceBarStart, priceBarEnd} = bar;
// 	console.log([rangeStart, rangeEnd]);

// })

// ADX
	// 	Directional movement is defined by +DI and -DI. In general, the bulls have the edge when +DI is greater than -DI, 
	// 	A buy signal occurs when +DI crosses above -DI. 
	// 	Wilder based the initial stop on the low of the signal day. 
	// 	The signal remains in force as long as this low holds, even if +DI crosses back below -DI.
	// 	Wait for this low to be penetrated before abandoning the signal. 
	// 	This bullish signal is reinforced if/when ADX turns up and the trend strengthens. 
	// 	Once the trend develops and becomes profitable, traders will have to incorporate a stop-loss and trailing stop should the trend continue. 
	//A buy signal occurs when +DI crosses above -DI. Wilder based the initial stop on the low of the signal day. 
	// 50-62% retracement zone.
	//For example, chartists can focus on +DI buy signals when the bigger trend is up and -DI sell signals when the bigger trend is down.



	// 1. Point of Control (PoC): It refers to the area in the chart with the most traded volume activity. This is by far the most relevant area you want to monitor as it can help to define the placement of your stops or the areas in the chart where you might find the most pristine entry levels. The highest concentrated area of volume for a particular period of time we will call it PoC or Point of Control and you will be surprised how many times it acts as a wall on a retest. Traders tend to factor this in as an area of support or resistance.
	// 2. High Volume Nodes (HVN): Sub-sequences in the chart with high volume activity. While not as powerful nor symbolic as the PoC, the HVN is also a powerful area as it also represents increased trading activity.
	// 3. Value Area (VA): The range of price levels in which a specified percentage of all volume was traded. By default, the industry standards tends to be 70%. 
	//  Once I explain the principle of the distribution curve below, it will become much clearer why the default number is the 70%, bear with me.
	// Volume Profile -highSpeedTrading
	// //priceFallsBetweenBarRange// 
	// priceFallsBetweenBarRange(rangeStart, rangeEnd, priceBarStart, priceBarEnd)
	// 	https://www.godmode-trader.de/analyse/trend-trading-mit-dem-volume-profile,5537753
	// 	The first thing that most traders will use volume profile for is identifying basic support and resistance levels. It is important to note that using Volume Profile as an identifier for support and resistance levels is a reactive method. 
	// 	High Volume Nodes (HVN) are peaks in volume at or around a price level. 
	// 	Low Volume Nodes (LVN) are the opposite. They are valleys (or significant drops) in volume at or around a price level.
	// 	Im Webinar meines Premiumservice „Highspeed Daytrader“ habe ich nach dem Ausbruch gesehen, dass immer am Tief der 1-Minuten-Candles kein weitere Verkaufsvolumen auftrat. Es bildete sich eine Unterstützung und damit das Volumentief. Ich stellte 2/3 der Position innerhalb der Bewegung glatt und versuchte nach erfolgreichen Ausbruch weiter im Sinne des Profils das letzte Drittel der Position zu halten. Dies gelang mir und ich konnte sehr gut in die Bewegung weiter meine Gewinne realisieren.