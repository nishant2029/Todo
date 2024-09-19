"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const OtpPage: React.FC = () => {
  const [otp, setOtp] = useState<string>("");
  const [userDetails, setUserDetails] = useState<{
    name: string;
    email: string;
    password: string;
    address: string;
  }>({
    name: "",
    email: "",
    password: "",
    address: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get("name");
    const email = urlParams.get("email");
    const password = urlParams.get("password");
    const address = urlParams.get("address");

    if (name && email && password && address) {
      setUserDetails({
        name,
        email,
        password,
        address,
      });
      setLoading(false);
    } else {
      setError("Missing required query parameters.");
      setLoading(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:8080/verify-otp", {
        ...userDetails,
        otp,
      });
      router.push("/auth/login");
    } catch (error) {
      console.error("Error during OTP verification", error);
      setError("An error occurred during OTP verification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Verify OTP</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
              className="w-full p-3 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full hover:bg-blue-600 transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpPage;
