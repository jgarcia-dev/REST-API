# REST API


## Description
- A REST API created with Express.
- The API provides a way to administer a school database.
- Users and courses can be created.
- Coursers can be updated and deleted.
- Users must be authenticated to create, edit, or delete courses.
- Sequelize validation and constraints are used to ensure requests are property submitted.
- User passwords are hashed before they are stored to the database.



## Running Application
1. Run `npm install` to install dependencies
2. Run `npm run seed` to create and seed database
3. Run `npm start` to run application on local host



## Technologies

- Sqlite3 for database
- Sequelize for ORM
- Express web framework
- bcryptjs for password hashing