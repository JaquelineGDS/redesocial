// Get a reference to the database service
var database = firebase.database();

$(document).ready(function(){
      
    let collectionPost = database.ref('user/post/')
      collectionPost.once('value')
      .then(function(snapshot) {
        snapshot.forEach(childSnapshot => {
          var chilKey = childSnapshot.key;
          var chilVal = childSnapshot.val();
          $('.txt-list-Post').append(`<li>${chilVal.text}</li>`);
        });
 
      })
    
    $(".btn-post").click(function(event){
        event.preventDefault();

        //input
        let txtPost = $('.txt-post').val();
          database.ref('user/post/').push({
            text: txtPost,
          }); 
    })

    $('.btn-nav-link').click(function(){
      firebase.auth().signOut()
      .then(function() {
        alert('Sign-out successful');
        window.location = "index.html"

      })
      .catch(function(error) {
        console.log(error);
      })
    })
})

// collectionPost.once('value', function(childSnapshot) {
//   var Snapshot = childSnapshot.val();
//   $('.txt-list-Post').html= '';
   
//   Object.keys(Snapshot).forEach(key => {
 
//     $('.txt-list-Post').append(`<li>${Snapshot[key].text}</li>`);
//   })

// });
