// ==UserScript==
// @name         U校园-综合教程3 test
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       define_9247
// @description  QQ:2066561288 QQ群：464970257
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

		var localUrl = window.location.href;
		var courseId = localUrl.match(/courseId=\d+/g);
		var school_id = localUrl.match(/school_id=\d+/g);
		var eccId = localUrl.match(/eccId=\d+/g);
		var classId = localUrl.match(/classId=\d+/g);
		//获取list中
		var stu_id = "";
		var homework_id = "";
		var sign = "";
		var listUrl = "https://u.unipus.cn/user/student/homework/list?length=10&"+school_id+"&"+courseId+"&"+eccId+"&"+classId+"&type=2&state=";
		$.getJSON(listUrl,function(data){
			//console.info(data.rs.list[n].homework_id);
			//console.info(data.rs.list[n].stu_id);

			stu_id = data.rs.list[n].stu_id;
			homework_id = data.rs.list[n].homework_id;
			//alert("homework_id=" + homework_id);
		});
		setTimeout(function(){//延时2s
			//获取forwardUrl
			var schoolId = school_id[0].replace(/[^0-9]/ig,"");
			var clsId = classId[0].replace(/[^0-9]/ig,"");
			var studentId = stu_id;
			var exerciseId = homework_id;
			//console.info(schoolId);
			//console.info(clsId);
			//获取sign

			//alert(homework_id);
			var signUrl = "https://u.unipus.cn/user/student/homework/chk?homeworkId="+homework_id+"&"+classId;
			//alert(signUrl);
			$.getJSON(signUrl,function(data){
				sign = data.rs.sign;
				//alert(sign);

				var tempUrl = "https://uexercise.unipus.cn/uexercise/api/v1/enter_check_student_exam_detail?plf=0&schoolId="+schoolId+"&clsId="+clsId+"&studentId="+studentId+"&exerciseId="+exerciseId;
				var lxforwardUrl = encodeURIComponent(tempUrl);
				//alert(sign);
				var endUrl = tempUrl + "&forwardUrl=" + lxforwardUrl + "&exerciseType=2&sign=" + sign;
				//alert(endUrl);
				var btn1 = '<a id="lxx" href="javascript:void(0)")">查看答案</button>';
				var body = document.getElementById("tbody");
				var btn = body.getElementsByClassName("last");
				btn[n].innerHTML += btn1;

				var endBtn = document.getElementById("lxx");
				endBtn.onclick = function(){
					window.open(endUrl);
				};
			});
		},"2000");
	};
})();