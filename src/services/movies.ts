import { baseUrl, apiKey } from "../models/common"
import { Movie, MovieDetail } from "../models/movies";

type QueryParams = {
   param: string,
   value: string | number
}

const baseQueries: QueryParams[] = [
   { param: "api_key", value: apiKey },

]

function getByPopularity(page?: number): Promise<Movie[]> {
   const queryParams = baseQueries;
   if (page) {
      queryParams.push({ param: "page", value: page });
   }
   return api<Movie[]>("popular", queryParams)
      .then(data => {
         return data;
      })
      .catch(err => {
         throw err;
      });
}

function getByRate(page?: number): Promise<Movie[]> {
   const queryParams = baseQueries;
   if (page) {
      queryParams.push({ param: "page", value: page });
   }
   return api<Movie[]>("top_rated", queryParams)
      .then(data => {
         return data;
      })
      .catch(err => {
         throw err;
      });
}

function getUpcoming(page?: number): Promise<Movie[]> {
   const queryParams = baseQueries;
   if (page) {
      queryParams.push({ param: "page", value: page });
   }
   return api<Movie[]>("upcoming", queryParams)
      .then(data => {
         return data;
      })
      .catch(err => {
         throw err;
      });
}

function getByName(name: string, page?: number): Promise<Movie[]> {
   const queryParams = baseQueries;
   queryParams.push({ param: "query", value: name });
   if (page) {
      queryParams.push({ param: "page", value: page });
   }
   return api<Movie[]>("", queryParams, `${baseUrl}/search/movie?`)
      .then(data => {
         return data;
      })
      .catch(err => {
         throw err;
      });
}

async function api<T>(endpoint: string, queryParams: QueryParams[], completeUrl?: string): Promise<T> {
   let url = `${baseUrl}/movie/${endpoint}?`; //api_key=${apiKey}&page=${page}`;
   if (completeUrl) {
      url = completeUrl;
   }
   queryParams.forEach(q => {
      url = url.concat(`${q.param}=${q.value}&`)
   });
   const response = await fetch(url);
   if (!response.ok) {
      throw new Error(response.statusText);
   }
   const data = await response.json();
   if (data.results) {
      return <T>data.results;
   }
   return <T>data;
}

function getFavoritesIds(): string[] {
   const favs = localStorage.getItem("favorites");
   if (!favs) {
      localStorage.setItem("favorites", "");
      return [];
   }
   return favs.split(";");
}

function addToFavorites(id: number): void {
   if (isInFavorites(id)) {
      return;
   }
   const favorites = getFavoritesIds();
   favorites.push(id.toString());
   localStorage.setItem("favorites", favorites.join(";"));
}

function removeFromFavorites(id: number): void {
   if (!isInFavorites(id)) {
      return;
   }
   const favorites = getFavoritesIds();
   favorites.splice(favorites.indexOf(id.toString()), 1);
   localStorage.setItem("favorites", favorites.join(";"));
}

function isInFavorites(id: number): boolean {
   const favorites = localStorage.getItem("favorites");
   if (!favorites) {
      return false;
   }
   const ids = favorites.split(";");
   const index = ids.indexOf(id.toString());
   if (index == -1) {
      return false;
   }
   return true;
}

function getById(id: number): Promise<MovieDetail> {
   const queryParams = baseQueries;
   return api<MovieDetail>("", queryParams, `${baseUrl}/movie/${id}?`)
      .then(data => {
         return data;
      })
      .catch(err => {
         throw err;
      });
}

function getBannerMovie(movies: Movie[]): Promise<MovieDetail> {
   /*
   dont work with favorites ids?
   const favsIds = getFavoritesIds();
   if (favsIds.length > 0) {
      const randomIndex = Math.floor(Math.random() * favsIds.length);
      return getById(randomIndex)
         .then(movie => {
            return movie;
         }).catch(err => {
            throw err;
         });
   }
   */
   return getById(Math.floor(Math.random() * movies.length))
      .then(movie => {
         return movie;
      }).catch(err => {
         throw err;
      });
}

export { getByPopularity, getByRate, getUpcoming, getByName, addToFavorites, removeFromFavorites, isInFavorites, getFavoritesIds, getBannerMovie }