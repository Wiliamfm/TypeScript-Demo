import { getByName, getByPopularity, getByRate, getUpcoming } from "../services/movies";
import { Movie } from "../models/movies";

function setMovies(): void {
   document.addEventListener('DOMContentLoaded', () => {
      const popular = document.getElementById("popular");
      const upcoming = document.getElementById("upcoming");
      const topRated = document.getElementById("top_rated");
      const btnSubmit = document.getElementById("submit");
      const searchInput = <HTMLInputElement>document.getElementById("search");
      if (popular) {
         popular.addEventListener("click", () => {
            createMovies(getByPopularity());
            //getByPopularity();
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
            //event.preventDefault();
            if (searchInput.value.length > 1) {
               createMovies(getByName(searchInput.value));
            }
            searchInput.value = "";
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
               const divShadow = document.createElement("div");
               divShadow.className = "card shadow-sm";
               const img = document.createElement("img");
               img.src = movie.poster_path ? "https://image.tmdb.org/t/p/w500/" + movie.poster_path : movie.original_title;
               img.alt = movie.original_title;
               const svg = document.createElement("svg");
               svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
               svg.setAttribute("stroke", "red");
               svg.setAttribute("fill", "#ff000078");
               svg.setAttribute("width", "50");
               svg.setAttribute("height", "50");
               svg.className = "bi bi-heart-fill position-absolute p-2";
               svg.setAttribute("viewBox", "0 -2 18 22");
               const pathElem = document.createElement("path");
               pathElem.setAttribute("fill-rule", "evenodd");
               pathElem.setAttribute("d", "M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z");
               svg.appendChild(pathElem);
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
               divShadow.appendChild(svg);
               divShadow.appendChild(divBody);
               divCard.appendChild(divShadow);
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

export { setMovies };