  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAsPDjZ4dAT3ujmyV-gPrYhnADYDnK-AJs",
    authDomain: "lovpets-3d183.firebaseapp.com",
    databaseURL: "https://lovpets-3d183.firebaseio.com",
    projectId: "lovpets-3d183",
    storageBucket: "",
    messagingSenderId: "540663191738"
  };
  firebase.initializeApp(config);


//input
let InputEmail1 = document.querySelector('#InputEmail1');
let InputPassword1 = document.querySelector('#InputPassword1');

// //btn
const btnSingIn = document.querySelector('.btnSingIn');
const btnSingUp = document.querySelector('.btnSingUp');

 // $(".btnSingUp")
  
  
 btnSingUp.addEventListener('click', function (event){
     event.preventDefault();
     console.log("AQUI")
    firebase
        .auth()
        .createUserWithEmailAndPassword(InputEmail1.value, InputPassword1.value)
        .then(function(){
            alert('Bem vindo '+ InputEmail1.value );
        })
        .catch(function(error) {
            console.error(error.code);
            console.error(error.message);
            alert('Falha ao cadastrar, verifique o erro no console');
      });
  });


  btnSingIn.addEventListener('click', function(event){
    event.preventDefault();
    console.log("AQUI");

    firebase
        .auth()
        .signInWithEmailAndPassword(InputEmail1.value, InputPassword1.value)
        .then(function(result){
            console.log(result);
            alert('Autenticado ' + InputEmail1.value);
        })
        .catch(function(error){
            console.error(error.code);
            console.error(error.message);
            alert('Falha ao autenticar, verifique o erro no console');
      });
  });