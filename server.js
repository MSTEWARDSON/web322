/*********************************************************************************
* BTI325 – Assignment 3
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Matthew Stewardson Student ID: 107419194 Date: 03/10/2019
*
* Online (Heroku) Link: 
*
********************************************************************************/
//Requires
var express = require("express");
var path = require("path");
var multer = require("multer");
var bodyParser = require("body-parser");
var dataService = require("./data-service.js");
const fs = require('fs');
const employeeData = require("./data/employees.json");     //My two json files
const departmentData = require("./data/departments.json");

//Middleware
var app = express();
app.use(express.static('public')); //'static' middleware to allow the use of css and images contained in the file
app.use(bodyParser.urlencoded({extended: true})); 
var HTTP_PORT = process.env.PORT || 8080;

//Start listening for requests
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

//==================================================================//
// Image upload setup                                               //
//==================================================================//

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "/public/images/uploaded")) //Where the photos are stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
//Tell multer to use diskstorage function for naming files
const upload = multer({ storage: storage });

//==================================================================//
// Routes                                                           //
//==================================================================//

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

//==================================================================//
// Employee viewing and adding Routes                               //
//==================================================================//

//Employees route
app.get("/employees", (req,res)=> {
    //Return a json string consisting of all employees where value could either be "fulltime" or "parttime"
    if (req.query.status) {
        dataService.getEmployeeByStatus(req.query.status).then((data)=>{
            res.json(data);
        }).catch((err) =>{
            res.json({message: err});
        })
    }
    //Return a json string consisting of all employees where value could be one 1,2,3,..7 (7 departments in dataset)
    else if (req.query.department) {
        dataService.getEmployeeByDepartment(req.query.department).then((data)=>{
            res.json(data);
        }).catch((err)=>{
            res.json({message: err});
        })
    } 
    //Return a json string consisting of all employees where value could be one 1,2,3,...30 (currenting 30 managers in dataset)
    else if (req.query.manager) {
        dataService.getEmployeeByManager(req.query.manager).then((data)=>{
            res.json(data);
        }).catch((err)=>{
            res.json({message: err});
        })
    } 
    //Return a json string of all employees with no filter (orginal from assignment #2)
    else {
        //Call our dataservice.js file and use the getAllEmpployees function to retrieve data
        dataService.getAllEmployees().then((data)=>{
            //Respond with employee json data
            res.json(data);
        }).catch((err)=>{
            res.json({message: err});
        });
    }
});

//Employee add route
app.get("/employees/add", (req,res)=> {
    res.sendFile(path.join(__dirname,"/views/addEmployee.html"));
});

app.post("/employees/add", function (req, res) {
    dataService.addEmployee(req.body)
        .then(()=> {
            res.redirect("/employees");
        });
});

app.get("/employees/:num", function (req, res) {
    dataService.getEmployeeByNum(req.params.num).then((data) => {
        res.json(data)
    }).catch((err)=>{
        res.json({message: err});
    })
});

//==================================================================//
// Image viewing and adding routes                                  //
//==================================================================//

//Image add route
app.get("/images/add", (req,res)=> {
    res.sendFile(path.join(__dirname,"/views/addImage.html"));
});

//Prepare to receive file and then go to images page
app.post("/images/add", upload.single("imageFile"), (req, res)=> {
    res.redirect("/images");
});

//GET /images
app.get("/images", function (req, res) {
    fs.readdir(path.join(__dirname, "/public/images/uploaded"), function(err, items) {
       var obj = { images: [] };
       var size = items.length;
       for (var i = 0; i < size; i++) {
           obj.images.push(items[i]);
       }
       res.json(obj);
    });
});

//no-matching route, custom 404 page
app.use(function(req,res) { 
    res.status(404);
    //Respond with custom 404 page
    res.sendFile(path.join(__dirname,"/views/404.html"));
});

//==================================================================//
// Start the server and call initialize to read the json data       //
//==================================================================//

dataService.initialize().then(()=>{
    app.listen(HTTP_PORT, onHttpStart);
}).catch((reason)=>{
    console.log(reason);
});