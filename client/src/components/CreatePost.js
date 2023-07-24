import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_POST } from "../utils/mutations"; //Bringing in the add post mutation
import { QUERY_POSTS, QUERY_USER, GET_POSTS } from "../utils/queries"; //Bringing in my post queries and my user query
import Auth from "../utils/auth"; //bringing in my Auth middleware

const CreatePost = () => {
  const [postText, setPostText] = useState(""); //state use of post Text that will be provided
  const [showInputBox, setShowInputBox] = useState(false);
  const [addPost, {error}] = useMutation(ADD_POST, {
    update(cache, {data: {addPost}}) {
      const {posts} = cache.readQuery({ query: QUERY_POSTS});
      cache.writeQuery({
        query: QUERY_POSTS,
        data: { posts: [addPost, ...posts]},
      });
    },
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await addPost({
        variables: {
          postText,
        },
      });

      setPostText("");
      console.log("Post created:", data.addPost);
    } catch (err) {
      console.error("error adding post",err);
    }
  };

  const handleAddPostClick = () => {
    setShowInputBox(true);
    setPostText(""); // Clear the text box
  };

  const handleCancelClick = () => {
    setPostText(""); // Clear the text box
    setShowInputBox(false);
  };


  return (
    <div className="container mx-auto max-w-md px-4 py-8">
      {Auth.loggedIn() ? (
        <>
          {showInputBox ? (
            <form onSubmit={handleFormSubmit} className="w-full">
              <textarea
                name="postText"
                placeholder="Share your Post here..."
                value={postText}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
                style={{ lineHeight: "1.5", resize: "vertical" }}
                onChange={(event) => setPostText(event.target.value)}
              ></textarea>

              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  className="text-bold background-darkBlue text-white py-2 px-4 rounded-lg hover:background-yellow hover:text-black"
                >
                  Add Post
                </button>
                <button
                  type="button"
                  className="text-bold px-4 py-2 background-medBlue text-white rounded-lg hover:background-yellow hover:text-black"
                  onClick={handleCancelClick}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="flex justify-center">
              <button
                className="background-darkBlue text-white py-2 px-4 rounded-lg hover:background-yellow hover:text-black text-bold"
                onClick={handleAddPostClick}
              >
                Create Post
              </button>
            </div>
          )}
          {error && (
            <div className="mt-3 bg-danger text-red-800 p-3">{error.message}</div>
          )}
        </>
      ) : (
        <p>
          You need to be logged in to share your thoughts. Please{" "}
          <Link to="/login">login</Link> or <Link to="/signup">signup.</Link>
        </p>
      )}
    </div>
  );
};

export default CreatePost;
