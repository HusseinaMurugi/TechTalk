import { useState, useEffect } from 'react';
import PostCard from './PostCard';
import { RefreshCw } from 'lucide-react';

const Feed = ({ userId, filter = 'following' }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, [filter, userId]);

  const fetchPosts = async (pageNum = 1) => {
    setLoading(pageNum === 1);
    try {
      // TODO: Replace with actual API call
      // const response = await api.get(`/posts?filter=${filter}&page=${pageNum}`);
      // setPosts(pageNum === 1 ? response.data : [...posts, ...response.data]);
      
      // Mock data for now
      const mockPosts = [
        {
          id: 1,
          user: {
            id: 2,
            username: 'sarah_dev',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
          },
          content: 'Just deployed my first full-stack app! 🚀 Built with React, Node.js, and PostgreSQL. The feeling is incredible!',
          image: null,
          tags: ['React', 'Node.js', 'PostgreSQL'],
          likes_count: 45,
          comments_count: 12,
          is_liked: false,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          user: {
            id: 3,
            username: 'code_wizard',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wizard'
          },
          content: 'Pro tip: Always use TypeScript for larger projects. The type safety saves countless hours of debugging.',
          image: null,
          tags: ['TypeScript', 'BestPractices'],
          likes_count: 89,
          comments_count: 23,
          is_liked: true,
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          user: {
            id: 4,
            username: 'ai_enthusiast',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ai'
          },
          content: 'Training neural networks is like teaching a child. Patience, good data, and the right architecture make all the difference.',
          image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
          tags: ['AI', 'MachineLearning', 'DeepLearning'],
          likes_count: 156,
          comments_count: 34,
          is_liked: false,
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      setPosts(pageNum === 1 ? mockPosts : [...posts, ...mockPosts]);
      setHasMore(mockPosts.length > 0);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts(1);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchPosts(page + 1);
    }
  };

  const handleLike = async (postId) => {
    try {
      // TODO: Replace with actual API call
      // await api.post(`/posts/${postId}/like`);
      
      setPosts(posts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              is_liked: !post.is_liked,
              likes_count: post.is_liked ? post.likes_count - 1 : post.likes_count + 1
            }
          : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        // TODO: Replace with actual API call
        // await api.delete(`/posts/${postId}`);
        
        setPosts(posts.filter(post => post.id !== postId));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-3"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 text-blue-500 hover:bg-blue-50 rounded-full transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="text-sm font-medium">Refresh</span>
        </button>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 text-lg mb-2">No posts yet</p>
          <p className="text-gray-400 text-sm">
            {filter === 'following' 
              ? 'Follow some users to see their posts here'
              : 'Be the first to create a post!'}
          </p>
        </div>
      ) : (
        <>
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={userId}
              onLike={() => handleLike(post.id)}
              onDelete={() => handleDelete(post.id)}
            />
          ))}

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center py-4">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Feed;