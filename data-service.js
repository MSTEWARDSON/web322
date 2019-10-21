//Requires
const fs = require('fs'); //File system

//Global arrays
var employees = [];
var departments = [];

//initalize function, loads JSON data into the above global arrays
module.exports.initialize = function() {
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
module.exports.getAllEmployees = function() {
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
module.exports.getManagers = function() {
    return new Promise((resolve, reject)=>{
        //Array that will hold JSON data from employees.json
        var manager = [];
        //Loop through each set of data from employees.json and push the data into each element of manager array if the employee is a manager
        employees.forEach (function(element){
            if (element.isManager) {
                manager.push(element);
            }
        });
        if (manager.length == 0) {
            var err = "getManagers() does not have any data"
            reject({message: err});
        }
        resolve(manager);
    })
}

//Responds with department json data
module.exports.getDepartments = function() {
    return new Promise((resolve, reject) =>{
        if(departments.lenth == 0) {
            var err = "getDepartments() does not have any data";
            reject({message: err});
        }
        resolve(departments);
    })
}

//Add New Employee
module.exports.addEmployee = function (employeeData) {
    return new Promise((resolve, reject) => {
        //If the user did not select "manager", set isManager to false
        if (typeof employeeData.isManager === "undefined") {
            employeeData.isManager = false;
        } else {
            employeeData.isManager = true;
        }
        //Set the new employee number to be +1 of whatever is the highest atm
        employeeData.employeeNum = employees.length + 1;
        //Push new employee to json file
        employees.push(employeeData);
        resolve(employeeData);
    });
}

//Filter for employee status
module.exports.getEmployeeByStatus = function (status) {
    return new Promise((resolve, reject)=>{
        //Using "filter" method to search the employee array
        //In this case im looking for employees that match the status of "full time" or "part time" based on what the user queryed for
        let filteredEmp = employees.filter(employees => employees.status == status);
        //If the status is 0, error msg
        if (filteredEmp.length == 0) {
            var err = "getEmployeeByStatus() No results returned";
            reject({message: err});
        }
        resolve(filteredEmp);
    });
}

//Filter for employee department (Works the same as getEmployeeByStatus)
module.exports.getEmployeeByDepartment = function (department) {
    return new Promise((resolve, reject)=>{
        let filteredEmp = employees.filter(employees => employees.department == department);
        if (filteredEmp.length == 0) {
            var err = "getEmployeeByDepartment() No results returned";
            reject({message: err});
        }
        resolve(filteredEmp);
    });
}

//filter for employee managers (Works the same as getEmployeeByStatus)
module.exports.getEmployeeByManager = function (manager) {
    return new Promise((resolve, reject)=>{
        let filteredEmp = employees.filter(employees => employees.employeeManagerNum == manager);
        if (filteredEmp.length == 0) {
            var err = "getEmployeeByManager() No results returned";
            reject({message: err});
        }
        resolve(filteredEmp);
    });
}

//filter for employee number
module.exports.getEmployeeByNum = function (num) {
    let filteredEmp;
    return new Promise((resolve, reject)=>{
        //Loop through the employee array
        for(var i =0 ; i < employees.length; i++) {
            //If the employee number matchs the searched for num
            if (employees[i].employeeNum == num) {
                //Answer is found so we set filteredEmp to the current employee
                //i is then set to the length of the array to exit the loop
                filteredEmp = employees[i];
                i = employees.length;
            }
        }
        if (num == 0 || num > employees.length) {
            var err = "getEmployeeByNum() No results returned";
            reject({message: err});
        }
        resolve(filteredEmp);
    });
}

module.exports.updateEmployee = function (employeeData) {
    //Flag to indicate if the employee number was matched
    let foundEmp = false;
    return new Promise((resolve, reject)=>{
        //Seach through the array of employees and find a matching num
        for (var i=0; i < employees.length; i++){
            if (employees[i].employeeNum == employeeData.employeeNum) {
                employees[i] = employeeData;
                //Now we can resolve
                foundEmp = true;
            }
        }
        //If we did not find the matching num, error msg
        if(foundEmp === false) {
         var err = "Cannot find employee to update.";
         reject({message: err});
        }  
        resolve (employees);
     });
}