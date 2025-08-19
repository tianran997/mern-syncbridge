import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import BASE_URL from '../config';

// Use direct URL instead of config file for now
const API_BASE_URL = BASE_URL;

function Dashboard({ user, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
      console.log('Messages loaded:', response.data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      console.log('Sending message to:', `${BASE_URL}/messages/text`);
      await axios.post(`${BASE_URL}/messages/text`, 
        { message: newMessage },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setNewMessage('');
      loadMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };
  // 上传文件（修复接口）
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      console.log('Uploading file to:', `${BASE_URL}/messages/upload`);
      
      const response = await axios.post(`${BASE_URL}/messages/upload`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Upload response:', response.data);
      loadMessages();
    } catch (error) {
      console.error('Failed to upload file:', error);
      alert(`Upload failed: ${error.response?.data?.message || error.message}`);
    }
  };


  const clearMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/messages/clear`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadMessages();
    } catch (error) {
      console.error('Failed to clear messages:', error);
    }
  };

  const copyToClipboard = async (text, button) => {
    try {
      await navigator.clipboard.writeText(text);
      const originalText = button.textContent;
      button.textContent = '✅Copied';
      setTimeout(() => {
        button.textContent = originalText;
      }, 1000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      console.log('File dropped:', file.name);
      uploadFile(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('File selected:', file.name);
      uploadFile(file);
    }
  };

  const textMessages = messages.filter(msg => msg.type === 'text');
  const fileMessages = messages.filter(msg => msg.type === 'file');

  return (
    <div className="container">
      <div className="top-bar">
        <h1>Hello, {user.username}</h1>
        <button className="btn btn-danger" onClick={onLogout}>
          Log out
        </button>
      </div>

      <div className="card">
        <form onSubmit={sendMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            required
          />
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>

        <div 
          className="dropzone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          📎 Drag & Drop file here or click to select
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          accept=".txt,.pdf,.png,.jpg,.jpeg,.docx"
        />
      </div>

      <div className="card">
        <button className="btn btn-danger" onClick={clearMessages}>
          🗑 Clear All
        </button>
        <h2>Shared Content (Last 24h)</h2>
        
        <div className="content-container">
          <div className="text-column">
            <h3>Messages ({textMessages.length})</h3>
            {textMessages.map((msg, index) => (
              <div key={index} className="message">
                <span>{msg.content}</span>
                <button
                  onClick={(e) => copyToClipboard(msg.content, e.target)}
                  title="Copy"
                >
                  📋Copy
                </button>
              </div>
            ))}
            {textMessages.length === 0 && (
              <p>No text messages yet.</p>
            )}
          </div>

          <div className="file-column">
            <h3>Files ({fileMessages.length})</h3>
            {fileMessages.map((msg, index) => (
              <div key={index} className="file-item">
                <a
                  href={`${API_BASE_URL.replace("/api", "")}/uploads/${msg.filename}`}
                  className="file-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📄 {msg.filename.split("/").slice(1).join("/")}
                </a>

              </div>
            ))}
            {fileMessages.length === 0 && (
              <p>No files uploaded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;