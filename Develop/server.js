var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require("console.table");
var figlet = require("figlet");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "popovich2020",
  database: "employee_trackerDB"
});

connection.connect(function (err) {
  if (err) throw err;
})

console.log("\n ----------------------------------- Welcome to ----------------------------------- \n");
console.log(figlet.textSync('EMPLOYR', {
  font: 'Alligator',
  horizontalLayout: 'default',
  verticalLayout: 'default',
  width: 150,
  whitespaceBreak: true
}, function(err, data) {
  if (err) {
      console.log('An error occured');
      console.dir(err);
      return;
  }
  
}));
console.log("\n");
console.log("A Content Management System designed to help companies organize their business");
console.log("\n");
mainMenu();

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
    .then(function (answer) {
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
  LEFT JOIN role ON employee.role_id = role.id
  LEFT JOIN department ON role.department_id = department.id
  LEFT JOIN employee manager ON employee.manager_id = manager.id
  `, function (err, res) {
    console.log("\n")
    console.table(res);
    mainMenu();
  })
}

function viewAllRoles() {
  connection.query("SELECT * FROM role", function (err, res) {
    console.log("\n")
    console.table(res);
    mainMenu();
  })
}

function viewAllDepts() {
  connection.query("SELECT * FROM department", function (err, res) {
    console.log("\n")
    console.table(res);
    mainMenu();
  })
}

function addEmp() {
  connection.query("SELECT * FROM role", function (err, res) {
    let titles = res.map(function (role) {
      return role.title
    })
    connection.query("SELECT * FROM employee", function (err, resEmp) {
      let managers = resEmp.map(function (employee) {
        return employee.first_name + " " + employee.last_name
      })
      connection.query("SELECT * FROM department", function (err, resDept) {
        let departments = resDept.map(function (department) {
          return department.dept_name
        })
        inquirer.prompt([
          {
            type: "input",
            message: "What is the employee's first name?",
            name: "firstName"
          },
          {
            type: "input",
            message: "What is the employee's last name?",
            name: "lastName"
          },
          {
            type: "list",
            message: "What is the employee's role?",
            name: "empRole",
            choices: titles
          },
          {
            type: "list",
            message: "What department is the employee in?",
            name: "empDept",
            choices: departments
          },
          {
            type: "list",
            message: "Who is the employee's manager?",
            name: "empMgr",
            choices: managers
          },
        ]).then(function (userInput) {
          let role = res.find(function (role) {
            return role.title === userInput.empRole
          })
          // console.log (role)
          let roleID = role.id
          let employee = resEmp.find(function (employee) {
            return (employee.first_name + " " + employee.last_name) === userInput.empMgr
          })
          // console.log(employee)
          let managerID = employee.id

          connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)", [userInput.firstName, userInput.lastName, roleID, managerID], function (err, res) {
            // connection.query("INSERT INTO * FROM department", function (err, resDept) {
            //   let departments = resDept.map(function (department) {
            //     return department.dept_name
            //   })
            console.log("Employee added!")
            mainMenu();

          })
        })
      })
    })
  })
}


function addDept() {
  inquirer.prompt({
    type: "input",
    message: "What department would you like to add?",
    name: "newDept"
  }).then(function (answer) {
    connection.query("INSERT INTO department (dept_name) VALUES (?)", [answer.newDept], function(err, res) {
      console.log("Department added!")
      mainMenu();
    })
  })
}

function addRole() {
  connection.query("SELECT * FROM department", function (err, res) {
    let depts = res.map(function (department) {
      return department.dept_name
    })
  //   // connection.query("SELECT * FROM employee", function (err, resEmp) {
  //   //   let managers = resEmp.map(function (employee) {
  //   //     return employee.first_name + " " + employee.last_name
  //   //   })
      inquirer.prompt([
        {
          type: "input",
          message: "What is the title of this role?",
          name: "roleTitle"
        },
        {
          type: "input",
          message: "What is the salary of this role?",
          name: "roleSalary"
        },
        {
          type: "list",
          message: "What department is this role in?",
          name: "roleDept",
          choices: depts
        },
      ]).then(function (userInput) {
        let department = res.find(function (department) {
          return department.dept_name === userInput.depts
        })
        let roleTitle = userInput.roleTitle
        // let department = userInput.roleDept
        let roleSalary = userInput.roleSalary

        connection.query(
          "INSERT INTO role SET ?",
          {
            title: roleTitle,
            department_id: department,
            salary: roleSalary
          },
          function(err, res) {
            if (err) throw err;
            
          });
          console.log("Role added!")
          mainMenu();
        });
      }
  )}
      

        // let department = res.find(function (department) {
        //   return department.dept_name === userInput.depts
        // })
        // let roleDept = department.dept_name
        // console.log (role)
        // let roleID = role.id
        // let employee = resEmp.find(function (employee) {
        //   return (employee.first_name + " " + employee.last_name) === userInput.empMgr
        // })
        // // console.log(employee)
        // let managerID = employee.id

  //       connection.query("INSERT INTO role (title, salary, department_id) VALUES(?, ?, ?)", [userInput.roleTitle, userInput.roleSalary, roleDept], function (err, res) {
  //         console.log("Role added!")
  //         mainMenu();
  //       })
  //     })
  //   })
  //  }
// }
