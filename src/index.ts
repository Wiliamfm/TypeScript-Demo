import { createMovies } from "./views/movies";

export async function render(): Promise<void> {
    createMovies();
}
