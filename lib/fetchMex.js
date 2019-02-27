import axios from 'axios'
import querystring from 'querystring'
import _ from 'lodash'
import eachSeries from 'async/eachSeries';
import Redis from 'redis'
import moment from 'moment'
import {DD} from './utils'
const redis = Redis.createClient({ path: '/var/run/redis/redis.sock' });
//https://www.bitmex.com/api/v1/trade/bucketed?binSize=1d&partial=false&symbol=XBT&columns=%5B%22open%22%2C%20%22high%22%2C%20%22low%22%2C%20%22close%22%2C%20%22trades%22%2C%22volume%22%5D&count=750&reverse=true

const lastCandle = (opts, next) => {
    let key = [opts.symbol, opts.binSize].join(':');
    // aufsteigend von 0  abDate bis lowDate  => +inf -inf    => dann LIMITieren auf last/highest
    redis.zrevrangebyscore(key, ['+inf', '-inf', 'WITHSCORES', 'LIMIT', 0 , opts.limit || 1], (err, res) => {
        let last = Number( _.last(res) );
        return next(err, last);
    });
}
const fetchMex = (opts,next) => {
	let options = Object.assign({}, {
		columns: [ 'open','high','low','close', 'volume', 'trades' ],
		reverse: true,
		count: 750,
		partial: true,
	}, opts);
	let URL = 'https://www.bitmex.com/api/v1/trade/bucketed?' + querystring.stringify(options);
	return axios.get(URL).then(response => {
        console.log('Fetched: '+ response.data.length +  ' \tfirst', DD(_.last(response.data).timestamp), 'last', DD(_.first(response.data).timestamp));
        saveOHLC(opts, response.data.reverse());
        return response.data.reverse();
    });
}

const saveOHLC = (opts, candles) => {
    if(!candles.length) return console.err('No candles fetched!')

        let id = [ opts.symbol, opts.binSize].join(':');
    candles.forEach(c => {
        let date = new Date(c.timestamp).getTime();
        //console.log([c.open, c.high, c.low, c.close, c.volume, c.trades]);
        redis.zadd(id, date, [c.open, c.high, c.low, c.close, c.volume, c.trades].map(d=>d.toFixed(2)).join('|'));
    });
}


const bulkFetchOHLC = (opts,next) => {
    let startTime;
    lastCandle(opts,(err,res) => {
        if(!err && res){
            startTime = new Date(res).toISOString();   
            console.log('found last candle: \t' + DD(startTime));
        }else {
            console.log('NO LAST CANDLE!');
            startTime = opts.startTime
            console.log('fetching from provided startTime ', startTime);
        }
        let options = Object.assign({}, opts );
        if(startTime) options.startTime = startTime;
        fetchMex(options).then(res =>{
            if(res.length === 750){
                console.log('need to fetch more! N*timeframe = now!' );
            }else{
                return next(null,res)
            }
        }).catch(err=>{
            console.log('failed', err);
            return next(err,null);
        });
    });

    
}

module.exports = {
    bulkFetchOHLC,
}


