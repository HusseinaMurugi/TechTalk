// Search page - search for users and posts
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const Search = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [searched, setSearched] = useState(false);
  const [trendingTags, setTrendingTags] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  useEffect(() => {
    const loadSideData = async () => {
      try {
        const [tagsRes, usersRes] = await Promise.all([
          api.get('/trending/tags'),
          api.get('/users/suggested?limit=10'),
        ]);
        setTrendingTags(tagsRes.data || []);
        setSuggestedUsers(usersRes.data || []);
      } catch (err) {
        setTrendingTags([]);
        setSuggestedUsers([]);
      }
    };
    loadSideData();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearched(true);
    try {
      if (activeTab === 'users') {
        const response = await api.get(`/search/users?q=${query}`);
        setUsers(response.data);
      } else {
        const response = await api.get(`/search/posts?q=${query}`);
        setPosts(response.data);
      }
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  return (
    <div className="app-bg">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">🔍 Search</h1>

        {/* Search form */}
        <div className="card-dark p-6 mb-6">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for users or posts..."
              className="input mb-4 text-lg"
            />
            <div className="flex gap-4 mb-4">
              <button
                type="button"
                onClick={() => setActiveTab('users')}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition ${
                  activeTab === 'users' 
                    ? 'bg-[#1f6feb] text-white shadow-md' 
                    : 'bg-[#1f3b5c] text-white hover:bg-[#2b4c6f]'
                }`}
              >
                👥 Users
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('posts')}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition ${
                  activeTab === 'posts' 
                    ? 'bg-[#1f6feb] text-white shadow-md' 
                    : 'bg-[#1f3b5c] text-white hover:bg-[#2b4c6f]'
                }`}
              >
                📝 Posts
              </button>
            </div>
            <button type="submit" className="w-full btn-primary">
              Search
            </button>
          </form>
        </div>

        {/* Results */}
        {searched && (
          <>
            {activeTab === 'users' && (
              <div className="card-dark overflow-hidden">
                {users.length === 0 ? (
                  <div className="p-12 text-center text-[#c9d1d9]">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-lg">No users found</p>
                  </div>
                ) : (
                  users.map((user) => (
                    <Link
                      key={user.id}
                      to={`/users/${user.id}`}
                      className="flex items-center gap-4 p-6 border-b border-[#1f3b5c] hover:bg-[#1f3b5c]/50 transition"
                    >
                      <img
                        src={user.profile_pic || 'https://via.placeholder.com/50'}
                        alt={user.username}
                        className="avatar w-16 h-16"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-lg text-white">{user.username}</p>
                        <p className="text-[#c9d1d9]">{user.bio || 'No bio'}</p>
                      </div>
                      <span className="text-[#1f6feb] font-semibold">→</span>
                    </Link>
                  ))
                )}
              </div>
            )}

            {activeTab === 'posts' && (
              <div className="space-y-4">
                {posts.length === 0 ? (
                  <div className="card-dark p-12 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-lg text-[#c9d1d9]">No posts found</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <div key={post.id} className="card-dark p-6 hover:shadow-xl transition">
                      <Link to={`/users/${post.author.id}`} className="flex items-center gap-3 mb-3 hover:opacity-80">
                        <img
                          src={post.author.profile_pic || 'https://via.placeholder.com/40'}
                          alt={post.author.username}
                          className="avatar w-12 h-12"
                        />
                        <div>
                          <p className="font-bold text-white">{post.author.username}</p>
                          <p className="text-sm text-[#8b949e]">{post.author.bio}</p>
                        </div>
                      </Link>
                      <p className="text-white text-lg">{post.content}</p>
                      <div className="flex gap-6 mt-4 text-[#c9d1d9]">
                        <span>❤️ {post.likes_count}</span>
                        <span>💬 {post.comments_count}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}

        {!searched && (
          <div className="card-dark p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-white">Search for users or posts</p>
            <p className="text-[#8b949e] mt-2">Enter a keyword and click search</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2"></div>
          <div className="lg:col-span-1 space-y-6">
            <div className="card-dark">
              <div className="p-6 border-b border-[#1f3b5c]">
                <h2 className="text-xl font-semibold">Trending Topics</h2>
              </div>
              <div className="divide-y divide-[#1f3b5c]">
                {trendingTags.map((t) => (
                  <Link
                    key={t.tag}
                    to={`/topic/${encodeURIComponent(t.tag)}`}
                    className="block p-4 hover:bg-[#1f3b5c]/50 transition"
                  >
                    <div className="flex justify-between">
                      <span className="text-white font-medium">#{t.tag}</span>
                      <span className="text-[#8b949e] text-sm">{t.count}</span>
                    </div>
                  </Link>
                ))}
                {trendingTags.length === 0 && (
                  <div className="p-4 text-[#8b949e]">No trending topics</div>
                )}
              </div>
            </div>
            <div className="card-dark">
              <div className="p-6 border-b border-[#1f3b5c]">
                <h2 className="text-xl font-semibold">Suggested Users</h2>
              </div>
              <div className="divide-y divide-[#1f3b5c]">
                {suggestedUsers.map((u) => (
                  <Link
                    key={u.id}
                    to={`/users/${u.id}`}
                    className="flex items-center gap-3 p-4 hover:bg-[#1f3b5c]/50 transition"
                  >
                    <img
                      src={u.profile_pic || 'https://via.placeholder.com/40'}
                      alt={u.username}
                      className="avatar w-10 h-10"
                    />
                    <div>
                      <div className="font-semibold">{u.username}</div>
                      <div className="text-[#8b949e] text-sm">{u.bio}</div>
                    </div>
                  </Link>
                ))}
                {suggestedUsers.length === 0 && (
                  <div className="p-4 text-[#8b949e]">No suggestions</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
