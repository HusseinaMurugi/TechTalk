import { useState, useContext } from 'react';
import { X, User, Mail, Lock, Eye, EyeOff, Camera, Link as LinkIcon, Shield, Bell, Palette, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const EditProfileModal = ({ isOpen, onClose, onUpdate }) => {
  const { user, updateUser } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState('basic');
  const [hasChanges, setHasChanges] = useState(false);
  
  // Basic Information
  const [displayName, setDisplayName] = useState(user?.username || '');
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  
  // Profile Appearance
  const [bio, setBio] = useState(user?.bio || '');
  const [profilePic, setProfilePic] = useState(user?.profile_pic || '');
  const [coverPhoto, setCoverPhoto] = useState('');
  const [website, setWebsite] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  
  // Account Settings
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState('public');
  
  // Interests and Tags
  const [selectedTags, setSelectedTags] = useState([]);
  const [interests, setInterests] = useState([]);
  
  // Preferences
  const [emailNotifications, setEmailNotifications] = useState({
    mentions: true,
    replies: true,
    trending: false
  });
  const [pushNotifications, setPushNotifications] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState('medium');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const techTags = [
    'Python', 'JavaScript', 'React', 'Node.js', 'AI', 'Machine Learning',
    'Web Development', 'DevOps', 'Cloud', 'AWS', 'Docker', 'Kubernetes',
    'Mobile Development', 'iOS', 'Android', 'Flutter', 'React Native',
    'Data Science', 'Blockchain', 'Cybersecurity', 'UI/UX', 'Design'
  ];

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setHasChanges(true);
  };

  const handleImageUpload = (type) => (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'profile') {
          setProfilePic(reader.result);
        } else {
          setCoverPhoto(reader.result);
        }
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const updates = {
        bio,
        profile_pic: profilePic,
        // Add other fields as needed
      };
      
      const response = await api.put('/profile', updates);
      updateUser(response.data);
      onUpdate?.();
      setHasChanges(false);
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    // Reset all fields to original values
    setBio(user?.bio || '');
    setProfilePic(user?.profile_pic || '');
    setHasChanges(false);
    onClose();
  };

  if (!isOpen) return null;

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Camera },
    { id: 'account', label: 'Account', icon: Lock },
    { id: 'interests', label: 'Interests', icon: LinkIcon },
    { id: 'preferences', label: 'Preferences', icon: Bell },
    { id: 'advanced', label: 'Advanced', icon: Shield }
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-white/40">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-black">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            <nav className="p-4 space-y-2">
              {sections.map(section => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                      activeSection === section.id
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              {/* Basic Information */}
              {activeSection === 'basic' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-black">Basic Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Display Name</label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => { setDisplayName(e.target.value); setHasChanges(true); }}
                        className="input"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Username</label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => { setUsername(e.target.value); setHasChanges(true); }}
                        className="input"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setHasChanges(true); }}
                        className="input"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Phone (Optional)</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => { setPhone(e.target.value); setHasChanges(true); }}
                        placeholder="For 2FA notifications"
                        className="input"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Profile Appearance */}
              {activeSection === 'appearance' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-black">Profile Appearance</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Profile Picture</label>
                      <div className="flex items-center gap-4">
                        <img
                          src={profilePic || 'https://via.placeholder.com/80'}
                          alt="Profile"
                          className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                        />
                        <label className="btn-primary cursor-pointer">
                          <Camera className="w-4 h-4 inline mr-2" />
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload('profile')}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Cover Photo</label>
                      <div className="w-full h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                        {coverPhoto ? (
                          <img src={coverPhoto} alt="Cover" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <label className="cursor-pointer text-gray-500 hover:text-gray-700">
                            <Camera className="w-6 h-6 mx-auto mb-1" />
                            <span className="text-sm">Add cover</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload('cover')}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => { setBio(e.target.value); setHasChanges(true); }}
                      rows="4"
                      placeholder="Tell us about yourself..."
                      className="input resize-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Website</label>
                      <input
                        type="url"
                        value={website}
                        onChange={(e) => { setWebsite(e.target.value); setHasChanges(true); }}
                        placeholder="https://yoursite.com"
                        className="input"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">GitHub</label>
                      <input
                        type="text"
                        value={github}
                        onChange={(e) => { setGithub(e.target.value); setHasChanges(true); }}
                        placeholder="username"
                        className="input"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">LinkedIn</label>
                      <input
                        type="text"
                        value={linkedin}
                        onChange={(e) => { setLinkedin(e.target.value); setHasChanges(true); }}
                        placeholder="username"
                        className="input"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Account Settings */}
              {activeSection === 'account' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-black">Account Settings</h3>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-black">Change Password</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="relative">
                        <label className="block text-sm font-medium text-black mb-2">Current Password</label>
                        <input
                          type={showPasswords ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="input pr-10"
                        />
                      </div>
                      
                      <div className="relative">
                        <label className="block text-sm font-medium text-black mb-2">New Password</label>
                        <input
                          type={showPasswords ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="input pr-10"
                        />
                      </div>
                      
                      <div className="relative">
                        <label className="block text-sm font-medium text-black mb-2">Confirm Password</label>
                        <input
                          type={showPasswords ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="input pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(!showPasswords)}
                          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-black">Two-Factor Authentication</h4>
                        <p className="text-sm text-black">Add an extra layer of security</p>
                      </div>
                      <button
                        onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                          twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Profile Visibility</label>
                      <select
                        value={profileVisibility}
                        onChange={(e) => setProfileVisibility(e.target.value)}
                        className="input"
                      >
                        <option value="public">Public - Anyone can see</option>
                        <option value="followers">Followers only</option>
                        <option value="private">Private - Only you</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Interests and Tags */}
              {activeSection === 'interests' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-black">Interests & Skills</h3>
                  
                  <div>
                    <h4 className="font-medium text-black mb-3">Tech Skills & Interests</h4>
                    <p className="text-sm text-black mb-4">Select topics you're interested in to personalize your feed</p>
                    <div className="flex flex-wrap gap-2">
                      {techTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => handleTagToggle(tag)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                            selectedTags.includes(tag)
                              ? 'bg-blue-100 text-blue-700 border border-blue-300'
                              : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences */}
              {activeSection === 'preferences' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-black">Preferences & Notifications</h3>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-black">Email Notifications</h4>
                    {Object.entries(emailNotifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-black capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <button
                          onClick={() => setEmailNotifications(prev => ({ ...prev, [key]: !value }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                            value ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Theme</label>
                      <select
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        className="input"
                      >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Font Size</label>
                      <select
                        value={fontSize}
                        onChange={(e) => setFontSize(e.target.value)}
                        className="input"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Advanced */}
              {activeSection === 'advanced' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-black">Advanced Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                      <h4 className="font-medium text-red-800 mb-2">Danger Zone</h4>
                      <p className="text-sm text-black mb-4">These actions cannot be undone</p>
                      <div className="space-y-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                          <Trash2 className="w-4 h-4" />
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-between p-6 border-t border-gray-200 bg-white/95 backdrop-blur">
          <div className="text-sm text-gray-500">
            {hasChanges && "You have unsaved changes"}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDiscard}
              className="btn-secondary"
            >
              Discard Changes
            </button>
            <button
              onClick={handleSave}
              disabled={loading || !hasChanges}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;