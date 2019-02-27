import _ from 'lodash';
require ('ansicolor').nice // .nice for unsafe String extensions
const olog        = require ('ololog').configure ({ locate: false })
const asTable = require ('as-table')
	.configure ({ title: x => x.bright, delimiter: ' | '.dim.cyan, dash: '-'.bright.cyan })


// simple 'paper wallet'
class Wallet {

	constructor(initBalance) {
		this.balance = initBalance;
		this.position = null;
		this.trades = [];
		this.allSignals = [];
	}

	show() {

		return { balance: this.balance, position: this.position }
	}

	get history(){

		return this.trades
	}

	get hasOpenPosition(){

		return this.position !== null
	}


	logTrade({ type, rate, amount, balance, date, ta }){

		let log = Object.assign({ type, rate:rate, amount: amount, date, balance}, ta);
		this.trades.push(log);
	}

	showHistory(){
		let ttype = (type,rate) => {
			if(type === 'open' && rate <0) return type.red;
			if(type === 'close') return type.magenta;
		}
		return this.history.map(h=>{
			return {
				type: h.type === 'open' ? h.type.yellow : h.type.blue,
				rate: h.rate<0 ? String(h.rate).red.bright : String(h.rate).green.bright,
				trend: h.trend === 'bullish' ? h.trend.green.bright : h.trend.red.bright,
				strength: String(h.strength).green.bright,
				rsi: String(h.rsi).green.bright,
				mfi: String(h.mfi).green.bright,
				date: h.date,
				amount: h.amount.toFixed(2).magenta,
				balance: h.balance.toFixed(2).magenta,
				signals: h.signals.substring(0,49).cyan
				//signalTypes: h.signalTypes.join(', ').cyan
			}
		});
	}

	togglePosition({rate, date, ta}, next){	// TODO: think
		if(this.hasOpenPosition === false){
			this.openPosition({rate, date, ta}, next);
		} else{
			if(this.hasOpenPosition === true) this.closePosition({rate, date, ta}, next);
		}
	}

	openPosition({rate, date, ta}, next){
		if(this.position){
			return next(null,'close position first!');
		} 
	
		let amount = Math.abs(this.balance/rate);
		this.position = { rate, amount };
		date = date || 123;
		this.logTrade({ type: 'open', rate, amount, date, balance: this.balance, ta });
		this.balance = 0;
		//	console.log('opened Position: ', this.position);
		next(null, 'opened')
	}

	closePosition({rate, date, ta}, next){
		if(!this.position) throw new Error('no open position!');
		let amount = this.position.amount;
		//console.log('closed Position: ', {rate, amount});
		if(this.position.rate > 0){
			this.balance = amount * rate;
			this.position = null;
		} else {
			let old = Math.abs(amount*this.position.rate);
			let diff = old - Math.abs((amount*rate));
			this.balance = old + diff
			this.position = null;
		}
		date = date || 123;
		this.logTrade({ type: 'close', rate, amount, date, balance: this.balance, ta });
		next(null, 'closed');
	}
}

export default Wallet
