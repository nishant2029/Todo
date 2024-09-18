"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Addblog = () => {
  const router = useRouter();
  const [title, setTarget] = useState("");
  const [content, setBlog] = useState("");

  const handleSubmit = async () => {
    const token = localStorage.getItem("authToken");
    try {
      await axios.post(
        "http://localhost:8080/blog",
        { title, content }, // Payload with the data
        {
          headers: {
            Authorization: `Bearer ${token}`, // Headers go here
          },
        }
      );
      router.push("/list"); // Redirect to the list page after successful post
    } catch (error) {
      console.log(error); // Handle error appropriately
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Add a New Blog
      </h1>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="w-full p-3 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Add Title"
          />
        </div>
        
        <div>
          <label htmlFor="blog" className="block text-lg font-medium text-gray-700 mb-2">
            Blog Content
          </label>
          <textarea
            id="blog"
            className="w-full p-3 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={8}
            onChange={(e) => setBlog(e.target.value)}
            placeholder="Write your blog content here"
          />
        </div>
        
        <div className="text-center mt-8">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Add Blog
          </button>
        </div>
      </div>
    </div>
  );
};

export default Addblog;
