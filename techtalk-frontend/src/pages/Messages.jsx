// Messages page - Direct messaging
import { useState, useEffect, useContext } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { formatDate } from '../utils/date';
import api from '../utils/api';
import LoginRequired from './LoginRequired';

const Messages = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  if (!user) {
    return <LoginRequired />;
  }

  useEffect(() => {
    loadConversations();
    
    // Check if a user was passed via navigation state
    if (location.state?.selectedUserId) {
      loadUserAndMessages(location.state.selectedUserId);
    }
  }, [location.state]);

  const loadUserAndMessages = async (userId) => {
    try {
      const userRes = await api.get(`/users/${userId}`);
      setSelectedUser(userRes.data);
      loadMessages(userId);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const loadConversations = async () => {
    try {
      const response = await api.get('/messages/conversations');
      setConversations(response.data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadMessages = async (userId) => {
    try {
      const response = await api.get(`/messages/${userId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSelectUser = (conv) => {
    setSelectedUser(conv.user);
    loadMessages(conv.user.id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      await api.post('/messages', {
        receiver_id: selectedUser.id,
        content: newMessage
      });
      setNewMessage('');
      loadMessages(selectedUser.id);
      loadConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="app-bg">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">💬 Messages</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="md:col-span-1 card-dark overflow-hidden">
            <div className="p-4 border-b border-[#1f3b5c] bg-[#1f3b5c]">
              <h2 className="font-bold text-lg text-white">Conversations</h2>
            </div>
            <div className="overflow-y-auto max-h-[600px]">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-[#c9d1d9]">
                  <div className="text-4xl mb-2">💬</div>
                  <p>No messages yet</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.user.id}
                    onClick={() => handleSelectUser(conv)}
                    className={`w-full p-4 border-b border-[#1f3b5c] hover:bg-[#1f3b5c]/50 transition text-left ${
                      selectedUser?.id === conv.user.id ? 'bg-[#1f3b5c]/50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={conv.user.profile_pic || 'https://via.placeholder.com/40'}
                        alt={conv.user.username}
                        className="avatar w-12 h-12"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white">{conv.user.username}</p>
                        <p className="text-sm text-[#8b949e] truncate">{conv.last_message}</p>
                      </div>
                      {conv.unread_count > 0 && (
                        <span className="bg-[#1f6feb] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="md:col-span-2 card-dark flex flex-col">
            {selectedUser ? (
              <>
                <div className="p-4 border-b border-[#1f3b5c] bg-[#1f3b5c] rounded-t-lg">
                  <Link to={`/users/${selectedUser.id}`} className="flex items-center gap-3 hover:opacity-80">
                    <img
                      src={selectedUser.profile_pic || 'https://via.placeholder.com/40'}
                      alt={selectedUser.username}
                      className="avatar w-10 h-10"
                    />
                    <div>
                      <p className="font-bold text-white">{selectedUser.username}</p>
                      <p className="text-sm text-[#c9d1d9]">{selectedUser.bio}</p>
                    </div>
                  </Link>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[500px]">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          msg.sender_id === user.id
                            ? 'bg-[#1f6feb] text-white'
                            : 'bg-[#1f3b5c] text-white'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p className={`text-xs mt-1 ${msg.sender_id === user.id ? 'text-blue-100' : 'text-[#8b949e]'}`}>
                          {formatDate(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t border-[#1f3b5c]">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="input flex-1"
                    />
                    <button type="submit" className="btn-primary">
                      Send
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-[#c9d1d9]">
                <div className="text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <p className="text-xl">Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;