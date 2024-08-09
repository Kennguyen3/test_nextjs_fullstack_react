"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import RootLayout from "@/components/RootLayout";
import { useRouter } from "next/navigation";
import { Button, Card, Pagination, Space, Spin } from "antd";
import { LogoutOutlined, PlusCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import type { Movie } from "@/context/MovieContext";
import { useMovie } from "@/context/MovieContext";

const Page: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMovies, setTotalMovies] = useState(0);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const pageSize = 10;

  useEffect(() => {
    if (isAuthenticated === undefined) {
      setIsCheckingAuth(true);
    } else if (!isAuthenticated) {
      router.push("/");
    } else {
      fetchMovies(0);
      setIsCheckingAuth(false);
    }
  }, [isAuthenticated, router]);

  const fetchMovies = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/movies`, {
        params: {
          page: page,
          limit: pageSize, // Pass the limit as a parameter
        },
      });
      setMovies(response.data.data);
      setTotalMovies(response.data.total);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
      {movies.length === 0 && !loading ? (
        <div className={"flex h-[90vh] items-center justify-center"}>
          <Space direction={"vertical"}>
            <h1 className="relative flex-1 whitespace-nowrap text-3xl text-inherit">Your movie list is empty</h1>
            <Button
              type="primary"
              className={`rounded-3xs flex-1 bg-emerald-400 text-white`}
              onClick={() => router.push("/create-movie")}
            >
              Add a new movie
            </Button>
          </Space>
        </div>
      ) : (
        <div className="w-full px-6 py-16">
          <FrameComponent />
          {loading ? (
            <div className="flex min-h-[64.5rem] items-center justify-center">
              <Spin size="large" />
            </div>
          ) : (
            <>
              <section className="mt-16 box-border flex max-w-full flex-row items-start justify-center self-stretch px-5 pb-1.5 pt-0">
                <div className="grid w-[75rem] max-w-full grid-cols-2 gap-x-2 gap-y-4 lg:grid-cols-4">
                  {movies.map(movie => (
                    <GroupComponent3
                      key={movie.id}
                      id={movie.id}
                      group15={movie.poster}
                      title={movie.title}
                      publishYear={movie.publish_year}
                    />
                  ))}
                </div>
              </section>
              <div className="mt-6 flex flex-row items-start justify-center self-stretch px-[1.25rem] py-0">
                <Pagination
                  current={currentPage}
                  total={totalMovies}
                  pageSize={pageSize}
                  showSizeChanger={false}
                  onChange={handlePageChange}
                  className="custom-pagination"
                  itemRender={(page, type, originalElement) => {
                    if (type === "prev") {
                      return <b className="pagination-prev-next">Prev</b>;
                    }
                    if (type === "next") {
                      return <b className="pagination-prev-next">Next</b>;
                    }
                    return originalElement;
                  }}
                />
              </div>
            </>
          )}
        </div>
      )}
    </RootLayout>
  );
};

export default Page;

export type GroupComponent3Type = {
  className?: string;
  group15?: string;
  title?: string;
  publishYear?: string;
  id: number; // Add this to the type
};

const GroupComponent3: React.FC<GroupComponent3Type> = ({ className = "", group15, title, publishYear, id }) => {
  const { dispatch } = useMovie();
  const router = useRouter();

  const handleEditClick = () => {
    const movie: any = { id, title, publish_year: publishYear, poster: group15 };
    dispatch({ type: "SET_MOVIE", payload: movie });
    router.push("/create-movie");
  };

  return (
    <Card
      styles={{ body: { padding: 8 } }}
      className={"cursor-pointer rounded-lg"}
      style={{ background: "#092C39", border: "none", maxHeight: "32rem" }}
      onClick={handleEditClick}
    >
      <div className={`font-body-large relative text-left text-[1.25rem] text-white ${className}`}>
        <div className="bg-card-color relative box-border flex h-0 w-full flex-col items-start justify-start rounded-xl pb-[150%]">
          <img
            className="absolute inset-0 h-full w-full rounded-lg object-cover"
            loading="lazy"
            alt={title}
            src={group15}
          />
        </div>
        <div className="ml-1 mt-1 flex flex-col">
          <h3 className="mq450:text-[1rem] mq450:leading-[1.625rem] relative m-0 inline-block min-w-[4.625rem] font-[inherit] font-medium leading-[2rem] text-inherit">
            {title}
          </h3>
          <div className="relative inline-block min-w-[1.938rem] text-[0.875rem] leading-[1.5rem]">{publishYear}</div>
        </div>
      </div>
    </Card>
  );
};

const FrameComponent: React.FC = () => {
  const { logout } = useAuth();
  const router = useRouter();
  return (
    <div className="box-border flex max-w-full flex-row items-start justify-center self-stretch px-[1.25rem] pb-[0.687rem] pt-[0rem]">
      <header className="flex w-[75rem] max-w-full flex-row items-start justify-between gap-[1.25rem] text-center text-white">
        <div className="flex items-center gap-2 text-white">
          <h1 className="relative flex-1 whitespace-nowrap text-3xl text-inherit">My movies</h1>
          <PlusCircleOutlined
            style={{ fontSize: 24 }}
            className="cursor-pointer"
            onClick={() => router.push("/create-movie")}
          />
        </div>
        <div className="flex cursor-pointer items-center gap-2 text-white" onClick={logout}>
          <a className="relative inline-block min-w-[3.75rem] font-bold leading-[1.5rem] text-[inherit] [text-decoration:none]">
            Logout
          </a>
          <LogoutOutlined className="relative h-[2rem] w-[2rem] shrink-0 overflow-hidden" />
        </div>
      </header>
    </div>
  );
};
