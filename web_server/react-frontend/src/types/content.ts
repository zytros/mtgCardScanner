export interface Dictionary {
    [key: string]: any; // Can be more specific based on expected structure
  }


export interface Content {
    title: string;
    chapters: Array<Dictionary>;
    sections: Array<Dictionary>;
}