$(document).ready(function(){
   
     $(".btn-singn-in").click(function(event){
       
        event.preventDefault();

        let email = $(".input-email").val();
        let password = $(".input-password").val();    
        
         console.log("AQUI")
         console.log(email)
         console.log(password)
         
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(function(response){
                console.log(response)
                var uid = response.user.uid;
                //window.location = "home.html?userId=" + uid;
                window.location.assign("home.html?userId=" + uid);
            })
            .catch(function(error) {
                catcherror(error);
            });
        
        // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
        // // When the user signs in with email and password.
        // firebase.auth().signInWithEmailAndPassword(email, password)
        //     .then(user => {
        //         console.log(user);
        //     // Get the user's ID token as it is needed to exchange for a session cookie.
        //      return user.getIdToken().then(idToken => {
        //             // Session login endpoint is queried and the session cookie is set.
        //             // CSRF protection should be taken into account.
        //             // ...
        //         const csrfToken = getCookie('csrfToken')
        //         return postIdTokenToSessionLogin('/sessionLogin', idToken, csrfToken);
        //     });
        //     // })
        //     // .then(() => {
        //     // // A page redirect would suffice as the persistence is set to NONE.
        //     // return firebase.auth().signOut();
        //     // })
        //     // .then(() => {
        //     // window.location.assign('home.html');
        //     });
    });


    $('.btn-authFacebook').click(authFacebook);

    $('.btn-authTwitter').click(authTwitter);

    $('.btn-authGoogle').click(authGoogle);
})

function authFacebook(){
    var provider = new firebase.auth.FacebookAuthProvider();
    signIn(provider);
}

function authTwitter(){
    var provider = new firebase.auth.TwitterAuthProvider();
    signIn(provider);
}

function authGoogle(){
    var provider = new firebase.auth.GoogleAuthProvider();
    signIn(provider);
}

function signIn(provider) {
    firebase.auth()
        .signInWithPopup(provider)
        .then(function (response) {
            console.log(response);
            // var token = response.credential.accessToken;
            var uid = response.user.uid;
            window.location = "home.html?userId=" + uid;
        }).catch(function (error) {
            catcherror(error);
        });
}

function catcherror(error) {
    alert(error.message);
    console.log(error.code, error.message);
}

