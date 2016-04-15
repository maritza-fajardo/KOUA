//  Declare SQL Query for SQLite
 
var createStatement = "CREATE TABLE IF NOT EXISTS Favorites (id INTEGER PRIMARY KEY AUTOINCREMENT, id_user TEXT, id_product TEXT)";
 
var selectAllStatement = "SELECT * FROM Favorites";
 
var insertStatement = "INSERT INTO Favorites (id_user TEXT, id_product TEXT) VALUES (?,?)";
 
var updateStatement = "UPDATE Favorites SET id_user = ?, id_product = ? WHERE id=?";
 
var deleteStatement = "DELETE FROM Favorites WHERE id=?";
 
var dropStatement = "DROP TABLE Favorites";
 
var db = openDatabase("FavoritesBook", "2.0", "Favorites Book", 200000);  // Open SQLite Database
 
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

        var id_usertemp = $('input:text[id=id_user]').val();
        var id_producttemp = $('input:text[id=id_product]').val();

        db.transaction(function (tx) { tx.executeSql(insertStatement, [id_usertemp, id_producttemp], loadAndReset, onError); });
 
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
 
    var id_userupdate = $('input:text[id=id_user]').val().toString();
    var id_productupdate = $('input:text[id=id_product]').val().toString();

    var favoriteidupdate = $("#id").val();
 
    db.transaction(function (tx) { tx.executeSql(updateStatement, [id_userupdate, id_productupdate, Number(favoriteidupdate)], loadAndReset, onError); });
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
 
    $("#id_user").val((item['id_user']).toString());
    $("#id_product").val((item['id_product']).toString());

    $("#id").val((item['id']).toString());
 
}
 
function resetForm() // Function for reset form input values.
 
{

    $("#id_user").val("");
    $("#id_product").val("");

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
 