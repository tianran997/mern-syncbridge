# SyncBridge
#### Video Demo: https://youtu.be/DkqyyDbcnYo
#### Description:

**SyncBridge** is a minimalist file and message transfer tool built for individual users to seamlessly **sync content across their own multiple devices**. Whether you're working on a laptop, phone, tablet, or desktop, SyncBridge allows you to easily send files, images, or text from one device and access them instantly on another — simply by **logging into the same account**. It is built using **Flask** (Python), **HTML/CSS/JS**, and uses **AJAX** to provide live updates without requiring the page to reload.

The app is intentionally simple and fast. One of the key features of the app is that **shared messages and files expire after 24 hours**, keeping the interface clean and relevant. Of course, users can clear the interface manually by clicking the **Clear All** button.

#### 1. Features

- Real-time message updates every 3 seconds using JavaScript and `fetch()`
- Drag-and-drop file upload support
- “Copy” buttons for each shared message
- One-click "Clear All" to erase shared content
- 24-hour expiration for all messages/files using database timestamps
- Simple session-based user login


#### 2. Backend (Flask)

The main backend file is `app.py`. It includes the following key routes:

- `/` – Displays the main page (requires login via session)
- `/register`- Allows a user to register with a username and password.
- `/login` – Allows a user to log in with the username and password.
- `/logout` – Clears the session and returns to login screen
- `/send_message` – Receives POST requests to store new text messages
- `/upload` – Handles file uploads via drag-and-drop or file select
- `/uploads/<username>/<filename>` - To ensure that users only access their own uploaded files
- `/messages` – Returns all messages/files from the last 24 hours in JSON
- `/clear` – Deletes all content for all users (for demo purposes)

All text and file messages are stored in a **SQLite** database (`sync.db`) located in the root of the project. This database contains two primary tables: one for users, and one for messages. Messages include both text and file records, and each message is associated with a user ID and a timestamp.

Old messages (older than 24 hours) are automatically excluded from the interface for cleanliness and privacy, though they may still exist in the database unless explicitly cleared.

#### 3. Frontend (HTML + JS + CSS)

The frontend uses a clean, responsive layout with a card-based UI. The styling (`style.css`) uses flexbox layout for dividing content, and includes both light and dark mode support.

In `script.js`, JavaScript handles:

- Submitting messages asynchronously
- Drag-and-drop file upload via `fetch` and `FormData`
- Auto-refreshing shared content via `setInterval(loadMessages, 3000)`
- Showing buttons that copy content directly to the clipboard
- Dynamically creating DOM elements based on returned JSON data. This makes the frontend fully dynamic without needing any page refresh.

#### 4. Database Schema

The `sync.db` database consists of two primary tables:

- `users`: Contains `id`, `username`, and `password_hash` columns. Passwords are securely hashed using Werkzeug's `generate_password_hash()` function.
- `messages`: Contains `id`, `user_id`, `type` (`text` or `file`), `content` (the message string or filename), and `timestamp`.

Each message is linked to a specific user via the foreign key `user_id`, allowing user-specific filtering of content. The `timestamp` is stored as a UNIX epoch time (`float`), making it easy to filter out expired content after 24 hours.


#### 5. Design Decisions

- **Clipboard Integration**: Each message has a “Copy to clipboard” button for quick transfer of text or links between devices.
- **Session Authentication**: Uses Flask-Session with filesystem-based storage to persist login sessions.
- **Security**: File uploads are restricted to a safe set of extensions and sanitized with `secure_filename()`; session checks ensure users only access their own uploads.
- **Shared Layout (layout.html)**: Login and register pages use a common base layout for consistent styling and maintainability.
- **AJAX-based UI**: JavaScript (`script.js`) handles asynchronous interaction using `fetch()` and polls new content every 3 seconds for a real-time feel.