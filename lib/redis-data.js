import {promisify} from 'util';
import Redis from 'redis'
import _ from 'lodash'
import moment from 'moment'
import {DD} from './utils'
const redis = Redis.createClient({ path: '/var/run/redis/redis.sock' });


const lastCandle = (opts, next) => {
	let key = [opts.symbol, opts.binSize].join(':');
	// aufsteigend von 0  abDate bis lowDate  => +inf -inf    => dann LIMITieren auf last/highest
	redis.zrevrangebyscore(key, ['+inf', '-inf', 'WITHSCORES', 'LIMIT', 0 , 1], (err, res) => {
		let last = Number(res[1]);
		return next(err, last);
	});
}


const getOHLCVByDate = (opts, next) => {
	let {start, end, symbol, binSize, rOpts} = opts;
	let key = [symbol, binSize].join(':');
	const market = { open: [], close: [], high: [], low: [], volume: [], trades:[], timestamp:[], date:[] };
	// rangebyscore XBTUSD:1d 1514761200000 1547142422000 WITHSCORES
	// szrangebyscore XBTUSD:1m 1514761200000 1547142422000 WITHSCORES
	let config = [ start, end, 'WITHSCORES'  ];
	if(rOpts) config = rOpts

		redis.zrevrangebyscore(key, config, (err, res) => {
			if(err) throw err;
			res = res.reverse()

			let candles = _.chunk(res, 2).map( r => {
				let [o,h,l,c,v,tr] = r[1].split('|').map(d => Number(d));
				market.open.push(o)
				market.high.push(h)
				market.low.push(l)
				market.close.push(c)
				market.volume.push(v)
				market.trades.push(tr)
				let nr = Number(r[0]);
				let dr = new Date(nr);
				market.timestamp.push( nr );
				market.date.push( dr );
				return { open:o, high: h, low: l, close: c, volume:v, trades: tr, timestamp: nr, date: dr }
			});

			return next(err, market);
		});
}



export default {
	getOHLCVByDate: promisify(getOHLCVByDate),
	lastCandle: promisify(lastCandle),
}