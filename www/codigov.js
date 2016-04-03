//  Declare SQL Query for SQLite
 
var createStatement = "CREATE TABLE IF NOT EXISTS Vendedores (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, curp TEXT, direccion TEXT, telefono TEXT, correo TEXT, contrasena TEXT)";
 
var selectAllStatement = "SELECT * FROM Vendedores";
 
var insertStatement = "INSERT INTO Vendedores (nombre, curp, direccion, telefono, correo, contrasena) VALUES (?,?,?,?,?,?)";

var loginStatement = "SELECT * FROM Vendedores WHERE correo = ? AND contrasena = ?";
 
var updateStatement = "UPDATE Vendedores SET nombre = ?, curp = ?, direccion = ?, telefono=?, correo=?, contrasena=? WHERE id=?";
 
var deleteStatement = "DELETE FROM Vendedores WHERE id=?";
 
var dropStatement = "DROP TABLE Vendedores";
 
 var db = openDatabase("VendedoresBook", "2.0", "Vendedores Book", 200000);  // Open SQLite Database
 
var dataset;
 
var DataType;
 
 function initDatabase()  // Function Call When Page is ready.
 
{
 
 //alert("Entro a crear la base de datos");
    try {
 
        if (!window.openDatabase)  // Check browser is supported SQLite or not.
 
        {
 
            alert('Databases are not supported in this browser.');
 
        }
 
        else {
 
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
 
        var nombretemp = $('input:text[id=nombre]').val();
        var curptemp = $('input:text[id=curp]').val();
        var direcciontemp = $('input:text[id=direccion]').val();
        var telefonotemp = $('input:text[id=telefono]').val();
        var correotemp = $('input:text[id=correo]').val();
        var contrasenatemp = $('input:text[id=contrasena]').val();
        db.transaction(function (tx) { tx.executeSql(insertStatement, [nombretemp, curptemp, direcciontemp,telefonotemp,correotemp,contrasenatemp], loadAndReset, onError); });
 
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
 
    var nombreupdate = $('input:text[id=nombre]').val().toString();
    var curpupdate = $('input:text[id=curp]').val().toString();
    var direccionupdate = $('input:text[id=direccion]').val().toString();
    var telefonoupdate = $('input:text[id=telefono]').val().toString();
    var correoupdate = $('input:text[id=correo]').val().toString();
    var contrasenaupdate = $('input:text[id=contrasena]').val().toString();
 
    var useridupdate = $("#id").val();
 
    db.transaction(function (tx) { tx.executeSql(updateStatement, [nombreupdate, curpupdate, direccionupdate,telefonoupdate,correoupdate, contrasenaupdate, Number(useridupdate)], loadAndReset, onError); });
 
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
 
    $("#nombre").val((item['nombre']).toString());
    $("#curp").val((item['curp']).toString());
    $("#direccion").val((item['direccion']).toString());
    $("#telefono").val((item['telefono']).toString());
    $("#correo").val((item['correo']).toString());
    $("#contrasena").val((item['contrasena']).toString());

    $("#id").val((item['id']).toString());
 
}
 
function resetForm() // Function for reset form input values.
 
{
 
    $("#nombre").val("");
    $("#curp").val("");
    $("#direccion").val("");
    $("#telefono").val("");
    $("#correo").val("");
    $("#contrasena").val("");

    $("#id").val("");
 
}
 
function loadAndReset() //Function for Load and Reset...
 
{
 
    resetForm();
 
    showRecords()
 
}
 
function onError(tx, error) // Function for Hendeling Error...
 
{
 
    alert(error.message);
 
}
 
function login(id) // Get id of record . Function Call when Delete Button Click..
 
{
 
        var correotemp = $('input:text[id=correo]').val();
        var contrasenatemp = $('input:text[id=contrasena]').val();
        db.transaction(function (tx) { tx.executeSql(loginStatement, [correotemp,contrasenatemp],  function(tx, result){ // <-- this is where you forgot tx
            
      

            if(result.rows.length > 0)
            {
               document.location.href=("vendedoresIndex.html");
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
 
    $("#results").html('<ul class="list">')
 
    db.transaction(function (tx) {
 
        tx.executeSql(selectAllStatement, [], function (tx, result) {
 
            dataset = result.rows;
 
            for (var i = 0, item = null; i < dataset.length; i++) {
 
                item = dataset.item(i);
           

                var linkeditdelete = '<li class="item">' + item['nombre'] + '   ' + '<a href="#" onclick="loadRecord(' + i + ');">Editar</a>' + '    ' +
 
                                            '<a href="#" onclick="deleteRecord(' + item['id'] + ');">Eliminar</a></li>';
 
                $("#results").append(linkeditdelete);
 
            }
  $("#results").append('</ul>');
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
 