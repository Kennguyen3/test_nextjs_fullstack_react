import type { ReactNode } from "react";
import React, { createContext, useContext, useReducer } from "react";

interface MovieState {
  movie: Movie | null;
}

export interface Movie {
  id: number;
  title: string;
  publish_year: string;
  poster: string;
}

type Action = { type: "SET_MOVIE"; payload: Movie } | { type: "CLEAR_MOVIE" };

const initialState: MovieState = {
  movie: null,
};

const MovieContext = createContext<{ state: MovieState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

const movieReducer = (state: MovieState, action: Action): MovieState => {
  switch (action.type) {
    case "SET_MOVIE":
      return { ...state, movie: action.payload };
    case "CLEAR_MOVIE":
      return { ...state, movie: null };
    default:
      return state;
  }
};

export const MovieProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer<any>(movieReducer, initialState);

  return <MovieContext.Provider value={{ state: state as any, dispatch }}>{children}</MovieContext.Provider>;
};

export const useMovie = () => {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error("useMovie must be used within a MovieProvider");
  }
  return context;
};
