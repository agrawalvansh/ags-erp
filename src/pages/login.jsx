import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaGoogle, FaGithub } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Redirect to home page on form submission
    navigate("/invoice");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#caf0f8] flex items-center justify-center p-4">
      {/* Main Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white rounded-3xl shadow-lg flex w-full max-w-6xl overflow-hidden border border-[#05014A]/10"
      >
        {/* Left Side - Branding */}
        <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center bg-gradient-to-br from-[#05014A] to-[#0a0a6c] relative overflow-hidden p-8">
          {/* Animated background elements */}
          <motion.div 
            className="absolute -top-20 -left-20 w-64 h-64 bg-[#caf0f8] rounded-full opacity-10"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#caf0f8] rounded-full opacity-10"
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />

          <div className="text-center px-8 z-10 space-y-8">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-[#caf0f8] mb-6"
            >
              Amit General Stores
            </motion.h1>
            
            {/* Feature list with improved accessibility */}
            <div className="flex flex-col gap-6 text-left">
              {[
                "Secure business networking",
                "Real-time collaboration tools",
                "Enterprise-grade encryption"
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="bg-[#caf0f8] p-2 rounded-full shrink-0">
                    <svg className="w-5 h-5 text-[#05014A]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-[#caf0f8]/90">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 p-8 md:p-12 max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-[#05014A]">Welcome Back</h2>
              <p className="mt-2 text-[#05014A]/80">Sign in to continue your business journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field with label */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#05014A]/90">Username</label>
                <div className="group relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#05014A]/50 transition-colors" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-[#05014A]/20 focus:border-[#05014A]/50 focus:ring-2 focus:ring-[#05014A]/10 bg-white/50 transition-all placeholder:text-[#05014A]/40"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              {/* Password Field with label */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#05014A]/90">Password</label>
                <div className="group relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#05014A]/50 transition-colors" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-[#05014A]/20 focus:border-[#05014A]/50 focus:ring-2 focus:ring-[#05014A]/10 bg-white/50 transition-all placeholder:text-[#05014A]/40"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {/* Submit Button with loading state */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-[#05014A] hover:bg-[#05014A]/90 text-[#caf0f8] py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <span>Sign In</span>
                <FiArrowRight className="w-5 h-5" />
              </motion.button>
            </form>

            {/* Helper Links */}
            <div className="text-center space-y-2 flex flex-col items-center justify-between">
              <a href="#" className="text-sm text-[#05014A]/80 hover:text-[#05014A] underline underline-offset-4 transition-colors">
                Forgot password?
              </a>
              <div className="text-sm text-[#05014A]/80">
                If not register with us <Link to="/signup" className="text-[#05014A] font-medium hover:underline">Signup</Link>
              </div>
            </div>

            {/* Social Auth with better contrast */}
            <div className="space-y-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#05014A]/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-[#05014A]/60">Or continue with</span>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <motion.button
                  whileHover={{ y: -2 }}
                  className="p-3 rounded-lg border border-[#05014A]/10 hover:border-[#05014A]/30 bg-white/50 flex items-center gap-2 text-[#05014A]/80 hover:text-[#05014A] transition-colors"
                >
                  <FaGoogle className="w-5 h-5" />
                  <span className="text-sm">Google</span>
                </motion.button>
                <motion.button
                  whileHover={{ y: -2 }}
                  className="p-3 rounded-lg border border-[#05014A]/10 hover:border-[#05014A]/30 bg-white/50 flex items-center gap-2 text-[#05014A]/80 hover:text-[#05014A] transition-colors"
                >
                  <FaGithub className="w-5 h-5" />
                  <span className="text-sm">GitHub</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;