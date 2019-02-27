import _ from 'lodash';
import redisData from './lib/redis-data';
import Wallet from './lib/wallet'
import Signald from './lib/signal'
import {bulkFetchOHLC} from './lib/fetchMex'
const async = require('async');
const log = require ('ololog').configure ({ concat: { separator: '' }})

bulkFetchOHLC({symbol: 'XBTUSD', binSize: '1h', count: 750 }, (err,res) => {
	if(err) log.bright.red (e);
	log.bright.red.error ('bright red error!')


	let wallet = new Wallet(10000);
	let siggi = new Signald();
	let now = Date.now();
	let signals=0;
	let configs = [
	 	//{ symbol: 'XBTUSD', binSize: '1h', rOpts: [ '+inf', '-inf', 'WITHSCORES', 'LIMIT', 0, 100000] }, //
	{ symbol: 'XBTUSD', binSize: '1m', rOpts: [ '+inf', '-inf', 'WITHSCORES', 'LIMIT', 0, 10000] },
		//{ symbol: 'XBTUSD', binSize: '1h', rOpts: [ '+inf', '-inf', 'WITHSCORES', 'LIMIT', 0, 1000] },
		//{ symbol: 'XBTUSD', binSize: '1d', rOpts: [ '+inf', '-inf', 'WITHSCORES', 'LIMIT', 0, 1000] },
	];// 
		let trades = 0;//
		let tasks = configs.map(opt => function(next){
			redisData.getOHLCVByDate(opt).then(data => siggi.createSignal(opt, data, (err,results) => {
				siggi.ananlyzeTrend(opt.binSize, (err, res) => {
					signals += res.signals
					trades += res.trades;
					next(err, null)
				});
			}));  
		});

		async.series(tasks, function (err, results) {
			console.log({elapsed: ((Date.now()-now)/1000) + ' sec ', trades, signals});	
		// 1. generate signals for all timeFrames !  *done 
		// 2. trade lowerTimeframe based on higher Signals!
		});
	})
