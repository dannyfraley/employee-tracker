var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require ("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "popovich2020",
  database: "employee_trackerDB"
});

connection.connect(function(err) {
  if (err) throw err;
  mainMenu();
});

function mainMenu() {
  inquirer
    .prompt({
      name: "mainMenu",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Roles",
        "View All Departments",
        "Add Employee",
        "Add Department",
        "Add Role",
        "Update Employee Role",
        "Quit",
        // "View All Employees by Department",
        // "View All Employees by Manager",
        // "Remove Employee",
        // "Update Employee Manager",
        // "Remove Role",
        // "Remove Department",
      ]
    })
    .then(function(answer) {
      switch (answer.mainMenu) {

      case "View All Employees":
        viewAllEmp();
        break;
      
      case "View All Roles":
        viewAllRoles();
        break;

      case "View All Departments":
        viewAllDepts();
        break;

      case "Add Employee":
        addEmp();
        break;

      case "Add Department":
        addDept();
        break;     
      
      case "Add Role":
        addRole();
        break;

      case "Update Employee Role":
        updateEmpRole();
        break;

      case "Quit":
        connection.end();
        break;

      //* BONUS STUFF

      // case "View All Employees by Department":
      //   viewAllEmpByDept();
      //   break;

      // case "View All Employees by Manager":
      //   viewAllEmpByMgr();
      //   break;

      // case "Remove Employee":
      //   removeEmp();
      //   break;

      // case "Update Employee Manager":
      //   updateEmpMgr();
      //   break;

      // case "Remove Role":
      //   removeRole();
      //   break;

      // case "Remove Department":
      //   removeDept();
      //   break; 

      }
    });
}

function viewAllEmp() {
  connection.query(`
  SELECT employee.id, employee.first_name, employee.last_name,
  role.title, role.salary, department.dept_name department,
  CONCAT(manager.first_name, " ", manager.last_name) manager
  FROM employee
  LEFT JOIN role on employee.role_id = role.id
  LEFT JOIN department on role.department_id = department.id
  LEFT JOIN employee manager on employee.manager_id = manager.id
  `, function (err, res) {
    console.log("\n")
    console.table(res);
    mainMenu();
  })
}

function viewAllRoles(){
  connection.query("SELECT * FROM role", function(err, res){
    console.log("\n")
    console.table(res);
    mainMenu();
  })
}

function viewAllDepts(){
  connection.query("SELECT * FROM department", function(err, res){
    console.log("\n")
    console.table(res);
    mainMenu();
  })
}

function addEmp(){
  connection.query("SELECT * FROM role", function(err,res){
    let titles = res.map(function(role){
      return role.title
    })
    connection.query("SELECT * FROM employee", function(err,resEmp){
      let managers = resEmp.map(function(employee){
        return employee.first_name + " " + employee.last_name
      })
      inquirer.prompt([
        {
          type:"input",
          message: "What is the employee's first name?",
          name: "firstName"
        },
        {
          type:"input",
          message: "What is the employee's last name?",
          name: "lastName"
        },
        {
          type:"list",
          message: "What is the employee's role?",
          name: "empRole",
          choices: titles 
    
        
        },
        {
          type:"list",
          message: "Who is the employee's manager?",
          name: "empMgr",
          choices: managers 
    
        
        },
      ]).then(function(userInput){
        let role = res.find(function(role){
          return role.title === userInput.empRole
        })
        // console.log (role)
        let roleID = role.id
        let employee = resEmp.find(function(employee){
          return (employee.first_name + " " + employee.last_name) === userInput.empMgr
        })
        // console.log(employee)
        let managerID = employee.id

        connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)", [userInput.firstName, userInput.lastName, roleID, managerID], function(err, res){
          console.log("employee added!")
          mainMenu();
        })
      })
      
  
    })
  
  })
}




// function artistSearch() {
//   inquirer
//     .prompt({
//       name: "artist",
//       type: "input",
//       message: "What artist would you like to search for?"
//     })
//     .then(function(answer) {
//       var query = "SELECT position, song, year FROM top5000 WHERE ?";
//       connection.query(query, { artist: answer.artist }, function(err, res) {
//         for (var i = 0; i < res.length; i++) {
//           console.log("Position: " + res[i].position + " || Song: " + res[i].song + " || Year: " + res[i].year);
//         }
//         runSearch();
//       });
//     });
// }

// function multiSearch() {
//   var query = "SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 1";
//   connection.query(query, function(err, res) {
//     for (var i = 0; i < res.length; i++) {
//       console.log(res[i].artist);
//     }
//     runSearch();
//   });
// }

// function rangeSearch() {
//   inquirer
//     .prompt([
//       {
//         name: "start",
//         type: "input",
//         message: "Enter starting position: ",
//         validate: function(value) {
//           if (isNaN(value) === false) {
//             return true;
//           }
//           return false;
//         }
//       },
//       {
//         name: "end",
//         type: "input",
//         message: "Enter ending position: ",
//         validate: function(value) {
//           if (isNaN(value) === false) {
//             return true;
//           }
//           return false;
//         }
//       }
//     ])
//     .then(function(answer) {
//       var query = "SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?";
//       connection.query(query, [answer.start, answer.end], function(err, res) {
//         for (var i = 0; i < res.length; i++) {
//           console.log(
//             "Position: " +
//               res[i].position +
//               " || Song: " +
//               res[i].song +
//               " || Artist: " +
//               res[i].artist +
//               " || Year: " +
//               res[i].year
//           );
//         }
//         runSearch();
//       });
//     });
// }

// function songSearch() {
//   inquirer
//     .prompt({
//       name: "song",
//       type: "input",
//       message: "What song would you like to look for?"
//     })
//     .then(function(answer) {
//       console.log(answer.song);
//       connection.query("SELECT * FROM top5000 WHERE ?", { song: answer.song }, function(err, res) {
//         console.log(
//           "Position: " +
//             res[0].position +
//             " || Song: " +
//             res[0].song +
//             " || Artist: " +
//             res[0].artist +
//             " || Year: " +
//             res[0].year
//         );
//         runSearch();
//       });
//     });
// }

// function songAndAlbumSearch() {
//   inquirer
//     .prompt({
//       name: "artist",
//       type: "input",
//       message: "What artist would you like to search for?"
//     })
//     .then(function(answer) {
//       var query = "SELECT top_albums.year, top_albums.album, top_albums.position, top5000.song, top5000.artist ";
//       query += "FROM top_albums INNER JOIN top5000 ON (top_albums.artist = top5000.artist AND top_albums.year ";
//       query += "= top5000.year) WHERE (top_albums.artist = ? AND top5000.artist = ?) ORDER BY top_albums.year, top_albums.position";

//       connection.query(query, [answer.artist, answer.artist], function(err, res) {
//         console.log(res.length + " matches found!");
//         for (var i = 0; i < res.length; i++) {
//           console.log(
//             i+1 + ".) " +
//               "Year: " +
//               res[i].year +
//               " Album Position: " +
//               res[i].position +
//               " || Artist: " +
//               res[i].artist +
//               " || Song: " +
//               res[i].song +
//               " || Album: " +
//               res[i].album
//           );
//         }

//         runSearch();
//       });
//     });
// }
