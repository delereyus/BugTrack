const ticketLista = document.querySelectorAll(".ticketList");
const ticketRow = document.querySelector("#ticketRow");
const projects = document.querySelectorAll(".projectList");
const projectDataTable = document.querySelector("#projectDataTable");
const ticketTableBody = document.querySelector("#tableBody");
const form = document.querySelector("#ticketForm");

const API_TICKET_TABLE_URL = "http://localhost:5005/ticketsfortable";
const API_URI = "http://localhost:5005/tickets";

projectDataTable.style.display = "none";
ticketRow.style.display = "none";

listAllTickets();

//Currently adding new elements each time
ticketLista.forEach(ticketa => {
  ticketa.addEventListener('click', function(event) {
    event.preventDefault();

    fetch(API_TICKET_TABLE_URL)
    .then(response => response.json())
    .then(tickets => {
      tickets.forEach(ticket => {
       let newTableRow = document.createElement('tr');

       let prjName = document.createElement('td');
       let userName = document.createElement('td');
       let userRole = document.createElement('td');
       let topic = document.createElement('td');
       let issue = document.createElement('td');
       let submitDate = document.createElement('td');
       let submitTime = document.createElement('td');
       let status = document.createElement('td');

       let projText = ticket.projectName;
       let userText = ticket.userName;
       let roleText = ticket.userRole;
       let topicText = ticket.topic;
       let issueText = ticket.issue;
       let dateText = ticket.submitDate;
       let timeText = ticket.submitTime;
       let statusText = ticket.issueStatus;

       let textProj = document.createTextNode(projText);
       let textUser = document.createTextNode(userText);
       let textRole = document.createTextNode(roleText);
       let textTopic = document.createTextNode(topicText);
       let textIssue = document.createTextNode(issueText);
       let textDate = document.createTextNode(dateText);
       let textTime = document.createTextNode(timeText);
       let textStatus = document.createTextNode(statusText);

       prjName.appendChild(textProj);
       userName.appendChild(textUser);
       userRole.appendChild(textRole);
       topic.appendChild(textTopic);
       issue.appendChild(textIssue);
       submitDate.appendChild(textDate);
       submitTime.appendChild(textTime);
       status.appendChild(textStatus);
       
       newTableRow.appendChild(prjName);
       newTableRow.appendChild(userName);
       newTableRow.appendChild(userRole);
       newTableRow.appendChild(topic);
       newTableRow.appendChild(issue);
       newTableRow.appendChild(submitDate);
       newTableRow.appendChild(submitTime);
       newTableRow.appendChild(status);

       ticketTableBody.appendChild(newTableRow);
      });
    });
    
    if (projectDataTable.style.display === 'none'){
      projectDataTable.style.display = '';
      } else projectDataTable.style.display = 'none';
  })
}, false);

projects.forEach(project => {
  project.addEventListener("click", function(event) {
    event.preventDefault();

    if (ticketRow.style.display === "none") {
      ticketRow.style.display = "";
    } else ticketRow.style.display = "none";
  });
}, false);

form.addEventListener(
  "submit",
  function(event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    const formData = new FormData(form);
    const topic = formData.get("topic");
    const issue = formData.get("issue");
    const time = getTime();
    const date = getDate();
    const newTicket = {
      submitterId: 1,
      projectId: 1,
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

function listAllTickets() {
  fetch(API_URI)
    .then(response => response.json())
    .then(tickets => {
      tickets.forEach(ticket => {
        var newTicket = document.createElement("li");
        var ticketLink = document.createElement("a");
        var ticketSpan = document.createElement("span");
        var arrow = document.createElement("i");

        arrow.className = "fas fa-angle-right";
        ticketLink.className = "text-white clearfix medium z-1";
        ticketLink.href = "#";

        var topic = ticket.topic + " ";
        let text = document.createTextNode(topic);
        ticketSpan.appendChild(text);

        ticketLink.appendChild(ticketSpan);
        ticketLink.appendChild(arrow);
        newTicket.appendChild(ticketLink);

        let ticketList = document.querySelector('.ticketList');
        ticketList.appendChild(newTicket);
      });
    });
}

function addNewTicket(ticket) {
  fetch(API_URI, {
    method: "POST",
    body: JSON.stringify(ticket),
    headers: {
      "content-type": "application/json"
    }
  });
  var newTicket = document.createElement("li");
  var ticketLink = document.createElement("a");
  var ticketSpan = document.createElement("span");
  var arrow = document.createElement("i");

  arrow.className = "fas fa-angle-right";
  ticketLink.className = "text-white clearfix medium z-1";
  ticketLink.href = "#";

  var topic = ticket.topic + " ";
  var text = document.createTextNode(topic);
  ticketSpan.appendChild(text);

  var ticketList = document.querySelector(".ticketList");
  ticketLink.appendChild(ticketSpan);
  ticketLink.appendChild(arrow);
  newTicket.appendChild(ticketLink);

  ticketList.appendChild(newTicket);
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
