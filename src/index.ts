import { setMovies } from "./views/movies";

export async function render(): Promise<void> {
    setMovies();
}
