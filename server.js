/**
 * Matthew Stewardson
 * Student #107419194
 * BTI325NBB
 * Assignement #2
 */
var express = require("express");
var app = express();
var path = require("path");
//Require the employee.json file
const employeeData = require("./data/employees.json");
const departmentData = require("./data/departments.json");
//Require are module 'data-service.js'
var dataService = require("./data-service.js");
//'static' middleware to allow the use of css
app.use(express.static('public'));

var HTTP_PORT = process.env.PORT || 8080;
//Start listening for requests
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}
//Home route
app.get("/", function(req,res) {
    res.sendFile(path.join(__dirname,"/views/home.html"));
});
//About route
app.get("/about", function(req,res) {
    res.sendFile(path.join(__dirname,"/views/about.html"));
});
//Employees route
app.get("/employees", (req,res)=> {
    dataService.getAllEmployees().then((data)=>{
        res.json(data);
    }).catch((reason)=>{
        res.json({message: reason});
    });
});
//Managers route
app.get("/managers", (req,res)=> {
    dataService.getManagers().then((data)=>{
        res.json(data);
    }).catch((reason)=>{
        res.json({message: reason});
    });
});
//departments route
app.get("/departments", (req,res)=> {
    dataService.getDepartments().then((data)=>{
        res.json(data);
    }).catch((reason)=>{
        res.json({message: reason});
    });
});
//no-matching route, custom 404 page
app.use(function(req,res) { //next
    res.status(404);
    res.sendFile(path.join(__dirname,"/views/404.html"));
});

//Initialize reading the 2 json files
dataService.initialize().then(()=>{
    //Start the server
    app.listen(HTTP_PORT, onHttpStart);
}).catch((reason)=>{
    console.log(reason);
});