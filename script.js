document.addEventListener("DOMContentLoaded", function () {
  const apiKey = "77c4e2b070a2e1396500d0b42ebf7cec";

  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const modal = document.getElementById("modal");
  const modalCarousel = document.getElementById("modal-carousel");
  const closeModalButton = document.getElementById("close-modal");
  const movieDetailModal = document.getElementById("movie-detail-modal");
  const closeDetailModalButton = document.getElementById("close-detail-modal");
  const movieDetailContent = document.getElementById("movie-detail-content");
  const genreCarousels = {
    action: document.getElementById("action-carousel"),
    comedy: document.getElementById("comedy-carousel"),
    drama: document.getElementById("drama-carousel"),
    romance: document.getElementById("romance-carousel"),
    horror: document.getElementById("horror-carousel"),
  };

  async function fetchMoviesByGenre(genreId, carousel) {
    const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=pt-BR&with_genres=${genreId}`;

    const response = await fetch(apiUrl);
    const data = await response.json();
    const movies = data.results;

    movies.forEach((movie) => {
      const movieCard = document.createElement("div");
      movieCard.classList.add("movie-card");
      movieCard.dataset.id = movie.id;

      const movieImage = document.createElement("img");
      movieImage.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      movieImage.alt = movie.title;

      const movieTitle = document.createElement("div");
      movieTitle.classList.add("movie-title");
      movieTitle.textContent = movie.title;

      movieCard.appendChild(movieImage);
      movieCard.appendChild(movieTitle);

      carousel.appendChild(movieCard);

      movieCard.addEventListener("click", function () {
        showMovieDetails(movie.id);
      });
    });

    $("#" + carousel.id).slick({
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      centerMode: true,
      focusOnSelect: true,
      vertical: false,
      arrows: false,
      variableWidth: true,
      adaptiveHeight: true,
      autoplay: true,
      autoplaySpeed: 10500,
      pauseOnHover: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            arrows: false,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
          },
        },
      ],
    });
  }

  async function showMovieDetails(movieId) {
    const apiUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=pt-BR`;

    const response = await fetch(apiUrl);
    const movie = await response.json();

    movieDetailContent.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
      <h2>${movie.title}</h2>
      <p><strong>Data de Lançamento:</strong> ${movie.release_date}</p>
      <p class="rating"><strong>Nota:</strong> ${movie.vote_average} / 10</p>
      <p><strong>Enredo:</strong> ${movie.overview}</p>
    `;

    movieDetailModal.style.display = "flex";
  }

  closeDetailModalButton.addEventListener("click", function () {
    movieDetailModal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === movieDetailModal) {
      movieDetailModal.style.display = "none";
    }
  });

  async function searchMovies(query) {
    const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=pt-BR&query=${query}`;

    const response = await fetch(apiUrl);
    const data = await response.json();
    const filteredMovies = data.results;

    modalCarousel.innerHTML = "";

    filteredMovies.forEach((movie) => {
      const movieCard = document.createElement("div");
      movieCard.classList.add("movie-card");
      movieCard.dataset.id = movie.id;

      const movieImage = document.createElement("img");
      movieImage.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      movieImage.alt = movie.title;

      const movieTitle = document.createElement("div");
      movieTitle.classList.add("movie-title");
      movieTitle.textContent = movie.title;

      movieCard.appendChild(movieImage);
      movieCard.appendChild(movieTitle);

      modalCarousel.appendChild(movieCard);

      movieCard.addEventListener("click", function () {
        showMovieDetails(movie.id);
      });
    });

    if (filteredMovies.length > 0) {
      modal.style.display = "flex";
      $("#modal-carousel").slick({
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        centerMode: true,
        focusOnSelect: true,
        vertical: false,
        arrows: true,
        variableWidth: true,
        adaptiveHeight: true,
        autoplay: true,
        autoplaySpeed: 7500,
        pauseOnHover: true,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              arrows: false,
            },
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              arrows: false,
            },
          },
        ],
      });
    } else {
      alert("Nenhum filme encontrado para a pesquisa!");
    }
  }

  searchButton.addEventListener("click", function () {
    const searchText = searchInput.value.trim();
    if (searchText) {
      searchMovies(searchText);
    } else {
      modal.style.display = "none";
    }
  });

  closeModalButton.addEventListener("click", function () {
    modal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  const genres = {
    action: 28,
    comedy: 35,
    drama: 18,
    romance: 10749,
    horror: 27,
  };

  for (const genre in genres) {
    fetchMoviesByGenre(genres[genre], genreCarousels[genre]);
  }
});
