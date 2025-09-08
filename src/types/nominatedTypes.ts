export interface FilmItem {
    _id: string;
    title: string;
    description: string;
    image: string;
    type: "short_film" | "documentary" | string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    __v: number;
}

export interface GetAllNominationResponse {
    items: FilmItem[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}
