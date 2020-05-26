// ==UserScript==
// @name         U校园-综合教程3 test
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       define_9247
// @description  QQ群：464970257
// @match        *://u.unipus.cn/user/student/homework/index*
// @match        *://uexercise.unipus.cn/*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant        unsafeWindow
// ==/UserScript==

//let $ = unsafeWindow.jQuery
(function() {

	'use strict';
	window.onload = function(){
		var n = 0;//第一份试题
		var lenth = 4;

		var localUrl = window.location.href;
		var courseId = localUrl.match(/courseId=\d+/g);
		var school_id = localUrl.match(/school_id=\d+/g);
		var eccId = localUrl.match(/eccId=\d+/g);
		var classId = localUrl.match(/classId=\d+/g);
		$.ajaxSettings.async = false;//取消异步执行
		//函数：
		function signData(signUrl){
			var sign = "";
			$.getJSON(signUrl,function(data){
				sign = data.rs.sign;
				//alert("getJSON:sign = " + sign);
			})
			return sign;
		}
		function btnUrl(btnName,anUrl){
			var endBtn = document.getElementById(btnName);
			endBtn.onclick = function(){
				//alert(anUrl);
				window.open(anUrl);
			};
		}
		//获取list中
		var stu_id = "";
		var homework_id = [];
		var sign = [];//sign
		var exerciseId = [];//存储作业ID
		var listUrl = "https://u.unipus.cn/user/student/homework/list?length=10&"+school_id+"&"+courseId+"&"+eccId+"&"+classId+"&type=2&state=";
		$.getJSON(listUrl,function(data){
			//console.info(data.rs.list[n].homework_id);
			//console.info(data.rs.list[n].stu_id);
			stu_id = data.rs.list[n].stu_id;
			for(n=0;n<lenth;n++){
				homework_id[n] = data.rs.list[n].homework_id;
				//alert("homework_id=" + homework_id[n]);
			}

			setTimeout(function(){//延时
				//获取forwardUrl
				var schoolId = school_id[0].replace(/[^0-9]/ig,"");
				var clsId = classId[0].replace(/[^0-9]/ig,"");
				var studentId = stu_id;
				for(n=0;n<lenth;n++){
					exerciseId[n] = homework_id[n];
					//alert("homework_id=" + homework_id[n]);
					//console.info(schoolId);
					//console.info(clsId);
				}
				//获取sign
				var tempUrl = [];
				var lxforwardUrl = [];
				var endUrl = [];//答案网址
				for(n=0;n<lenth;n++){
					//alert("homework_id=" + homework_id[n]);
					var signUrl = "https://u.unipus.cn/user/student/homework/chk?homeworkId=" + homework_id[n] + "&" + classId;
					//alert(signUrl);
					sign[n] = signData(signUrl);

					//alert("sign = " + sign[n]);
					tempUrl[n] = "https://uexercise.unipus.cn/uexercise/api/v1/enter_check_student_exam_detail?plf=0&schoolId="+schoolId+"&clsId="+clsId+"&studentId="+studentId+"&exerciseId="+exerciseId[n];
					lxforwardUrl[n] = encodeURIComponent(tempUrl[n]);
					//alert(sign);
					endUrl[n] = tempUrl[n] + "&forwardUrl=" + lxforwardUrl[n] + "&exerciseType=2&sign=" + sign[n];
					//alert(endUrl);
					var btn1 = '<a id="lxx' + n + '" href="javascript:void(0)")">查看答案</button>';
					var body = document.getElementById("tbody");
					var btn = body.getElementsByClassName("last");
					btn[n].innerHTML += btn1;

					var btnName = "lxx" + n;
					btnUrl(btnName,endUrl[n]);//添加点击事件
				}
			},"2000");
		});
	};
})();