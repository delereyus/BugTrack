const AUTH0_USERS = "http://localhost:5005/getUsers";

getUserIds();

function getUserIds() {
  fetch(AUTH0_USERS).then(response =>
    response.json().then(users => {
      users.forEach(user => {
        console.log(user.user_id);
      });
    })
  );
}
