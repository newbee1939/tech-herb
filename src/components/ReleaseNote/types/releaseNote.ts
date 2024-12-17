type ReleaseNoteItem = {
	title: string,
	link: string,
    description: string,
}

export type ReleaseNote = {
	releaseDate: Date,
    releaseNoteItems: ReleaseNoteItem[],
}
