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
  const [openFullMovie, setOpenFullMovie] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:3001/movies"); // Update this to your backend URL
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setMovies(data);
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

  const handleOpenFullMovie = (movie) => {
    setCurrentMovie(movie);
    setOpenFullMovie(true);
  };

  const handleCloseFullMovie = () => {
    setOpenFullMovie(false);
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
                  image={movie.poster_url} // Ensure your database has this field
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
                      <StarIcon color="primary" /> {movie.rating}
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
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {movie.trailerUrl && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpenVideoOptions(movie)}
                        >
                          Trailer
                        </Button>
                      )}
                      {/* Always show Full Movie button for demonstration */}
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenFullMovie(movie)}
                      >
                        Full Movie
                      </Button>
                    </Box>
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
        maxWidth="lg"
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
        </DialogActions>
      </Dialog>

      <Dialog
        open={openFullMovie}
        onClose={handleCloseFullMovie}
        fullWidth
        maxWidth="lg"
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
          {getFullMovieUrl() && (
            <ReactPlayer
              url={getFullMovieUrl()}
              width="100%"
              height="100%"
              controls
              style={{ position: "absolute", top: 0, left: 0 }}
            />
          )}
          {!getFullMovieUrl() && (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              No full movie available.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFullMovie} color="primary">
            Close
          </Button>
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
          mb: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {movie.description}
      </Typography>
      <Button onClick={handleExpandClick}>
        {expanded ? "Show Less" : "Show More"}
      </Button>
      {expanded && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {movie.description}
        </Typography>
      )}
    </>
  );
};

export default MovieGrid;
