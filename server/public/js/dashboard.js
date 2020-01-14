const AUTH0_USERS = "http://localhost:5005/getUsers";
const AUTH0_ROLES = "http://localhost:5005/getRoles";

getUserIds();

function getRole() {
  fetch(AUTH0_ROLES).then(response =>
    response.json().then(users => {
      users.forEach(user => {
        console.log(user.user_id);
      });
    })
  );
}

function getUserIds() {
  fetch(AUTH0_USERS).then(response =>
    response.json().then(users => {
      users.forEach(user => {
        console.log(user.user_id);
      });
    })
  );
}
