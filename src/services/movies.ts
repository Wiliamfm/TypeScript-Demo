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

function getByRate(page: number): Promise<Movie[]> {
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

function getUpcoming(page: number): Promise<Movie[]> {
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

async function api(endpoint: string, queryParams: QueryParams[]): Promise<Movie[]> {
   let url = `${baseUrl}/movie/${endpoint}?`; //api_key=${apiKey}&page=${page}`;
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

export { getByPopularity, getByRate, getUpcoming }