var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");

require('dotenv').config();

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: process.env.PASS,
  database: "employee_DB",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected to SQL");
  // first prompt we want to be user to have
  startingOptions();
});

// Functions
// TODO:
// updateEmployeeRole() --> update query
// updateEmployeeManager() --> update query
// viewAllRoles() --> select query, like artist search
// end()

function startingOptions() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees By Department",
        "View All Employees By Manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manger",
        "View All Roles",
      ],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View All Employees":
          viewAllEmployees();
          break;

        case "View All Employees By Department":
          viewEmployeeByDept();
          break;

        case "View All Employees By Manager":
          viewEmployeeByManager();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Remove Employee":
          removeEmployee();
          break;

        case "Update Employee Role":
          
          break;

        case "Update Employee Manger":
          
          break;

        case "View All Roles":
          
          break;
      }
    });
}
function viewAllEmployees(answer) {
  var query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager "
  query += "FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;";
  connection.query(query, function (err, res) {
    for (var i = 0; i < res.length; i++) {}
    console.table(res);
    startingOptions();
  });
}

function viewEmployeeByDept() {
    var query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager "
    query += "FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id ORDER BY department.id DESC";
  connection.query(query, function (err, res) {
    for (var i = 0; i < res.length; i++) {}
    console.table(res);
    startingOptions();
  });
}

function viewEmployeeByManager() {
    var query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager "
    query += "FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id ORDER BY employee.manager_id DESC";
  connection.query(query, function (err, res) {
    for (var i = 0; i < res.length; i++) {}
    console.table(res);
    startingOptions();
  });
}

async function addEmployee() {
    var allRoles = await getAllRoles()
    var allManagers = await getAllManagers()
  inquirer
    .prompt([
      {
        name: "first",
        type: "input",
        message: "What is the employee's first name?",
      },
      {
        name: "last",
        type: "input",
        message: "What is the employee's last name?",
      },
      {
        name: "role",
        type: "list",
        message: "What is the employee's role?",
        choices: allRoles,
      },
      {
      name: "manager",
      type: "list",
      message: "Who is the employee's manager?",
      choices: allManagers
      },
    ])
    .then(async function (answer) {
      var roleID = await getRoleId(answer.role)
      var managerID = await getManagerId(answer.manager)
      var query =
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
      connection.query(
        query,
        [answer.first, answer.last, roleID, managerID],
        function (err, res) {
            if (err) throw err
          console.log("Your employee has been added to the system");
          startingOptions();
        }
      );
    });
}
function getRoleId(title) {
    return new Promise(function(resolve, reject){
        var query = `SELECT role.id FROM role WHERE title = "${title}"`;
        connection.query(query, function(err, res){
            if (err) reject(err)
            resolve(res[0].id)
        })
    }) 
}
function getAllRoles() {
    return new Promise(function(resolve, reject){
        var query = `SELECT role.title FROM role`;
        connection.query(query, function(err, res){
            if (err) reject(err)
            const roleOptions = []
            for (var i=0; i < res.length; i++){
                roleOptions.push(res[i].title)
            }
            resolve(roleOptions)
        })
    }) 
}
function getManagerId(name) {
    return new Promise(function(resolve, reject){
        var query = `SELECT employee.id FROM employee WHERE first_name = "${name}"`;
        connection.query(query, function(err, res){
            if (err) reject(err)
            resolve(res[0].id)
        })
    }) 
}
function getAllManagers() {
    return new Promise(function(resolve, reject){
        var query = `SELECT * from employee WHERE employee.manager_id IS NULL;`;
        connection.query(query, function(err, res){
            if (err) reject(err)
            const managerOptions = []
            for (var i=0; i < res.length; i++){
                let fullName = res[i].first_name + " " + res[i].last_name
                managerOptions.push(fullName)
            }
            resolve(managerOptions)
        })
    }) 
}

async function removeEmployee() {
  var allEmployees = await getAllEmployees()
  inquirer
    .prompt([
      {
      name: "employee",
      type: "list",
      message: "Which employee would you like to remove?",
      choices: allEmployees
      },
    ])
    .then(async function (answer) {
      var employeeID = await getEmployeeId(answer.employee)
      var query =
        "DELETE FROM employee WHERE ? = employee.id";
        connection.query(
            query,
            [employeeID],
            function (err, res) {
                if (err) throw err
                console.log("Your employee has been removed from the system");
                startingOptions();
            }
            );
})
}
function getEmployeeId(name) {
    return new Promise(function(resolve, reject) {
        var query = `SELECT employee.id FROM employee WHERE CONCAT(first_name, " ", last_name) = ?`;

        connection.query(query, [name], function(err, res){
           err ? reject(err) :
            resolve(res[0].id)
        })
    }) 
}
function getAllEmployees() {
    return new Promise(function(resolve, reject){
        var query = `SELECT * from employee;`;
        connection.query(query, function(err, res){
            if (err) reject(err)
            const employeeOptions = []
            for (var i=0; i < res.length; i++){
                let fullName = res[i].first_name + " " + res[i].last_name
                employeeOptions.push(fullName)
            }
            resolve(employeeOptions)
        })
    }) 
}

function updateEmployeeRole() {

}

function updateEmployeeManager() {

}