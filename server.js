const inquirer = require('inquirer');
const db = require('./config/connection');
require('console.table');

// bringing in the inquirer prompts which have been placed in a separate file for readability
const { openingQuestion, addDepartmentPrompt, generateAddRolePrompt, generateAddEmployeePrompt, generateUpdateEmployeeRolePrompt, generateDeleteDepartmentPrompt } = require('./helpers/prompts');

function init() {
    inquirer.prompt(openingQuestion).then((userInput) => {
      inputHandler(userInput.openingQuestion);
    });
}

// the main function of the application, this will take in the users input on the opening question and call the appropriate functions to view, add, or update the database
async function inputHandler (userInput) {
    switch (userInput) {
        case 'View All Departments':
            await db.query(`SELECT * FROM department`).then((departmentData) => console.table(departmentData[0]));
            break;


        case 'View All Roles':
            await db.query(`SELECT roles.id, roles.title, roles.salary, department.department_name FROM roles RIGHT JOIN department ON roles.department_id = department.id`).then((roleData) => console.table(roleData[0]));
            break;


        case 'View All Employees':
            await db.query(`SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, roles.title, roles.salary FROM employee RIGHT JOIN roles ON employee.role_id = roles.id`).then((employeeData) => console.table(employeeData[0]));
            break;


        case 'Add a Department':
            // add the department name to the database
            await inquirer.prompt(addDepartmentPrompt).then(async (userInput) => {
                await db.query(`INSERT INTO department (department_name) VALUES ('${userInput.departmentName}')`);
            });
            // display the updated table
            await db.query(`SELECT * FROM department`).then((departmentData) => console.table(departmentData[0]));
            break;


        case 'Add a Role':
            // get the up to date list of departments in raw format, then map the raw data to an array of strings of the department names and id's to be used in Inquirer prompts. (the department name is what the user sees, the value is what gets passed back for us to add to the database.)
            let allDepartmentsRaw = await db.query(`SELECT * FROM department`);
            let allDepartmentsFormatted = await allDepartmentsRaw[0].map((department) => ({ name: department.department_name, value: department.id }));
            // generate the add role prompt with the updated list of departments (which gets passed into the choices field for which department the role belongs to)
            let addRolePrompt = await generateAddRolePrompt(allDepartmentsFormatted);
            // prompt the user and then add the role and associated information to the database
            await inquirer.prompt(addRolePrompt).then(async (userInput) => {
                await db.query(`INSERT INTO roles (title, salary, department_id) VALUES ('${userInput.roleTitle}', '${userInput.roleSalary}', '${userInput.roleDepartment}')`);
            });
            // display the updated table
            await db.query(`SELECT roles.id, roles.title, roles.salary, department.department_name FROM roles RIGHT JOIN department ON roles.department_id = department.id`).then((roleData) => console.table(roleData[0]));
            break;


        case 'Add an Employee':
            // !!! in this function I had to append *Add* in the variable names to avoid naming conflicts with the variables in the other cases (specifically the update employee role case).

            // get the up to date list of role titles and format the data to be used in Inquirer prompts
            let allRolesAddRaw = await db.query(`SELECT * FROM roles`);
            let allRolesAddFormatted = await allRolesAddRaw[0].map((role) => ({ name: role.title, value: role.id }));
            // get the up to date list of employee names and format them to be used in Inquirer prompts
            let allEmployeesAddRaw = await db.query(`SELECT * FROM employee`);
            let allEmployeesAddFormatted = await allEmployeesAddRaw[0].map((employee) => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }));
            // generate the add employee prompt with the updated lists of roles and employees (which gets passed into the choices fields for the employee's role and manager)
            let addEmployeePrompt = await generateAddEmployeePrompt(allRolesAddFormatted, allEmployeesAddFormatted);
            // prompt the user and then add the employee and associated information to the database
            await inquirer.prompt(addEmployeePrompt).then(async (userInput) => {
                await db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${userInput.employeeFirstName}', '${userInput.employeeLastName}', '${userInput.employeeRole}', '${userInput.employeeManager}')`);
            });
            // display the updated table
            await db.query(`SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, roles.title, roles.salary FROM employee RIGHT JOIN roles ON employee.role_id = roles.id`).then((employeeData) => console.table(employeeData[0]));
            break;


        case 'Update an Employee Role':
            // !!! in this function I had to append *Update* in the variable names to avoid naming conflicts with the variables in the other cases (specifically the add employee case).

            // get the up to date list of role titles and format the data to be used in Inquirer prompts
            let allRolesUpdateRaw = await db.query(`SELECT * FROM roles`);
            let allRolesUpdateFormatted = await allRolesUpdateRaw[0].map((role) => ({ name: role.title, value: role.id }));
            // get the up to date list of employee names and format them to be used in Inquirer prompts
            let allEmployeesUpdateRaw = await db.query(`SELECT * FROM employee`);
            let allEmployeesUpdateFormatted = await allEmployeesUpdateRaw[0].map((employee) => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }));
            // generate the update employee prompt with the updated lists of roles and employees (which gets passed into the choices fields for the employee to update and the new role)
            let updateEmployeePrompt = await generateUpdateEmployeeRolePrompt(allRolesUpdateFormatted, allEmployeesUpdateFormatted);
            // prompt the user and then update the employee and associated information in the database
            await inquirer.prompt(updateEmployeePrompt).then(async (userInput) => {
                await db.query(`UPDATE employee SET role_id = '${userInput.updatedRole}' WHERE id = '${userInput.employeeToUpdate}'`);
            });
            // display the updated table
            await db.query(`SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, roles.title, roles.salary FROM employee RIGHT JOIN roles ON employee.role_id = roles.id`).then((employeeData) => console.table(employeeData[0]));
            break;


        case 'Delete a Department':
            // get the up to date list of departments and format the data to be used in Inquirer prompts
            let allDepartmentsDeleteRaw = await db.query(`SELECT * FROM department`)
            let allDepartmentsDeleteFormatted = await allDepartmentsDeleteRaw[0].map((department) => ({ name: department.department_name, value: department.id }));
            // generate the delete department prompt with the updated list of departments (which gets passed into the choices field for which department to delete)
            let deleteDepartmentPrompt = await generateDeleteDepartmentPrompt(allDepartmentsDeleteFormatted);
            // prompt the user and delete the department from the database
            await inquirer.prompt(deleteDepartmentPrompt).then(async (userInput) => {
                await db.query(`DELETE FROM department WHERE department.id = ${userInput.departmentToDelete}`);
            });
            // display the updated table
            await db.query(`SELECT * FROM department`).then((departmentData) => console.table(departmentData[0]));
        break;

        
        case 'Exit':
            console.log('Goodbye!')
            process.exit();
            break;


        default:
            console.log('Unable to handle your request!');
            break;
    }
    // after the user has gone through the prompt, call the init function again to prompt the user for another action
    init();
}

init();