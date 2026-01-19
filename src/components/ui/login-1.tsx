"use client";

import React, { useState } from "react";
import { Chrome, Eye, EyeOff, Facebook } from "lucide-react";

interface FormState {
  email: string;
  password: string;
}

interface LoginScreenProps {
  onSubmit?: (data: FormState, mode: "login" | "signup") => Promise<void> | void;
  isLoading?: boolean;
  errorMessage?: string;
}

export default function LoginScreen({ onSubmit, isLoading = false, errorMessage }: LoginScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormState>({ email: "", password: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      await onSubmit(formData, isLogin ? "login" : "signup");
    } else {
      console.log("Form submitted:", formData);
    }
  };

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setFormData({ email: "", password: "" });
    setShowPassword(false);
  };

  return (
    <div className="w-full min-h-screen flex">
      {/* Left side - Hero section */}
      <div className="flex-1 bg-linear-to-br from-[#0b4022] via-[#0f5f30] to-[#bc6c25] flex items-center justify-center p-12">
        <div className="text-white max-w-lg">
          <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
            Welcome to Organica Dashboard.
          </h1>
          <p className="text-lg text-slate-100/80">
            Manage products, orders, and growth in one place—built for Moroccan Organica.
          </p>
        </div>
      </div>

      {/* Right side - Login/Signup form */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-6 sm:p-10 lg:p-12">
        <div className="w-full max-w-md">
          {errorMessage && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          {/* Logo/Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#118f14] rounded-lg mb-4 shadow-lg shadow-emerald-200/80">
              <div className="w-6 h-6 bg-white rounded-sm relative">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-3 bg-[#bc6c25] rounded-b-sm" />
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-1 h-2 bg-[#118f14] rounded-t-sm" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? "Welcome Back" : "Join Us Today"}
            </h2>
            <p className="text-gray-600">
              {isLogin
                ? "Welcome back to Organica — Continue your journey"
                : "Welcome to Organica — Start your journey"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Your email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {isLogin ? "Password" : "Create new password"}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                  placeholder={isLogin ? "Enter your password" : "Create a secure password"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  Remember me
                </label>
                <button type="button" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#118f14] hover:bg-[#0f7a11] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-[#118f14] focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : isLogin ? "Sign In" : "Create a new account"}
            </button>

            <div className="text-center text-sm text-gray-600">
              <span>{isLogin ? "Don't have an account?" : "Already have account?"}</span>{" "}
              <button type="button" onClick={toggleMode} className="text-blue-600 hover:text-blue-700 font-semibold">
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-8 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
              </div>
            </div>
          </div>

          {/* Social login buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
              <Chrome className="w-5 h-5 mr-2 text-[#4285f4]" />
              <span className="text-sm font-medium">Google</span>
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
              <Facebook className="w-5 h-5 mr-2 text-[#1877f2]" />
              <span className="text-sm font-medium">Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
