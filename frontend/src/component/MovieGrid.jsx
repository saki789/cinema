import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  Typography,
  Card,
  CardMedia,
  Button,
  IconButton,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { styled } from "@mui/material/styles";

const MovieCard = styled(Card)(({ theme }) => ({
  width: 280, // Adjusted width
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  margin: theme.spacing(2),
  position: "relative",
  overflow: "hidden", // Prevents overflow
}));

const Overlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  width: "100%",
  background: "rgba(0, 0, 0, 0.6)",
  color: theme.palette.common.white,
  padding: theme.spacing(1),
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
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
            <Box sx={{ position: "relative" }}>
              <CardMedia
                component="img"
                height="400" // Adjusted height to fit the card
                image={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                alt={movie.title}
              />
              <Overlay>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2">
                    <StarIcon color="primary" /> {movie.vote_average}
                  </Typography>
                  <Box>
                    <IconButton color="primary" aria-label="share">
                      <ShareIcon />
                    </IconButton>
                    <IconButton color="primary" aria-label="love">
                      <FavoriteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="h6" component="div">
                    {movie.title}
                  </Typography>
                  <Description movie={movie} />
                </Box>
              </Overlay>
            </Box>
          </MovieCard>
        </Grid>
      ))}
    </Grid>
  );
};

const Description = ({ movie }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {expanded ? movie.overview : `${movie.overview.substring(0, 100)}...`}
      </Typography>
      <Button size="small" color="primary" onClick={handleExpandClick}>
        {expanded ? "Show Less" : "Show More"}
      </Button>
    </>
  );
};

export default MovieGrid;
