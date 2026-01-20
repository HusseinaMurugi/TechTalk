// User profile page - view other users' profiles
import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import api from '../utils/api';

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [reposts, setReposts] = useState([]);
  const [mentions, setMentions] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    loadUserProfile();
  }, [userId]);

  const loadUserProfile = async () => {
    try {
      const [userRes, postsRes, repostsRes, mentionsRes, followersRes, followingRes] = await Promise.all([
        api.get(`/users/${userId}`),
        api.get(`/users/${userId}/posts`),
        api.get(`/users/${userId}/reposts`),
        api.get(`/users/${userId}/mentions`),
        api.get(`/users/${userId}/followers`),
        api.get(`/users/${userId}/following`),
      ]);
      setUser(userRes.data);
      setPosts(postsRes.data);
      setReposts(repostsRes.data);
      setMentions(mentionsRes.data);
      setFollowers(followersRes.data);
      setFollowing(followingRes.data);
      
      // Check if following only if logged in
      if (currentUser) {
        const isFollowingRes = await api.get(`/users/${userId}/is-following`);
        setIsFollowing(isFollowingRes.data.is_following);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await api.delete(`/users/${userId}/follow`);
        setIsFollowing(false);
      } else {
        await api.post(`/users/${userId}/follow`);
        setIsFollowing(true);
      }
      loadUserProfile();
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="app-bg min-h-screen">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="card-dark p-6 mb-6">
          <div className="flex items-start gap-6">
            <img
              src={user.profile_pic || 'https://via.placeholder.com/100'}
              alt={user.username}
              className="avatar w-24 h-24"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-black">{user.username}</h1>
              <p className="text-gray-600">{user.email}</p>
              <p className="mt-2 text-black">{user.bio || 'No bio'}</p>
              
              {currentUser && currentUser.id !== user.id && (
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={handleFollow}
                    className={`px-6 py-2 rounded font-semibold ${
                      isFollowing
                        ? 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                        : 'btn-primary'
                    }`}
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
                  <button
                    onClick={() => navigate('/messages', { state: { selectedUserId: userId } })}
                    className="btn-secondary"
                  >
                    Message
                  </button>
                </div>
              )}
              
              <div className="flex gap-6 mt-4 text-black">
                <div>
                  <span className="font-bold">{posts.length}</span> Posts
                </div>
                <div>
                  <span className="font-bold">{followers.length}</span> Followers
                </div>
                <div>
                  <span className="font-bold">{following.length}</span> Following
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 flex gap-4 border-b border-gray-300 bg-white rounded-t-lg">
          <button
            onClick={() => setActiveTab('posts')}
            className={`pb-3 px-4 font-semibold transition text-black ${
              activeTab === 'posts' ? 'border-b-2 border-blue-600' : 'hover:text-gray-600'
            }`}
          >
            Posts ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab('reposts')}
            className={`pb-3 px-4 font-semibold transition text-black ${
              activeTab === 'reposts' ? 'border-b-2 border-blue-600' : 'hover:text-gray-600'
            }`}
          >
            Reposts ({reposts.length})
          </button>
          <button
            onClick={() => setActiveTab('mentions')}
            className={`pb-3 px-4 font-semibold transition text-black ${
              activeTab === 'mentions' ? 'border-b-2 border-blue-600' : 'hover:text-gray-600'
            }`}
          >
            Tagged ({mentions.length})
          </button>
        </div>

        {activeTab === 'posts' && (
          posts.length === 0 ? (
            <div className="card-dark p-8 text-center text-gray-600">No posts yet.</div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => <PostCard key={post.id} post={post} onUpdate={loadUserProfile} />)}
            </div>
          )
        )}

        {activeTab === 'reposts' && (
          reposts.length === 0 ? (
            <div className="card-dark p-8 text-center text-gray-600">No reposts yet.</div>
          ) : (
            <div className="space-y-4">
              {reposts.map((post) => <PostCard key={post.id} post={post} onUpdate={loadUserProfile} />)}
            </div>
          )
        )}

        {activeTab === 'mentions' && (
          mentions.length === 0 ? (
            <div className="card-dark p-8 text-center text-gray-600">No mentions yet.</div>
          ) : (
            <div className="space-y-4">
              {mentions.map((post) => <PostCard key={post.id} post={post} onUpdate={loadUserProfile} />)}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default UserProfile;
