var database = firebase.database();

$(document).ready(function(){
    $(".btn-singn-up").click(createUser);
})

function createUser(event){     
    event.preventDefault();

    var email = $(".input-email").val();
    let name = $(".input-name").val();
    let lastName = $(".input-last-name").val();
    let password = $(".input-password").val(); 
    let photo = $(".input-file").val(); 
     firebase
         .auth()
         .createUserWithEmailAndPassword(email, password)
         .then(function(response){
             console.log(response)
             var uid = response.user.uid;
             createUserBD(uid, email, name, lastName, photo);
             window.location = "home.html?userId=" + uid;
         })
         .catch(function(error) {
            catcherror(error);
         });
 }

 function catcherror(error) {
    alert(error.message);
    console.log(error.code, error.message);
}

function createUserBD(uid, email, name, lastName, photo) {
    database.ref('users/' + uid).set({
        email: email,
        name: name,
        lastName: lastName,
        photo: photo
    })
}