import { getByName, getByPopularity, getByRate, getUpcoming, isInFavorites, addToFavorites, removeFromFavorites, getFavoritesIds } from "../services/movies";
import { Movie } from "../models/movies";

function setMovies(): void {
   document.addEventListener('DOMContentLoaded', () => {
      const popular = document.getElementById("popular");
      const upcoming = document.getElementById("upcoming");
      const topRated = document.getElementById("top_rated");
      const btnSubmit = document.getElementById("submit");
      const searchInput = <HTMLInputElement>document.getElementById("search");
      const btnFavorites = document.getElementById("btnFav");
      if (popular) {
         popular.addEventListener("click", () => {
            createMovies(getByPopularity());
         });
      }
      if (upcoming) {
         upcoming.addEventListener("click", () => {
            createMovies(getUpcoming());
         });
      }
      if (topRated) {
         topRated.addEventListener("click", () => {
            createMovies(getByRate());
         });
      }
      if (btnSubmit && searchInput) {
         btnSubmit.addEventListener("click", (event) => {
            event.preventDefault();
            if (searchInput.value.length > 1) {
               createMovies(getByName(searchInput.value));
            }
            searchInput.value = "";
         });
      }
      if (btnFavorites) {
         btnFavorites.addEventListener("click", () => {
            const ids = getFavoritesIds();
            createFavorites(ids);
         });
      }
      createMovies(getByPopularity());
   });
}

function createMovies(method: Promise<Movie[]>): void {
   const container = document.getElementById("film-container");
   if (container) {
      container.innerHTML = "";
      method
         .then(movies => {
            movies.forEach(movie => {
               const divCard = document.createElement("div");
               divCard.className = "col-lg-3 col-md-4 col-12 p-2";
               createMovieCard(divCard, movie);
               container.appendChild(divCard);
            });
         })
         .catch(err => {
            throw err;
         });
   } else {
      alert("No container?");
   }
}

function createMovieCard(container: HTMLElement, movie: Movie): void {
   const divShadow = document.createElement("div");
   divShadow.className = `card-${movie.id} card shadow-sm`;
   const img = document.createElement("img");
   img.src = movie.poster_path ? "https://image.tmdb.org/t/p/w500/" + movie.poster_path : movie.original_title;
   img.alt = movie.original_title;
   const divFavIcon = document.createElement("div");
   if (isInFavorites(movie.id)) {
      divFavIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" stroke="white" fill="#ff000078" width="50" height="50"
                                class="svg-${movie.id} bi bi-heart-fill position-absolute p-2" viewBox="0 -2 18 22">
                                <path fill-rule="evenodd"
                                    d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                            </svg>`
   } else {
      divFavIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" stroke="white" fill="#ff000078" width="50" height="50"
                                class="svg-${movie.id} bi bi-heart-fill position-absolute p-2" viewBox="0 -2 18 22">
                                <path fill-rule="evenodd"
                                    d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" fill-opacity="0" fill-opacity="0"/>
                            </svg>`
   }
   if (divFavIcon.firstChild) {
      divFavIcon.firstChild.addEventListener("click", () => {
         const op = addOrRemoveFavorite(movie.id);
         console.log(changeFavIcon(movie.id, op));
      });
   }
   const divBody = document.createElement("div");
   divBody.className = "card-body";
   const p = document.createElement("p");
   p.className = "card-text truncate";
   p.textContent = movie.overview;
   const div = document.createElement("div");
   div.className = "d-flex justify-content-between align-items-center";
   const small = document.createElement("small");
   small.className = "text-muted";
   small.textContent = movie.release_date;
   div.appendChild(small);
   divBody.appendChild(p);
   divBody.appendChild(div);
   divShadow.appendChild(img);
   divShadow.appendChild(<ChildNode>divFavIcon.firstChild);
   divShadow.appendChild(divBody);
   container.appendChild(divShadow);
}

function createFavorites(movies: string[]): void {
   const container = document.getElementById("favorite-movies");
   if (!container) {
      return;
   }
   container.innerHTML = "";
   movies.forEach(id => {
      const divCard = document.createElement("div");
      divCard.className = "col-12 p-2";
      const divs = document.getElementsByClassName(`card-${id}`);
      divCard.appendChild(divs[0].cloneNode(true));
      container.appendChild(divCard);
   });
}

function addOrRemoveFavorite(id: number): string {
   if (isInFavorites(id)) {
      removeFromFavorites(id);
      return "remove";
   } else {
      addToFavorites(id);
      return "add";
   }
}

function changeFavIcon(id: number, operation: string): boolean {
   //const svg = document.getElementById(id.toString());
   const svg = document.getElementsByClassName("svg-" + id.toString());
   for (let i = 0; i < svg.length; i++) {
      const pathElem = svg.item(i)?.firstElementChild;
      if (!pathElem) {
         return false;
      }
      operation === "add" ? pathElem.removeAttribute("fill-opacity") : pathElem.setAttribute("fill-opacity", "0");
   }
   return true;
}

export { setMovies };