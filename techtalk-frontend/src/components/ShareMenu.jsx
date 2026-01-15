// Share menu component
import { useState } from 'react';

const ShareMenu = ({ postId, postContent, onRepost }) => {
  const [showMenu, setShowMenu] = useState(false);
  const postUrl = `${window.location.origin}/posts/${postId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    alert('Link copied!');
    setShowMenu(false);
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(postContent + ' ' + postUrl)}`, '_blank');
    setShowMenu(false);
  };

  const handleRepost = () => {
    onRepost();
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 hover:scale-110 hover:text-green-600 transition"
      >
        <span className="text-xl">🔄</span>
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
          <div className="absolute bottom-full right-0 mb-2 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-20 min-w-[200px]">
            <button
              onClick={handleRepost}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 transition flex items-center gap-3"
            >
              <span>🔄</span>
              <span className="font-medium">Repost</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 transition flex items-center gap-3"
            >
              <span>🔗</span>
              <span className="font-medium">Copy Link</span>
            </button>
            <button
              onClick={handleWhatsApp}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 transition flex items-center gap-3"
            >
              <span>💬</span>
              <span className="font-medium">Share to WhatsApp</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareMenu;
