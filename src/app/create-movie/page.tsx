"use client";
import React, { useEffect, useState } from "react";
import { Button as AntButton, notification, Spin, Upload } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import RootLayout from "@/components/RootLayout";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useMovie } from "@/context/MovieContext";

const { Dragger } = Upload;

const CreateANewMovie: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { state, dispatch } = useMovie();
  const router = useRouter();

  const [title, setTitle] = useState<string>("");
  const [publishYear, setPublishYear] = useState<string>("");
  const [poster, setPoster] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated === undefined) {
      setIsCheckingAuth(true);
    } else if (!isAuthenticated) {
      router.push("/");
    } else {
      setIsCheckingAuth(false);
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (state.movie) {
      setIsEditMode(true);
      setTitle(state.movie.title);
      setPublishYear(state.movie.publish_year);
      setPosterPreview(state.movie.poster);
    }
  }, [state.movie]);

  const handleFileChange = (file: File) => {
    setPoster(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPosterPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!title || !publishYear || (!poster && !isEditMode)) {
      notification.error({
        message: "Validation Error",
        description: "Please fill in all fields and upload a poster image.",
      });
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("publish_year", publishYear);
    if (poster) {
      formData.append("poster", poster);
    }

    try {
      if (isEditMode && state.movie) {
        await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/movies/${state.movie.id}`, formData);
        notification.success({
          message: "Success",
          description: "Movie updated successfully!",
        });
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/movies`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        notification.success({
          message: "Success",
          description: "Movie created successfully!",
        });
      }

      dispatch({ type: "CLEAR_MOVIE" });
      router.push("/movie-list");
    } catch (error: any) {
      notification.error({
        message: "Submission Failed",
        description:
          error?.response?.data?.message || "An error occurred while processing the request. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <RootLayout>
      <div className="w-full px-6 py-16">
        <header className="mx-auto mb-8 w-full max-w-4xl text-left text-white">
          <h1 className="text-3xl font-semibold">{isEditMode ? "Edit Movie" : "Create a new movie"}</h1>
        </header>
        <main className="mx-auto flex w-full max-w-4xl flex-col-reverse items-start gap-8 lg:flex-row">
          <Dragger
            className="bg-input-color flex h-80 w-full flex-col items-center justify-center gap-4 border-dashed border-white lg:w-1/2"
            multiple={false}
            showUploadList={false}
            beforeUpload={file => {
              handleFileChange(file);
              return false;
            }}
          >
            {posterPreview ? (
              <img src={posterPreview} alt="Poster Preview" className="h-full max-h-72 w-full object-contain" />
            ) : (
              <>
                <DownloadOutlined className="text-2xl text-white" />
                <div className="text-white">Drop an image here or click to upload</div>
              </>
            )}
          </Dragger>
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSubmit();
            }}
            className="flex w-full flex-col items-start gap-4 lg:w-1/2"
          >
            <input
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full rounded-xl bg-cyan-900 px-4 py-3 text-white"
            />
            <input
              placeholder="Publishing year"
              value={publishYear}
              onChange={e => setPublishYear(e.target.value)}
              className="w-[13.5rem] rounded-xl bg-cyan-900 px-4 py-3 text-white"
            />
            <div className="mt-4 flex w-full flex-row items-start justify-start gap-4">
              <AntButton
                className={`rounded-3xs flex-1 border-[1px] border-solid border-white bg-transparent text-white`}
                onClick={() => {
                  dispatch({ type: "CLEAR_MOVIE" });
                  router.push("/movie-list");
                }}
              >
                Cancel
              </AntButton>
              <AntButton
                type="primary"
                className={`rounded-3xs flex-1 bg-emerald-400 text-white ${
                  isLoading ? "cursor-not-allowed opacity-50" : ""
                }`}
                htmlType="submit"
                loading={isLoading}
                disabled={isLoading}
              >
                {isEditMode ? "Update" : "Submit"}
              </AntButton>
            </div>
          </form>
        </main>
      </div>
    </RootLayout>
  );
};

export default CreateANewMovie;
