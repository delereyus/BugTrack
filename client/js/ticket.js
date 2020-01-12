const API_ALL_TICKETS_URL = "http://localhost:5005/tickets";
const API_OPEN_TICKET_URL = "http://localhost:5005/ticketsopen";
const API_IN_PROGRESS_TICKET_URL = "http://localhost:5005/ticketsinprogress";
const API_RESOLVED_TICKET_URL = "http://localhost:5005/ticketsresolved";
const form = document.querySelector("#ticketForm");

listAllTickets(API_ALL_TICKETS_URL);

function listAllTickets(status) {
  fetch(status)
    .then(response => response.json())
    .then(tickets => {
      tickets.forEach(ticket => {
  var newTicket = document.createElement("li");
  var ticketSpan = document.createElement("span");
  ticketSpan.className = "text-white clearfix medium z-1";

  var texter = ticket.topic;
  var text = document.createTextNode(texter);
  ticketSpan.appendChild(text);

  newTicket.appendChild(ticketSpan);

  var ticketList = document.querySelector(".ticketList");
  ticketList.appendChild(newTicket);
      });
    });
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
  var texter = ticket.topic + ", " + ticket.issue;
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
