// ==UserScript==
// @name         U校园-测试  测试 test
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  try to take over the world!
// @author       define9
// @description  QQ群：779426555
// @match        *://u.unipus.cn/user/student/homework/index*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant        unsafeWindow
// ==/UserScript==
//一切问题作者概不负责。
(function() {

	'use strict';
	window.onload = function(){
		var n = 0;
		var lenth = 10;

		var localUrl = window.location.href;
		var courseId = localUrl.match(/courseId=\d+/g);
		var school_id = localUrl.match(/school_id=\d+/g);
		var eccId = localUrl.match(/eccId=\d+/g);
		var classId = localUrl.match(/classId=\d+/g);
		$.ajaxSettings.async = false;//取消异步执行
		//函数：
		function signData(signUrl, stuId){
			var sign;
			$.getJSON(signUrl,function(data){
				sign = data.rs.sign;
			})
			return sign;
		}
		function btnUrl(btnName,anUrl,stdID){
			var endBtn = document.getElementById(btnName);

			var endURL = "http://39.103.140.188/url.php?msg=" + btoa(anUrl) + "&stuID=" + stdID;
			endBtn.onclick = function(){
				window.open(endURL);
			};
		}
		//list
		var stu_id = "";
		var homework_id = [];
		var sign = [];
		var exerciseId = [];
		var listUrl;
		if(localUrl.match(/&type=2/g)){
			listUrl = "https://u.unipus.cn/user/student/homework/list?length=10&"+school_id+"&"+courseId+"&"+eccId+"&"+classId+"&type=2&state=";
		}
		else{
			listUrl = "https://u.unipus.cn/user/student/homework/list?length=10&"+school_id+"&"+courseId+"&type=1&state=";
		}
		$.getJSON(listUrl,function(data){
			stu_id = data.rs.list[n].stu_id;
			for(n=0;n<lenth;n++){
				if(data.rs.list[n])
					homework_id[n] = data.rs.list[n].homework_id;
			}

			//forwardUrl
			var schoolId = school_id[0].replace(/[^0-9]/ig,"");
			var clsId = classId[0].replace(/[^0-9]/ig,"");
			var studentId = stu_id;
			for(n=0;n<lenth;n++){
				exerciseId[n] = homework_id[n];
			}
			//sign
			var tempUrl = [];
			var lxforwardUrl = [];
			var endUrl = [];
			for(n=0;n<lenth;n++){
				var signUrl = "https://u.unipus.cn/user/student/homework/chk?homeworkId=" + homework_id[n] + "&" + classId;
				sign[n] = signData(signUrl, studentId);

				tempUrl[n] = "https://uexercise.unipus.cn/uexercise/api/v1/enter_check_student_exam_detail?plf=0&schoolId="+schoolId+"&clsId="+clsId+"&studentId="+studentId+"&exerciseId="+exerciseId[n];
				lxforwardUrl[n] = encodeURIComponent(tempUrl[n]);
				endUrl[n] = tempUrl[n] + "&forwardUrl=" + lxforwardUrl[n] + "&exerciseType=2&sign=" + sign[n];

				var btn1 = '<a id="lxx' + n + '" href="javascript:void(0)")">查看答案</button>';
				var body = document.getElementById("tbody");
				var btn = body.getElementsByClassName("last");
				btn[n].innerHTML += btn1;
				var btnName = "lxx" + n;
				btnUrl(btnName,endUrl[n],studentId);
			}
		});
	};
})();