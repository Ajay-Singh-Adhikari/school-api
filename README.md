# School Management API

A simple Node.js + Express + MySQL backend project for managing schools.  
The API allows you to **add schools** and **list schools sorted by proximity** to a given location.

# Features
- Add new schools with name, address, latitude, and longitude
- Retrieve schools sorted by proximity (using latitude & longitude in query params)
- MySQL database integration
- Environment variable configuration with `.env`
- Ready-to-use REST API (tested with Postman)

# Tech Stack
- **Node.js**
- **Express.js**
- **MySQL (mysql2/promise)**
- **dotenv**

## Getting Started

Follow these steps to run the project on your local machine:

1.Download this repository as a ZIP file, then extract it.
2.Open the project folder in VS Code (or any editor of your choice).
3.Run "npm install" command on the command line of the editor to install all the web dependencies.
4.Inside the project root, create a file named .env and add the following environment variables:
PORT=<your-browser-port>
DB_HOST=localhost
DB_USER=<your-username>
DB_PASSWORD=<your-password>
DB_NAME=<your-database-name>
DB_PORT=<your-database-port>
5.Use npm start command to run the backend server.
6.To see the List of Schools (can use browser or postman both) :-
Method: GET 
Route: http://localhost:3000/listSchools?latitude=28.6139&longitude=77.2090
7.TO Add a School (use Postman) :-
Method: POST
Route: http://localhost:3000/addSchool


NOw you are ready to go.....
