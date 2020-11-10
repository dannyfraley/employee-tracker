USE employee_trackerDB;

INSERT INTO department (dept_name)
VALUES ("Administration"), ("Sales"), ("Accounting"), ("Marketing");

INSERT INTO role (title, salary, department_id)
VALUES 
("Chief Executive Officer", 150000, 1),
("Human Resources Director", 80000, 1),
("Employee Benefits Director", 65000, 1), 
("Vice President of Sales", 120000, 2), 
("Sales Manager", 90000, 2),
("Salesperson", 50000, 2),
("Chief Financial Officer", 120000, 3),
("Accounts Receivable Director", 80000, 3),
("Accounts Payable Director", 80000, 3),
("Vice President of Marketing", 100000, 4),
("Art Director", 85000, 4),
("Graphic Designer", 55000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
("Danny", "Fraley", 1, null),
("Angie", "Bottoms", 2, 1),
("Scott", "Schaefer", 3, 1),
("Nick", "Cook", 4, null),
("Erik", "Evans", 5, 4),
("Joe", "Crews", 6, 4),
("Orlando", "Wynn", 7, null),
("Brittany", "Burgess", 8, 7),
("Scott", "Bartholf", 9, 7),
("Kate", "McCullough", 10, null),
("Sarah", "Frydrych", 11, 10),
("Jason", "Hundley", 12, 10);


