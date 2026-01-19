import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/password-reset/verify', { email, security_answer: securityAnswer });
      setSecurityQuestion(response.data.security_question);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.detail || 'Verification failed');
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/password-reset/reset', { email, security_answer: securityAnswer, new_password: newPassword });
      setSuccess('Password reset successful!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Reset failed');
    }
  };

  return (
    <div className="app-bg min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">TechTalk</h1>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Reset Password</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}
        
        {step === 1 ? (
          <form onSubmit={handleVerify}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:border-blue-500 focus:outline-none transition"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">Security Answer</label>
              <input
                type="text"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                placeholder="Answer to your security question"
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:border-blue-500 focus:outline-none transition"
                required
              />
            </div>
            
            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-semibold">
              Verify
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset}>
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700"><strong>Your Question:</strong> {securityQuestion}</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:border-blue-500 focus:outline-none transition"
                required
              />
            </div>
            
            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-semibold">
              Reset Password
            </button>
          </form>
        )}
        
        <p className="mt-6 text-center">
          <Link to="/login" className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
