import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
const API_URL = import.meta.env.VITE_API_URL;

const CreatePost = () => {
  const queryClient = useQueryClient();

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
        `${API_URL}/posts`,
        { text: data.text },
        { withCredentials: true }
      );

      if (res.data.success) {
        alert("Post created successfully!");
        reset(); // ✅ Reset form after submission
        queryClient.invalidateQueries(["posts"]);
      } else {
        throw new Error(res.data.error || "An error occurred");
      }
    } catch (error) {
      console.error("🔥 Error creating post:", error);
    }
  };

  return (
    <div className="flex flex-col justify-between items-center w-full h-full">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <textarea
          placeholder="Text"
          {...register("text")}
          className="textarea textarea-primary w-100 h-50 resize-none border mb-4"
        />
        <p className="text-red-500">{errors.text?.message}</p>

        {/* <input
          type="file"
          accept="image/*"
          {...register("file")}
          className="file-input file-input-primary my-4 w-100"
        /> */}

        <p className="text-red-500">{errors.file?.message}</p>

        <button type="submit" className="btn btn-primary">
          Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
