let isUsernameSameCheck = false;

$("#btnJoin").click(() => {
	join();
});

$("#btnUsernameSameCheck").click(() => {
	checkUsername();
});

$("#btnLogin").click(() => {
	login();
});


$("#btnDelete").click(() => {
	resign();
});

$("#btnUpdate").click(() => {
	update();
});

function join() {
	if (isUsernameSameCheck == false) {
		alert("username 중복 체크를 진행해주세요");
		return;
	}

	if (koreanCheck() == true) {
		alert("username에 한글이 있으면 안 됩니다.");
		return;
	}

	if (engCheck() == true) {
		alert("username에 대문자를 하나 넣어주세요");
		return;
	}

	if (passwordCheck() == false) {
		alert("비밀번호가 불일치합니다.");
		return;
	}

	if (emailCheck() == true) {
		alert("이메일 형식에 맞게 적어주세요.");
		return;
	}
	
	if (checkSpace() == true) {
		alert("이메일 공백 test");
		return;
	}

	let data = {
		username: $("#username").val(),
		password: $("#password").val(),
		email: $("#email").val()
	};

	$.ajax("/api/join", {
		type: "POST",
		dataType: "json", // 응답 데이터
		data: JSON.stringify(data), // http body에 들고갈 요청 데이터
		headers: { // http header에 들고갈 요청 데이터
			"Content-Type": "application/json"
		}
	}).done((res) => {
		if (res.code == 1) {
			location.href = "/loginForm";
		}else{
			alert(res.msg);
		}
	});
}

function checkUsername() {
	let username = $("#username").val();

	$.ajax(`/api/users/usernameSameCheck?username=${username}`, {
		type: "GET",
		dataType: "json",
		async: true
	}).done((res) => {
		if (res.code == 1) { // 통신 성공
			if (res.data == false) {
				alert("아이디가 중복되지 않았습니다.");
				isUsernameSameCheck = true;
			} else {
				alert("아이디가 중복되었어요. 다른 아이디를 사용해주세요.");
				isUsernameSameCheck = false;
				$("#username").val("");
			}
		}
	});
}

function login() {
	let data = {
		username: $("#username").val(),
		password: $("#password").val(),
		remember: $("#remember").prop("checked")
	};

	$.ajax("/api/login", {
		type: "POST",
		dataType: "json", // 응답 데이터
		data: JSON.stringify(data), // http body에 들고갈 요청 데이터
		headers: { // http header에 들고갈 요청 데이터
			"Content-Type": "application/json; charset=utf-8"
		}
	}).done((res) => {
		if (res.code == 1) {
			location.href = "/";
		} else {
			alert("로그인 실패, 아이디 패스워드를 확인해주세요");
		}
	});
}

function resign() {
	let id = $("#id").val();

	$.ajax("/s/api/users/" + id, {
		type: "DELETE",
		dataType: "json" // 응답 데이터
	}).done((res) => {
		if (res.code == 1) {
			alert("회원탈퇴 완료");
			location.href = "/";
		} else {
			alert("회원탈퇴 실패");
			history.back();
		}
	});
}

function update() {
	let data = {
		password: $("#password").val(),
		email: $("#email").val()
	};

	let id = $("#id").val();

	$.ajax("/s/api/users/" + id, {
		type: "PUT",
		dataType: "json", // 응답 데이터
		data: JSON.stringify(data), // http body에 들고갈 요청 데이터
		headers: { // http header에 들고갈 요청 데이터
			"Content-Type": "application/json; charset=utf-8"
		}
	}).done((res) => {
		if (res.code == 1) {
			alert("회원 수정 완료");
			location.reload(); // f5
		} else {
			alert("업데이트에 실패하였습니다");
		}
	});
}

function koreanCheck() {
	let username = $("#username").val();
	let korRule = /^[가-힣]*$/;
	if (korRule.test(username)) {
		return true;
	} else {
		return false;
	}
}

function engCheck() {
	let username = $("#username").val();
	let engRule = /[A-Z]/;
	if (!engRule.test(username)) {
		return true;
	} else {
		return false;
	}
}

function passwordCheck() {
	let password = $("#password").val();
	let passwordSame = $("#passwordSame").val();

	if (password != passwordSame) {
		return false;
	} else {
		return true;
	}
}

function emailCheck() {
	let email = $("#email").val();
	let emilRule = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
	if (!emilRule.test(email)) {
		return true;
	} else {
		return false;
	}
}

function checkSpace() {
	let email = $("#email").val();
	if (email.search(/\s/) !== -1) {
		return true; // 스페이스가 있는 경우
	} else {
		return false; // 스페이스 없는 경우
	}
}
