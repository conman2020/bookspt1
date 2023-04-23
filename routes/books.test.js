process.env.NODE_ENV= "test";
const request = require("supertest");
const app= require('../app')
const db = require("../db");

let testBook = [];

beforeEach(async () => {
    const result = await db.query(`INSERT INTO books (isbn, amazon_url, author, language, pages, publisher, title, year) VALUES ('342', 'wwww.amazon.com', 'bob sagot', 'french', 342, 'jones','Moby Dick',1900) RETURNING amazon_url, isbn, language, pages, title, author, publisher, year `);
    const resultTwo = await db.query(`INSERT INTO books (isbn, amazon_url, author, language, pages, publisher, title, year) VALUES ('3466', 'wwww.amazonfff.com', 'bob sajujgot', 'frencais', 3472, 'jonpes','Moby Dicksssss',1900) RETURNING amazon_url, isbn, language, pages, title, author, publisher, year `);

    // console.log(result);
    testBook.push(result.rows[0]);
    testBook.push(resultTwo.rows[0]);
    // console.log(testBook)
});


afterEach(async () => {
    await db.query(`DELETE FROM books`)
});

afterAll(async () => {
    await db.end();
});

describe("Hope this works", () => {
    test("BLAH", () => {
      expect(1).toBe(1);
    });
  });
  
  describe("GET /books", () => {
    test("Get books", async () => {
      const res = await request(app).get('/books');

      expect(res.statusCode).toBe(200);
      expect(res.body.books[0]).toEqual(testBook[0]);
    });
  });
  
  describe("GET /books/:isbn", () => {
    test("Get specific book", async () => {
      const res = await request(app).get(`/books/${testBook[0].isbn}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ book: testBook[0] });
    });
    test("Get invalid book", async () => {
        const res = await request(app).get(`/books/${testBook[8]}`);
        expect(res.statusCode).toBe(404);

      });
  });


  describe("POST /books", () => {
    test("Post  book", async () => {
      const res = await request(app).post(`/books`).send({isbn: "6",amazon_url:"wwww.fb.com",
      author: "H haw",language: "german",pages: 3633, publisher:"dogs",title: "to fly",year: 1999 });
      expect(res.statusCode).toBe(201);

      expect(res.body).toEqual({  book: {
        isbn: "6",
        amazon_url: "wwww.fb.com",
        author: "H haw",
        language: "german",
        pages: 3633,
        publisher: "dogs",
        title: "to fly",
        year: 1999,
      }, });
    });
  });

  describe("Put /books",() => {
    test("Update a user", async () => {
        const res = await request(app)
        .put(`/books/${testBook[1].isbn}`)
        .send({ isbn: 234, amazon_url: "www.facebook.com", author: "small", language: "shitake", pages: 30, publisher: "joe demaggio", title: "google", year:2000 });
        console.log(res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ book: {
    isbn: 10,
      amazon_url: "www.facebook.com",
      author: "small",
      isbn: "3466",
      language: "shitake",
      pages: 30,
      publisher: "joe demaggio",
      title: "google",
      year: 2000,
        }})
    })
});



describe("Delete /books",() => {
    test("Delete a book", async () => {
        const res = await request(app).delete(`/books/${testBook[1].isbn}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({message: "Book deleted"})
    
    })
})