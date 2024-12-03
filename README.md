# School Timetable Management App Backend

## Overview

This is the backend service for the **School Timetable Management App**, built using **Express.js** and a **local MySQL database**. It serves as the backbone for managing timetables, facilitating real-time chat communication, and handling CRUD operations for all entities in the system. The backend communicates with the client app, ensuring smooth data flow and responsiveness.

---

## Key Features

1. **Modular Architecture**: 
   - Built using the **Controller-Service-Repository** design pattern for scalability and maintainability.

2. **Socket Communication**:
   - Enables real-time interactions between the backend and client app for functionalities such as live updates and chat.

3. **Database Integration**:
   - Interfaces with a **local MySQL database** to store and retrieve timetable data and user information.

4. **Error Handling**:
   - Comprehensive error management to ensure reliable and consistent communication between the backend and client app.

---

## Technologies Used

- **Backend Framework**: Express.js
- **Database**: MySQL
- **Socket Communication**: Socket.io
- **Dependency Management**: npm
- **Secure Tunnels**: ngrok (for development/testing purposes)

---

## Project Structure

.
- ├── controllers/       # Handles HTTP requests and delegates tasks to services 
- ├── node_modules/      # Node.js dependencies 
- ├── repository/        # Manages direct database interactions (queries and updates) 
- ├── schedules/         # Contains logic for handling and updating timetables 
- ├── service/           # Implements business logic and workflows 
- ├── README.md          # Project documentation 
- ├── app.js             # Main application entry point 
- ├── data.router.js     # Defines API routes for various entities 
- ├── ngrok.exe          # Ngrok executable for secure tunnels (optional) 
- ├── package-lock.json  # Dependency lock file for consistent builds 
- └── package.json       # Node.js project metadata and dependency management


---

## Installation and Setup

### Prerequisites
- **Node.js** (v14+ recommended)
- **MySQL** (installed locally)
- **ngrok** (optional, for secure tunnels during development)

### Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend

    Install dependencies:

npm install

Set up the MySQL database:

    Create a local MySQL database and configure the connection in the .env file.
    Example .env file:

    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=yourpassword
    DB_NAME=school_timetable

Run the backend server:

node app.js

Optionally, start ngrok for secure tunnels:

    ./ngrok.exe http 3000

API Endpoints
Base URL

http://localhost:3000
Example Endpoints

    GET /timetable: Retrieve all timetable entries.
    POST /timetable: Add a new timetable entry.
    PUT /timetable/:id: Update a specific timetable entry.
    DELETE /timetable/:id: Delete a specific timetable entry.
    Socket Communication: Handles events such as chatMessage and scheduleUpdate.

Contributing

Contributions are welcome! If you find any issues or want to propose enhancements, feel free to create a pull request or open an issue in the repository.
License

This project is licensed under the MIT License.
