var database = firebase.database();
var USER_ID = window.location.search.match(/\?id=(.*)/)[1];
console.log(USER_ID);
$(document).ready(function () {
    getTasksFromDB ()    
    $(".add-posts").click(addPostClick);
    $(".nav-link-signOut").click(signOut);
});

function getTasksFromDB (){
    database.ref("posts/" + USER_ID).once('value')
        .then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                createPost(childData.text, childKey)                 
            });
        });
}

function addPostClick(event){
    event.preventDefault();

    var newTask = $(".posts-input").val();
    var taskFromDB = addPostToDB(newTask);
    createPost(newTask, taskFromDB.key) 
}

function addPostToDB(text){
    return database.ref("posts/" + USER_ID).push({
        text: text
    });
}

function createPost(text, key) {

   // var txt2 = $("<textarea></textarea>").text(text);
    
    let template =
        `<div class="card" data-div-id=${key}>
            <div class="card-header bkg-bkg">
                <input type="button" value="Delete" data-delete-id=${key} />
                <input type="button" value="Edit" data-edit-id=${key} />
            </div>
            <div class="card-body">
            <textarea class="card-text posts-input" data-text-id=${key}>${text}</textarea>
            </div>        
    </div>`
    // $(`textarea[data-text-id="${key}]`).text(text);

    $(".tasks-list").append(template)

    // $(`input[data-delete-id="${key}"]`).click(function () {
    //     database.ref("posts/" + USER_ID + "/" + key).remove();
    //     $(`.card[data-div-id=${key}]`).remove();
    // });

    $(`input[data-delete-id="${key}"]`).click(function () {
        var acao = confirm("Tem certeza que deseja excluir esse post?")
        if (acao) {
            database.ref("posts/" + USER_ID + "/" + key).remove();
            $(this).parent().remove();
        }
        else {
            event.preventDefault();
        }
    });

    $(`input[data-edit-id="${key}"]`).click(function () {
        var editedText = prompt(`Edite seu texto: ${text}`);
        $(`textarea[data-text-id=${key}]`).val(editedText);
        database.ref("posts/" + USER_ID + "/" + key).update({
            text: editedText
        });

    });
}
    
function signOut(){
    firebase.auth().signOut()
    .then(function() {
        window.location = "home.html"
    })
    .catch(function(error) {
        console.log(error);
    })
}