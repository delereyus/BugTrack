const API_URL = "http://localhost:5005/tickets";
const form = document.querySelector("#ticketForm");

form.addEventListener(
  "submit",
  function(event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    const formData = new FormData(form);
    const fromUser = formData.get("fromUser");
    const topic = formData.get("topic");
    const issue = formData.get("issue");
    const time = getTime();
    const date = getDate();
    const newTicket = {
      fromUser: fromUser,
      topic: topic,
      issue: issue,
      date,
      time
    };
    console.log(newTicket);
    addNewTicket(newTicket);
    form.reset();
  },
  false
);

function listAllTickets(){
  fetch(API_URL).then(response => response.json()).then(tickets => {
    
  })
}

function addNewTicket(ticket) {
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(ticket),
    headers: {
      "content-type": "application/json"
    }
  });
  var newTicket = document.createElement("p");
  var texter = ticket.fromUser + ", " + ticket.topic;
  var text = document.createTextNode(texter);
  newTicket.appendChild(text);
  console.log("ayy");

  var parent = document.getElementById("newTickets");
  parent.appendChild(newTicket);
  console.log("ay2");
}

function getDate() {
  let today = new Date();
  let date =
    today.getFullYear() +
    "-" +
    checkDate(today.getMonth()) +
    (today.getMonth() + 1) +
    "-" +
    checkDate(today.getDate()) +
    today.getDate();
  return date;
}

function getTime() {
  let today = new Date();
  let time =
    today.getHours() +
    ":" +
    today.getMinutes() +
    ":" +
    checkDate(today.getSeconds()) +
    today.getSeconds();
  return time;
}

function checkDate(dateOrTime) {
  if (dateOrTime < 10) {
    return "0";
  } else return "";
}