export class Note {

    id: number;
    title: string;
    message: string;
    views: number;

    toArray(): Array<any> {
        return [this.title, this.message, this.views];
    }
}