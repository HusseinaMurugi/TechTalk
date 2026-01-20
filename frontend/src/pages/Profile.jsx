// Profile page - shows user's own profile with edit capability
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import EditProfileModal from '../components/EditProfileModal';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [reposts, setReposts] = useState([]);
  const [mentions, setMentions] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const [postsRes, repostsRes, mentionsRes, followersRes, followingRes] = await Promise.all([
        api.get(`/users/${user.id}/posts`),
        api.get(`/users/${user.id}/reposts`),
        api.get(`/users/${user.id}/mentions`),
        api.get(`/users/${user.id}/followers`),
        api.get(`/users/${user.id}/following`),
      ]);
      setPosts(postsRes.data);
      setReposts(repostsRes.data);
      setMentions(mentionsRes.data);
      setFollowers(followersRes.data);
      setFollowing(followingRes.data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  return (
    <div className="app-bg min-h-screen">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Profile header */}
        <div className="card-dark p-6 mb-6">
          <div className="flex items-start gap-6">
            <img
              src={user?.profile_pic || 'https://via.placeholder.com/100'}
              alt={user?.username}
              className="avatar w-24 h-24"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-black">{user?.username}</h1>
              <p className="text-gray-600">{user?.email}</p>
              
              <>
                <p className="mt-2 text-black">{user?.bio || 'No bio yet'}</p>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="mt-3 btn-primary"
                >
                  Edit Profile
                </button>
              </>
              
              <div className="flex gap-6 mt-4 text-black">
                <button type="button" className="hover:opacity-80" onClick={() => setActiveTab('posts')}>
                  <span className="font-bold">{posts.length}</span> Posts
                </button>
                <button type="button" className="hover:opacity-80" onClick={() => setActiveTab('followers')}>
                  <span className="font-bold">{followers.length}</span> Followers
                </button>
                <button type="button" className="hover:opacity-80" onClick={() => setActiveTab('following')}>
                  <span className="font-bold">{following.length}</span> Following
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* User's posts */}
        <div className="mb-4 flex gap-4 border-b border-gray-300 bg-white rounded-t-lg">
          <button
            onClick={() => setActiveTab('posts')}
            className={`pb-3 px-4 font-semibold transition text-black ${
              activeTab === 'posts'
                ? 'border-b-2 border-blue-600'
                : 'hover:text-gray-600'
            }`}
          >
            Posts ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab('reposts')}
            className={`pb-3 px-4 font-semibold transition text-black ${
              activeTab === 'reposts'
                ? 'border-b-2 border-blue-600'
                : 'hover:text-gray-600'
            }`}
          >
            Reposts ({reposts.length})
          </button>
          <button
            onClick={() => setActiveTab('mentions')}
            className={`pb-3 px-4 font-semibold transition text-black ${
              activeTab === 'mentions'
                ? 'border-b-2 border-blue-600'
                : 'hover:text-gray-600'
            }`}
          >
            Tagged Posts ({mentions.length})
          </button>
          <button
            onClick={() => setActiveTab('followers')}
            className={`pb-3 px-4 font-semibold transition text-black ${
              activeTab === 'followers'
                ? 'border-b-2 border-blue-600'
                : 'hover:text-gray-600'
            }`}
          >
            Followers ({followers.length})
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`pb-3 px-4 font-semibold transition text-black ${
              activeTab === 'following'
                ? 'border-b-2 border-blue-600'
                : 'hover:text-gray-600'
            }`}
          >
            Following ({following.length})
          </button>
        </div>

        {activeTab === 'posts' && (
          posts.length === 0 ? (
            <div className="card-dark p-8 text-center text-gray-500">
              You haven't posted anything yet.
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => <PostCard key={post.id} post={post} onUpdate={loadProfile} />)}
            </div>
          )
        )}

        {activeTab === 'reposts' && (
          reposts.length === 0 ? (
            <div className="card-dark p-8 text-center text-gray-500">
              You haven't reposted anything yet.
            </div>
          ) : (
            <div className="space-y-4">
              {reposts.map((post) => <PostCard key={post.id} post={post} onUpdate={loadProfile} />)}
            </div>
          )
        )}

        {activeTab === 'mentions' && (
          mentions.length === 0 ? (
            <div className="card-dark p-8 text-center text-gray-500">
              You haven't been tagged in any posts yet.
            </div>
          ) : (
            <div className="space-y-4">
              {mentions.map((post) => <PostCard key={post.id} post={post} onUpdate={loadProfile} />)}
            </div>
          )
        )}

        {activeTab === 'followers' && (
          <div className="card-dark">
            <div className="p-6 border-b border-[#1f3b5c]">
              <h2 className="text-xl font-semibold">Followers</h2>
            </div>
            {followers.length === 0 ? (
              <div className="p-8 text-center text-[#8b949e]">No followers yet.</div>
            ) : (
              <div className="divide-y divide-[#1f3b5c]">
                {followers.map(f => (
                  <Link
                    key={f.id}
                    to={`/users/${f.id}`}
                    className="flex items-center gap-4 p-6 hover:bg-[#1f3b5c]/50 transition"
                  >
                    <img
                      src={f.profile_pic || 'https://via.placeholder.com/60'}
                      alt={f.username}
                      className="avatar w-14 h-14"
                    />
                    <div>
                      <div className="font-semibold">{f.username}</div>
                      <div className="text-[#8b949e] text-sm">{f.bio}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'following' && (
          <div className="card-dark">
            <div className="p-6 border-b border-[#1f3b5c]">
              <h2 className="text-xl font-semibold">Following</h2>
            </div>
            {following.length === 0 ? (
              <div className="p-8 text-center text-[#8b949e]">You're not following anyone yet.</div>
            ) : (
              <div className="divide-y divide-[#1f3b5c]">
                {following.map(f => (
                  <Link
                    key={f.id}
                    to={`/users/${f.id}`}
                    className="flex items-center gap-4 p-6 hover:bg-[#1f3b5c]/50 transition"
                  >
                    <img
                      src={f.profile_pic || 'https://via.placeholder.com/60'}
                      alt={f.username}
                      className="avatar w-14 h-14"
                    />
                    <div>
                      <div className="font-semibold">{f.username}</div>
                      <div className="text-[#8b949e] text-sm">{f.bio}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
        
        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onUpdate={loadProfile}
        />
      </div>
    </div>
  );
};

export default Profile;
