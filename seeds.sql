-- INSERT INTO tableName (column 1, column 2) VALUES (value for column 1, value for column 2)

INSERT INTO department (id, department_name) VALUES (1, "Engineering");
INSERT INTO department (id, department_name) VALUES (2, "Accounting");
INSERT INTO department (id, department_name) VALUES (3, "Marketing");


INSERT INTO role (id, title, salary, department_id) VALUES (1, "Lead Engineer", 100000.00, 1);
INSERT INTO role (id, title, salary, department_id) VALUES (2, "Engineer", 80000.00, 1);
INSERT INTO role (id, title, salary, department_id) VALUES (3, "Junior Engineer", 60000.00, 1);
INSERT INTO role (id, title, salary, department_id) VALUES (4, "Accountant", 95000.00, 2);
INSERT INTO role (id, title, salary, department_id) VALUES (5, "Fundraising", 55000.00, 2);
INSERT INTO role (id, title, salary, department_id) VALUES (6, "Online Marketing", 75000.00, 3);
INSERT INTO role (id, title, salary, department_id) VALUES (7, "Other Marketing", 70000.00, 3);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (1, "Jess", "Jones", 1, null);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (2, "Mark", "Williams", 2, 1);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (3, "Babe", "Ruth", 7, null);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (4, "Robin", "Williams", 5, 3);