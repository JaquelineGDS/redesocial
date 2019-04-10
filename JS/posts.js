var database = firebase.database();
var USER_ID = window.location.search.match(/\?id=(.*)/)[1];
console.log(USER_ID);

var postType = "publico";

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
                createPost(childData.text, childKey,childData.postType)                 
            });
        });
}

function getTasksFilterFromDB (type){
    $(".tasks-list").remove();
    database.ref("posts/" + USER_ID).orderByChild("postType").equalTo(type)
        .once('value').then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                createPost(childData.text, childKey, childData.postType)                 
            });
        });
}

function addPostClick(event){
    event.preventDefault();

    var newTask = $(".posts-input").val();
    var taskFromDB = addPostToDB(newTask);
    createPost(newTask, taskFromDB.key, postType) 
}

function addPostToDB(text){
    return database.ref("posts/" + USER_ID).push({
        text: text,
        postType: postType
    });
}

function createPost(text, key, type) {

   // var txt2 = $("<textarea></textarea>").text(text);
    
    let template =
        `
        <div class="tasks-list" data-div-id=${key}>
            <div class="card">
                <div class="card-header bkg-bkg">
                    <input type="button" value="Delete" data-delete-id=${key} />
                    <label for="" data-text-id=${key}>${type}</label>
                    <input type="button" value="Edit" data-edit-id=${key} />
                </div>
                <div class="card-body">
                <textarea class="card-text posts-input" data-text-id=${key}>${text}</textarea>
                </div>        
            </div>
        </div>
        `

    $(".task-list").append(template)

    $(`input[data-delete-id="${key}"]`).click(function () {
        var acao = confirm("Tem certeza que deseja excluir esse post?")
        if (acao) {
            database.ref("posts/" + USER_ID + "/" + key).remove();
            $(`.tasks-list [data-div-id=${key}]`).remove();
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

//Filtro
$('a[href="#publico"]').click(function(){
    postType = "publico"
    $("#btn-privacidade").html('Público');
    console.log(postType);
});
$('a[href="#publico-filtro"]').click(function(){
    getTasksFilterFromDB ("publico");
});

$('a[href="#amigos"]').click(function(){    
    postType = "amigos"
    $("#btn-privacidade").html('Amigos');
    console.log(postType);
});
$('a[href="#amigos-filtro"]').click(function(){
    getTasksFilterFromDB ("amigos");
});

$('a[href="#privado"]').click(function(){
    postType = "privado"
    $("#btn-privacidade").html('Privado');
    console.log(postType);
});
$('a[href="#privado-filtro"]').click(function(){
    getTasksFilterFromDB ("privado");
});


$('a[href="#todos-filtro"]').click(function(){
    getTasksFromDB ();
});

    
function signOut(){
    firebase.auth().signOut()
    .then(function() {
        window.location = "singin.html"
    })
    .catch(function(error) {
        console.log(error);
    })
}