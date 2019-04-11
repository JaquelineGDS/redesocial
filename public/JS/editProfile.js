const database = firebase.database();
$(document).ready(function(){
    observador()
})

function observador(){
    
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
       
        if(user != null){ 
            const uid = user.uid;
            $(".form-edit-profile").submit(function(event){
                event.preventDefault();
                let userPhoto = $('.photo').val();
                let userName = $('input[name="name"]').val();
                let userLastName = $('input[name="last-name"]').val();
                let NameUser = $('input[name="user-name"]').val();
                console.log(userName)
               dataBaseUpdateUser(userPhoto, userName, userLastName, NameUser, uid);
            });
        }
        } else {
            console.log('nao tem usuario online');
        }
    });
}

function dataBaseUpdateUser(userPhoto, userName, userLastName, NameUser, uid) {
    database.ref(`user/`+ uid).set({
        photoURL: userPhoto,
        displayName: userName, 
        userLastName, userLastName,
        NameUser, NameUser
    })
    .then(function() {

        redirectToTasks(uid);
    })

}


function redirectToTasks(uid){
    window.location = "home.html?id=" + uid;
}