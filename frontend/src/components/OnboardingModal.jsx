import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const OnboardingModal = ({ user, onClose }) => {
  const [step, setStep] = useState(1);
  const [bio, setBio] = useState('');
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [followedUsers, setFollowedUsers] = useState(new Set());

  useEffect(() => {
    if (step === 2) {
      loadSuggestedUsers();
    }
  }, [step]);

  const loadSuggestedUsers = async () => {
    try {
      const response = await api.get('/users/suggested?limit=5');
      setSuggestedUsers(response.data);
    } catch (error) {
      console.error('Error loading suggested users:', error);
    }
  };

  const handleUpdateProfile = async () => {
    if (bio.trim()) {
      try {
        await api.put('/profile', { bio });
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
    setStep(2);
  };

  const handleFollow = async (userId) => {
    try {
      await api.post(`/users/${userId}/follow`);
      setFollowedUsers(new Set([...followedUsers, userId]));
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        {step === 1 ? (
          <>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Welcome to TechTalk! 🎉</h2>
            <p className="text-gray-600 mb-6">Let's set up your profile</p>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">Tell us about yourself</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="I'm a developer passionate about..."
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 resize-none focus:border-blue-500 focus:outline-none transition"
                rows="4"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleUpdateProfile}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-semibold"
              >
                Next
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition font-medium"
              >
                Skip
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Follow Some Users 👥</h2>
            <p className="text-gray-600 mb-6">Discover interesting people to follow</p>
            
            <div className="space-y-3 mb-6 max-h-80 overflow-y-auto">
              {suggestedUsers.map((suggestedUser) => (
                <div key={suggestedUser.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-blue-50 transition">
                  <img
                    src={suggestedUser.profile_pic || 'https://via.placeholder.com/40'}
                    alt={suggestedUser.username}
                    className="w-12 h-12 rounded-full border-2 border-blue-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate text-gray-800">{suggestedUser.username}</p>
                    <p className="text-sm text-gray-500 truncate">{suggestedUser.bio || 'Tech enthusiast'}</p>
                  </div>
                  <button
                    onClick={() => handleFollow(suggestedUser.id)}
                    disabled={followedUsers.has(suggestedUser.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      followedUsers.has(suggestedUser.id)
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {followedUsers.has(suggestedUser.id) ? 'Following' : 'Follow'}
                  </button>
                </div>
              ))}
            </div>
            
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-semibold"
            >
              Get Started
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OnboardingModal;
