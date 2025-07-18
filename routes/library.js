const express = require("express")

const app = express()

let Book = require("../models/book")

app.get('/', async(req, res)=> {
  try{
    const books = await Book.find()
    res.render("library", {
                title: books,
                books: books
            })
  } catch(err){
    console.log("Error in books", err)
  }      
})

app.route('/add')
  .get((req, res) => {
    res.render("add_book", {
      genres: [
        "adventure", "science fiction", "tragedy",
        "romance", "horror", "comedy"
      ]
    });
  })
  .post((req, res) => {
    const { title, author, pages, genres, rating } = req.body;

    const book = new Book({
      title,
      author,
      pages,
      genres,
      rating
    });

    book.save((err) => {
      if (err) {
        console.error("Error saving book:", err);
        return res.status(500).send("Failed to save book.");
      }
      res.redirect("/");
    });
  });


app.get('/details', async(req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).send("Missing book ID in query.");
    }

    try {
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).send("Book not found.");
        }

        res.render("book", { book });
    } catch (err) {
        console.error("Error fetching book:", err);
        res.status(500).send("Internal server error.");
    }
});


//Edit books
app.route('/edit')
  .get(async (req, res) => {
    try {
      const book = await Book.findById(req.query.id); // or req.params.id if using /edit/:id
      res.render("editBook", {
        book,
        genres: [
          "adventure", "science fiction", "tragedy",
          "romance", "horror", "comedy"
        ]
      });
    } catch (err) {
      console.error("Error fetching book:", err);
      res.status(500).send("Error fetching book");
    }
  })
  .post(async (req, res) => {
    try {
      const { title, author, pages, genres, rating } = req.body;

      await Book.updateOne(
        { _id: req.query.id }, // Use req.query.id (if your form sends ?id=...)
        {
          title,
          author,
          pages,
          genres: genres.split(',').map(g => g.trim()),
          rating
        }
      );

      res.redirect("/books");
    } catch (err) {
      console.error("Error updating book:", err);
      res.status(500).send("Error updating book");
    }
  });

module.exports = app;
