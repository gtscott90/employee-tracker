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
// updateEmployeeManager() --> update query
// viewAllRoles() --> select query, like artist search
// viewAllDepartments()
// addDepartment()
// addRole()
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
        "View All Employees By Role",
        "View All Employees By Manager",
        "View All Roles",
        "View All Departments",
        "Add Employee",
        "Add Department",
        "Add Role",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manger",
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

        case "View All Employees By Role":
          viewEmployeeByRole();
          break;

        case "View All Employees By Manager":
          viewEmployeeByManager();
          break;

        // to do 
        case "View All Roles":
          
          break;
          
        case "View All Departments":
          viewAllDepartments();
          break;
        
        case "Add Employee":
          addEmployee();
          break;

        case "Add Department":
          addDepartment();
          break;

        // to do 
          case "Add Role":
          addRole();
          break;

        case "Remove Employee":
          removeEmployee();
          break;

        // to dp 
          case "Update Employee Role":
          updateEmployeeRole();
          break;

        // to do 
          case "Update Employee Manger":
          updateEmployeeManager();
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

function viewEmployeeByRole() {
    var query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager "
    query += "FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id ORDER BY role.id";
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
      choices: allManagers,
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
        var nameArray = name.split(" ")
        var query = `SELECT employee.id FROM employee WHERE first_name = "${nameArray[0]}"`;
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

function addDepartment() {
    inquirer
    .prompt([
      {
        name: "newDepartment",
        type: "input",
        message: "What is the name of the new department?",
      },
    ])
    .then(async function (answer) {
      var query =
        "INSERT INTO department (department_name) VALUES (?)";
      connection.query(
        query,
        [answer.newDepartment],
        function (err, res) {
            if (err) throw err
          console.log("Your department has been added to the system");
          startingOptions();
        }
      );
    });
}

function viewAllDepartments() {
    var query = "SELECT department.department_name FROM department ORDER BY department.id";
  connection.query(query, function (err, res) {
    for (var i = 0; i < res.length; i++) {}
    console.table(res);
    startingOptions();
  });
}

function addRole() {

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

async function updateEmployeeRole() {
    var allEmployees = await getAllEmployees()
    var allRoles = await getAllRoles()
    inquirer
      .prompt([
        {
        name: "employee",
        type: "list",
        message: "Which employee's role would you like to update?",
        choices: allEmployees
        },
        {
        name: "newRole",
        type: "list",
        message: "Select the employee's new role:",
        choices: allRoles
        },
      ])
      .then(async function (answer) {
        var employeeID = await getEmployeeId(answer.employee)
        var roleID = await getRoleId(answer.newRole)
        var query =
          "UPDATE employee SET employee.role_id = ? WHERE employee.id = ?";
          connection.query(
              query,
              [roleID, employeeID],
              function (err, res) {
                  if (err) throw err
                  console.log("Your employee's role has been updated in the system");
                  startingOptions();
              }
              );
  })
  }

async function updateEmployeeManager() {
    var allEmployees = await getAllEmployees()
    var allManagers = await getAllManagers()
    inquirer
        .prompt([
        {
        name: "employee",
        type: "list",
        message: "Which employee's manager would you like to update?",
        choices: allEmployees
        },
        {
        name: "newManager",
        type: "list",
        message: "Select the employee's new manager:",
        choices: allManagers
        },
        ])
        .then(async function (answer) {
        var employeeID = await getEmployeeId(answer.employee)
        var managerID = await getManagerId(answer.newManager)
        var query =
            "UPDATE employee SET employee.manager_id = ? WHERE employee.id = ?";
            connection.query(
                query,
                [managerID, employeeID],
                function (err, res) {
                    if (err) throw err
                    console.log("Your employee's manager has been updated in the system");
                    startingOptions();
                }
                );
    })
  }