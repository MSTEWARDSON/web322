//Requires
//fs is for the file system module that allows us to read and  write files
const fs = require('fs'); //File system
//Global arrays
var employees = [];
var departments = [];
//initalize function, loads JSON data into the above global arrays
exports.initialize = function() {
    return new Promise((resolve, reject)=> {
        try {
            //Try reading the file
            fs.readFile('./data/employees.json', (err, data) => {
                if (err) throw err;
                employees = JSON.parse(data);
            });
            fs.readFile('./data/departments.json', (err, data) => {
                if (err) throw err;
                departments = JSON.parse(data);
            });
            resolve("Data Sent!");
        } catch (ex) {
            reject("Initialize went wrong");
        }
    });
}
//Returns the employee list in JSON format to the server.js file
exports.getAllEmployees = function() {
    return new Promise((resolve, reject)=>{
        if (employees.length > 0) {
            resolve(employees);
        }
        else {
            reject("No Employees.");
        }
    });
}
//Returns the list of employees but only ones that are mangers
exports.getManagers = function() {
    return new Promise((resolve, reject)=>{
        //Array that will hold JSON data from employees.json
        var manager = [];
        //Loop through each set of data from employees.json and push the data into each element of manager array if the employee is a manager
        employees.forEach (function(element){
            if (element.isManager) {
                manager.push(element);
            }
        });
        if (manager.length === 0) {
            var err = "getManagers() does not have any data"
            reject({message: err});
        }
        resolve(manager);
    })
}
//Responds with department json data
exports.getDepartments = function() {
    return new Promise((resolve, reject) =>{
        if(departments.lenth === 0) {
            var err = "getDepartments() does not have any data";
            reject({message: err});
        }
        resolve(departments);
    })
}