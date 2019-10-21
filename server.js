/*********************************************************************************
* BTI325 – Assignment 4
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
const exphbs = require('express-handlebars');

//Middleware
var app = express();
app.use("/public", express.static('public')); //'static' middleware to allow the use of css and images contained in the file
app.use(bodyParser.urlencoded({extended: true})); 
var HTTP_PORT = process.env.PORT || 8080;
app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});
   
//Start listening for requests
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}
//==================================================================//
// Handlebars setup                                                 //
//==================================================================//

app.engine('.hbs', exphbs({ 
    extname: '.hbs',
    defaulLayout: 'main',
    layoutDir: __dirname + '/views/layouts',
    helpers: {
        navLink: function(url, options) {
            return '<li' + ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
            '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }     
    }
}));
app.set('view engine', '.hbs');

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

//Home route (updated to use handlebars)
app.get("/", function(req,res) {
    res.render('home', {
        layout: "main"
    });
});

//About route (updated to use handlebars)
app.get("/about", function(req,res) {
    res.render('about', {
        layout: "main"
    });
});

//departments route (updated to use handlebars)
app.get("/departments", (req,res)=> {
    dataService.getDepartments().then((data)=>{
        res.render("departments", {departments: data});
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
            res.render("employees",{employees: data});
        }).catch(() =>{
            res.render({message: "no results"});
        })
    }
    //Return a json string consisting of all employees where value could be one 1,2,3,..7 (7 departments in dataset)
    else if (req.query.department) {
        dataService.getEmployeeByDepartment(req.query.department).then((data)=>{
            res.render("employees",{employees: data});
        }).catch(()=>{
            res.render({message: "no results"});
        })
    } 
    //Return a json string consisting of all employees where value could be one 1,2,3,...30 (currenting 30 managers in dataset)
    else if (req.query.manager) {
        dataService.getEmployeeByManager(req.query.manager).then((data)=>{
            res.render("employees",{employees: data});
        }).catch(()=>{
            res.render({message: "no results"});
        })
    } 
    //Return a json string of all employees with no filter (orginal from assignment #2)
    else {
        //Call our dataservice.js file and use the getAllEmpployees function to retrieve data
        dataService.getAllEmployees().then((data)=>{
            //Respond with employee json data
            res.render("employees",{employees: data});
        }).catch(()=>{
            res.render({message: "no results"});
        });
    }
});

//Employee add route (updated to use handlebars)
app.get("/employees/add", (req,res)=> {
    res.render('addEmployee', {
        layout: "main"
    });
});

app.post("/employees/add", function (req, res) {
    dataService.addEmployee(req.body).then(()=> {
            res.redirect("/employees");
    });
});

app.post("/employee/update", (req, res) => {
    dataService.updateEmployee(req.body).then(() => {
        res.redirect("/employees");
    }).catch((err) => {
        res.render({message: "no results"});
    })
});

//Allows the user to search for a certain employee by number through the url
app.get("/employees/:num", function (req, res) {
    dataService.getEmployeeByNum(req.params.num).then((data) => {
        res.render("employee", {employee: data});
    }).catch((err)=>{
        res.render("employee", {message:"no results"});
    })
});

//==================================================================//
// Image viewing and adding routes                                  //
//==================================================================//

//Image add route (updated to use handlebars)
app.get("/images/add", (req,res)=> {
    res.render('addImage', {
        layout: "main"
    });
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
       res.render("images", obj);
    });
});

//==================================================================//
// Adding my own routes                                             //
//==================================================================//

//Home route (updated to use handlebars)
app.get("/projects", function(req,res) {
    res.render('projects', {
        layout: "main"
    });
});

//no-matching route, custom 404 page (updated to use handlebars)
app.use(function(req,res) { 
    res.status(404);
    //Respond with custom 404 page
    res.render('404', {
        layout: "main"
    });
});

//==================================================================//
// Start the server and call initialize to read the json data       //
//==================================================================//

dataService.initialize().then(()=>{
    app.listen(HTTP_PORT, onHttpStart);
}).catch((reason)=>{
    console.log(reason);
});