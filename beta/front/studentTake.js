document.getElementById("TakeForm").addEventListener("submit", ajaxSubmitExam);

ajaxShowExam(getExamNameParam(window.location.href), renderExam);

function getExamNameParam(currentURL){
	
	let sp = "exam=";
	let pInd = currentURL.search(sp);
	let exam = currentURL.substr(pInd + sp.length);
	
	return exam;
}

function ajaxShowExam(ename, callback){
	
	const SERVER = 'ajaxHandler.php';

	let post_params = 'RequestType=showExam&examname=' + ename;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", SERVER, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

	xhr.onload = function(){
		if (xhr.status == 200){
			let resp = JSON.parse(this.responseText);

			renderExam(ename, resp);
		}
	}

	xhr.send(post_params);

}

function renderExam(ename, questions){
	const divExam = document.getElementById("TakeDiv");
	const divName = document.getElementById("examName");

	divName.innerHTML = "Currently taking " + ename;

	let friendlyctr = 1;
	for (let question in questions){
		let li = document.createElement("div");
		let answer = document.createElement("textarea");

		li.setAttribute('class', 'TakeItems TakeQuestions');
		li.setAttribute('id', 'examquestion');
		li.innerHTML += '<strong>Question ' + friendlyctr + '</strong><br />';
		li.innerHTML += '<strong>' + questions[question]['points'] + ' Points</strong><br /><br />';
		li.innerHTML += questions[question]['questiontext'];

		answer.setAttribute('id', 'answerText' + questions[question]['questionID']);
		answer.setAttribute('class', 'TakeItems TakeAnswer');
		answer.setAttribute('cols', '100');
		answer.setAttribute('rows', '8');
		answer.setAttribute('wrap', 'soft');
		answer.setAttribute('placeholder', "Enter answer for question " + friendlyctr + " here");
		divExam.appendChild(li);
		divExam.appendChild(answer);

		divExam.innerHTML += '<hr />';

		++friendlyctr;
	}
}

function ajaxSubmitExam(e){
	
	e.preventDefault();

	const SERVER = 'ajaxHandler.php';

	let examname = getExamNameParam(window.location.href);
	let allanswers = document.getElementsByClassName("TakeAnswer");

	let ids = [];
	let answers = [];

	for(let answer in allanswers){
		if(allanswers[answer]['type'] != 'textarea')
			continue;
		console.log(allanswers[answer]);
		ids.push(allanswers[answer]['id'].substr(10));
		answers.push(allanswers[answer]['value']);
	}

	let post_params = 'RequestType=submitExam&examname=' + examname + '&ids=' + ids + '&answers=' + answers;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", SERVER, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

	xhr.onload = function(){
		if (xhr.status == 200){
			let elem = document.getElementById("response");
			let resp = JSON.parse(this.responseText);

			elem.innerHTML = resp;
		}
	}

	xhr.send(post_params);
}