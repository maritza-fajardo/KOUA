//  Declare SQL Query for SQLite
 
var createStatement = "CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT, user_name varchar(50), email varchar(50), password varchar(15), phone varchar(30), cellphone varchar(30), address varchar(150), type varchar(10))";
 
var selectAllStatement = "SELECT * FROM Users";
 
var insertStatement = "INSERT INTO Users (user_name, email, password, phone, cellphone, address, type) VALUES (?,?,?,?,?,?,?)";

var loginStatement = "SELECT * FROM Users WHERE email = ? AND password = ?";
 
var updateStatement = "UPDATE Users SET user_name = ?, email = ?, password = ?, phone=?, cellphone=?, address=?, type=? WHERE id=?";
 
var deleteStatement = "DELETE FROM Users WHERE id=?";
 
var dropStatement = "DROP TABLE Users";
 
 var db = openDatabase("UsersBook", "2.0", "Users Book", 200000);  // Open SQLite Database
 
var dataset;
 
var DataType;

var onloadDone;
 
 function initDatabase()  // Function Call When Page is ready.
 
{
 
 //alert("Entro a crear la base de datos");
    try {
 
        if (!window.openDatabase)  // Check browser is supported SQLite or not.
 
        {
 
            alert('Databases are not supported in this browser.');
 
        }
 
        else {
 
            onloadDone = false;
            createTable();  // If supported then call Function for create table in SQLite
 
        }
 
    }
 
    catch (e) {
 
        if (e == 2) {
 
            // Version number mismatch. 
 
            console.log("Invalid database version.");
 
        } else {
 
            console.log("Unknown error " + e + ".");
 
        }
 
        return;
 
    }
 
}
 
function createTable()  // Function for Create Table in SQLite.
 
{
  //checar porque solo cuando se carga la pantalla se ejecuta dos veces la funcion show records y por eso muestra doble registro
    db.transaction(function (tx) { tx.executeSql(createStatement, [], showRecords, onError); });
 
}
 
function insertRecord() // Get value from Input and insert record . Function Call when Save/Submit Button Click..
 
{

        var user_nametemp = $('input:text[id=user_name]').val();
        var emailtemp = $('input:text[id=email]').val();
        var passwordtemp = $('input:text[id=password]').val();
        var phonetemp = $('input:text[id=phone]').val();
        var cellphonetemp = $('input:text[id=cellphone]').val();
        var addresstemp = $('input:text[id=address]').val();
        var typetemp = $('input:text[id=type]').val();

        db.transaction(function (tx) { tx.executeSql(insertStatement, [user_nametemp, emailtemp, passwordtemp,phonetemp,cellphonetemp,addresstemp,typetemp], loadAndReset, onError); });
 
        //tx.executeSql(SQL Query Statement,[ Parameters ] , Sucess Result Handler Function, Error Result Handler Function );
 
}
 
function deleteRecord(id) // Get id of record . Function Call when Delete Button Click..
 
{
 
    var iddelete = id.toString();
 
    db.transaction(function (tx) { tx.executeSql(deleteStatement, [id], showRecords, onError); alert("Delete Sucessfully"); });
 
    resetForm();
 
}
 
function updateRecord() // Get id of record . Function Call when Delete Button Click..
 
{
 
    var user_nameupdate = $('input:text[id=user_name]').val().toString();
    var emailupdate = $('input:text[id=email]').val().toString();
    var passwordupdate = $('input:text[id=password]').val().toString();
    var phoneupdate = $('input:text[id=phone]').val().toString();
    var cellphoneupdate = $('input:text[id=cellphone]').val().toString();
    var addressupdate = $('input:text[id=address]').val().toString();
    var typeupdate = $('input:text[id=type]').val().toString();
 
    var useridupdate = $("#id").val();
 
    db.transaction(function (tx) { tx.executeSql(updateStatement, [user_nameupdate, emailupdate, passwordupdate,phoneupdate,cellphoneupdate, addressupdate, typeupdate, Number(useridupdate)], loadAndReset, onError); });
    onloadDone = false; 
}
 
function dropTable() // Function Call when Drop Button Click.. Talbe will be dropped from database.
 
{
 
    db.transaction(function (tx) { tx.executeSql(dropStatement, [], showRecords, onError); });
 
    resetForm();
 
    initDatabase();
 
}
 
function loadRecord(i) // Function for display records which are retrived from database.
 
{

    var item = dataset.item(i);
 
    $("#user_name").val((item['user_name']).toString());
    $("#email").val((item['email']).toString());
    $("#password").val((item['password']).toString());
    $("#phone").val((item['phone']).toString());
    $("#cellphone").val((item['cellphone']).toString());
    $("#address").val((item['address']).toString());
    $("#type").val((item['type']).toString());

    $("#id").val((item['id']).toString());
 
}
 
function resetForm() // Function for reset form input values.
 
{

    $("#user_name").val("");
    $("#email").val("");
    $("#password").val("");
    $("#phone").val("");
    $("#cellphone").val("");
    $("#address").val("");
    $("#type").val("");

    $("#id").val("");
 
}
 
function loadAndReset() //Function for Load and Reset...
 
{
 
    resetForm();
 
    showRecords();
 
}
 
function onError(tx, error) // Function for Hendeling Error...
 
{
 
    alert(error.message);
 
}
 
function login(id) // Get id of record . Function Call when Delete Button Click..
 
{
 
        var emailtemp = $('input:text[id=email]').val();
        var passwordtemp = $('input:text[id=password]').val();
        db.transaction(function (tx) { tx.executeSql(loginStatement, [emailtemp,passwordtemp],  function(tx, result){ // <-- this is where you forgot tx
            
      

            if(result.rows.length > 0)
            {
               document.location.href=("listado_usuarios.html");
            }
            else
            {
            alert("Correo y/o contraseña invalido");

            }

        }, onError); });

 
    resetForm();
 
}

function showRecords() // Function For Retrive data from Database Display records as list
 
{
 

    $("#results").html('<ul class="list">');
 
    db.transaction(function (tx) {
 
        tx.executeSql(selectAllStatement, [], function (tx, result) {
         if( onloadDone == false)
         {
            dataset = result.rows;
 
            for (var i = 0, item = null; i < dataset.length; i++) {
 
                item = dataset.item(i);
           

                var linkeditdelete = '<li class="item">' + item['id'] + '   ' + '<a href="#" onclick="loadRecord(' + i + ');">Editar</a>' + '    ' +
 
                                            '<a href="#" onclick="deleteRecord(' + item['id'] + ');">Eliminar</a></li>';
 
                $("#results").append(linkeditdelete);
 
            }
  $("#results").append('</ul>');
              onloadDone = true;
            }
        });
 
    });

    

 
}
 
$(document).ready(function () // Call function when page is ready for load..
 
{
;
 
    $("body").fadeIn(2000); // Fede In Effect when Page Load..
 
    initDatabase();
 
    $("#submitButton").click(insertRecord);  // Register Event Listener when button click.
 
    $("#btnUpdate").click(updateRecord);
 
    $("#btnReset").click(resetForm);
 
    $("#btnDrop").click(dropTable);
 
});
 