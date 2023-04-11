INSERT INTO department(department_name)
VALUES 
    ("Sales"),
    ("Engineering"),
    ("Legal"),
    ("Human Resources"),
    ("Finance");

INSERT INTO roles (title, salary, department_id)
VALUES 
    ("Sales Lead", 140000, 1),
    ("Account Manager", 120000, 1),
    ("Inside Sales Coordinator", 65000, 1),
    ("Lead Engineer", 150000, 2),
    ("Software Engineer", 120000, 2),
    ("Legal Team Lead", 110000, 3),
    ("Lawyer", 105000, 3),
    ("HR Lead", 85000, 4),
    ("Accountant", 75000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ("John", "Ramon", 1, null),
    ("Mica", "For", 2, 1),
    ("Bob", "Saget", 2, 1),
    ("Michelle", "Castro", 3, 1),
    ("Austin", "Powers", 4, null),
    ("Oscar", "DeLaHoya", 5, 5),
    ("Pablo", "Escobar", 6, null),
    ("Brad", "Gelina", 7, 7),
    ("Jimmy", "Buffet", 7, 7),
    ("Lebron", "Lebron", 8, null),
    ("Yami", "Sukihero", 9, null);

SELECT * FROM department;
SELECT * FROM roles;
SELECT * FROM employee;