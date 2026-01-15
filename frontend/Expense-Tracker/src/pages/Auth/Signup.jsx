import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import axiosInstance from "../../utils/axiosInstance";
import investmentSvg from "../../assets/undraw_investment-data_frxx.svg";


const getPhotoURL = (file) => (file ? URL.createObjectURL(file) : null);

const initialForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  dob: "",
  profile: null,
  terms: false,
  showPassword: false,
};

const Signup = () => {
  const [form, setForm] = useState(initialForm);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, profile: file }));
    setPreview(getPhotoURL(file));
  };

  const handleTogglePassword = () =>
    setForm((prev) => ({ ...prev, showPassword: !prev.showPassword }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        fullName: form.name,
        email: form.email,
        password: form.password,
        dob: form.dob,
        profileImageUrl: preview || "",
      };

      const res = await axiosInstance.post(
        "http://localhost:5000/api/v1/auth/register",
        payload
      );

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      navigate("/auth/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  
    return (
  <AuthLayout
    title="Create Account"
    subtitle="Start tracking your expenses today"
    sideTitle="Take control of your finances"
    sideDesc="Join thousands of users managing expenses smarter every day."
  >
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {/* Full Name */}
      <input
        type="text"
        name="name"
        placeholder="Full name"
        value={form.name}
        onChange={handleChange}
        className="md:col-span-2 input"
        required
      />

      {/* Email */}
      <input
        type="email"
        name="email"
        placeholder="Email address"
        value={form.email}
        onChange={handleChange}
        className="md:col-span-2 input"
        required
      />

      {/* DOB */}
      <input
        type="date"
        name="dob"
        value={form.dob}
        onChange={handleChange}
        className="input"
        required
      />

      {/* Password */}
      <input
        type={form.showPassword ? "text" : "password"}
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="input"
        required
      />

      {/* Terms */}
      <label className="md:col-span-2 flex items-center gap-2 text-sm text-gray-600 mt-1">
        <input
          type="checkbox"
          name="terms"
          checked={form.terms}
          onChange={handleChange}
          required
          className="accent-[#875cf5]"
        />
        I accept the terms & conditions
      </label>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="md:col-span-2 mt-2 w-full bg-[#875cf5] text-white py-3 rounded-lg font-semibold hover:bg-[#734ae8] transition"
      >
        {loading ? "Creating account..." : "Create Account"}
      </button>

      {/* Footer */}
      <p className="md:col-span-2 text-center text-sm text-gray-600 mt-2">
        Already have an account?{" "}
        <Link to="/auth/login" className="text-[#875cf5] font-medium">
          Login
        </Link>
      </p>
    </form>
  </AuthLayout>
);

  
};

export default Signup;
