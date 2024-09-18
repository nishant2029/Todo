"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// Define the Blog type
interface Blog {
  title: string;
  content: string;
  author: string;
}

const Blog = () => {
  const [userBlog, setUserBlog] = useState<Blog[]>([]); // Initialize as an empty array with Blog[] type
  const router = useRouter();

  // Navigate to the "Add Blog" page
  const handleSubmit = () => {
    router.push("/list/addblog");
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      // Ensure the code runs on the client
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
        if (token) {
          try {
            // Fetch user blogs
            const response = await axios.get("http://localhost:8080/blogs", {
              headers: {
                Authorization: `Bearer ${token}`, // Include token in Authorization header
              },
            });

            setUserBlog(response.data.blogs); // Set the user blogs from response
          } catch (error) {
            console.error("Error fetching blogs:", error);
          }
        }
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Your Blogs
      </h1>
      <hr className="border-t-2 border-gray-300 mb-6" />

      {/* Check if blogs exist */}
      {userBlog.length > 0 ? (
        <div className="space-y-6">
          {/* Map through user blogs */}
          {userBlog.map((blog, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {blog.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">{blog.content}</p>
              <hr className="border-t mt-4" />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">Loading blogs or no blogs available...</p>
      )}

      <div className="mt-10 text-center">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-200"
        >
          Add Blog
        </button>
      </div>
    </div>
  );
};

export default Blog;
