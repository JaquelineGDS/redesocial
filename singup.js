$(document).ready(function(){
   
    $(".btnSingnUp").click(function(event){
      
       event.preventDefault();

       var inputEmail = $(".InputEmail1").val();
       var inputPassword = $(".InputPassword1").val();    
       
        
        firebase
            .auth()
            .createUserWithEmailAndPassword(inputEmail, inputPassword)
            .then(function(){
                alert('Bem vindo ', InputEmail);
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