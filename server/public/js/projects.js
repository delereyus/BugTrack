const ticketRow = document.querySelector("#ticketRow");
const projects = document.querySelectorAll(".projectList");
const projectDataTable = document.querySelector("#projectDataTable");
const ticketTableBody = document.querySelector("#tableBody");
//const form = document.querySelector("#ticketForm");
const newTableRow = document.querySelectorAll(".newTableRow");
const topicClass = document.querySelectorAll(".topicClass");
const issueDescriptionContainer = document.querySelector(
  "#descriptionContainer"
);
const ticketCard = document.querySelector("#ticketCard");

const newTicketFooter = document.querySelector("#newTicketFooter");
const inProgressTicketFooter = document.querySelector(
  "#inProgressTicketFooter"
);
const resolvedTicketFooter = document.querySelector("#resolvedTicketFooter");

const openArrow = document.querySelector("#openArrow");
const inProgressArrow = document.querySelector("#inProgressArrow");
const resolvedArrow = document.querySelector("#resolvedArrow");

const arrowArray = [openArrow, inProgressArrow, resolvedArrow];

const API_ALL_TICKETS_URL = "http://localhost:5005/tickets";
const API_OPEN_TICKET_URL = "http://localhost:5005/ticketsopen";
const API_IN_PROGRESS_TICKET_URL = "http://localhost:5005/ticketsinprogress";
const API_RESOLVED_TICKET_URL = "http://localhost:5005/ticketsresolved";

projectDataTable.style.display = "none";
ticketRow.style.display = "none";
issueDescriptionContainer.style.display = "none";

let projectsIsClicked = false;
let dataTableIsClicked = false;
let ticketIsClicked = false;
let lastTicketShown = "";
let lastStatusShown = "";

let arrowDown = "fas fa-angle-down";
let arrowRight = "fas fa-angle-right";


newTicketFooter.addEventListener("click", function(event) {
  event.preventDefault();
  removeDataTable();
  if (lastStatusShown != "#openArrow") {
    dataTableIsClicked = false;
    projectDataTable.style.display = "none";
  }
  createDataTable(API_OPEN_TICKET_URL);
  dataTableDisplay();
  lastStatusShown = "#openArrow";
  changeArrow(lastStatusShown);
});

inProgressTicketFooter.addEventListener("click", function(event) {
  event.preventDefault();
  removeDataTable();
  if (lastStatusShown != "#inProgressArrow") {
    dataTableIsClicked = false;
    projectDataTable.style.display = "none";
  }
  createDataTable(API_IN_PROGRESS_TICKET_URL);
  dataTableDisplay();
  lastStatusShown = "#inProgressArrow";
  changeArrow(lastStatusShown);
});

resolvedTicketFooter.addEventListener("click", function(event) {
  event.preventDefault();
  removeDataTable();
  if (lastStatusShown != "#resolvedArrow") {
    dataTableIsClicked = false;
    projectDataTable.style.display = "none";
  }
  createDataTable(API_RESOLVED_TICKET_URL);
  dataTableDisplay();
  lastStatusShown = "#resolvedArrow";
  changeArrow(lastStatusShown);
});

projects.forEach(project => {
  project.addEventListener("click", function(event) {
    event.preventDefault();

    if (!projectsIsClicked) {
      document.querySelector("#projectsArrow").className = arrowDown;
      projectsIsClicked = true;
    } else {
      document.querySelector("#projectsArrow").className = arrowRight;
      projectsIsClicked = false;
    }

    if (ticketIsClicked == true) {
      removeTicket();
    }
    dataTableDisplay();
    if (ticketRow.style.display === "none") {
      ticketRow.style.display = "";
    } else ticketRow.style.display = "none";

    changeArrow(lastStatusShown);
  });
}, false);

function changeArrow(target) {
  arrowArray.forEach(arrow => {
    arrow.className = arrowRight;
  });

  if (lastStatusShown == target && projectDataTable.style.display === "") {
    document.querySelector(target).className = arrowDown;
  } else document.querySelector(target).className = arrowRight;
}

function dataTableDisplay() {
  if 
  (
    projectDataTable.style.display === "none" &&
    ticketRow.style.display === "" &&
    document.querySelector("#projectsArrow").className === arrowDown
  ) {
    projectDataTable.style.display = "";
  } else projectDataTable.style.display = "none";
}

function showTicket(ticketTopic) {
  fetch(API_ALL_TICKETS_URL).then(response =>
    response.json().then(tickets => {
      tickets.forEach(ticket => {
        if (ticket.topic == ticketTopic) {
          if (!ticketIsClicked) {
            createTicket(ticket);
          } else if (ticketIsClicked && lastTicketShown === ticket.issue) {
            removeTicket();
            lastTicketShown == "";
          } else if (ticketIsClicked && lastTicketShown != ticket.issue) {
            removeTicket();
            createTicket(ticket);
          }
        }
      });
    })
  );
}

function createTicket(ticket) {
  let newHeader = document.createElement("h5");
  let newPar = document.createElement("p");

  newHeader.className = "card-title";
  newHeader.id = "issueDescriptionLabel";

  newPar.className = "card-text";
  newPar.id = "ticketDescription";

  let issueText = ticket.issue;
  let textIssue = document.createTextNode(issueText);

  let topicText = ticket.topic;
  topicNode = document.createTextNode(topicText);

  newHeader.appendChild(topicNode);
  newPar.appendChild(textIssue);

  ticketCard.appendChild(newHeader);
  ticketCard.appendChild(newPar);

  ticketIsClicked = true;
  lastTicketShown = issueText;
  issueDescriptionContainer.style.display = "";
}

function removeTicket() {
  let ticketDescription = document.querySelector("#ticketDescription");
  ticketDescription.remove();
  let ticketHeader = document.querySelector("#issueDescriptionLabel");
  ticketHeader.remove();

  ticketIsClicked = false;
  if (issueDescriptionContainer.style.display === "none") {
    issueDescriptionContainer.style.display = "";
  } else issueDescriptionContainer.style.display = "none";
}

function createDataTable(ticketUrl) {
  if (!dataTableIsClicked) {
    fetch(ticketUrl)
      .then(response => response.json())
      .then(tickets => {
        tickets.forEach(ticket => {
          let newTableRow = document.createElement("tr");

          let prjName = document.createElement("td");
          let userName = document.createElement("td");
          let userRole = document.createElement("td");
          let topic = document.createElement("td");
          let submitDate = document.createElement("td");
          let submitTime = document.createElement("td");
          let status = document.createElement("td");

          let projText = ticket.projectName;
          let userText = ticket.userName;
          let roleText = ticket.userRole;
          let topicText = ticket.topic;
          let dateText = ticket.submitDate;
          let timeText = ticket.submitTime;
          let statusText = ticket.issueStatus;

          let linkToTicketDescription = document.createElement("a");
          linkToTicketDescription.href = "#";

          let textProj = document.createTextNode(projText);
          let textUser = document.createTextNode(userText);
          let textRole = document.createTextNode(roleText);
          let textTopic = document.createTextNode(topicText);
          let textDate = document.createTextNode(dateText);
          let textTime = document.createTextNode(timeText);
          let textStatus = document.createTextNode(statusText);

          linkToTicketDescription.appendChild(textTopic);

          linkToTicketDescription.addEventListener("click", function(event) {
            event.preventDefault();
            showTicket(topicText);
          });

          prjName.appendChild(textProj);
          userName.appendChild(textUser);
          userRole.appendChild(textRole);
          topic.appendChild(linkToTicketDescription);
          submitDate.appendChild(textDate);
          submitTime.appendChild(textTime);
          status.appendChild(textStatus);

          newTableRow.appendChild(prjName);
          newTableRow.appendChild(userName);
          newTableRow.appendChild(userRole);
          newTableRow.appendChild(topic);
          newTableRow.appendChild(submitDate);
          newTableRow.appendChild(submitTime);
          newTableRow.appendChild(status);

          newTableRow.className = "newTableRow";

          ticketTableBody.appendChild(newTableRow);

          dataTableIsClicked = true;
        });
      });
  } else {
    removeDataTable();
  }
}

function removeDataTable() {
  document.querySelectorAll(".newTableRow").forEach(row => {
    row.remove();
  });
  if (ticketIsClicked == true) {
    removeTicket();
  }
  dataTableIsClicked = false;
}

function addNewTicket(ticket) {
  fetch(API_ALL_TICKETS_URL, {
    method: "POST",
    body: JSON.stringify(ticket),
    headers: {
      "content-type": "application/json"
    }
  });
  showDataTableAfterPosting();
}

function showDataTableAfterPosting() {
  removeDataTable();
  setTimeout(function() {
    if (lastStatusShown === "#openArrow") {
      createDataTable(API_OPEN_TICKET_URL);
    } else if (lastStatusShown === "#inProgressArrow") {
      createDataTable(API_IN_PROGRESS_TICKET_URL);
    } else if (lastStatusShown === "#resolvedArrow") {
      createDataTable(API_RESOLVED_TICKET_URL);
    }
  }, 100);
}

/*form.addEventListener(
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
);*/

function listAllTickets() {
  fetch(API_ALL_TICKETS_URL)
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

        let ticketList = document.querySelector(".ticketList");
        ticketList.appendChild(newTicket);
      });
    });
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
    checkDate(today.getHours()) +
    today.getHours() +
    ":" +
    checkDate(today.getMinutes()) +
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

/*var newTicket = document.createElement("li");
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

  ticketList.appendChild(newTicket);*/
