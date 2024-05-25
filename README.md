![image](https://github.com/DeotaleChinmay2001/Aerothon6.0/assets/87092070/48fcb1a8-34ac-4687-b5da-f0062f988157)<h1 align="center">
  AIRBUS AEROTHON 6.0 🛫
  <br>
  <img src="https://cdn-icons-png.flaticon.com/512/7893/7893979.png" alt="airplane pic" width="300">
  <br>
</h1>

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Problem Statement](#problem-statement)
- [Proposed Solution](#proposed-solution)
- [Technologies Used](#technologies-used)
- [About The Application](#about-the-application)
- [Architecture](#architecture)
- [Usage](#usage)
- [Contributors](#contributors)

## Problem Statement

## Proposed Solution

## Technologies used
- Frontend: <br/>
   Framework - React<br/>
   Design- Tailwind<br/>
   State Management - redux<br/>
   connection - Axios<br/>
   
- Backend: 
  Framework- Node, Express
  Authentication - JWT
  
- Database: MongoDB
- Python Flask

### About The Application

 Summary of each API endpoint:
 Socket endpoints  - 


socket = io(import.meta.env.VITE_SOCKETURL,{}) :-  Imports the io function from       the socket.io-client library. This function is used to create a Socket.IO client instance.
socket.emit('airportData') :-  The client is requesting data related to airports from the server.
socket.on("airportData",(){} ) :-  Server is listening and will send data related to airports when this event occurs.
socket.on("simulationResponse",{} ) :-  Server is listening and  will respond with simulation data in response to a request or action
socket.on("simulationUpdate",(){} ) :-   Server will send updates related to the simulation.
socket.off("simulationUpdate") :-  Removes the event listener for the simulationUpdate event 
socket.on('updateActiveSimulations', (){} ) :- Server will send updates related to active simulations.
socket.off("airportData") :-  Removes the event listener for the airportData event 
socket.off("simulationResponse") :-   Removes the event listener for the simulationResponse event 


socket.emit("startSimulation", (){} ) :-  Trigger the server to start a simulation process.
socket.emit("pauseSimulation") :-  Pause the simulation process.
socket.emit("resumeSimulation") :-  Resume the simulation process.
socket.emit("stopSimulation") :-  Stop the simulation process
io.on("connection", (socket) {} ) :-  Establish the socket connection between the server and the newly connected client.
socket.on("startSimulation", (){} ) :-  Start the simulation to send the aeroplane data to the client


HTTP endpoints  -
http.createServer(app) :- create an HTTP server in Node.js, using the core http module.

app.use("/api/v1/users", userRoutes) :- mounting the userRoutes middleware or sub-application to the path "/api/v1/users".

router.post('/login', decryptMiddleware,login) :- This route handles POST requests to "/login". When a request is made to this endpoint, it first passes through the decryptMiddleware for decryption if there is encrypted data.

router.post('/validate-token', authenticateToken) :- This route handles POST requests to "/validate-token".It directly goes to the authenticateToken middleware function. This middleware is responsible for validating the token included in the request headers.

app.use("/api/v1/reports", reportRoutes) :-  mounting the reportRoutes middleware or sub-application to the path "/api/v1/reports".

router.get('/allreports', getAllReports) :- it invokes the getAllReports function. This function likely retrieves all reports from the database or some data source and sends them back as a response.

router.get('/user/:userName', getUserReports) :- it invokes the getUserReports function, passing the username as a parameter. This function likely retrieves reports associated with the specified user from the database or some data source and sends them back as a response.



## Usage

Install project dependencies: 

Client
npm init –y
npm install
npm run dev

Backend (Nodejs Server)
npm init –y
npm install
nodemon server.js

Flask Server
python app.py



## Contributors

Team Aerovators
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/DeotaleChinmay2001"><img src="https://avatars.githubusercontent.com/u/95205222?v=4" width="100px;" alt="Chinmay"/><br /><sub><b>Chinmay Deotale</b></sub></a><br /></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/mrudulamore"><img src="https://avatars.githubusercontent.com/u/133312331?v=4" width="100px;" alt="Mrudula"/><br /><sub><b>Mrudula More</b></sub></a><br /></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/rk-4444"><img src="https://avatars.githubusercontent.com/u/84564943?v=4" width="100px;" alt="Rahul"/><br /><sub><b>Rahul kumar</b></sub></a><br /></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Aditi9800/"><img src="https://avatars.githubusercontent.com/u/78742814?v=4" width="100px;" alt="Abhishek"/><br /><sub><b>Aditi Sahu</b></sub></a><br /></td>
    </tr>
  </tbody>
</table>
