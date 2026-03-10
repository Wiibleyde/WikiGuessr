export interface WikiSection {
    title: string;
    content: string;
}

export interface WikiPage {
    title: string;
    url: string;
    images: string[];
    sections: WikiSection[];
}

export interface RandomPageResponse {
    query: {
        random: { id: number; ns: number; title: string }[];
    };
}

export interface ImageInfo {
    url: string;
}

export interface ImagePage {
    imageinfo?: ImageInfo[];
}

export interface PageData {
    extract?: string;
    fullurl?: string;
    images?: { title: string }[];
}

export interface ArticleApiResponse {
    query?: {
        pages: Record<string, PageData>;
    };
}

export interface ImageApiResponse {
    query?: {
        pages: Record<string, ImagePage>;
    };
}
