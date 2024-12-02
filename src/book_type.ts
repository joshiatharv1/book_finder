export type BookResult = {
  docs: Book_type[];
};

export type Book_type = {
  title: string;
  author_name: string[];
  first_publish_year?: number;
  isbn?: string[];
  number_of_pages_median?: number;
};
