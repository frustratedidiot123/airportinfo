var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
XMLHttpRequest.UNSENT = 0;
XMLHttpRequest.OPENED = 1;
XMLHttpRequest.HEADERS_RECEIVED = 2;
XMLHttpRequest.LOADING = 3;
XMLHttpRequest.DONE = 4;

//category = 11  === Entertainment, Film;

function callAPI(p_url) {
  var req = new XMLHttpRequest();

  req.open('GET',p_url,false);
  req.send();
  return req;
};// callAPI

function getToken() {
  var tokenURL = 'https://opentdb.com/api_token.php?command=request',
      response = callAPI(tokenURL),
      responseText = response.responseText,
      responseObj = JSON.parse(responseText);

  if (responseObj.response_code === 0) {
    return responseObj.token;
  } else {
    return '';
  };
};// getToken

function getQuestion(p_categ, p_amt, p_token) {
  var questionURL = 'https://opentdb.com/api.php?type=multiple'

  if (p_categ) {
    questionURL +=  '&category=' + p_categ.toString();
  };

  if (p_amt) {
    questionURL +=  '&amount=' + p_amt.toString();
  } else {
 // get at least one question
    questionURL +=  '&amount=1';
  };

  if (p_token) {
    questionURL +=  '&token=' + p_token.toString();
  };
  console.log(questionURL);

  var response = callAPI(questionURL),
      questionText = response.responseText,
      questionObj = JSON.parse(questionText);

  if (questionObj.response_code === 0) {
    return questionObj.results;
  } else {
    return [
            {question: 'No question returned'
           ,correct_answer: ''
           ,incorrect_answers: []} ];
  };
}; //getQuestion
// console.log(getToken());
//console.log(getQuestion(11,null,getToken()));
console.log(getQuestion(11,2,'6a6dfc232a24162aad444d615e7bb3a3bed3b86d4b8cff50deee7abc4d2c7db8'));
//xhr.open('GET','https://opentdb.com/api.php?category=11&amount=1',false);
//xhr.open('GET','https://opentdb.com/api_token.php?command=request',false);

// xhr.send();
// console.log(xhr.status);
// console.log(xhr.responseText);
// var token = JSON.parse(xhr.responseText);
// console.log(token.token);
