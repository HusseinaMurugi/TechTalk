import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const OnboardingModal = ({ user, onClose }) => {
  const [step, setStep] = useState(1);
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [imageFile, setImageFile] = useState(null);
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

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const updates = {};
      if (bio.trim()) updates.bio = bio;
      if (profilePic.trim()) updates.profile_pic = profilePic;
      
      if (Object.keys(updates).length > 0) {
        await api.put('/profile', updates);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
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
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" style={{
      backgroundImage: 'linear-gradient(rgba(11, 28, 45, 0.85), rgba(11, 28, 45, 0.85)), url("https://i.pinimg.com/1200x/cc/91/67/cc91670bf478bd62daeacc927fe92cd5.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="card-dark max-w-md w-full p-8 backdrop-blur-sm">
        {step === 1 ? (
          <>
            <h2 className="text-2xl font-bold mb-2 text-white">Welcome to TechTalk! 🎉</h2>
            <p className="text-[#c9d1d9] mb-6">Let's set up your profile</p>
            
            <div className="mb-4">
              <label className="block text-white mb-2 font-medium">Profile Photo</label>
              <div className="space-y-3">
                <label className="cursor-pointer bg-[#1f3b5c] hover:bg-[#2b4c6f] px-4 py-3 rounded-lg transition flex items-center justify-center gap-2 text-white font-medium">
                  <span>📷</span>
                  <span>Upload from Gallery</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  value={profilePic}
                  onChange={(e) => setProfilePic(e.target.value)}
                  placeholder="Or paste image URL"
                  className="input"
                />
              </div>
              {profilePic && (
                <img src={profilePic} alt="Preview" className="mt-3 w-20 h-20 rounded-full object-cover border-2 border-[#1f6feb]" />
              )}
            </div>
            
            <div className="mb-6">
              <label className="block text-white mb-2 font-medium">Tell us about yourself</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="I'm a developer passionate about..."
                className="input resize-none"
                rows="4"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleUpdateProfile}
                className="flex-1 btn-primary"
              >
                Next
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 text-[#c9d1d9] hover:text-white transition font-medium"
              >
                Skip
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-2 text-white">👥 Follow Some Users</h2>
            <p className="text-[#c9d1d9] mb-6">Discover interesting people to follow</p>
            
            <div className="space-y-3 mb-6 max-h-80 overflow-y-auto">
              {suggestedUsers.map((suggestedUser) => (
                <div key={suggestedUser.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#1f3b5c]/30 hover:bg-[#1f3b5c]/50 transition">
                  <img
                    src={suggestedUser.profile_pic || 'https://via.placeholder.com/40'}
                    alt={suggestedUser.username}
                    className="w-12 h-12 rounded-full border-2 border-[#1f6feb]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate text-white">{suggestedUser.username}</p>
                    <p className="text-sm text-[#8b949e] truncate">{suggestedUser.bio || 'Tech enthusiast'}</p>
                  </div>
                  <button
                    onClick={() => handleFollow(suggestedUser.id)}
                    disabled={followedUsers.has(suggestedUser.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      followedUsers.has(suggestedUser.id)
                        ? 'bg-[#1f3b5c] text-[#8b949e] cursor-not-allowed'
                        : 'btn-primary'
                    }`}
                  >
                    {followedUsers.has(suggestedUser.id) ? 'Following' : 'Follow'}
                  </button>
                </div>
              ))}
            </div>
            
            <button
              onClick={onClose}
              className="w-full btn-primary"
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