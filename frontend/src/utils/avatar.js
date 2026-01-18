// Utility function to get profile picture with default fallback
export const getProfilePic = (profilePic, username = 'User') => {
  if (profilePic && profilePic.trim()) {
    return profilePic;
  }
  
  // Generate a default avatar using UI Avatars service
  // This creates a colorful avatar with the user's initials
  const initials = username
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=1f6feb&color=fff&size=200&bold=true`;
};
