import {
	abandonedbaby, 
	eveningstar, 
	downsidetasukigap, 
	bearishengulfingpattern,
	bullishengulfingpattern,
	darkcloudcover,
	doji,
	dragonflydoji,
	gravestonedoji,
	bullishharami,
	bearishharamicross,
	bullishharamicross,
	bullishmarubozu,
	bearishmarubozu,
	eveningdojistar,
	bearishharami,
	piercingline,
	bullishspinningtop,
	bearishspinningtop,
	morningdojistar,
	morningstar,
	threeblackcrows,
	threewhitesoldiers,
	bullishhammerstick,
	bearishhammerstick,
	bullishinvertedhammerstick,
	bearishinvertedhammerstick,
	hammerpattern,
	hammerpatternunconfirmed,
	hangingman,
	hangingmanunconfirmed,
	shootingstar,
	shootingstarunconfirmed,
	tweezertop,
	tweezerbottom,
} from 'technicalindicators'

let avail = ["AvailablePatterns","getAvailableIndicators","AvailableIndicators","FixedSizeLinkedList",
"CandleData","CandleList","sma","SMA","ema","EMA","wma","WMA","wema","WEMA","macd","MACD","rsi","RSI",
"bollingerbands","BollingerBands","adx","ADX","atr","ATR","truerange","TrueRange","roc","ROC","kst",
"KST","psar","PSAR","stochastic","Stochastic","williamsr","WilliamsR","adl","ADL","obv","OBV","trix",
"TRIX","forceindex","ForceIndex","cci","CCI","awesomeoscillator","AwesomeOscillator","vwap","VWAP",
"volumeprofile","VolumeProfile","mfi","MFI","stochasticrsi","StochasticRSI","averagegain","AverageGain",
"averageloss","AverageLoss","sd","SD","highest","Highest","lowest","Lowest","sum","Sum","renko",
"HeikinAshi","heikinashi","bullish","bearish","abandonedbaby","doji","bearishengulfingpattern",
"bullishengulfingpattern","darkcloudcover","downsidetasukigap","dragonflydoji","gravestonedoji",
"bullishharami","bearishharami","bullishharamicross","bearishharamicross","eveningdojistar",
"eveningstar","morningdojistar","morningstar","bullishmarubozu","bearishmarubozu","piercingline",
"bullishspinningtop","bearishspinningtop","threeblackcrows","threewhitesoldiers","bullishhammerstick",
"bearishhammerstick","bullishinvertedhammerstick","bearishinvertedhammerstick","hammerpattern",
"hammerpatternunconfirmed","hangingman","hangingmanunconfirmed","shootingstar","shootingstarunconfirmed",
"tweezertop","tweezerbottom","fibonacciretracement","predictPattern","PatternDetector","hasDoubleBottom",
"hasDoubleTop","hasHeadAndShoulder","hasInverseHeadAndShoulder","isTrendingUp","isTrendingDown",
"ichimokucloud","IchimokuCloud","keltnerchannels","KeltnerChannels","KeltnerChannelsInput",
"KeltnerChannelsOutput","chandelierexit","ChandelierExit","ChandelierExitInput","ChandelierExitOutput","setConfig","getConfig"]

var aabandonedBaby = {
	open: [31.10,26.18,27.47],
	high: [31.80,26.91,30.94],
	close: [28.10,26.18,30.62],
	low: [27.50,25.40,27.03]
}
var eeveningStar = {
	open: [18.35,22.20,21.60],
	high: [21.60,22.70,22.05],
	close: [21.30,22.52,19.45],
	low: [18.13,21.87,19.30]
}
var ddownsidetasukigap = {
	open: [45.00, 33.45, 30.20],
	high: [46.20,34.70,36.63],
	close:[41.20,29.31,36.28],
	low: [38.56,28,29.80],
}
var mix = {
	open: [ ...eeveningStar.open, ...aabandonedBaby.open, ...ddownsidetasukigap.open ],
	high: [ ...eeveningStar.high, ...aabandonedBaby.high, ...ddownsidetasukigap.high ],
	close: [ ...eeveningStar.close, ...aabandonedBaby.close, ...ddownsidetasukigap.close ],
	low: [ ...eeveningStar.low, ...aabandonedBaby.low, ...ddownsidetasukigap.low ],
}
var twoDayBearishInput = {
	open: [21.44,27.89],
	high: [25.10,30.87],
	close: [23.25,15.36],
	low: [20.82,14.93],
}
var twoDayBullishInput = {
	open: [23.25,15.36],
	high: [25.10,30.87],
	close: [21.44,27.89],
	low: [20.82,14.93],
}
var darkcloudcoverInput = {
	open: [30.10,39.45],
	high: [37.40,41.45],
	close: [35.36,32.50],
	low: [28.30,31.25],
}
var dojiInput = {
	open: [30.10],
	high: [32.10],
	close: [30.13],
	low: [28.10],
}
var dragonflydojiInput = {
	open: [30.10],
	high: [30.10],
	close: [30.13],
	low: [28.10],
}
var gravestonedojiInput = {
	open: [30.10],
	high: [36.13],
	close: [30.13],
	low: [30.12], 
}
var bullishharamiInput = {
	open: [20.12, 22,13],
	high: [23.82,22.76],
	close: [23.50,21.70],
	low: [19.88,21.31],
}
var bearishharamicrossInput = {
	open: [25.13, 23.45],
	high: [25.80,24.59],
	close: [22.14,23.45],
	low: [21.7,23.07],
}
var bullishharamicrossInput = {
	open: [20.12, 22.13],
	high: [23.82,22.76],
	close: [23.50,22.13],
	low: [19.88,21.31],
}
var bullishmarubozuInput = {
	close: [31.23],
	open: [30.50],
	high: [31.23],
	low: [30.50],
}
var bearishmarubozuInput = {
	close: [30.50],
	open: [31.23],
	high: [31.23],
	low: [30.50],
}
var eveningdojistarInput = {
	open: [18.35,22.20,21.60],
	high: [21.60,22.40,22.05],
	close: [21.30,22.22,19.45],
	low: [18.13,21.87,19.30]
}
var bearishharamiInput = {
	open: [25.13, 23.45],
	high: [25.80,24.59],
	close: [22.14,23.45],
	low: [21.7,23.07], 
}
var piercinglineInput = {
	open: [42.70, 41.33],
	high: [42.82,42.50],
	close: [41.60,42.34],
	low: [41.45,41.15],
}
var bullishspinningtopInput = {
	open: [20.50],
	high: [20.87],
	close: [20.62],
	low: [20.23],
}
var bearishspinningtopInput = {
	open: [20.62],
	high: [20.75],
	close: [20.50],
	low: [20.34],
}
var morningdojistarInput = {
	open: [22.20,20.30,20.70],
	high: [22.50,20.45,21.82],
	close: [20.80,20.30,21.58],
	low: [20.65,20.10,20.40]
}
var morningstarInput = {
	open: [22.20,20.30,20.70],
	high: [22.50,20.45,21.82],
	close: [20.80,19.80,21.58],
	low: [20.65,19.60,20.40]
}
var threeblackcrowsInput = {
	open: [21.65,21.48,21.25],
	high: [21.82,21.57,21.35],
	close: [21.32,21.10,20.70],
	low: [21.25,20.97,20.60]
}
var threewhitesoldiersInput = {
	open: [21.12,21.48,21.80],
	close: [21.65,22.20,22.65],
	high: [21.83,22.40,22.80],
	low: [20.85,21.36,21.66]
}
var bullishhammerInput = {
	open: [30.10],
	high: [32.10],
	close: [32.10],
	low: [26.10],
}
var bearishhammerInput = {
	open: [32.10],
	high: [32.10],
	close: [30.10],
	low: [26.10],
}
var bullishinvertedhammerInput = {
	open: [26.10],
	high: [32.10],
	close: [28.10],
	low: [26.10],
}
var bearishinvertedhammerInput = {
	open: [28.10],
	high: [32.10],
	close: [26.10],
	low: [26.10],
}
var hammerData = [
{
	name: 'Bearish',
	data: {
		open: [40.90, 36.00, 33.10, 30.10, 26.13],
		high: [41.80, 37.60, 35.90, 30.10, 33.60],
		close: [36.00, 33.10, 29.50, 26.13, 31.00],
		low: [28.00, 27.70, 26.90, 10.06, 25.90],
	},
},
{
	name: 'Bearish Inverted',
	data: {
		open: [40.90, 36.00, 33.10, 29.10, 26.13],
		high: [41.80, 37.60, 35.90, 36.10, 33.60],
		close: [36.00, 33.10, 29.50, 26.13, 31.00],
		low: [28.00, 27.70, 26.90, 26.13, 25.90],
	},
},
{
	name: 'Bullish',
	data: {
		open: [40.90, 36.00, 33.10, 26.13, 26.13],
		high: [41.80, 37.60, 35.90, 30.10, 33.60],
		close: [36.00, 33.10, 29.50, 30.10, 31.00],
		low: [28.00, 27.70, 26.90, 10.06, 25.90],
	},
},
{
	name: 'Bullish Inverted',
	data: {
		open: [40.90, 36.00, 33.10, 26.13, 26.13],
		high: [41.80, 37.60, 35.90, 36.10, 33.60],
		close: [36.00, 33.10, 29.50, 29.10, 31.00],
		low: [28.00, 27.70, 26.90, 26.13, 25.90],
	},
},
];
var hammerDataUnconfirmed = [
{
	name: 'Bearish',
	data: {
		open: [44.00, 40.90, 36.00, 33.10, 30.10],
		high: [45.00, 41.80, 37.60, 35.90, 30.10],
		close: [42.00, 36.00, 33.10, 29.50, 26.13],
		low: [38.00, 28.00, 27.70, 26.90, 10.06],
	},
},
{
	name: 'Bearish Inverted',
	data: {
		open: [44.00, 40.90, 36.00, 33.10, 29.10],
		high: [45.00, 41.80, 37.60, 35.90, 36.10],
		close: [42.00, 36.00, 33.10, 29.50, 26.13],
		low: [38.00, 28.00, 27.70, 26.90, 26.13],
	},
},
{
	name: 'Bullish',
	data: {
		open: [44.00, 40.90, 36.00, 33.10, 26.13],
		high: [45.00, 41.80, 37.60, 35.90, 30.10],
		close: [42.00, 36.00, 33.10, 29.50, 30.10],
		low: [38.00, 28.00, 27.70, 26.90, 10.06],
	},
},
{
	name: 'Bullish Inverted',
	data: {
		open: [44.00, 40.90, 36.00, 33.10, 26.13],
		high: [45.00, 41.80, 37.60, 35.90, 36.10],
		close: [42.00, 36.00, 33.10, 29.50, 29.10],
		low: [38.00, 28.00, 27.70, 26.90, 26.13],
	},
},
];
var hangingManData = [
{
	name: 'Bearish',
	data: {
		open: [29.50, 33.10, 36.00, 42.80, 40.90],
		high: [35.90, 37.60, 41.80, 42.80, 43.10],
		close: [33.10, 36.00, 40.90, 40.90, 38.05],
		low: [26.90, 27.70, 28.00, 33.10, 37.50],
	},
},
{
	name: 'Bullish',
	data: {
		open: [29.50, 33.10, 36.00, 40.90, 40.90],
		high: [35.90, 37.60, 41.80, 42.80, 43.10],
		close: [33.10, 36.00, 40.90, 42.80, 38.05],
		low: [26.90, 27.70, 28.00, 33.10, 37.50],
	},
},
];
var hangingManDataUnconfirmed = [
{
	name: 'Bearish',
	data: {
		open: [28.90, 29.50, 33.10, 36.00, 42.80],
		high: [36.10, 35.90, 37.60, 41.80, 42.80],
		close: [29.50, 33.10, 36.00, 40.90, 40.90],
		low: [27.00, 26.90, 27.70, 28.00, 33.10],
	},
},
{
	name: 'Bullish',
	data: {
		open: [28.90, 29.50, 33.10, 36.00, 40.90],
		high: [36.10, 35.90, 37.60, 41.80, 42.80],
		close: [29.50, 33.10, 36.00, 40.90, 42.80],
		low: [27.00, 26.90, 27.70, 28.00, 33.10],
	},
},
];
var shootingStarData = [
{
	name: 'Bearish',
	data: {
		open: [29.50, 33.10, 36.00, 42.80, 40.90],
		high: [35.90, 37.60, 41.80, 42.80, 43.10],
		close: [33.10, 36.00, 40.90, 40.90, 38.05],
		low: [26.90, 27.70, 28.00, 33.10, 37.50],
	},
},
{
	name: 'Bullish',
	data: {
		open: [29.50, 33.10, 36.00, 40.90, 40.90],
		high: [35.90, 37.60, 41.80, 42.80, 43.10],
		close: [33.10, 36.00, 40.90, 42.80, 38.05],
		low: [26.90, 27.70, 28.00, 33.10, 37.50],
	},
},
];
var shootingStarDataUnconfirmed = [
{
	name: 'Bearish',
	data: {
		open: [28.90, 29.50, 33.10, 36.00, 42.80],
		high: [36.10, 35.90, 37.60, 41.80, 48.80],
		close: [29.50, 33.10, 36.00, 40.90, 40.90],
		low: [27.00, 26.90, 27.70, 28.00, 40.90],
	},
},
{
	name: 'Bullish',
	data: {
		open: [28.90, 29.50, 33.10, 36.00, 40.90],
		high: [36.10, 35.90, 37.60, 41.80, 48.80],
		close: [29.50, 33.10, 36.00, 40.90, 42.80],
		low: [27.00, 26.90, 27.70, 28.00, 40.90],
	},
},
];
var tweezertopInput = {
	open: [29.50, 33.10, 36.00, 40.90, 42.80],
	high: [35.90, 37.60, 41.80, 43.10, 43.10],
	close: [33.10, 36.00, 40.90, 42.80, 38.05],
	low: [26.90, 27.70, 28.00, 39.10, 37.50],
};
var tweezerbottomInput = {
	open: [40.90, 36.00, 33.10, 30.10, 26.13],
	high: [41.80, 37.60, 35.90, 31.60, 33.60],
	close: [36.00, 33.10, 29.50, 26.13, 31.00],
	low: [28.00, 27.70, 26.90, 25.90, 25.90],
};
const Multiple = (data, opts, next) => {
	//data = slicer(mix, 0, -3); //eveing:true, baby: false
	//data = slicer(mix, -3, 6); //eveing:false, baby: true
	//data = slicer(mix, -3, mix.close.length); //eveing:false, baby: true, isDown: true
	//data = twoDayBullishInput
	//data = twoDayBearishInput
	//data = dojiInput
	//data = darkcloudcoverInput
	//data = dragonflydojiInput
	//data = gravestonedojiInput
	//data = bullishharamiInput
	//data = bearishharamicrossInput
	//data = bullishharamicrossInput
	//data = bullishmarubozuInput
	//data = bearishmarubozuInput
	//data = eveningdojistarInput
	//data = bearishharamiInput
	//data = piercinglineInput
	//data = bullishspinningtopInput
	//data = bearishspinningtopInput
	//data = morningdojistarInput
	//data = morningstarInput
	//data = threeblackcrowsInput
	//data = threewhitesoldiersInput
	//data = bullishhammerInput
	//data = bullishinvertedhammerInput
	//data = hammerData
	//data = tweezertopInput
	//data = tweezerbottomInput
	let res = {
		eveningstar: eveningstar(data),
		abandonedBaby: abandonedbaby(data),
		downsidetasukigap: downsidetasukigap(data),
		bearishengulfingpattern: bearishengulfingpattern(data),
		bullishengulfingpattern: bullishengulfingpattern(data),
		darkcloudcover: darkcloudcover(data),
		doji: doji(data),
		dragonflydoji: dragonflydoji(data),
		gravestonedoji: gravestonedoji(data),
		bullishharami: bullishharami(data),		// FAILS with sample data
		bearishharamicross: bearishharamicross(data), // FAILS with sample data
		bullishharamicross: bullishharamicross(data), // FAILS with sample data
		bullishmarubozu: bullishmarubozu(data),
		bearishmarubozu: bearishmarubozu(data),
		eveningdojistar: eveningdojistar(data),
		piercingline: piercingline(data),
		bullishspinningtop: bullishspinningtop(data),	//ALLWAYS TRUE
		bearishspinningtop: bearishspinningtop(data), //ALWAYS TRUE
		morningdojistar: morningdojistar(data),
		morningstar: morningstar(data),
		threeblackcrows: threeblackcrows(data),
		threewhitesoldiers: threewhitesoldiers(data),
		bullishhammerstick: bullishhammerstick(data),			// NotAFunction
		bearishhammerstick: bearishhammerstick(data),				// NotAFunction
		bullishinvertedhammerstick: bullishinvertedhammerstick(data),
		bearishinvertedhammerstick: bearishinvertedhammerstick(data),
		hammerpattern: hammerpattern(data),		//transformdata !
		tweezertop: tweezertop(data),
		tweezerbottom:tweezerbottom(data),
		hammerpatternunconfirmed: hammerpatternunconfirmed(data),
		hangingman: hangingman(data),
		hangingmanunconfirmed: 	hangingmanunconfirmed(data),
		shootingstar: shootingstar(data),
		shootingstarunconfirmed: shootingstarunconfirmed(data),
	}
/*
	hammerData.forEach((patternSet) => {
		const result = hammerpattern(patternSet.data) ? 'yes' : 'no';
		console.log(`Is Hammer Pattern: ${patternSet.name}? : ${result}`);
	});
	hammerDataUnconfirmed.forEach((patternSet) => {
		const result = hammerpatternunconfirmed(patternSet.data) ? 'yes' : 'no';
		console.log(`Is Hammer Pattern (Unconfirmed): ${patternSet.name}? : ${result}`);
	});

	hangingManData.forEach((patternSet) => {
		const result = hangingman(patternSet.data) ? 'yes' : 'no';
		console.log(`Is Hanging Man pattern: ${patternSet.name}? : ${result}`);
	});
	hangingManDataUnconfirmed.forEach((patternSet) => {
		const result = hangingmanunconfirmed(patternSet.data) ? 'yes' : 'no';
		console.log(`Is Hanging Man pattern: ${patternSet.name}? : ${result}`);
	});

	shootingStarData.forEach((patternSet) => {
		const result = shootingstar(patternSet.data) ? 'yes' : 'no';
		console.log(`Is Shooting Star pattern: ${patternSet.name}? : ${result}`);
	});
	shootingStarDataUnconfirmed.forEach((patternSet) => {
		const result = shootingstarunconfirmed(patternSet.data) ? 'yes' : 'no';
		console.log(`Is Shooting Star pattern: ${patternSet.name}? : ${result}`);
	});
*/
	return next(null, res)
}

const slicer = (market, start, end) => {
	return {
		open: market.open.slice(start, end),
		high: market.high.slice(start, end),
		close: market.close.slice(start, end),
		low: market.low.slice(start, end),
	}
}

export default Multiple


