# SyncBridge
#### Video Demo: https://youtu.be/DkqyyDbcnYo

#### Description:

**SyncBridge** is a minimalist file and message transfer tool built for individual users to seamlessly **sync content across their own multiple devices**. Whether you're working on a laptop, phone, tablet, or desktop, SyncBridge allows you to easily send files, images, or text from one device and access them instantly on another — simply by **logging into the same account**. 

This version is rebuilt using the **MERN stack** (MongoDB, Express.js, React, Node.js) to provide a modern, scalable, and maintainable architecture with improved performance and user experience.

## ✨ Features

- **Real-time message updates** every 3 seconds using React state and `fetch()`
- **Drag-and-drop file upload** support with visual feedback
- **"Copy" buttons** for each shared message with instant clipboard integration
- **One-click "Clear All"** to erase all shared content
- **24-hour expiration** for all messages/files using MongoDB TTL indexes
- **JWT-based authentication** with secure user sessions
- **Responsive design** with light and dark mode support
- **Modern React UI** with component-based architecture

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Multer** - File upload handling
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - Frontend library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Modern CSS** - Responsive styling with Flexbox

## Project Structure

```
syncbridge-mern/
├── backend/
│   ├── server.js              # Main server file
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Message.js         # Message schema
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   └── messages.js        # Message & file routes
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── uploads/               # File storage directory
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js       # Login component
│   │   │   ├── Register.js    # Registration component
│   │   │   └── Dashboard.js   # Main dashboard
│   │   ├── App.js             # Main app component
│   │   ├── App.css           # Global styles
│   │   └── index.js          # App entry point
│   ├── public/
│   │   └── index.html
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Git

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd syncbridge-mern
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create environment file
cat > .env << 'EOF'
MONGODB_URI=mongodb://localhost:27017/syncbridge
JWT_SECRET=your-very-secure-secret-key-here
PORT=5001
EOF

# Start the backend server
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Start the React development server
npm start
```

### 4. MongoDB Setup

**MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in backend `.env` file

## 💾 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  username: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Message Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  type: String ('text' | 'file'),
  content: String,
  createdAt: Date (with TTL index: 24 hours),
}
```

## 🔧 Key Features Explained

### 1. Real-time Updates
React components use `useEffect` and `setInterval` to poll for new messages every 3 seconds, providing near real-time synchronization across devices.

### 2. File Upload System
- **Backend**: Uses Multer middleware to handle multipart/form-data
- **Frontend**: Supports both drag-and-drop and click-to-select file upload
- **Security**: Files are stored in user-specific directories and access is authenticated

### 3. Authentication Flow
- JWT tokens stored in localStorage
- Protected routes using authentication middleware
- Automatic token validation on each API request

### 4. Automatic Cleanup
MongoDB TTL (Time To Live) indexes automatically remove messages older than 24 hours, keeping the database clean without manual intervention.

### 5. Cross-Device Sync
Users can log in from multiple devices simultaneously. All devices will show the same synchronized content through the polling mechanism.

## 🔒 Security Features

- **Password hashing**: bcryptjs with salt rounds
- **JWT authentication**: Secure token-based sessions
- **File access control**: Users can only access their own uploaded files
- **Input validation**: Server-side validation for all inputs
- **CORS configuration**: Proper cross-origin resource sharing setup

## 🚦 Usage

1. **Register/Login**: Create an account or log in with existing credentials
2. **Send Messages**: Type in the text field and click "Send"
3. **Upload Files**: Drag files onto the drop zone or click to select
4. **Copy Content**: Use the copy button next to each message
5. **Access on Other Devices**: Log in with the same account on any device
6. **Clean Up**: Use "Clear All" button to remove all content

## 🔄 Differences from Flask Version

| Feature | Flask Version | MERN Version |
|---------|---------------|--------------|
| **Backend** | Flask + SQLite | Express.js + MongoDB |
| **Frontend** | Server-rendered HTML | React SPA |
| **Authentication** | Flask sessions | JWT tokens |
| **Database** | SQLite with manual queries | MongoDB with Mongoose ODM |
| **Real-time Updates** | JavaScript polling | React state management |
| **Architecture** | Monolithic | Separated frontend/backend |
| **Scalability** | Limited | Highly scalable |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Future Enhancements

- [ ] WebSocket integration for true real-time updates
- [ ] File preview functionality
- [ ] Bulk file operations
- [ ] Message search and filtering
- [ ] Mobile app development
- [ ] End-to-end encryption
- [ ] File sharing with expiration links
- [ ] User profile management
