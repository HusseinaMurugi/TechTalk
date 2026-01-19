// Notifications page - shows user notifications
import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import LoginRequired from './LoginRequired';

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  if (!user) {
    return <LoginRequired />;
  }

  useEffect(() => {
    loadNotifications();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatNotificationTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read if not already read
    if (!notification.read) {
      try {
        await api.put(`/notifications/${notification.id}/read`);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }

    // Navigate based on notification type (only if context exists)
    if (notification.related_user_id || notification.related_post_id) {
      switch (notification.type) {
        case 'follow':
          if (notification.related_user_id) {
            navigate(`/users/${notification.related_user_id}`);
          }
          break;
        case 'like':
        case 'comment':
        case 'repost':
        case 'mention':
          if (notification.related_post_id) {
            navigate(`/posts/${notification.related_post_id}`);
          }
          break;
        case 'message':
          navigate('/messages');
          break;
        default:
          break;
      }
    }
    
    // Reload notifications to update read status
    loadNotifications();
  };

  const loadNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      loadNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      loadNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return (
    <div className="app-bg">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          {notifications.some((n) => !n.read) && (
            <button
              onClick={markAllAsRead}
              className="text-[#1f6feb] hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="card-dark p-8 text-center">
            No notifications yet.
          </div>
        ) : (
          <div className="card-dark">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 border-b border-[#1f3b5c] cursor-pointer hover:bg-[#1f3b5c]/30 transition ${
                  notification.read ? '' : 'bg-[#1f6feb]/10'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">
                        {notification.type === 'follow' && '👥'}
                        {notification.type === 'like' && '❤️'}
                        {notification.type === 'comment' && '💬'}
                        {notification.type === 'repost' && '🔄'}
                        {notification.type === 'mention' && '🏷️'}
                        {notification.type === 'message' && '📩'}
                      </span>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="font-medium text-white">{notification.message}</p>
                    <p className="text-sm text-[#8b949e] mt-1">
                      {formatNotificationTime(notification.timestamp)}
                    </p>
                  </div>
                  <div className="text-[#8b949e] text-sm">
                    Click to view
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
