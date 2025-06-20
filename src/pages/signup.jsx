import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBuilding, FaUser, FaLock, FaChartLine, FaCheck, FaInfoCircle } from 'react-icons/fa';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { useNavigate, Link } from 'react-router-dom';

const SignupPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { title: "Account Setup", icon: <FaUser />, fields: ['fullName', 'email', 'password'] },
    { title: "Business Info", icon: <FaBuilding />, fields: ['businessName', 'industry', 'website'] },
    { title: "Finalization", icon: <FaCheck />, fields: ['employees', 'revenue', 'terms'] }
  ];

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    businessName: '',
    industry: '',
    website: '',
    employees: '',
    revenue: '',
    terms: false
  });

  // Fixed validation rules
  const validate = (step) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Simplified password regex to just check length
    const passwordRegex = /^.{8,}$/;

    // Only validate fields for the current step
    steps[step - 1].fields.forEach(field => {
      switch(field) {
        case 'fullName':
          if (!formData.fullName.trim()) {
            errors.fullName = 'Full name is required';
          }
          break;
        case 'email':
          if (!formData.email) {
            errors.email = 'Email is required';
          } else if (!emailRegex.test(formData.email)) {
            errors.email = 'Invalid email address';
          }
          break;
        case 'password':
          if (!formData.password) {
            errors.password = 'Password is required';
          } else if (!passwordRegex.test(formData.password)) {
            errors.password = 'Password must be at least 8 characters';
          }
          break;
        case 'terms':
          if (!formData.terms) {
            errors.terms = 'You must accept the terms';
          }
          break;
        default:
          if (!formData[field] && field !== 'website') {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
          }
      }
    });

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(currentStep);

    if (Object.keys(errors).length === 0) {
      if (currentStep === steps.length) {
        setIsSubmitting(true);
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          navigate('/');
        } finally {
          setIsSubmitting(false);
        }
      } else {
        nextStep();
      }
    } else {
      setFormErrors(errors);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

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

        {/* Right Form Section */}
        <div className="flex-1 flex flex-col">
          {/* Progress Header */}
          <div className="p-6 pt-8 pb-2 border-b border-[#05014A]/10">
            <div className="flex justify-between items-center w-full">
              {steps.map((step, index) => (
                <div key={step.title} className="flex flex-col items-center relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
                    ${currentStep > index + 1 ? 'bg-[#05014A] text-white' : 
                     currentStep === index + 1 ? 'bg-[#05014A] text-white ring-4 ring-[#05014A]/30' : 
                     'bg-[#caf0f8] text-[#05014A]'}`}>
                    {currentStep > index + 1 ? <FaCheck /> : step.icon}
                  </div>
                  <p className={`text-xs mt-2 text-center ${currentStep >= index + 1 ? 'text-[#05014A] font-medium' : 'text-gray-400'}`}>
                    {step.title}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-4 h-1 bg-[#caf0f8] rounded-full">
              <div 
                className="h-full bg-[#05014A] rounded-full transition-all duration-500" 
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode='wait'>
                {currentStep === 1 && (
                  <Step1 
                    formData={formData} 
                    formErrors={formErrors}
                    handleChange={handleChange}
                  />
                )}
                
                {currentStep === 2 && (
                  <Step2 
                    formData={formData} 
                    formErrors={formErrors}
                    handleChange={handleChange}
                  />
                )}
                
                {currentStep === 3 && (
                  <Step3 
                    formData={formData} 
                    formErrors={formErrors}
                    handleChange={handleChange}
                    isSubmitting={isSubmitting}
                  />
                )}
              </AnimatePresence>

              {/* Navigation Controls */}
              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <motion.button
                    type="button"
                    onClick={prevStep}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-2 text-[#05014A]/80 hover:text-[#05014A]"
                  >
                    <FiArrowLeft />
                    Previous
                  </motion.button>
                )}
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  disabled={isSubmitting}
                  className={`ml-auto px-6 py-2 rounded-lg flex items-center gap-2 
                    ${currentStep === steps.length ? 
                      'bg-[#05014A] text-[#caf0f8] hover:bg-[#05014A]/90' : 
                      'bg-[#caf0f8] text-[#05014A] hover:bg-[#caf0f8]/90'}`}
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-5 h-5 border-2 border-[#05014A] border-t-transparent rounded-full"
                    />
                  ) : currentStep === steps.length ? (
                    'Complete Registration'
                  ) : (
                    <>
                      Next
                      <FiArrowRight />
                    </>
                  )}
                </motion.button>
              </div>
              
              {/* Login Link */}
              <div className="text-center mt-6 pt-4 border-t border-[#05014A]/10">
                <p className="text-[#05014A]/70">
                  Already have an account?{" "}
                  <Link to="/login" className="text-[#05014A] font-medium hover:underline">
                    Login here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Step Components
const Step1 = ({ formData, formErrors, handleChange }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-6"
  >
    <h3 className="text-2xl font-bold text-[#05014A]">Create Your Account</h3>

    <div className="space-y-4">
      <InputField
        icon={<FaUser />}
        label="Full Name"
        name="fullName"
        value={formData.fullName}
        error={formErrors.fullName}
        onChange={handleChange}
        placeholder="Enter your full name"
        required
      />
      <InputField
        icon={<FaUser />}
        label="Email Address"
        name="email"
        type="email"
        value={formData.email}
        error={formErrors.email}
        onChange={handleChange}
        placeholder="Enter your email address"
        required
      />
      <InputField
        icon={<FaLock />}
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        error={formErrors.password}
        onChange={handleChange}
        placeholder="Create a secure password"
      />
    </div>
  </motion.div>
);

const Step2 = ({ formData, formErrors, handleChange }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-6"
  >
    <h3 className="text-2xl font-bold text-[#05014A]">Business Information</h3>

    <div className="space-y-4">
      <InputField
        icon={<FaBuilding />}
        label="Business Name"
        name="businessName"
        value={formData.businessName}
        error={formErrors.businessName}
        onChange={handleChange}
        placeholder="Enter your business name"
        required
      />
      <InputField
        icon={<FaChartLine />}
        label="Industry"
        name="industry"
        value={formData.industry}
        error={formErrors.industry}
        onChange={handleChange}
        placeholder="Select your industry"
        required
      />
      <InputField
        icon={<FaChartLine />}
        label="Website"
        name="website"
        type="url"
        value={formData.website}
        error={formErrors.website}
        onChange={handleChange}
        placeholder="https://your-business-website.com"
      />
    </div>
  </motion.div>
);

const Step3 = ({ formData, formErrors, handleChange, isSubmitting }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-6"
  >
    <h3 className="text-2xl font-bold text-[#05014A]">Final Details</h3>

    <div className="space-y-4">
      <InputField
        label="Number of Employees"
        name="employees"
        type="number"
        value={formData.employees}
        error={formErrors.employees}
        onChange={handleChange}
        placeholder="Enter number of employees"
        min="1"
      />
      <InputField
        label="Annual Revenue"
        name="revenue"
        type="select"
        options={['< $100k', '$100k - $1M', '$1M - $10M', '> $10M']}
        value={formData.revenue}
        error={formErrors.revenue}
        onChange={handleChange}
        placeholder="Select your annual revenue"
      />
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="terms"
          name="terms"
          checked={formData.terms}
          onChange={handleChange}
          className="w-5 h-5 mt-1 border-[#05014A]/30 rounded focus:ring-[#05014A]"
        />
        <label htmlFor="terms" className="text-sm text-[#05014A]/80">
          I agree to the{' '}
          <a href="/terms" className="text-[#05014A] underline hover:text-[#05014A]/70">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-[#05014A] underline hover:text-[#05014A]/70">
            Privacy Policy
          </a>
        </label>
      </div>
      {formErrors.terms && <p className="text-red-500 text-sm mt-1">{formErrors.terms}</p>}
    </div>

    <AnimatePresence>
      {isSubmitting && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <h4 className="text-lg font-medium text-green-700 flex items-center gap-2">
            <FaCheck className="text-green-600" />
            Registration Successful!
          </h4>
          <p className="text-green-600 mt-2">
            Redirecting to your dashboard...
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

// Enhanced Input Component
const InputField = ({ icon, label, type = 'text', options, error, infoText, ...props }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label htmlFor={props.name} className="text-sm font-medium text-[#05014A]/90">{label}</label>
      {infoText && (
        <span className="text-xs text-[#05014A]/50 flex items-center gap-1">
          <FaInfoCircle className="w-3 h-3" />
          {infoText}
        </span>
      )}
    </div>

    {type === 'select' ? (
      <select
        id={props.name}
        {...props}
        className={`w-full px-4 py-3 rounded-lg border ${
          error ? 'border-red-300' : 'border-[#05014A]/20'
        } focus:border-[#05014A]/50 focus:ring-2 focus:ring-[#05014A]/10 bg-white/50`}
      >
        <option value="">{props.placeholder || 'Select an option'}</option>
        {options?.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    ) : (
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#05014A]/50">
            {icon}
          </div>
        )}
        <input
          id={props.name}
          type={type}
          {...props}
          className={`w-full ${icon ? 'pl-12' : 'pl-4'} pr-4 py-3 rounded-lg border ${
            error ? 'border-red-300' : 'border-[#05014A]/20'
          } focus:border-[#05014A]/50 focus:ring-2 focus:ring-[#05014A]/10 bg-white/50 transition-all placeholder:text-[#05014A]/40`}
        />
      </div>
    )}

    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default SignupPage;