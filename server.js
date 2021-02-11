var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "WarriorMentality1995!",
  database: "employee_DB",
});

connection.connect(function (err) {
  if (err) throw err;
  // first prompt we want to be user to have
  startingOptions();
});

// Functions
// startingOptions()
// viewAllEmployees()
// viewEmployeeByDept()
// TODO:
// viewEmployeeByManager() --> select query, like artist search

// addEmployee() --> create query
// removeEmployee() --> delete query
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
          //rangeSearch();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Remove Employee":
          //songSearch();
          break;

        case "Update Employee Role":
          // songAndAlbumSearch();
          break;

        case "Update Employee Manger":
          //songAndAlbumSearch();
          break;

        case "View All Roles":
          // songAndAlbumSearch();
          break;
      }
    });
}
function viewAllEmployees(answer) {
  var query =
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.department_name ";
  query += "FROM ((role INNER JOIN employee ON role.id = employee.role_id) ";
  query += "INNER JOIN department ON role.department_id = department.id)";
  // var query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.department_name, employee.manager_id ";
  //     query += "FROM (((role INNER JOIN employee ON role.id = employee.role_id) ";
  //     query += "INNER JOIN department ON role.department_id = department.id) ";
  //     query += "INNER JOIN employee ON employee.id = employee.manager_id)";
  connection.query(query, function (err, res) {
    // console.log(res)
    for (var i = 0; i < res.length; i++) {}
    console.table(res);
    startingOptions();
  });
}

function viewEmployeeByDept() {
  var query =
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.department_name ";
  query += "FROM ((role INNER JOIN employee ON role.id = employee.role_id) ";
  query +=
    "INNER JOIN department ON role.department_id = department.id) ORDER BY department.id";
  connection.query(query, function (err, res) {
    // console.log(res)
    for (var i = 0; i < res.length; i++) {}
    console.table(res);
    startingOptions();
  });
}

function addEmployee() {
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
        choices: [
          "Lead Engineer",
          "Engineer",
          "Junior Engineer",
          "Accountant",
          "Fundraising",
          "Online Marketing",
          "Other Marketing",
        ],
      },
      // , {
      // name: "manager",
      // type: "list",
      // message: "Who is the employee's manager?",
      // choicees: ["Lead Engineer", "Engineer", "Junior Engineer", "Accountant", "Fundraising", "Online Marketing", "Other Marketing"]
      // },
    ])
    .then(function (answer) {
      // to do: deconstruct here?
      // const { first, last, role } = answer;
      console.log(answer.last)
      console.log(answer.role)
      var query =
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, null)";
      connection.query(
        query, [answer.first, answer.last, answer.role],
        function (err, res) {
            console.log("Your employee has been added to the system")
        //   for (var i = 0; i < res.length; i++) {}
        //   console.table(res);
          
          startingOptions();
        }
      );
    });
}
function artistSearch() {
  inquirer
    .prompt({
      name: "artist",
      type: "input",
      message: "What artist would you like to search for?",
    })
    .then(function (answer) {
      var query = "SELECT position, song, year FROM top5000 WHERE ?";
      connection.query(query, { artist: answer.artist }, function (err, res) {
        for (var i = 0; i < res.length; i++) {
          console.log(
            "Position: " +
              res[i].position +
              " || Song: " +
              res[i].song +
              " || Year: " +
              res[i].year
          );
        }
        runSearch();
      });
    });
}

function multiSearch() {
  var query = "SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 1";
  connection.query(query, function (err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].artist);
    }
    runSearch();
  });
}

function rangeSearch() {
  inquirer
    .prompt([
      {
        name: "start",
        type: "input",
        message: "Enter starting position: ",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        },
      },
      {
        name: "end",
        type: "input",
        message: "Enter ending position: ",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        },
      },
    ])
    .then(function (answer) {
      var query =
        "SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?";
      connection.query(query, [answer.start, answer.end], function (err, res) {
        for (var i = 0; i < res.length; i++) {
          console.log(
            "Position: " +
              res[i].position +
              " || Song: " +
              res[i].song +
              " || Artist: " +
              res[i].artist +
              " || Year: " +
              res[i].year
          );
        }
        runSearch();
      });
    });
}

function songSearch() {
  inquirer
    .prompt({
      name: "song",
      type: "input",
      message: "What song would you like to look for?",
    })
    .then(function (answer) {
      console.log(answer.song);
      connection.query(
        "SELECT * FROM top5000 WHERE ?",
        { song: answer.song },
        function (err, res) {
          console.log(
            "Position: " +
              res[0].position +
              " || Song: " +
              res[0].song +
              " || Artist: " +
              res[0].artist +
              " || Year: " +
              res[0].year
          );
          runSearch();
        }
      );
    });
}

function songAndAlbumSearch() {
  inquirer
    .prompt({
      name: "artist",
      type: "input",
      message: "What artist would you like to search for?",
    })
    .then(function (answer) {
      var query =
        "SELECT top_albums.year, top_albums.album, top_albums.position, top5000.song, top5000.artist ";
      query +=
        "FROM top_albums INNER JOIN top5000 ON (top_albums.artist = top5000.artist AND top_albums.year ";
      query +=
        "= top5000.year) WHERE (top_albums.artist = ? AND top5000.artist = ?) ORDER BY top_albums.year, top_albums.position";

      connection.query(
        query,
        [answer.artist, answer.artist],
        function (err, res) {
          console.log(res.length + " matches found!");
          for (var i = 0; i < res.length; i++) {
            console.log(
              i +
                1 +
                ".) " +
                "Year: " +
                res[i].year +
                " Album Position: " +
                res[i].position +
                " || Artist: " +
                res[i].artist +
                " || Song: " +
                res[i].song +
                " || Album: " +
                res[i].album
            );
          }

          runSearch();
        }
      );
    });
}
