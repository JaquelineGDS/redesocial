$(document).ready(function(){
    // auth EmailAndPassword
    $(".btn-singn-in").click(signInClick);
     // auth redes socials
    $('.btn-authGoogle').click(authGoogle);
})

 //login authEmailAndPassword
function signInClick(event) {
    event.preventDefault();
    let email = $(".input-email").val();
    let password = $(".input-password").val();
    signInUser(email, password)    
}

function signInUser(email, password){
    firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
        .then(function (response) {
            let userId = response.user.uid;
            redirectToTasks(userId);
        })
        .catch(function (error) {
            handleError(error);            
        });
}
 //login com redes socials

function authGoogle(){
    let provider = new firebase.auth.GoogleAuthProvider();
    signIn(provider);
}

 //chamando as functions
function signIn(provider) {
    firebase.auth()
        .signInWithPopup(provider)
        .then(function (response) {
            let userId = response.user.uid;
            redirectToTasks(userId);
        }).catch(function (error) {
            handleError(error);  
        });
}

function handleError(error){
    alert(error.message);
    console.log(error.code, error.message);
}

function redirectToTasks(userId){
    window.location = "home.html?id=" + userId;
}