# Educase School Management API

This is a Node.js and Express API built for the Educase assignment. It allows users to add school data to a MySQL database and retrieve a list of schools sorted by their geographical distance from a user's current location.

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MySQL (Hosted on TiDB Cloud)
- **Code Formatting:** Prettier

## Features
- **`POST /addSchool`**: Validates and stores a new school's name, address, latitude, and longitude.
- **`GET /listSchools`**: Fetches all schools and sorts them by proximity to the user-provided latitude and longitude using the Haversine formula.

## Local Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Abhinav943/SchoolAPI
   cd SchoolAPI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:** Create a `.env` file in the root directory and add your MySQL database credentials:
   ```env
   DB_HOST=your_db_host
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   DB_PORT=4000
   PORT=3000
   ```

4. **Run the Server:**
   ```bash
   npm run dev
   ```