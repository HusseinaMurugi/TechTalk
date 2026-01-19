// Navigation bar component
import { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ users: [], posts: [], tags: [] });
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    if (user) {
      loadUnreadCount();
      const interval = setInterval(loadUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target) &&
          resultsRef.current && !resultsRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (searchQuery.trim() && searchQuery.length > 1) {
        performSearch();
      } else {
        setSearchResults({ users: [], posts: [], tags: [] });
        setShowSearchResults(false);
      }
    }, 300);
    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  const loadUnreadCount = async () => {
    try {
      const response = await api.get('/notifications/unread-count');
      setUnreadCount(response.data.unread_count);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const performSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const [usersRes, postsRes, tagsRes] = await Promise.all([
        api.get(`/search/users?q=${searchQuery}`),
        user ? api.get(`/search/posts?q=${searchQuery}`) : Promise.resolve({ data: [] }),
        api.get('/trending/tags')
      ]);
      
      const filteredTags = tagsRes.data.filter(tag => 
        tag.tag.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3);
      
      setSearchResults({
        users: usersRes.data.slice(0, 3),
        posts: postsRes.data.slice(0, 3),
        tags: filteredTags
      });
      setShowSearchResults(true);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
      setSearchQuery('');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults({ users: [], posts: [], tags: [] });
    setShowSearchResults(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white hover:text-blue-400 transition">
            🚀 TechTalk
          </Link>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8 relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users, posts, hashtags..."
                  className="w-full bg-[#0b1c2d] text-white border border-[#1f3b5c] rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-[#1f6feb] focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
            
            {/* Search Results Dropdown */}
            {showSearchResults && (searchResults.users.length > 0 || searchResults.posts.length > 0 || searchResults.tags.length > 0 || isSearching) && (
              <div ref={resultsRef} className="absolute top-full left-0 right-0 mt-1 bg-[#0f2a44] border border-[#1f3b5c] rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
                {isSearching ? (
                  <div className="p-4 text-center text-[#c9d1d9]">
                    <div className="animate-spin w-5 h-5 border-2 border-[#1f6feb] border-t-transparent rounded-full mx-auto mb-2"></div>
                    Searching...
                  </div>
                ) : (
                  <>
                    {/* Users */}
                    {searchResults.users.length > 0 && (
                      <div className="border-b border-[#1f3b5c]">
                        <div className="px-4 py-2 text-xs font-semibold text-[#8b949e] uppercase tracking-wide">Users</div>
                        {searchResults.users.map(user => (
                          <Link
                            key={user.id}
                            to={`/users/${user.id}`}
                            onClick={() => { setShowSearchResults(false); setSearchQuery(''); }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-[#1f3b5c]/50 transition"
                          >
                            <img
                              src={user.profile_pic || 'https://via.placeholder.com/32'}
                              alt={user.username}
                              className="w-8 h-8 rounded-full border border-[#1f6feb]"
                            />
                            <div>
                              <div className="font-medium text-white">{user.username}</div>
                              <div className="text-sm text-[#8b949e] truncate">{user.bio || 'Tech enthusiast'}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                    
                    {/* Tags */}
                    {searchResults.tags.length > 0 && (
                      <div className="border-b border-[#1f3b5c]">
                        <div className="px-4 py-2 text-xs font-semibold text-[#8b949e] uppercase tracking-wide">Hashtags</div>
                        {searchResults.tags.map(tag => (
                          <Link
                            key={tag.tag}
                            to={`/search?q=${encodeURIComponent(tag.tag)}`}
                            onClick={() => { setShowSearchResults(false); setSearchQuery(''); }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-[#1f3b5c]/50 transition"
                          >
                            <div className="w-8 h-8 bg-[#1f6feb]/20 rounded-full flex items-center justify-center">
                              <span className="text-[#1f6feb] font-bold">#</span>
                            </div>
                            <div>
                              <div className="font-medium text-white">#{tag.tag}</div>
                              <div className="text-sm text-[#8b949e]">{tag.count} posts</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                    
                    {/* Posts */}
                    {searchResults.posts.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-xs font-semibold text-[#8b949e] uppercase tracking-wide">Posts</div>
                        {searchResults.posts.map(post => (
                          <Link
                            key={post.id}
                            to={`/posts/${post.id}`}
                            onClick={() => { setShowSearchResults(false); setSearchQuery(''); }}
                            className="block px-4 py-3 hover:bg-[#1f3b5c]/50 transition"
                          >
                            <div className="font-medium text-white truncate">{post.content.substring(0, 60)}...</div>
                            <div className="text-sm text-[#8b949e] mt-1">by {post.author.username}</div>
                          </Link>
                        ))}
                      </div>
                    )}
                    
                    {/* View All Results */}
                    <div className="border-t border-[#1f3b5c] p-2">
                      <button
                        onClick={() => {
                          navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                          setShowSearchResults(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-center py-2 text-[#1f6feb] hover:text-white font-medium transition"
                      >
                        View all results for "{searchQuery}"
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-6">
            <Link to="/home" className="nav-link">Feed</Link>
            <Link to="/explore" className="nav-link">Explore</Link>
            
            {user ? (
              <>
                <Link to="/messages" className="nav-link">Messages</Link>
                <Link to="/notifications" className="nav-link relative">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                <Link to="/profile" className="nav-link">Profile</Link>
                <button onClick={handleLogout} className="btn-secondary">Logout</button>
              </>
            ) : (
              <>
                <Link to="/messages" className="nav-link">Messages</Link>
                <Link to="/notifications" className="nav-link">Notifications</Link>
                <Link to="/login" className="btn-secondary">Login</Link>
                <Link to="/register" className="btn-primary">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
