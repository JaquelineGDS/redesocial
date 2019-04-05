const database = firebase.database();

$(document).ready(function(){
    $(".btn-singn-up").click(signUnClick);
})
function signUnClick(event) {
    event.preventDefault();
    let email = $(".input-email").val();
    let password = $(".input-password").val();
    signUpUser(email, password)    
}
function signUpUser(email, password){
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function (response) {
        let userId = response.user.uid;
        createUserBD(userId, email);
        redirectToTasks(userId);
    })
    .catch(function (error) {
        handleError(error)
    });
}

function createUserBD(userId, email) {
    database.ref('users/' + userId).set({
        email: email,
    })
}

function redirectToTasks(userId){
    window.location = "home.html?id=" + userId;
}

function handleError(error){
    alert(error.message);
    console.log(error.code, error.message);
}