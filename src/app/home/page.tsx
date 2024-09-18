import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-8">
          Welcome to Blog Post
        </h1>
        <div className="space-y-4">
          <a
            href="/auth/register"
            className="block bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Register
          </a>
          <a
            href="/auth/login"
            className="block bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
