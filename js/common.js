//var APIURL = 'http://hao.taohaomi.com/index.php?appapis/'; //全局api地址
//var APIURL = 'http://49.73.62.177:9090/index.php?appapis/'; //全局api地址
//var APIURL = 'http://222.93.185.217:9090/index.php?appapis/'; //全局api地址

//登陆:login
//首页:b
//帖子列表:forum(需要提交node_id,否则报404)
/**
 * @description 全局变量：domain：http://hao.taohaomi.com/
 */
var APP_DOMAIN = 'https://app.linshigong.com/';
//var APP_DOMAIN = 'http://admin.linshigong.com/';

/**
 * @description 全局变量：接口地址
 */
var APIURL = APP_DOMAIN + 'index.php?appapis/';

/**
 * @description 全局变量：全局图片地址
 */
var imgURL = 'https://app.linshigong.com/';

/**
 * @description 全局变量：静态加载中的文本
 */
var loading_msg = '<p class="mui-text-center" style="padding: 50% 0px;">加载中....</p>';
/**
 * @description 调试用的时间戳
 * @author suwill
 * @param {none} 不需要参数
 * @example mklog();
 */
function mklog() {
	var date = new Date(); //新建一个事件对象
	var seperator1 = "/"; //日期分隔符
	var seperator2 = ":"; //事件分隔符
	var month = date.getMonth() + 1; //获取月份
	var strDate = date.getDate(); //获取日期
	var ss = date.getSeconds(); //获取秒
	if(month >= 1 && month <= 9) { //判断月份
		month = "0" + month;
	}
	if(strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	if(ss >= 0 && ss <= 9) {
		ss = "0" + ss;
	}
	var ms = date.getMilliseconds();
	if(ms >= 10 && ms <= 100) {
		ms = '0' + ms;
	} else if(ms >= 0 & ms <= 9) {
		ms = '00' + ms;
	}
	//	var currentdate = ('2' + date.getYear() - 100) + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes() + ":" + ss + "'" + ms;
	var currentdate = date.getHours() + seperator2 + date.getMinutes() + ":" + ss + "'" + ms;
	return currentdate + '|';
};
/**
 * @description 返回所有窗口的艾迪
 * @author suwill
 * @param {none} 不需要参数
 * @example mkwv();
 */
function mkwv() {
	var wvs = plus.webview.all(); //循环显示当前webv
	var t1 = "|debug:当前共有" + wvs.length + "个webview\n";
	var t2 = "";
	for(var i = 0; i < wvs.length; i++) {
		t2 += "|webview" + i + "|id:" + wvs[i].id + "|@url:" + wvs[i].getURL().substr(82) + '\n';
	}
	return t1 + t2;
};

var waitingStyle = {
	style: "black",
	color: "#FF0000",
	//				width: "48px",
	background: "rgba(0,0,0,0)",
	//	back: "none",
	loading: {
		icon: "../img/loading.png",
		display: "inline"
	}
};

/**
 * @description 新开窗口
 * @param {URIString} target  需要打开的页面的地址
 * @param {Object} parm 传递的对象
 * @param {Boolean} autoShow 是否自动显示
 * @example openNew({URIString});
 * */
function openNew(target, parm, autoShow) {
	var isAutoShow = arguments[2] || true
	console.log(mklog() + 'common:openNew|Parm:' + JSON.stringify(parm))
	mui.openWindow({
		url: target,
		id: target,
		show: {
			autoShow: isAutoShow, //页面loaded事件发生后自动显示，默认为true
			aniShow: 'pop-in',
			duration: 300
		},
		waiting: {
			autoShow: true,
			options: waitingStyle
		},
		extras: {
			info: parm
		}
	});
};
//用于返回主Tab
function toDefaultTab() {
	var main = plus.webview.currentWebview().parent(); //仅限4个tab页面调用
	mui.fire(main, 'toDefaultTab');
};
//定义顺序排序比较器(display_order)
function orderByDisplayOrder(propertyName) {
	return function(object1, object2) {
		var value1 = object1[propertyName];
		var value2 = object2[propertyName];
		if(value2 < value1) {
			return 1;
		} else if(value2 > value1) {
			return -1;
		} else {
			return 0;
		}
	}
};

//验证用户输入
var checkInput = {
	/**
	 * @description 验证手机号
	 * @param {String} str 要验证的手机号码字符串
	 * @param {Function.fn} callback 回调函数，验证成功返回空，否则失败
	 */
	tel: function(str, callback) {
		if(str.length == 0) {
			return callback('手机号码不能为空');
		} else {
			return callback((!/^[1][3,4,5,8][0-9]{9}$/.test(str)) ? '请输入正确的手机号码' : '');
		}
	},
	/**
	 * @description 验证非空字符串
	 * @param {String} str 要验证的字符串
	 * @param {Function.fn} callback 回调函数，验证成功返回空，否则失败
	 */
	username: function(str, callback) {
		if(str.length == 0) {
			return callback('用户名不能为空');
		} else {
			return callback((!/^[a-z0-9A-Z]{4}$/.test(str)) ? '请输入正确的验证码' : '');
		}
	},
	/**
	 * @description 验证密码
	 * @param {String} str 要验证的密码字符串
	 * @param {Function.fn} callback 回调函数，验证成功返回空，否则失败
	 */
	pass: function(str, callback) {
		if(str.length < 6) {
			return callback('密码至少需要6位');
		} else {
			return callback((!/^.*[A-Za-z0-9\\w_-]+.*$/.test(str)) ? '请输入正确的密码：\n密码至少6位,仅允许英文字母和数字' : '');
			//TODO 已知bug，该正则无法验证中文密码但是中间包含阿拉伯数字或者英文字母的密码，如：用来测试的2密码
			//BUG
		}
	},
	/**
	 * @description 验证身份证号
	 * @param {String} str 要验证的身份证号字符串
	 * @param {Function.fn} callback 回调函数，验证成功返回空，否则失败
	 */
	mysfzh: function(str, callback) {
		return callback((!/^\d{15}|\d{}18$/.test(str)) ? '请输入正确的身份号' : '');
	},
	/**
	 * @description 检查验证码
	 * @param {String} str 要检查的验证码字符串
	 * @param {Function.fn} callback 回调函数，验证成功返回空，否则失败
	 */
	mycode: function(str, callback) {
		if(str.length == 0) {
			return callback('验证码不能为空');
		} else {
			return callback((!/^[a-z0-9A-Z]{4}$/.test(str)) ? '请输入正确的验证码' : '');
		}
	}
};
/**
 * @description 请求接口数据
 * @param {URIString} url  需要氢气机的接口地址
 * @param {Object} parm 传递的对象
 * @param {String} dom 要插入的道姆节点
 * @param {String} tmpl 调用的模板名称
 * @example openNew({URIString});
 * */
//function Request(url, parm, dom, tmpl, callback) {
//	mui.ajax(APIURL + url, {
//		data: parm,
//		dataType: 'json', //要求服务器返回json格式数据
//		type: 'post', //HTTP请求类型，要和服务端对应，要么GET,要么POST
//		timeout: 10000, //超时时间设置为10秒；
//		beforeSend: function() { //发送之前，可以打一下看看提交的参数（如果是变量）
//			console.log(mklog() + 'AJAX-->URL:' + APIURL + url + '|P:' + JSON.stringify(parm))
//		},
//		success: function(data) {
//			callback(data);
//			console.log(mklog() + '<--AJAX:' + JSON.stringify(data)) //成功，则打一下返回的数据
//		},
//		error: function(xhr, type, errorThrown) { //失败，打一下失败的类型，主要用于调试和用户体验
//			console.log('AJAX:ERR-|T:' + type + '|H:' + xhr.responseText);
//			if (type == 'timeout') {
//				mui.toast("请求超时：请检查网络")
//			} else {
//				mui.toast('请求失败：' + type + '\n err:' + errorThrown);
//				console.log(type + ':' + errorThrown)
//			}
//		},
//		complete: function() {}
//	}); //ajax end
//}\
function getTimeStamp() {
	var tmp = Date.parse(new Date()).toString();
	tmp = tmp.substr(0, 10);
	return tmp;
};
/**
 * @description 获取数据
 * @param {URIString} url  需要请求数据的接口地址
 * @param {Object} parm 提交的参数
 * */
function getData(url, parm, callback) {
	//	parm._xfToken =;
	parm._xfToken = plus.storage.getItem('token');
	parm._xfSessionId = plus.storage.getItem('sid');
	parm.csrf_token_page = plus.storage.getItem('token');

	//	console.log(JSON.stringify(parm))
	var foundCookie = plus.storage.getItem('cookie');
	mui.ajax(url, {
		data: parm,
		crossDomain: true,
		xhrFields: {
			withCredentials: true
		},
		dataType: 'json', //要求服务器返回json格式数据
		type: 'post', //HTTP请求类型，要和服务端对应，要么GET,要么POST
		timeout: 8000, //超时时间设置为3秒；
		headers: {
			//			'cookie': plus.storage.getItem('cookie')
			'cookie': foundCookie
		},
		beforeSend: function() { //发送之前，可以打一下看看提交的参数（如果是变量）

			console.log(mklog() + '==AJAX==>URL 【' + url + '】');
						console.log(mklog() + '==AJAX==>Parm【' + JSON.stringify(parm).length + '】|Token【' + JSON.stringify(parm._xfToken).length + '】|Cookie【' + foundCookie.length + '】|sid【' + JSON.stringify(parm._xfSessionId).length + '】|Page【' + JSON.stringify(parm.csrf_token_page).length + '】')
						console.log(mklog() + '==AJAX==>parm【' + JSON.stringify(parm) + '】')
						console.log(mklog() + '==AJAX==>token【' + JSON.stringify(parm._xfToken) + '】')
						console.log(mklog() + '==AJAX==>cookie【' +foundCookie + '】')
		},
		success: function(data) {
			callback(data);
			//核心写在这里
		},
		error: function(xhr, type, errorThrown) { //失败，打一下失败的类型，主要用于调试和用户体验
			//			console.log(mklog() + '失败之前的窗口是：' + plus.webview.currentWebview().opener().id);
			console.log(mklog() + '启动窗口是' + plus.webview.getLaunchWebview().id)
				//console.log(mklog()+'【AJAX:ERR】-|T:' + type + '|H:' + xhr.responseText);
			console.log(mklog() + '【AJAX:ERR】-|T:' + type + '|H:' + errorThrown);
			//			console.log(mklog() + '【AJAX:ERR】-|XHR:' + xhr.responseText);
			//alert(xhr.responseText)
			console.log('----------返回的错误文本长度：' + xhr.responseText.length);
			//			getJsonToClipboard(xhr.responseText);

			if(type == 'timeout' || type == 'abort') {
				mui.toast("请求超时：请检查网络")
					//				setTimeout(function() {
					//					mui.back();
					//				}, 1000)
			} else if(xhr.responseText.length) {
				var errTxt = xhr.responseText;
				var t_start = errTxt.indexOf('<!-- main template -->');
				errTxt = errTxt.substring(t_start, errTxt.length)
				var t_end = errTxt.indexOf('</div>');
				errTxt = removeHTMLTag(errTxt.substring(0, t_end));
				switch(errTxt) {
					case '您必须登录后才可执行此操作。':
						mui.fire(plus.webview.getWebviewById('mainUser.html'), 'changeUserLoginStatus', {
							code: false
						});
						break;
					case '无法找到指定的版面。':
						console.log('抓住:无法找到指定的版面');
						break;
						case '没有匹配记录，请尝试采用其他条件查询。':
						mui.toast('抓住:没有匹配记录，请尝试采用其他条件查询。');
						break;
					default:
						console.log(errTxt);
						break;
				}
				mui.toast('提示：' + errTxt);
				if(plus.webview.currentWebview().opener().id != plus.webview.getLaunchWebview().id) {
					setTimeout(function() {
						mui.back();
					}, 1000)
				}
			} else
				mui.toast(errorThrown);
			//				mui.alert(xhr.responseText);
		},
		complete: function() {
			plus.nativeUI.closeWaiting(); //关闭转圈
		}
	}); //ajax end
}; //获取数据结束
/**
 * @description 移除网页源码
 * @param {String} str  需要过滤的代码
 * */
function removeHTMLTag(str) {
	str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
	str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
	//            str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
	str = str.replace(/ /ig, ''); //去掉 
	str = str.replace(/\s+/g, ""); //删除所有空格;
	return str;
};

function showMyWating() {
	plus.nativeUI.showWaiting('', waitingStyle); //开始转圈
};
/**
 * @description 时间戳转日期字符串
 * @param {Date} s  需要转换的时间戳
 * @example Date2YYYYMMDDHHMMSS(时间戳);
 * */
function Date2YYYYMMDDHHMMSS(s) {
	var d = new Date(s * 1000); //根据时间戳生成的时间对象
	var yyyy = d.getFullYear();
	var month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
	var dd = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
	var hh = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
	var mm = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
	var ss = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
	var t = yyyy + "-" + month + "-" + dd + " " + hh + ":" + mm + ":" + ss;
	return t;
};

/**
 * @description 对象转数组
 * @param {Object} obj  需要转换的对象
 * @example transObjectToArry(对象);
 * */
function transObjectToArry(obj) {
	var arr = [];
	for(var item in obj) {
		arr.push(obj[item]);
	}
	//console.log(JSON.stringify(arr))
	return arr;
};
/**
 * @description 安卓写入剪贴板
 * @param {Object} obj  需要转换的对象
 * @example transObjectToArry(对象);
 * */
function getJsonToClipboard(jsonStr) {
	var Context = plus.android.importClass("android.content.Context");
	var main = plus.android.runtimeMainActivity();
	var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);
	return plus.android.invoke(clip, "setText", jsonStr);
};

//过滤换行符
function formatTopticInfoP(content) {
	var string = content;
	//	console.log('原始数据:'+content)
	try {
		string = string.replace(/([\r\n]?)(\r\n|\n\r|\r|\n)/g, "<p>")
		string = string.replace(/\n/g, "<br>");
		string = string.replace(/\n/g, "<br/>");
		string = string.replace(/\r\n\r\n/g, "<br/><br/><p>");
		string = string.replace(/\n\r/g, "<br/><br/>");
		string = string.replace(/\r\n/g, "<br/><br/>");

		if(string.indexOf('blockquote') > 0) {
			//			console.log('formatTopticInfo检测到引用：' + string)
			string = cleanQuoteP(string);
		}
		//				string =string.replace('-------',"</br>")
	} catch(e) {
		alert(e.message);
	}
	return string;
};

//过滤换行符
function formatTopticInfoB(content) {
	var string = content;
	//	console.log('原始数据:'+content)
	try {
		string = string.replace(/([\r\n]?)(\r\n|\n\r|\r|\n)/g, '<br/><br/>')
		string = string.replace(/\n/g, "<br>");
		string = string.replace(/(<\/?a.*?>)|(<\/?span.*?>)/g, '');
		string = string.replace(/\n/g, "<br/>");
		string = string.replace(/\r\n\r\n/g, "<br/><br/><p>");
		string = string.replace(/\n\r/g, "<br/><br/>");
		string = string.replace(/\r\n/g, "<br/><br/>");

		if(string.indexOf('blockquote') > 0) {
			//			console.log('formatTopticInfo检测到引用：' + string)
			string = cleanQuoteP(string);
		}
		//				string =string.replace('-------',"</br>")

	} catch(e) {
		alert(e.message);
	}
	return string;
};

function cleanQuoteP(txt) {
	//	console.log('输入：' + txt)
	var re = new RegExp("<blockquote", "g");
	var arr = txt.match(re);
	//	console.log('检测quote出现次数：'+arr.length)
	//	console.log('————————————————————————————————————')
	if(arr.length > 0) {
		txt = txt.replace(new RegExp('<.p>', 'gim'), '</br>').replace(new RegExp('<\/p>', 'gim'), '</br>');
		//		txt = '<blockquote class="xbbcode-blockquote mui-ellipsis-2"><i>牙混混：</i>一共8周年？老牙在此学习了6年，中医都只在这学习的~</blockquote ><p>是啊，一共8周年。牙师也是论坛老家伙了:029:<p>这里说的老家伙都是指坛龄';
		//		console.log('转换后的文本：'+txt)
	}
	return txt;
};

function bb2html(txt) {
	var result = XBBCODE.process({
		text: txt,
		removeMisalignedTags: true,
		addInLineBreaks: false
	});
	//	return result.error ? result.error : formatTopticInfo(result.html);

	return formatTopticInfoP(result.html).replace(/\:(\w+)\:/g, '<img class="smile" src="../img/smile/$1.gif"/>');

	//处理表情图片
	//		return result.html;
};

function clearBr(str) {
	return str.replace(/<br\/>/g, "")
};

function bb2htmlItem(txt) {
	var result = XBBCODE.process({
		text: txt,
		removeMisalignedTags: true,
		addInLineBreaks: false
	});
	//	return result.error ? result.error : formatTopticInfo(result.html);
	return formatTopticInfoB(result.html).replace(/\:(\w+)\:/g, '<img class="smile" src="../img/smile/$1.gif"/>');

	//处理表情图片
};
//用户头像
function getUserAvatar(uid, avdate) {
	//	console.log(avdate)
	if(uid == 0 || avdate == 0) {
		return '../img/avatar_s.png';
	} else {
		return imgURL + '/data/avatars/s/' + Math.floor(uid / 1000) + '/' + uid + '.jpg';
	}
};

//资源图标
function getResourceIcon(resourceId, icondate) {
	if(resourceId == 0 || icondate == 0) {
		return '../img/resource_icon.png';
	} else {
		return imgURL + '/data/resource_icons/' + Math.floor(resourceId / 1000) + '/' + resourceId + '.jpg?' + icondate;
	}
};
//function nl2br(str, is_xhtml) {
//	var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
//	return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
//}

/**
 * @description 给数字增加千位分隔福
 * @param {Number} s  需要转换的数字
 * @example formatNumber(数字);
 * */
function formatNumber(num) {
	var j = j || ",";
	var s = num + "";
	var l = s.length;
	var m = l % 3;
	if(m == l) {
		return  s;
	} else if(m == 0) {
		return (s.substring(m).match(/\d{3}/g)).join(j);
	} else {
		return [s.substr(0, m)].concat(s.substring(m).match(/\d{3}/g)).join(j);
	}
};

// function baidupoint(){
// 	//使用百度地图地位模块获取位置信息
// 	plus.geolocation.getCurrentPosition(function(p){
// 		// console.log('plus.geolocation.getCureentPosition'); 

// 		if (!p || !p.address) {
// 			return;
// 		}
// 		// vm.city = p.addresses;
// 		// vm.mypoint = p.coords;
		
// 		localStorage.setItem('city' ,p.addresses );
// 		localStorage.setItem('mypoint' ,p.coords)
		
// 		// that.$options.methods.ajaxdata('', '', '', that.distance,'api/order');
// 		//经纬度
// 		console.log('common.js---L531;Geolocation\nLatitude:' + p.coords.latitude + '\nLongitude:' + p.coords.longitude + '\nAltitude:' + p.coords.altitude);
// 	   //JSON对象，地址信息
// 		// console.log(JSON.stringify(p.address));
// 	}, function(e){
// 			// console.log('Geolocation error: ' + e.message);
// 		if (isShowToast) {
// 			mui.toast("定位出错："+e.message);
// 		}
// 	}, {provider:'baidu'}); 


// }