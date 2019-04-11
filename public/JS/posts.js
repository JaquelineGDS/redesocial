var database = firebase.database();
var USER_ID = window.location.search.match(/\?id=(.*)/)[1];
console.log(USER_ID);

var postType = "publico";

$(document).ready(function () {
    console.log('entrou ready')
    getTasksFromDB(); 
    $(".add-posts").click(addPostClick);
    $(".nav-link-signOut").click(signOut);
});

function getTasksFromDB (){
    console.log('entrou fromDB')
    database.ref("posts/" + USER_ID).once('value')
        .then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                let childKey = childSnapshot.key;
                let childData = childSnapshot.val();
                createPost(childData.text, childKey,childData.postType, childData.like)                 
            });
        });
}

function getTasksFilterFromDB (type){
    console.log('entrou filter')
    $(".tasks-list").remove();
    database.ref("posts/" + USER_ID).orderByChild("postType").equalTo(type)
        .once('value').then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                let childKey = childSnapshot.key;
                let childData = childSnapshot.val();
                createPost(childData.text, childKey, childData.postType, childData.like)                 
            });
        });
}

function addPostClick(event){
    event.preventDefault();
    let like=0;
    let newTask = $(".posts-input").val();
    let taskFromDB = addPostToDB(newTask);
    createPost(newTask, taskFromDB.key, postType, like) 
}

function addPostToDB(text){
    console.log('post fromDB')
    return database.ref("posts/" + USER_ID).push({
        text: text,
        postType: postType,
        like: 0
    });
}

function createPost(text, key, type, like) {
    console.log(text, key, type, like)
   
   template = `
        <div class="list-post" data-div-id=${key}>
            <div class="card mb-2"  data-div-id=${key}>
                <div class="card-header bkg-bkg">
                    <input type="button" value="Delete" data-delete-id=${key} />
                    <input type="button" value="Edit" data-edit-id=${key} />
                    <input type="button" value="salvar" style="display: none;" data-salve-id=${key} />
                </div>
                <div class="card-body">
                    <p class="card-text posts-input" data-text-id=${key}>${text}</p>
                </div>
                <div class="card-footer bkg-bkg">
                    <form id="like-form">
                        <button data-like-id=${key} data-count-id=${like} class="like-button">${like} Likes</button>
                    </form>
                    <label for="" data-text-id=${key}>${type}</label>
                </div>
            </div>
        </div>
        `

   $(".list-posts").prepend(template)

    $(`input[data-delete-id="${key}"]`).click(function () {
        var acao = confirm("Tem certeza que deseja excluir esse post?")
        if (acao) {
            database.ref("posts/" + USER_ID + "/" + key).remove();
            $(`.list-post[data-div-id=${key}]`).remove();
        }
        
    });

    $(`input[data-edit-id="${key}"]`).click(function () {
        console.log('entrou editar');

        $(`input[data-edit-id="${key}"]`).hide();
        $(`input[data-delete-id="${key}"]`).hide();
        $(`input[data-salve-id="${key}"]`).show();
        console.log('entrou input[data-salve-id');
        $(`p[data-text-id="${key}"]`).attr('contenteditable', 'true').focus();
        console.log('entrou attr');

            $(`input[data-salve-id="${key}"]`).click(function() {
                console.log('entrou salvar');

                $(`input[data-salve-id="${key}"]`).hide();
                $(`input[data-edit-id="${key}"]`).show();
                $(`input[data-delete-id="${key}"]`).show();
                
                var editedText = $(`p[data-text-id="${key}"]`).html();
                console.log(editedText);
                database.ref("posts/" + USER_ID + "/" + key).update({
                    text: editedText
                });
                console.log('salcvou bd');

                $(`p[data-text-id="${key}"]`).html(editedText);
                $(`p[data-text-id="${key}"]`).attr('contenteditable', 'false');
                console.log('editou');
            })  
    });
    $(`button[data-like-id="${key}"]`).click(function () {
        event.preventDefault();
        var count = $(this).data("count-id")
        count += 1
        $(this).data("count-id", count)
        $(this).html(count + ' Likes')

        database.ref("posts/" + USER_ID + "/" + key).update({
            like: count
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
        window.location = "index.html"
    })
    .catch(function(error) {
        console.log(error);
    })
}