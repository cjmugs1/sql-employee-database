const inquirer = require('inquirer');
// const { map } = require('rxjs');
const db = require('./config/connection');
require('console.table');

// bringing in the inquirer prompts which have been placed in a separate file for readability
const { openingQuestion, addDepartmentPrompt, generateAddRolePrompt, generateAddEmployeePrompt, generateUpdateEmployeeRolePrompt } = require('./helpers/prompts');

function init() {
    inquirer.prompt(openingQuestion).then((userInput) => {
      inputHandler(userInput.openingQuestion);
    });
}

// the main function of the application, this will take in the users input on the opening question and call the appropriate functions to view, add, or update the database
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
                db.query(`INSERT INTO department (department_name) VALUES ('${userInput['departmentName']}')`);
            });
            // display the updated table
            db.query(`SELECT * FROM department`).then((departmentData) => console.table(departmentData[0]));
            break;

        case 'Add a Role':
            // get the up to date list of departments
            let allDepartments = await db.query(`SELECT department_name FROM department`)
            // generate the add role prompt with the updated list of departments (which gets passed into the choices field for which department the role belongs to)
            let addRolePrompt = await generateAddRolePrompt(allDepartments);
            // add the role and associated information to the database
            await inquirer.prompt(addRolePrompt).then((userInput) => {
                db.query(`INSERT INTO roles (title, salary, department_id) VALUES ('${userInput['roleTitle']}', '${userInput['roleSalary']}', '${userInput['roleDepartment']}')`);
            });
            // display the updated table
            db.query(`SELECT * FROM roles`).then((roleData) => console.table(roleData[0]));
            break;

        case 'Add an Employee':

            // !!! in this function I had to append *add* to the end of the variable names to avoid naming conflicts with the variables in the other cases (specifically the update employee role case).

            // get the up to date list of role titles
            let allRolesAdd = await db.query(`SELECT title FROM roles`);
            // get the up to date list of employees and map them to an array of strings of first and last names
            let allEmployeesAddRaw = await db.query(`SELECT * FROM employee`);
            let allEmployeesAdd = allEmployeesAddRaw.map((employee) => `${employee.first_name} ${employee.last_name}`);
            // generate the add employee prompt with the updated lists of roles and employees (which gets passed into the choices fields for the employee's role and manager)
            let addEmployeePrompt = await generateAddEmployeePrompt(allRolesAdd, allEmployeesAdd);
            // add the employee and associated information to the database
            await inquirer.prompt(addEmployeePrompt).then(async (userInput) => {
                // get the id of the employee's role
                let roleId = await db.query(`SELECT id FROM roles WHERE title = '${userInput['employeeRole']}'`);
                // split the manager name into first and last and then get the id of the manager
                let managerFirstName = userInput['employeeManager'].split(' ')[0];
                let managerLastName = userInput['employeeManager'].split(' ')[1];
                let managerId = await db.query(`SELECT id FROM employee WHERE first_name = '${managerFirstName}' AND last_name = '${managerLastName}'`);
                // add the employee to the database
                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${userInput['employeeFirstName']}', '${userInput['employeeLastName']}', '${roleId}', '${managerId}')`);
            });
            // display the updated table
            db.query(`SELECT * FROM employee`).then((employeeData) => console.table(employeeData[0]));
            break;

        case 'Update an Employee Role':

            // !!! in this function I had to append *update* to the end of the variable names to avoid naming conflicts with the variables in the other cases (specifically the add employee case).

            // get the up to date list of role titles
            let allRolesUpdate = await db.query(`SELECT title FROM roles`);
            // get the up to date list of employees and map them to an array of strings of first and last names
            let allEmployeesUpdateRaw = await db.query(`SELECT * FROM employee`);
            let allEmployeesUpdate = allEmployeesUpdateRaw.map((employee) => `${employee.first_name} ${employee.last_name}`);
            // generate the update employee role prompt with the updated lists of roles and employees (which gets passed into the choices fields for the employee's role and manager)
            let updateEmployeePrompt = await generateUpdateEmployeeRolePrompt(allRolesUpdate, allEmployeesUpdate);

            await inquirer.prompt(updateEmployeePrompt).then(async (userInput) => {
                // get the id of the employee's updated role (the id of their new role)
                let updatedRoleId = await db.query(`SELECT id FROM roles WHERE title = '${userInput['role']}'`);
                // get the first and last name of the employee we are updating and then get their id
                let employeeFirstName = userInput['employee'].split(' ')[0];
                let employeeLastName = userInput['employee'].split(' ')[1];
                let employeeId = await db.query(`SELECT id FROM employee WHERE first_name = '${employeeFirstName}' AND last_name = '${employeeLastName}'`);
                // update the employee's role in the database
                db.query(`UPDATE employee SET role_id = '${updatedRoleId}' WHERE id = '${employeeId}'`);
            });
            // display the updated table
            db.query(`SELECT * FROM employee`).then((employeeData) => console.table(employeeData[0]));
            break;

        case 'Exit':
            console.log('Goodbye!')
            process.exit();
            break;

        default:
            console.log('Unable to handle your request!');
            break;
    }
    // call the init function again to prompt the user for another action
    init();
}

init();