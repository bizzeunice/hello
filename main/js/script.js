document.addEventListener("DOMContentLoaded", function () {
    fetchLatestMovies();
});

const apiKey = '10395f27ffd401df0db761d8c485ac32'; // Replace with your TMDB API Key
const imgBaseUrl = 'https://image.tmdb.org/t/p/w500';
const moviesContainer = document.getElementById("moviesList");
const prevButton = document.getElementById("prevPage");
const nextButton = document.getElementById("nextPage");
const pageNumberDisplay = document.getElementById("pageNumber");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

let currentPage = 1;
let isSearching = false;
let searchQuery = "";

// Fetch Now Playing Movies
function fetchLatestMovies(page = 1) {
    isSearching = false;
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=${page}`;
    fetchMovies(url, page);
}

// Search Movies
function searchMovies(query, page = 1) {
    isSearching = true;
    searchQuery = query;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${query}&page=${page}`;
    fetchMovies(url, page);
}

// Fetch movies from API using XMLHttpRequest
function fetchMovies(url, page) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.results) {
                    displayMovies(response.results);
                    updatePagination(page, response.total_pages);
                } else {
                    moviesContainer.innerHTML = "<p>No movies found.</p>";
                }
            } else {
                console.error("Error fetching movies:", xhr.statusText);
            }
        }
    };

    xhr.send();
}



// Display Movies
function displayMovies(movies) {
    moviesContainer.innerHTML = "";
    if (movies.length === 0) {
        moviesContainer.innerHTML = "<p class='text-center'>No movies found.</p>";
        return;
    }

    movies.forEach(movie => {
        const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

        const movieElement = document.createElement("div");
        movieElement.classList.add("col-md-3", "mb-4");
        movieElement.innerHTML = `
            <div class="movie-card p-3">
                <img src="${movie.poster_path ? imgBaseUrl + movie.poster_path : 'https://via.placeholder.com/200'}" alt="${movie.title}">
                <h5 class="mt-2">
                    <a href="movie-details.html?id=${movie.id}" class="text-dark text-decoration-none">${movie.title}</a>
                </h5>
                <p class="text-muted">${movie.release_date ? movie.release_date.split("-")[0] : "N/A"}</p>
                <p><strong>IMDb Rating:</strong> ⭐ ${rating}/10</p>
            </div>
        `;

        moviesContainer.appendChild(movieElement);
    });
}


// Update Pagination
function updatePagination(page, totalPages) {
    currentPage = page;
    pageNumberDisplay.textContent = `Page ${page} of ${totalPages}`;

    prevButton.disabled = page <= 1;
    nextButton.disabled = page >= totalPages;
}

// Event Listeners for Pagination
prevButton.addEventListener("click", function () {
    if (currentPage > 1) {
        isSearching ? searchMovies(searchQuery, --currentPage) : fetchLatestMovies(--currentPage);
    }
});

nextButton.addEventListener("click", function () {
    isSearching ? searchMovies(searchQuery, ++currentPage) : fetchLatestMovies(++currentPage);
});

// Event Listener for Search
searchButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent form reload

    const query = searchInput.value.trim();
    if (query !== "") {
        searchMovies(query);
    } else {
        fetchLatestMovies();
    }
});


// Initial Load
fetchLatestMovies();
