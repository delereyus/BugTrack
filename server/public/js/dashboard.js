function lastOpenedTicket() {
  
}










getUserIds();

function getUserIds() {
  fetch(process.env.AUTH0_USERS).then(response =>
    response.json().then(users => {
      users.forEach(user => {
        console.log(user.user_id);
      });
    })
  );
}
