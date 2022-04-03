import React, { useState, useEffect, useCallback } from "react";
import AddMovie from "../src/components/AddMovie";
import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  /** async/await POST method using Firebase Realtime Database*/
  const fetchMovieshandler = useCallback(async () => {
    setIsLoading(true);
    setIsError(null);
    try {
      const response = await fetch(
        "https://react-http-using-fetch-default-rtdb.firebaseio.com/movies.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong!!");
      }

      const data = await response.json();
      const loadedMovies = [];
      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }
      setMovies(loadedMovies);
    } catch (error) {
      setIsError(error.message);
    }
    setIsLoading(false);
  }, []);

  /** async/await GET method 
  const fetchMovieshandler = useCallback(async () => {
    setIsLoading(true);
    setIsError(null);
    try {
      const response = await fetch("https://swapi.dev/api/films/");
      // const response = await fetch("https://swapi.dev/api/film/"); //Invalid API for error handling
      if (!response.ok) {
        throw new Error("Something went wrong!!");
      }

      const data = await response.json();
      const transformedData = data.results.map((item) => {
        return {
          id: item.episode_id,
          title: item.title,
          openingText: item.opening_crawl,
          releaseDate: item.release_date,
        };
      });
      setMovies(transformedData);
    } catch (error) {
      setIsError(error.message);
    }
    setIsLoading(false);
  }, []); */

  /** Promise GET method
  const fetchMovieshandler = () => {
    fetch("https://swapi.dev/api/films/")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const transformedData = data.results.map((item) => {
          return {
            id: item.episode_id,
            title: item.title,
            openingText: item.opening_crawl,
            releaseDate: item.release_date,
          };
        });
        setMovies(transformedData);
      });
  }; */

  useEffect(() => {
    fetchMovieshandler();
  }, [fetchMovieshandler]);

  async function addMovieHandler(movie) {
    const response = await fetch(
      "https://react-http-using-fetch-default-rtdb.firebaseio.com/movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = response.json();
    console.log(data);
  }

  let content = <p>No movies found.</p>;
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }
  if (isError) {
    content = <p>Something went wrong!!</p>;
  }
  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMovieshandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
