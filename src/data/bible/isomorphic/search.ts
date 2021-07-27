import type { VerseEntity } from "../RawTypes";

export default function* search(verses: VerseEntity[],options: {text: string}) {
    for (let verse of verses) {
        if (verse.text.includes(options.text)) {
            yield verse;
        }
    }
}