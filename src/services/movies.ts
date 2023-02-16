import { baseUrl, apiKey } from "../models/common"
import { Movie } from "../models/movies";

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
   return api("popular", queryParams)
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
   return api("top_rated", queryParams)
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
   return api("upcoming", queryParams)
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
   return api("", queryParams, `${baseUrl}/search/movie?`)
      .then(data => {
         return data;
      })
      .catch(err => {
         throw err;
      });
}

async function api(endpoint: string, queryParams: QueryParams[], completeUrl?: string): Promise<Movie[]> {
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
   return data.results;
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

export { getByPopularity, getByRate, getUpcoming, getByName, addToFavorites, removeFromFavorites, isInFavorites, getFavoritesIds }