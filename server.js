/*********************************************************************************
* BTI325 – Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Matthew Stewardson Student ID: 107419194 Date: 03/10/2019
*
* Online (Heroku) Link: 
*
********************************************************************************/
var express = require("express");
var app = express();
var path = require("path");
//Require the employee.json file
const employeeData = require("./data/employees.json");
const departmentData = require("./data/departments.json");
//Require the module 'data-service.js'
var dataService = require("./data-service.js");
//'static' middleware to allow the use of css and images contained in the file
app.use(express.static('public'));

var HTTP_PORT = process.env.PORT || 8080;
//Start listening for requests
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}
//Home route
app.get("/", function(req,res) {
    //Respond with home.html
    res.sendFile(path.join(__dirname,"/views/home.html"));
});
//About route
app.get("/about", function(req,res) {
    //Respond with about/html
    res.sendFile(path.join(__dirname,"/views/about.html"));
});
//Employees route
app.get("/employees", (req,res)=> {
    //Call our dataservice.js file and use the getAllEmpployees function to retrieve data
    dataService.getAllEmployees().then((data)=>{
        //Respond with employee json data
        res.json(data);
    }).catch((reason)=>{
        res.json({message: reason});
    });
});
//Managers route
app.get("/managers", (req,res)=> {
    dataService.getManagers().then((data)=>{
        //Respond with all managers from employees
        res.json(data);
    }).catch((reason)=>{
        res.json({message: reason});
    });
});
//departments route
app.get("/departments", (req,res)=> {
    dataService.getDepartments().then((data)=>{
        //Respond with all departments json data
        res.json(data);
    }).catch((reason)=>{
        res.json({message: reason});
    });
});
//no-matching route, custom 404 page
app.use(function(req,res) { //next
    res.status(404);
    //Respond with custom 404 page
    res.sendFile(path.join(__dirname,"/views/404.html"));
});

//Initialize reading the 2 json files
dataService.initialize().then(()=>{
    //Start the server
    app.listen(HTTP_PORT, onHttpStart);
}).catch((reason)=>{
    console.log(reason);
});