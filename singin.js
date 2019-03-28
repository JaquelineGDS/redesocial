$(document).ready(function(){
   
     $(".btnSingnIn").click(function(event){
       
        event.preventDefault();

        let inputEmail = $(".InputEmail1").val();
        let inputPassword = $(".InputPassword1").val();    
        
         console.log("AQUI")
         console.log(inputEmail)
         console.log(inputPassword)
         
        firebase
            .auth()
            .signInWithEmailAndPassword(inputEmail, inputPassword)
            .then(function(){
                alert('Bem vindo '+ InputEmail1);
            })
            .catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.error(errorCode);
                console.error(errorMessage);
                alert('Falha ao acessar, '+ errorMessage);
        });
    });
})
 