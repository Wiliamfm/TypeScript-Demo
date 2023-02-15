import { baseUrl, apiKey } from "../models/common"
import { Movie } from "../models/movies";

function getByPopularity(page: number): Promise<Movie[]> {
   return fetch(`${baseUrl}/movie/popular?api_key=${apiKey}&page=${page}`)
      .then(response => {
         if (!response.ok) {
            throw new Error(response.statusText);
         }
         return response.json();
      })
      .then(data => {
         return data.results;
      });
}

export { getByPopularity }