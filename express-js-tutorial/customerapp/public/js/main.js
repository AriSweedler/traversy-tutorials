
const deleteUserBtns = document.querySelectorAll('.delete-user-btn');

for (const button of deleteUserBtns) {
  button.addEventListener('click', () => {
    console.log(`Deleting user: ${button.id}`);
    //confirm("Are you sure?")
    if(1) {
      // console.log("Delete user here");
      // console.log("Sending an AJAX request to delete the user");
      var xhttp = new XMLHttpRequest();
      var url = `http://localhost:3000/users/delete/${button.id}`
      xhttp.open("DELETE", url, true);
      xhttp.send();
      // window.location.replace('/');
      // window.location.reload();
    }
  });
}