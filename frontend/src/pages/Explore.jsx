import { useState, useEffect, useContext } from 'react';
import { TrendingUp, Users, Hash } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import api from '../utils/api';

const Explore = () => {
  const { user } = useContext(AuthContext);
  const [trendingTags, setTrendingTags] = useState([]);
  const [trendingUsers, setTrendingUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [following, setFollowing] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrendingTags();
    fetchTrendingUsers();
    fetchPublicPosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTrendingTags = async () => {
    try {
      const response = await api.get('/trending/tags');
      setTrendingTags(response.data);
    } catch (error) {
      console.error('Error fetching trending tags:', error);
      const mockTags = [
        { tag: 'React', count: 1245 },
        { tag: 'Python', count: 2341 },
        { tag: 'AI', count: 3456 },
        { tag: 'WebDev', count: 890 },
        { tag: 'JavaScript', count: 2100 },
      ];
      setTrendingTags(mockTags);
    }
  };

  const fetchTrendingUsers = async () => {
    try {
      const response = await api.get('/trending/users');
      setTrendingUsers(response.data);
    } catch (error) {
      console.error('Error fetching trending users:', error);
    }
  };

  const fetchPublicPosts = async () => {
    try {
      const response = await api.get('/feed/public');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleFollowToggle = async (targetUserId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      if (following.has(targetUserId)) {
        await api.delete(`/users/${targetUserId}/follow`);
        const next = new Set(following);
        next.delete(targetUserId);
        setFollowing(next);
      } else {
        await api.post(`/users/${targetUserId}/follow`);
        const next = new Set(following);
        next.add(targetUserId);
        setFollowing(next);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  return (
    <div className="app-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">Explore</h1>
        <p className="text-[#c9d1d9] mb-4">Discover trending topics and connect with developers</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-[#1f3b5c]">
        <button
          onClick={() => setActiveTab('posts')}
          className={`pb-3 px-4 font-medium transition ${
            activeTab === 'posts'
              ? 'text-[#1f6feb] border-b-2 border-[#1f6feb]'
              : 'text-[#c9d1d9] hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Posts
          </div>
        </button>
        <button
          onClick={() => setActiveTab('people')}
          className={`pb-3 px-4 font-medium transition ${
            activeTab === 'people'
              ? 'text-[#1f6feb] border-b-2 border-[#1f6feb]'
              : 'text-[#c9d1d9] hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            People
          </div>
        </button>
        <button
          onClick={() => setActiveTab('trending')}
          className={`pb-3 px-4 font-medium transition ${
            activeTab === 'trending'
              ? 'text-[#1f6feb] border-b-2 border-[#1f6feb]'
              : 'text-[#c9d1d9] hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5" />
            Trending Tags
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Posts Tab */}
          {activeTab === 'posts' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Latest TechTalks</h2>
              {posts.length === 0 ? (
                <div className="card-dark p-12 text-center">
                  <p className="text-[#c9d1d9]">No posts yet</p>
                </div>
              ) : (
                posts.map(post => (
                  <PostCard key={post.id} post={post} onUpdate={fetchPublicPosts} />
                ))
              )}
            </div>
          )}

          {/* Trending Tags Tab */}
          {activeTab === 'trending' && (
            <div className="card-dark">
              <div className="p-6 border-b border-[#1f3b5c]">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Hash className="w-6 h-6 text-[#1f6feb]" />
                  Trending Topics
                </h2>
              </div>
              <div className="divide-y divide-[#1f3b5c]">
                {trendingTags.map((item, index) => (
                  <Link
                    key={item.tag}
                    to={`/topic/${encodeURIComponent(item.tag)}`}
                    className="block p-6 hover:bg-[#1f3b5c]/50 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[#8b949e] text-sm">#{index + 1} Trending</span>
                        </div>
                        <h3 className="text-lg font-semibold">
                          #{item.tag}
                        </h3>
                        <p className="text-[#8b949e] text-sm mt-1">
                          {item.count.toLocaleString()} posts
                        </p>
                      </div>
                      <TrendingUp className="w-5 h-5 text-[#1f6feb]" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* People Tab */}
          {activeTab === 'people' && (
            <div className="card-dark">
              <div className="p-6 border-b border-[#1f3b5c]">
                <h2 className="text-xl font-semibold">Top Developers</h2>
              </div>
              <div className="divide-y divide-[#1f3b5c]">
                {trendingUsers.map((trendingUser) => (
                  <div
                    key={trendingUser.id}
                    className="p-6 hover:bg-[#1f3b5c]/50 transition"
                  >
                    <div className="flex items-center gap-4">
                      <Link to={`/users/${trendingUser.id}`}>
                        <img
                          src={trendingUser.profile_pic || 'https://via.placeholder.com/60'}
                          alt={trendingUser.username}
                          className="avatar w-16 h-16"
                        />
                      </Link>
                      <div className="flex-1">
                        <Link to={`/users/${trendingUser.id}`} className="font-semibold text-lg hover:underline">
                          {trendingUser.username}
                        </Link>
                        <p className="text-[#8b949e] text-sm">{trendingUser.bio || 'Tech enthusiast'}</p>
                        {typeof trendingUser.followers_count !== 'undefined' && (
                          <p className="text-[#1f6feb] text-sm mt-1">{trendingUser.followers_count} followers</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleFollowToggle(trendingUser.id)}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                          following.has(trendingUser.id)
                            ? 'bg-transparent border border-[#1f6feb] text-[#1f6feb] hover:bg-[#1f6feb]/10'
                            : 'bg-[#1f6feb] text-white hover:bg-[#1a5dcc]'
                        }`}
                      >
                        {following.has(trendingUser.id) ? 'Following' : 'Follow'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card-dark p-6 mb-6">
            <h3 className="text-xl font-bold mb-3">💡 Pro Tip</h3>
            <p className="text-[#c9d1d9] mb-4">
              Follow trending tags to stay updated with the latest in tech. The more you engage, the better your feed becomes!
            </p>
            {user ? (
              <Link to="/home" className="btn-primary inline-block">
                Go to Feed
              </Link>
            ) : (
              <Link to="/register" className="btn-primary inline-block">
                Join TechTalk
              </Link>
            )}
          </div>

          {/* Quick Stats */}
          <div className="card-dark p-6">
            <h3 className="font-semibold mb-4">Community Stats</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#c9d1d9]">Active Users</span>
                  <span className="font-semibold">{trendingUsers.length}+</span>
                </div>
                <div className="w-full bg-[#1f3b5c] rounded-full h-2">
                  <div className="bg-[#1f6feb] h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#c9d1d9]">Posts Today</span>
                  <span className="font-semibold">{posts.length}+</span>
                </div>
                <div className="w-full bg-[#1f3b5c] rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#c9d1d9]">Trending Tags</span>
                  <span className="font-semibold">{trendingTags.length}</span>
                </div>
                <div className="w-full bg-[#1f3b5c] rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Explore;