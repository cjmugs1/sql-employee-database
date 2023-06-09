# SQL Employee Database
Use the command line to navigate and make changes to an employee database. Built using SQL and ran via node.js.
<br><br>

## Video Walk Through of Application
[Employee Database Walkthrough](https://drive.google.com/file/d/1K_Lin1m7KBi2HXNOxMurnwcmxgSg1u4k/view?usp=sharing)
<br><br>
## --Installation and Usage Info--
After cloning the repo, run *npm i* from the root directory of the project to install the necessary dependencies.  
Then, simply run *npm start* to prompt the application to open in your command line.
<br/><br/>
## Challenge Description | User Story
### **AS A Business Owner**  
I WANT to be able to view and manage the departments, roles, and employees in my company,  
SO THAT I can organize and plan my business.  
### **Acceptance Criteria**
GIVEN a command-line application that accepts user input  
WHEN I start the application,  
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role.  
WHEN I choose to view all departments,  
THEN I am presented with a formatted table showing department names and department ids.  
WHEN I choose to view all roles,  
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role.  
WHEN I choose to view all employees,  
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to.
WHEN I choose to add a department,  
THEN I am prompted to enter the name of the department and that department is added to the database.  
WHEN I choose to add a role,  
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database.  
WHEN I choose to add an employee,  
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database.  
WHEN I choose to update an employee role,  
THEN I am prompted to select an employee to update and their new role and this information is updated in the database.  
<br/>
## Employee Database Screenshot
![Employee Database](./sql-employee-database-screenshot.JPG)