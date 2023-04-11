const inquirer = require('inquirer');
// const { map } = require('rxjs');
const db = require('./config/connection');
require('console.table');

// bringing in the inquirer prompts which have been placed in a separate file for readability
const { openingQuestion, addDepartmentPrompt, generateAddRolePrompt, generateAddEmployeePrompt, generateUpdateEmployeeRolePrompt } = require('./helpers/prompts');

function init() {
    inquirer.prompt(openingQuestion).then((userInput) => {
      inputHandler(userInput);
    });
}

async function inputHandler (userInput) {
    switch (userInput) {
        case 'View All Departments':
            db.query(`SELECT * FROM department`).then((departmentData) => console.table(departmentData[0]));
            break;
        case 'View All Roles':
            db.query(`SELECT * FROM roles`).then((roleData) => console.table(roleData[0]));
            break;
        case 'View All Employees':
            db.query(`SELECT * FROM employee`).then((employeeData) => console.table(employeeData[0]));
            break;
        case 'Add a Department':
            // add the department name to the database
            await inquirer.prompt(addDepartmentPrompt).then((userInput) => {
                db.query(`INSERT INTO department (name) VALUES ('${userInput['departmentName']}')`);
            });
            // display the updated table
            db.query(`SELECT * FROM department`).then((departmentData) => console.table(departmentData[0]));
            break;
        case 'Add a Role':
            // get the up to date list of departments
            let allDepartments = db.query(`SELECT * FROM department`)
            // generate the add role prompt with the updated list of departments (which gets passed into the choices field for which department the role belongs to)
            let addRolePrompt = generateAddRolePrompt(allDepartments);
            // add the role and associated information to the database
            await inquirer.prompt(addRolePrompt).then((userInput) => {
                db.query(`INSERT INTO roles (title, salary, department_id) VALUES ('${userInput['roleTitle']}', '${userInput['roleSalary']}', '${userInput['roleDepartment']}')`);
            });
            // display the updated table
            db.query(`SELECT * FROM roles`).then((roleData) => console.table(roleData[0]));
            break;
        case 'Add an Employee':
            
            break;
        case 'Update an Employee Role':
            updateEmployeeRole();
            break;
        case 'Exit':
            console.log('Goodbye!')
            process.exit();
            break;
        default:
            console.log('Unable to handle your request!');
            break;
    }
    init();
}