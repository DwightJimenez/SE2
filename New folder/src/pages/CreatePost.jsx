import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

const CreatePost = () => {
  const schema = yup.object({
    text: yup.string().required("Text is required"),
    file: yup
      .mixed()
      .test("fileSize", "File size must be less than 2MB", (value) => {
        if (!value || value.length === 0) return true;
        return value[0].size <= 2 * 1024 * 1024;
      }),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:4001/posts",
        { text: data.text },
        {
          headers: {
            "Content-Type": "application/json", // ✅ Send JSON (no file)
            accessToken: sessionStorage.getItem("accessToken"),
          },
        }
      );

      if (res.data.success) {
        alert("Post created successfully!");
        reset(); // ✅ Reset form after submission
      } else {
        throw new Error(res.data.error || "An error occurred");
      }
    } catch (error) {
      console.error("🔥 Error creating post:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-4">
      <p className="text-xl font-bold m-4">Create Post</p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <textarea
          placeholder="Text"
          {...register("text")}
          className="textarea textarea-primary w-100 mb-4"
        />
        <p className="text-red-500">{errors.text?.message}</p>

        <input
          type="file"
          accept="image/*" // ✅ Only allows image files
          {...register("file")}
          className="file-input file-input-primary mb-2"
        />

        <p className="text-red-500">{errors.file?.message}</p>

        <button type="submit" className="btn btn-primary">
          Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;

