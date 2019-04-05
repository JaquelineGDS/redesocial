const database = firebase.database();

$(document).ready(function(){
    $(".btn-singn-up").click(createUser);
})

function catcherror(error) {
    alert(error.message);
    console.log(error.code, error.message);
}

function signUpClick(event) {
    event.preventDefault();
    let email = $(".input-email").val();
    let password = $(".input-password").val(); 
    createUser(email, password)
};

function createUser(email, password){
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function (response) {
        let userId = response.user.uid;
        redirectToTasks(userId);
        createUserBD(userId, email)
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

function handleError(error){
    alert(error.message);
    console.log(error.code, error.message);
}

function redirectToTasks(userId){
    window.location = "home.html?id=" + userId;
}