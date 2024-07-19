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
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { styled } from "@mui/material/styles";
import ReactPlayer from "react-player";

const MovieCard = styled(Card)(({ theme }) => ({
  width: 280,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  margin: theme.spacing(2),
  position: "relative",
  overflow: "hidden",
}));

const Overlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  width: "100%",
  background: "rgba(0, 0, 0, 0.6)",
  color: theme.palette.common.white,
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  height: "100%",
}));

const MovieGrid = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openVideoOptions, setOpenVideoOptions] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(null);

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
          const moviesWithTrailers = await Promise.all(
            data.results.map(async (movie) => {
              const trailerResponse = await fetch(
                `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=e61ff087a286341b7b33fb21f1ad8a47`
              );
              const trailerData = await trailerResponse.json();
              const trailer = trailerData.results.find(
                (v) => v.type === "Trailer"
              );
              return {
                ...movie,
                trailerUrl: trailer
                  ? `https://www.youtube.com/watch?v=${trailer.key}`
                  : null,
                fullMovieUrl: null, // Placeholder for full movie URL
              };
            })
          );
          setMovies(moviesWithTrailers);
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

  const handleOpenVideoOptions = (movie) => {
    setCurrentMovie(movie);
    setOpenVideoOptions(true);
  };

  const handleCloseVideoOptions = () => {
    setOpenVideoOptions(false);
    setCurrentMovie(null);
  };

  const getTrailerUrl = () => currentMovie?.trailerUrl;
  const getFullMovieUrl = () => currentMovie?.fullMovieUrl;

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
    <>
      <Grid container spacing={2} justifyContent="center">
        {movies.map((movie) => (
          <Grid item key={movie.id}>
            <MovieCard>
              <Box sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  height="400"
                  image={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                  alt={movie.title}
                />
                <Overlay>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
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
                  <Box>
                    <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                      {movie.title}
                    </Typography>
                    <Description movie={movie} />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenVideoOptions(movie)}
                    >
                      Watch
                    </Button>
                  </Box>
                </Overlay>
              </Box>
            </MovieCard>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openVideoOptions}
        onClose={handleCloseVideoOptions}
        fullWidth
        maxWidth="lg" // Adjust this for different screen sizes
        PaperProps={{
          style: {
            padding: 0,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle>{currentMovie?.title}</DialogTitle>
        <DialogContent
          sx={{
            position: "relative",
            padding: 0,
            overflow: "hidden",
            paddingBottom: "56.25%", // 16:9 aspect ratio
          }}
        >
          {getTrailerUrl() && (
            <ReactPlayer
              url={getTrailerUrl()}
              width="100%"
              height="100%"
              controls
              style={{ position: "absolute", top: 0, left: 0 }}
            />
          )}
          {!getTrailerUrl() && (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              No trailer available.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseVideoOptions} color="primary">
            Close
          </Button>
          {getFullMovieUrl() && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.open(getFullMovieUrl(), "_blank")}
            >
              Watch Full Movie
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

const Description = ({ movie }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mt: 1,
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {expanded ? movie.overview : `${movie.overview.substring(0, 100)}...`}
      </Typography>
      <Button size="small" color="primary" onClick={handleExpandClick}>
        {expanded ? "Show Less" : "Show More"}
      </Button>
    </>
  );
};

export default MovieGrid;
