export interface MediaInterface {
    kind: "image" | "video",
    url: string
}

export interface EntryInterface {
    title: string, score: number, link: string, author: string, awards: number, comments: number,
    spoiler: boolean, archived: boolean, crosspostable: boolean, pinned: boolean, locked: boolean,
    created_utc: number, id: string,

    flair: string,
    nsfw: boolean,
    text: string,
    media: Array<MediaInterface>
}