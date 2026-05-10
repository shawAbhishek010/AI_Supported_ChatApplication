# AI Study Assistant

AI Study Assistant is a full-stack chat and note-taking application. The backend is built with Spring Boot and MySQL, and the frontend is built with React, Vite, Tailwind CSS, and WebSocket-based chat streaming. The AI responses are generated through Ollama running locally on your machine.

## Project Structure

```text
AiChatApplication/
|-- Backend-AI-assistant/
|   `-- ai-study-assistant/
|       |-- pom.xml
|       |-- mvnw
|       |-- mvnw.cmd
|       `-- src/
|           |-- main/java/com/ai/assistant/
|           |   |-- config/
|           |   |-- controller/
|           |   |-- dto/
|           |   |-- entity/
|           |   |-- repository/
|           |   |-- security/
|           |   |-- service/
|           |   `-- AiStudyAssistantApplication.java
|           `-- main/resources/application.properties
`-- Frontend-AI-assistant/
    `-- frontend/
        |-- package.json
        |-- vite.config.js
        |-- tailwind.config.js
        `-- src/
            |-- components/
            |-- context/
            |-- hooks/
            |-- pages/
            `-- services/
```

## Main Features

- User registration and login using JWT authentication.
- Protected React routes for logged-in users.
- Real-time AI chat using WebSocket, STOMP, and SockJS.
- Streaming AI responses from the backend to the frontend.
- Chat history saved in MySQL.
- Personal notes with create, read, update, and delete support.
- Dashboard analytics for user activity.
- Guest mode in the frontend for local UI exploration.
- Vite proxy setup so the frontend can call the backend using `/api` and `/ws-chat`.

## Technology Stack

### Backend

- Java 17
- Spring Boot 3.2.3
- Spring Web
- Spring WebSocket
- Spring Security
- Spring Data JPA
- MySQL
- JWT using `jjwt`
- WebFlux `WebClient` for Ollama API calls
- Lombok
- Maven

### Frontend

- React 18
- Vite 5
- React Router
- Tailwind CSS
- Framer Motion
- GSAP
- Axios
- SockJS
- STOMP
- React Markdown
- Syntax highlighter

### AI Runtime

- Ollama
- Default model configured in the backend: `llama3.2`

## Prerequisites

Install these before running the project:

1. Java 17 or newer
2. Node.js 18 or newer
3. npm
4. MySQL Server
5. Ollama
6. Git, optional but recommended

Check installed versions:

```powershell
java -version
node -v
npm -v
mysql --version
ollama --version
```

## Database Setup

The backend uses MySQL. The configured database name is:

```text
ai_study_assistant
```

Create the database before starting the Spring Boot server:

```sql
CREATE DATABASE ai_study_assistant;
```

The backend currently uses this database configuration in `Backend-AI-assistant/ai-study-assistant/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ai_study_assistant
spring.datasource.username=root
spring.datasource.password=Abhishek1234
spring.jpa.hibernate.ddl-auto=update
```

If your MySQL username or password is different, update `application.properties` before starting the backend.

`spring.jpa.hibernate.ddl-auto=update` means Hibernate will create or update the required tables automatically when the server starts.

## Ollama Setup

The backend sends prompts to Ollama at:

```text
http://localhost:11434
```

The configured model is:

```text
llama3.2
```

Start Ollama and pull the model:

```powershell
ollama pull llama3.2
```

You can test Ollama separately:

```powershell
ollama run llama3.2
```

If you want to use another installed model, change this property:

```properties
ollama.chat.model=llama3.2
```

For example:

```properties
ollama.chat.model=mistral
```

## Backend Configuration

Backend config file:

```text
Backend-AI-assistant/ai-study-assistant/src/main/resources/application.properties
```

Important properties:

```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/ai_study_assistant
spring.datasource.username=root
spring.datasource.password=Abhishek1234
jwt.secret=5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437
jwt.expiration=86400000
ollama.base-url=http://localhost:11434
ollama.chat.model=llama3.2
cors.allowed.origins=http://localhost:3000
```

Notes:

- Backend server runs on `http://localhost:8080`.
- JWT expiration is `86400000` milliseconds, which is 24 hours.
- The frontend dev server runs on `http://localhost:3000`.
- The frontend proxies API and WebSocket requests to the backend.
- For production, do not keep real database passwords or JWT secrets directly in `application.properties`. Use environment variables or a secret manager.

## How To Start The Server First

Open a terminal at the project root:

```powershell
cd D:\PlacementNotes\AiChatApplication
```

Go to the backend folder:

```powershell
cd Backend-AI-assistant\ai-study-assistant
```

Start the Spring Boot backend using the Maven wrapper:

```powershell
.\mvnw.cmd spring-boot:run
```

On macOS or Linux, use:

```bash
./mvnw spring-boot:run
```

The backend is ready when you see logs showing that Tomcat started on port `8080`.

Backend URL:

```text
http://localhost:8080
```

## How To Start The Frontend Application After The Server

Open a second terminal. Keep the backend terminal running.

Go to the frontend folder:

```powershell
cd D:\PlacementNotes\AiChatApplication\Frontend-AI-assistant\frontend
```

Install dependencies:

```powershell
npm install
```

Start the frontend development server:

```powershell
npm run dev
```

Open the application in your browser:

```text
http://localhost:3000
```

## Correct Startup Order

Use this order every time:

1. Start MySQL.
2. Create the `ai_study_assistant` database if it does not exist.
3. Start Ollama and make sure the configured model is installed.
4. Start the Spring Boot backend server.
5. Start the React frontend application.
6. Open `http://localhost:3000`.

## Frontend Proxy Behavior

The frontend uses this backend target in `vite.config.js`:

```js
const backendUrl = process.env.VITE_BACKEND_URL || "http://localhost:8080";
```

During development:

- Requests to `/api` are proxied to `http://localhost:8080/api`.
- Requests to `/ws-chat` are proxied to `http://localhost:8080/ws-chat`.

This is why the frontend service files can use simple paths like:

```js
baseURL: import.meta.env.VITE_API_URL || "/api"
```

and:

```js
const socketUrl = import.meta.env.VITE_WS_URL || "/ws-chat";
```

If your backend runs on a different port, start Vite with a different backend URL:

```powershell
$env:VITE_BACKEND_URL="http://localhost:8081"
npm run dev
```

## Application Routes

Frontend routes:

| Route | Purpose |
| --- | --- |
| `/login` | Login, registration, and guest mode |
| `/chat` | AI chat screen |
| `/history` | Previous chat history |
| `/notes` | Personal saved notes |
| `/profile` | User profile page |
| `/` | Redirects to `/chat` when logged in, otherwise `/login` |

Protected routes require a JWT token in browser local storage.

## Backend API Endpoints

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create a new user |
| `POST` | `/api/auth/login` | Login and receive a JWT token |

Request body:

```json
{
  "username": "abhishek",
  "password": "password123"
}
```

Response body:

```json
{
  "token": "jwt-token",
  "username": "abhishek",
  "email": "abhishek@example.com"
}
```

### Chat History

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/chat/history` | Get logged-in user's chat history |
| `GET` | `/api/history` | Get logged-in user's chat history |

### Notes

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/notes` | Get all notes for the logged-in user |
| `POST` | `/api/notes` | Create a note |
| `PUT` | `/api/notes/{id}` | Update a note |
| `DELETE` | `/api/notes/{id}` | Delete a note |

Note request body:

```json
{
  "title": "Spring Boot Notes",
  "content": "Important points about controllers, services, and repositories."
}
```

### Dashboard

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/dashboard` | Get dashboard analytics for the logged-in user |

## WebSocket Chat Flow

WebSocket endpoint:

```text
/ws-chat
```

STOMP application destination prefix:

```text
/app
```

Message destination used by the frontend:

```text
/app/sendMessage
```

Backend sends messages to:

```text
/user/queue/messages
/user/queue/stream
/user/queue/errors
```

The frontend passes the JWT token in the STOMP connection headers:

```js
connectHeaders: { Authorization: `Bearer ${token}` }
```

## Backend Package Explanation

```text
config/
```

Contains Spring configuration classes:

- `SecurityConfig.java` configures JWT-based security.
- `WebConfig.java` contains web-related configuration.
- `WebSocketConfig.java` enables STOMP WebSocket messaging.

```text
controller/
```

Contains REST and WebSocket controllers:

- `AuthController.java` handles register and login.
- `ChatController.java` exposes chat history.
- `ChatWebSocketController.java` handles real-time chat messages.
- `NotesController.java` handles notes CRUD.
- `HistoryController.java` exposes history data.
- `DashboardController.java` exposes analytics data.

```text
dto/
```

Contains request and response objects used between frontend and backend.

```text
entity/
```

Contains JPA database entities:

- `User`
- `ChatMessage`
- `SavedNote`
- `Analytics`

```text
repository/
```

Contains Spring Data JPA repositories for database access.

```text
security/
```

Contains JWT and authentication logic:

- JWT creation and validation.
- Request filtering.
- WebSocket authentication.
- User details loading.

```text
service/
```

Contains business logic:

- Authentication
- Chat saving and retrieval
- Analytics
- Ollama communication
- AI response streaming

## Frontend Folder Explanation

```text
src/pages/
```

Top-level screens:

- `Login.jsx`
- `Chat.jsx`
- `History.jsx`
- `Notes.jsx`
- `Profile.jsx`

```text
src/components/
```

Reusable UI components such as navbar, sidebar, chat box, message rendering, loading skeleton, and error boundary.

```text
src/context/
```

Contains `AuthContext.jsx`, which stores login state, JWT token, user data, logout logic, registration, and guest mode.

```text
src/services/
```

Contains frontend API clients:

- `api.js` creates the Axios instance.
- `authService.js` calls login and register endpoints.
- `socket.js` manages WebSocket/STOMP connection.

```text
src/hooks/
```

Contains custom React hooks for chat and typing effects.

```text
src/animations/
```

Contains animation helpers and particle-related code.

## Build Commands

### Backend

Run tests:

```powershell
cd Backend-AI-assistant\ai-study-assistant
.\mvnw.cmd test
```

Build the backend jar:

```powershell
.\mvnw.cmd clean package
```

Run the built jar:

```powershell
java -jar target\ai-study-assistant-0.0.1-SNAPSHOT.jar
```

### Frontend

Build the frontend:

```powershell
cd Frontend-AI-assistant\frontend
npm run build
```

Preview the production build:

```powershell
npm run preview
```

## Troubleshooting

### Backend fails to connect to MySQL

Check that:

- MySQL server is running.
- Database `ai_study_assistant` exists.
- Username and password in `application.properties` are correct.
- MySQL is listening on port `3306`.

### Port 8080 is already in use

Change the backend port in `application.properties`:

```properties
server.port=8081
```

Then tell Vite to proxy to the new port:

```powershell
$env:VITE_BACKEND_URL="http://localhost:8081"
npm run dev
```

### Port 3000 is already in use

Change the Vite port in `Frontend-AI-assistant/frontend/vite.config.js`:

```js
server: {
  port: 3001
}
```

Then open:

```text
http://localhost:3001
```

### AI chat does not respond

Check that:

- Ollama is installed.
- Ollama is running.
- The configured model is installed.
- `ollama.base-url` is `http://localhost:11434`.

Useful commands:

```powershell
ollama list
ollama pull llama3.2
ollama run llama3.2
```

### Login works but protected requests fail

Check that:

- The browser has a `token` value in local storage.
- The frontend sends the `Authorization: Bearer <token>` header.
- The backend JWT secret has not changed since the token was created.

If needed, log out and log in again.

### WebSocket connection fails

Check that:

- Backend is running on `localhost:8080`.
- Frontend is running through Vite on `localhost:3000`.
- `/ws-chat` is proxied by `vite.config.js`.
- The user is logged in before opening the chat.

## Quick Start Summary

Terminal 1:

```powershell
cd D:\PlacementNotes\AiChatApplication\Backend-AI-assistant\ai-study-assistant
.\mvnw.cmd spring-boot:run
```

Terminal 2:

```powershell
cd D:\PlacementNotes\AiChatApplication\Frontend-AI-assistant\frontend
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```
