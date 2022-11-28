// import mysql
const mysql = require("mysql");

// import express library
const express = require("express");

//create on application instance
const app = express();

// call a middleware
app.use(express.json());

//create a connection config
let mysqlConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ROOT",
    database: "studentDB",
    multipleStatements: true,
} );

//connect to the database
mysqlConnection.connect( () => {
    console.log("Database connection successful");
});

//test for endpoint
app.get( "/", (req, res) => {
    res.send("Welcome to our new express api")
});

//get all students
app.get("/students", (req, res) => {
    mysqlConnection.query("SELECT * FROM studentRecords", (err, rows, fields) =>{
        if(err){
            console.log(err.message)
        }else{
            // res.status(200).json({
            //     data: rows
            // })
             res.send(
                rows
            )
        }
    });
});

// get a single student from studentRecords
// approach one
// app.get("/students/:id", (req, res)=>{
//     mysqlConnection.query("SELECT * FROM studentRecords WHERE id=?", [req.params.id], (err, rows, fields)=>{
//         if(!err){
//             res.status(200).json({
//                 message: "Student was sucessfully retrieved",
//                 data: rows 
//             })
//         }else{
//             console.log(err.message);
//             res.status(404).json({
//                 message: err.message
//             });
//         }
//     });
// });

//approach two
// app.get("/students/:id", async(req, res)=>{
//     try{
//         await mysqlConnection.query("SELECT * FROM studentRecords WHERE id=?", [req.params.id], (err,rows,fields)=>{
//             if(!err){
//                 res.status(200).json({
//                     data: rows
//                 })
//             }else{
//                 console.log(err.message);
//                 res.status(404).json({
//                     message: err.message 
//                 })
//             }
//         })
//     }catch(err){
//         res.status(404).json({
//             message: err.message
//         })
//     }
// });

// //approach three
app.get("/students/:id", (req,res)=>{
    let userId = req.params.id;
    mysqlConnection.query(`SELECT * FROM studentRecords WHERE id=${userId}`, (err, rows, fields)=>{
        if(!err){
            res.status(200).json({
                data: rows
            })
        }else{
            console.log(err.message);
            res.status(404).json({
                message: err.message
            });
        }
    });
});

//remove a record from a database table
app.delete("/students/:id", (req,res)=>{
    let id = req.params.id;
    mysqlConnection.query(`DELETE FROM studentRecords WHERE id=${id}`, (err,rows,fields)=>{
        if(!err){
            res.status(200).json({
                message: "Student is deleted sucessfully "
            })
        }else{
            res.status(404).json({
                message: err.message
            })
        }
    });
});

// add a new record to the database table
app.post("/students", (req,res)=>{
    let student = req.body;
    let sql = `SET @id=?; SET @studentName=?; SET @studentCourse=?; SET @studentDuration=?; SET @studentAge=?;
    CALL curveAddOrEdit(@id, @studentName, @studentCourse, @studentDuration, @studentAge);`;

    mysqlConnection.query(sql, [student.id, student.studentName, student.studentCourse, student.studentDuration, student.studentAge], (err, rows, fields)=>{
        if(!err){
            rows.forEach( (element) =>{
                if (element.constructor == Array ){
                    res.status(200).json({
                        message: "New Student has been created.",
                        data: "Student ID: " + element[0].id
                    });
                }else{
                    console.log("No Student Found")
                }
            });
        }else{
            console.log(err.message);
        }
    });
});

// create a port
const PORT = 3030;
app.listen(PORT, ()=>{
    console.log("App listening to:" + PORT)
});