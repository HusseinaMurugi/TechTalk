// Post card component - displays a single post with actions
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { formatDate } from '../utils/date';
import api from '../utils/api';

const PostCard = ({ post, onUpdate }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [isReposted, setIsReposted] = useState(post.is_reposted);
  const [repostsCount, setRepostsCount] = useState(post.reposts_count);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);

  const renderContentWithHashtags = (content) => {
    const parts = content.split(/(#\w+|@\w+)/);
    return parts.map((part, idx) => {
      if (part.startsWith('#')) {
        return (
          <span key={idx} className="text-blue-600 font-semibold hover:underline cursor-pointer">
            {part}
          </span>
        );
      } else if (part.startsWith('@')) {
        return (
          <Link 
            key={idx} 
            to={`/search?q=${part.substring(1)}`}
            className="text-green-600 font-semibold hover:underline"
          >
            {part}
          </Link>
        );
      }
      return part;
    });
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      if (isLiked) {
        await api.delete(`/posts/${post.id}/likes`);
        setIsLiked(false);
        setLikesCount(likesCount - 1);
      } else {
        await api.post(`/posts/${post.id}/likes`);
        setIsLiked(true);
        setLikesCount(likesCount + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const loadComments = async () => {
    if (!showComments) {
      try {
        const response = await api.get(`/posts/${post.id}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error('Error loading comments:', error);
      }
    }
    setShowComments(!showComments);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!commentText.trim()) return;

    try {
      const response = await api.post(`/posts/${post.id}/comments`, { content: commentText });
      setComments([response.data, ...comments]);
      setCommentText('');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleRepost = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      if (isReposted) {
        await api.delete(`/posts/${post.id}/repost`);
        setIsReposted(false);
        setRepostsCount(repostsCount - 1);
      } else {
        await api.post(`/posts/${post.id}/repost`);
        setIsReposted(true);
        setRepostsCount(repostsCount + 1);
      }
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error toggling repost:', error);
    }
  };

  const handleReport = async (reason) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      // This would typically send to a moderation system
      console.log('Reporting post:', post.id, 'Reason:', reason);
      alert('Post reported successfully. Thank you for helping keep our community safe.');
      setShowReportModal(false);
    } catch (error) {
      console.error('Error reporting post:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this post?')) {
      try {
        await api.delete(`/posts/${post.id}`);
        if (onUpdate) onUpdate();
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  return (
    <div className="post">
      {/* Post header */}
      <div className="flex items-center justify-between mb-4">
        <Link to={`/users/${post.author.id}`} className="flex items-center gap-3 hover:opacity-80 transition">
          <img
            src={post.author.profile_pic || 'https://via.placeholder.com/40'}
            alt={post.author.username}
            className="avatar w-12 h-12"
          />
          <div>
            <p className="font-bold">{post.author.username}</p>
            <p className="text-sm text-[#8b949e]">{formatDate(post.timestamp)}</p>
          </div>
        </Link>
        {user?.id === post.author.id && (
          <button onClick={handleDelete} className="text-red-400 hover:text-red-300 font-medium">
            Delete
          </button>
        )}
      </div>

      {/* Post content */}
      <p className="mb-4 text-lg whitespace-pre-wrap">{renderContentWithHashtags(post.content)}</p>
      {post.tags && (
        <div className="mb-3 flex flex-wrap gap-2">
          {post.tags.split(',').map((tag, idx) => (
            <span key={idx} className="bg-[#1f6feb]/20 text-[#1f6feb] px-3 py-1 rounded-full text-sm font-medium">
              {tag.trim()}
            </span>
          ))}
        </div>
      )}
      {post.image_url && (
        <img src={post.image_url} alt="Post" className="w-full rounded-xl mb-4 max-h-96 object-cover" />
      )}

      {/* Post actions */}
      <div className="post-actions border-t border-[#1f3b5c] pt-4">
        <button 
          onClick={handleLike} 
          className={`flex items-center gap-2 hover:scale-110 transition ${
            isLiked ? 'text-red-400' : 'hover:text-red-400'
          }`}
        >
          <span className="text-xl">{isLiked ? '❤️' : '🤍'}</span>
          <span className="font-semibold">{likesCount}</span>
        </button>
        <button 
          onClick={loadComments} 
          className="flex items-center gap-2 hover:scale-110 hover:text-[#1f6feb] transition"
        >
          <span className="text-xl">💬</span>
          <span className="font-semibold">{post.comments_count}</span>
        </button>
        <button 
          onClick={handleRepost} 
          className={`flex items-center gap-2 hover:scale-110 transition ${
            isReposted ? 'text-green-400' : 'hover:text-green-400'
          }`}
        >
          <span className="text-xl">{isReposted ? '🔄' : '↻'}</span>
          <span className="font-semibold">{repostsCount}</span>
        </button>
        <button 
          onClick={() => setShowReportModal(true)} 
          className="flex items-center gap-2 hover:scale-110 hover:text-yellow-400 transition"
        >
          <span className="text-xl">⚠️</span>
          <span className="font-semibold">Report</span>
        </button>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Report Post</h3>
            </div>
            <div className="p-4">
              <p className="text-gray-600 mb-4">Why are you reporting this post?</p>
              <div className="space-y-2">
                {['Spam', 'Harassment', 'Inappropriate content', 'Misinformation', 'Copyright violation', 'Other'].map(reason => (
                  <button
                    key={reason}
                    onClick={() => handleReport(reason)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition text-gray-700"
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments section */}
      {showComments && (
        <div className="mt-4 border-t border-[#1f3b5c] pt-4">
          {user ? (
            <form onSubmit={handleComment} className="mb-4">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="input"
              />
            </form>
          ) : (
            <div className="mb-4 text-center py-3 bg-[#1f3b5c]/50 rounded-xl">
              <Link to="/login" className="text-[#1f6feb] hover:underline font-semibold">Login</Link>
              <span className="text-[#c9d1d9]"> to comment</span>
            </div>
          )}
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <img
                  src={comment.author.profile_pic || 'https://via.placeholder.com/32'}
                  alt={comment.author.username}
                  className="avatar w-10 h-10"
                />
                <div className="flex-1 bg-[#1f3b5c]/50 rounded-xl px-4 py-3">
                  <Link to={`/users/${comment.author.id}`} className="font-semibold text-sm hover:text-[#1f6feb]">
                    {comment.author.username}
                  </Link>
                  <p className="text-sm mt-1">{comment.content}</p>
                  <p className="text-xs text-[#8b949e] mt-1">{formatDate(comment.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
