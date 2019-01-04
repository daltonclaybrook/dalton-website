import IBook from '../models/IBook';

const Book = (book: IBook) => (
    <div className="book">
        <h3>{book.title}</h3>
        <h4>{book.authors.join(', ')}</h4>
    </div>
);

export default Book;
