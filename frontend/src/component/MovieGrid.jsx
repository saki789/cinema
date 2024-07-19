import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { styled } from "@mui/material/styles";

const MovieCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  margin: theme.spacing(2),
}));

const MovieGrid = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          "https://api.themoviedb.org/3/movie/popular?api_key=e61ff087a286341b7b33fb21f1ad8a47"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        if (data.results) {
          setMovies(data.results);
        } else {
          throw new Error("Data format error");
        }
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <Typography variant="h6" color="error">
          Error fetching movies: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2} justifyContent="center">
      {movies.map((movie) => (
        <Grid item key={movie.id}>
          <MovieCard>
            <CardMedia
              component="img"
              height="140"
              image={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              alt={movie.title}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {movie.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {movie.overview}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">
                Learn More
              </Button>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <StarIcon color="primary" />
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  {movie.vote_average}
                </Typography>
              </Box>
            </CardActions>
          </MovieCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default MovieGrid;
