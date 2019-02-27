
const getConfig = () => {

	return {
		bounds: {high: 80, low:20},
		adx: { period:14,},
		macd:{ fastPeriod: 5, slowPeriod: 8, signalPeriod: 3, SimpleMAOscillator: false, SimpleMASignal: false},
		obv: { fromLastValues: -5 },
		stochRSI: { rsiPeriod:7, stochasticPeriod: 7, kPeriod:3, dPeriod:3},
		mfi: { period:14},
		ptd: { fromLastValues:-2 },
		kst: { ROCPer1: 10, ROCPer2: 15, ROCPer3: 20, ROCPer4: 30, SMAROCPer1: 10, SMAROCPer2: 10, SMAROCPer3: 10, SMAROCPer4: 15, signalPeriod: 3}
	}
}

export default getConfig()

