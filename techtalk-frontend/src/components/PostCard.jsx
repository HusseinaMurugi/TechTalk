// Post card component - displays a single post with actions
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { formatDate } from '../utils/date';
import { getProfilePic } from '../utils/avatar';
import api from '../utils/api';

const PostCard = ({ post, onUpdate }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [isReposted, setIsReposted] = useState(post.is_reposted || false);
  const [repostsCount, setRepostsCount] = useState(post.reposts_count || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  const renderContentWithHashtags = (content) => {
    const parts = content.split(/(#\w+)/);
    return parts.map((part, idx) => 
      part.startsWith('#') ? (
        <Link 
          key={idx} 
          to={`/topic/${part.substring(1)}`}
          className="text-blue-600 font-semibold hover:underline cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </Link>
      ) : part
    );
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
    } catch (error) {
      console.error('Error toggling repost:', error);
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
            src={getProfilePic(post.author.profile_pic, post.author.username)}
            alt={post.author.username}
            className="avatar w-12 h-12"
          />
          <div>
            <p className="font-bold text-white">{post.author.username}</p>
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
      <Link to={`/posts/${post.id}`} className="block">
        <p className="mb-4 text-lg whitespace-pre-wrap text-white hover:text-gray-300 transition">{renderContentWithHashtags(post.content)}</p>
      </Link>
      {post.tags && (
        <div className="mb-3 flex flex-wrap gap-2">
          {post.tags.split(',').map((tag, idx) => (
            <Link
              key={idx}
              to={`/topic/${tag.trim()}`}
              className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition"
              onClick={(e) => e.stopPropagation()}
            >
              {tag.trim()}
            </Link>
          ))}
        </div>
      )}
      {post.image_url && (
        <img src={post.image_url} alt="Post" className="w-full rounded-xl mb-4 max-h-96 object-cover" />
      )}

      {/* Post actions */}
      <div className="post-actions border-t border-gray-300 pt-4">
        <button 
          onClick={handleLike} 
          className={`flex items-center gap-2 hover:scale-110 transition ${
            isLiked ? 'text-red-500' : 'hover:text-red-500'
          }`}
        >
          <span className="text-xl">{isLiked ? '❤️' : '🤍'}</span>
          <span className="font-semibold">{likesCount}</span>
        </button>
        <button 
          onClick={loadComments} 
          className="flex items-center gap-2 hover:scale-110 hover:text-blue-500 transition"
        >
          <span className="text-xl">💬</span>
          <span className="font-semibold">{post.comments_count}</span>
        </button>
        <button 
          onClick={handleRepost} 
          className={`flex items-center gap-2 hover:scale-110 transition ${
            isReposted ? 'text-green-500' : 'hover:text-green-500'
          }`}
        >
          <span className="text-xl">🔁</span>
          <span className="font-semibold">{repostsCount}</span>
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="mt-4 border-t border-gray-300 pt-4">
          {user ? (
            <form onSubmit={handleComment} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="input flex-1"
                />
                <button type="submit" className="btn-primary">
                  Post
                </button>
              </div>
            </form>
          ) : (
            <div className="mb-4 text-center py-3 bg-gray-100 rounded-xl">
              <Link to="/login" className="text-blue-600 hover:underline font-semibold">Login</Link>
              <span className="text-gray-700"> to comment</span>
            </div>
          )}
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <img
                  src={getProfilePic(comment.author.profile_pic, comment.author.username)}
                  alt={comment.author.username}
                  className="avatar w-10 h-10"
                />
                <div className="flex-1 bg-[#0b1c2d] rounded-xl px-4 py-3 border border-[#1f3b5c]">
                  <Link to={`/users/${comment.author.id}`} className="font-semibold text-sm hover:text-blue-400 text-white">
                    {comment.author.username}
                  </Link>
                  <p className="text-sm mt-1 text-white">{comment.content}</p>
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