/**
 * 量化指标
 * @author chengn
 * @date   2015-04
 */

/**
 * 基本量化指标
 */
var Quant = {
		/**
		 * 求和
		 * @param arr
		 * @returns {Number}
		 */
		sum:function(arr){
			var sum=0;
			for(var i=0;i<arr.length;i++){
				sum+=arr[i];
			}
			return sum;
		},
		/**
		 * 求一个数组的平均数
		 * @param arr
		 * @returns {Number}
		 */
		avg:function(arr){
			var sum = this.sum(arr);
			return sum/arr.length;
		},
		/**
		 * 滚动平均
		 * @param arr
		 * @param n
		 */
		rollAvg : function(arr,n){
			var re = [];
			re[0] = arr[0];
			for (var i = 1; i < arr.length; i++) {
				var prev = 0;
				var t = 0;
				for (var k = 1; k <= n && (i - k) >= 0; k++) {
					t++;
					prev += parseFloat(arr[i - k]);
				}
				var pAvg = prev / t;
				re[i] = pAvg;
			}
			return re;
		},
		
		/**
		 * //标准差 jStat.js 统计库
		 */
		stdev: function(arr){
			var vari = this.vari(arr);
			var stdev = Math.sqrt(number);
		},
		/**
		 * 方差，二阶距
		 * @param arr
		 * @returns {Number}
		 */
		vari:function(arr){
			var vari = 0;
			var avg = this.avg(arr);
			for(var i=0;i<arr.length;i++){
				vari+=Math.pow(arr[i]-avg,2);
			}
			return vari/arr.length;
		},
		/**
		 * 变化率
		 * @param arr       待求数组
		 * @param period    周期，默认为1（环比），同比时输入12
		 * @returns {Array} 变化率数组
		 */
		roc:function(arr,period){
			var roc = [];
			if (period == null) {
				period = 1;
			}
			for (var i = period ; i < arr.length; i++) {
				roc[i] = arr[i]/arr[i - period] - 1;
			}
			return roc;
		},
		/**
		 * 变化量
		 * @param arr       待求数组
		 * @param period    周期，默认为1（环比），同比时输入12(月度日期同比)
		 * @returns {Array} 变化量数组
		 */
		voc:function(arr,period){
			var roc = [];
			if (period == null) {
				period = 1;
			}
			for (var i = period ; i < arr.length; i++) {
				roc[i] = arr[i]-arr[i - period];
			}
			return roc;
		}
		
}

/**
 * 同比 Year-of-Year
 */
var YOY = {
	/**
	 * 增速，变化率
	 * @param arr      原始一维数组
	 * @param n        滚动平均数 可空，默认1
	 * @param period  周期，默认年度为12
	 * @param decimals  计算结果的小数保留位数 可空
	 */
	roc: function(arr,decimals, n, period) {
		if (n == null) {
			n = 1;
		}
		if (period == null) {
			period = 12;
		}
		var roc = this.change(arr,n, period,function(cur,prev) {
			return (cur/prev - 1).toFixed(decimals);
		});
		return roc;
	},
	/**
	 * 增量，变化，变化量
	 * @param arr
	 */
	voc: function(arr,decimals,n, period) {
		if (n == null) {
			n = 1;
		}
		if (period == null) {
			period = 12;
		}
		var voc = this.change(arr,n, period,function(cur,prev) {
			return (cur-prev).toFixed(decimals);
		});
		return voc;
	},
	/**
	 * 同比变化
	 * @param arr    待求数组
	 * @param n      滚动数，默认1（不滚动）
	 * @param period 同比周期,默认12（同比），环比=1
	 * @param func   计算函数,默认变化量
	 * @returns {Array} 结果数组
	 */
     change:function(arr,n, period,func){
		if (n == null) {
			n = 1;
		}
		if (period == null) {
			period = 12;
		}
		var chg = [];
		var avg = Quant.rollAvg(arr, n);
		
		for (var i = period ; i < avg.length; i++) {
			chg[i] = func(avg[i],avg[i-period]);
		}
		return chg;
	}
};
/**
 * 环比
 */
var QOQ = {
	/**
	 * 增速，变化率
	 * @param arr
	 * @param n
	 */
	roc: function(arr,decimals, n) {
		var roc = this.change(arr,n,function(cur,prev) {
			return (cur/prev - 1).toFixed(decimals);
		});
		return roc;
	},

	/**
	 * 增量，变化，变化量
	 * @param arr
	 */
	voc: function(arr,decimals,n) {
		var voc = this.change(arr,n,function(cur,prev) {
			return (cur-prev).toFixed(decimals);
		});
		return voc;
	},
	/**
	 * 环比变化
	 * @param arr       待计算数组
	 * @param n         滚动n
	 * @param func      计算函数
	 * @returns {Array} 计算后的数组
	 */
	change:function(arr,n,func){
		if (n == null) {
			n = 1;
		}
		var chg = [];
		var avg = Quant.rollAvg(arr, n);
		for (var i = 1; i < avg.length; i++) {
			chg[i] = func(avg[i],avg[i-1]);
		}
		return chg;
	}
}