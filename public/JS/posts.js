var database = firebase.database();
var USER_ID = window.location.search.match(/\?id=(.*)/)[1];
console.log(USER_ID);

$(document).ready(function () { 
    filterSelect(); 
    $('.nav-link-signOut').click(signOut)
    $(".add-posts").click(addPostClick)
    $(".filter-privacy").change(filterSelect);
    observador();
});

function observador(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
         if(user != null){
            var email = user.email;
            var emailVerified = user.emailVerified;
            var uid = user.uid;
            let profilePicUrl = getUserPhotoURL();
            console.log(profilePicUrl)
            $(".nameUser").html(email);
            $(".img-user").css('background-image', 'url(img/ni.jpg)');
            $(".photoUser").css('background-image', 'url(' + profilePicUrl + ')');
         }
        }
    })
}

function addPostClick(event){
    console.log("addpostclick")
    event.preventDefault();
    let like = 0;
    let newtext = $(".posts-input").val();
    let postType = $(".privacyPost").val();
    getdataPost(newtext, postType, like);
    $(".posts-input").val("");
}

function getdataPost(newtext, postType, like){
    console.log("getdataPost")
    let postsFromDB = addPostToDB(newtext, postType, like);
    createPost(newtext, postsFromDB.key, postType, like );
}

function addPostToDB(newtext, postType, like){
    console.log("addPostToDB")
    return database.ref("posts/" + USER_ID).push({
            text: newtext,
            postType: postType,
            like: like
    });
}

function createPost(text, key, type, like) {
   template = `
        <div class="list-post" data-div-id=${key}>
            <div class="card mb-2"  data-div-id=${key}>
                <div class=" d-flex  align-items-end background-green">
                    <button class="btn" value="Delete" data-delete-id=${key}><i class="fas fa-trash-alt"></i> </button>
                    <button class="btn" value="Edit" data-edit-id=${key}><i class="fas fa-edit"></i></button> 
                    <button class="btn" value="salvar" style="display: none;" data-salve-id=${key}><i class="fas fa-save"></i> </button>
                </div>
                <div class="card-body">
                    <p class="card-text posts-input" data-text-id=${key}>${text}</p>
                </div>
                <div class="card-footer bkg-bkg">
                    <form id="like-form">
                        <button class="btn" data-like-id=${key} data-count-id=${like} class="like-button"><i class="fab fa-gratipay"></i>${like}</button>
                    </form>
                    <span data-text-id=${key}>${type}<span>
                </div>
            </div>
        </div>
        `
   $(".list-posts").prepend(template)

   deletePost(key);
   editPost(key);
   likePost(key);
}

function deletePost(key){
    $(`button[data-delete-id="${key}"]`).click(function () {
        var acao = confirm("Tem certeza que deseja excluir esse post?")
        if (acao) {
            database.ref("posts/" + USER_ID + "/" + key).remove();
            $(`.list-post[data-div-id=${key}]`).remove();
        }
        
    });
}

function editPost(key){
    $(`button[data-edit-id="${key}"]`).click(function () {
        console.log('entrou editar');

        $(`button[data-edit-id="${key}"]`).hide();
        $(`button[data-delete-id="${key}"]`).hide();
        $(`button[data-salve-id="${key}"]`).show();
        console.log('entrou button[data-salve-id');
        $(`p[data-text-id="${key}"]`).attr('contenteditable', 'true').focus();
    
            $(`button[data-salve-id="${key}"]`).click(function() {
            
                $(`button[data-salve-id="${key}"]`).hide();
                $(`button[data-edit-id="${key}"]`).show();
                $(`button[data-delete-id="${key}"]`).show();
                
                var editedText = $(`p[data-text-id="${key}"]`).html();

                database.ref("posts/" + USER_ID + "/" + key).update({
                    text: editedText
                });
                
                $(`p[data-text-id="${key}"]`).html(editedText);
                $(`p[data-text-id="${key}"]`).attr('contenteditable', 'false');
            
            })  
    });
}

function likePost(key){
    $(`button[data-like-id="${key}"]`).click(function () {
        event.preventDefault();
        var count = $(this).data("count-id")
        count += 1
        $(this).data("count-id", count)
        $(this).html( `<i class="fab fa-gratipay"></i>` + count)

        database.ref("posts/" + USER_ID + "/" + key).update({
            like: count
        });
    });
}

// filter
function filterSelect(){
    let selectPrivacy = $(".filter-privacy").val();
    console.log(selectPrivacy)
    if(selectPrivacy == "todos"){
        getPostsFromDB();
    }else{
        getPostFilterFromDB(selectPrivacy);
    }
  }

  function getPostsFromDB(){
    $(".list-posts").html("");
    database.ref("posts/" + USER_ID).once('value')
 
        .then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                let childKey = childSnapshot.key;
                let childData = childSnapshot.val();
                createPost(childData.text, childKey,childData.postType, childData.like)                 
            });
        });
}

function getPostFilterFromDB(selectPrivacy){
    $(".list-posts").html("");
    database.ref("posts/" + USER_ID).orderByChild("postType").equalTo(selectPrivacy)
        .once('value').then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                let childKey = childSnapshot.key;
                let childData = childSnapshot.val();
                console.log(childData.text, childKey, childData.postType, childData.like); 
                createPost(childData.text, childKey, childData.postType, childData.like);
            });
        });
}
// signOut
function signOut(){
    firebase.auth().signOut()
    .then(function() {
        window.location = "index.html"
    })
    .catch(function(error) {
        console.log(error);
    })
}

function getUserPhotoURL(){
    return firebase.auth().currentUser.photoURL || 'img/ni.jpg';
}