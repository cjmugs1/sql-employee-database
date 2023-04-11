const openingQuestion = [
    {
        type: 'list',
        name: 'openingQuestion',
        message: 'What would you like to do?',
        choices: [
            'View All Departments',
            'View All Roles',
            'View All Employees',
            'Add a Department',
            'Add a Role',
            'Add an Employee',
            'Update an Employee Role',
            'Delete a Department',
            'Exit'
        ]
    }
]

const addDepartmentPrompt = [
    {
        type: 'input',
        name: 'departmentName',
        message: 'What is the name of the department you would like to add?'
    }
]

const generateAddRolePrompt = (allDepartments) => {
    return [
        {
            type: 'input',
            name: 'roleTitle',
            message: 'What is the title of the role?',
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: 'What is the salary of the role?',
        },
        {
            type: 'list',
            name: 'roleDepartment',
            message: 'What department does this role belong to?',
            choices: allDepartments
        }
    ]
}

const generateAddEmployeePrompt = (allRoles, allEmployees) => {
    return [
        {
            type: 'input',
            name: 'employeeFirstName',
            message: 'What is the first name of the employee?',
        },
        {
            type: 'input',
            name: 'employeeLastName',
            message: 'What is the last name of the employee?',
        },
        {
            type: 'list',
            name: 'employeeRole',
            message: 'What is the employee\'s role?',
            choices: allRoles
        },
        {
            type: 'list',
            name: 'employeeManager',
            message: 'Who is the employee\'s manager?',
            choices: allEmployees
        }
    ]
}

const generateUpdateEmployeeRolePrompt = (allRoles, allEmployees) => {
    return [
        {
            type: 'list',
            name: 'employeeToUpdate',
            message: 'Which employee\'s role would you like to update?',
            choices: allEmployees
        },
        {
            type: 'list',
            name: 'updatedRole',
            message: 'What is the employee\'s new role?',
            choices: allRoles
        }
    ]
}

const generateDeleteDepartmentPrompt = (allDepartments) => {
    return [
        {
            type: 'list',
            name: 'departmentToDelete',
            message: 'Which department would you like to delete?',
            choices: allDepartments
        }
    ]
}

module.exports = { openingQuestion, addDepartmentPrompt, generateAddRolePrompt, generateAddEmployeePrompt, generateUpdateEmployeeRolePrompt, generateDeleteDepartmentPrompt };