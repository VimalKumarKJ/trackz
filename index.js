import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Trackz",
    password: "vs2602",
    port: "5432"
  });
  db.connect();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let notes = [
    {id: 1, body: "Today was a good day"},
    {id: 2, body: "It as fucked up I lost my dick"},
    {id: 3, body: "It as fucked up I lost my dick"}
]

app.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM notes ORDER BY id ASC");
        notes = result.rows;
        res.render("Notes.ejs", {notes : notes}); 
    } catch (error) {
        console.log(error);
    }   
});

app.post("/post", async (req, res) => {
    try {
        const input = req.body.newNote;
        // console.log(input);
        await db.query("INSERT INTO notes(body) VALUES($1);", [input]);
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
});

app.post("/edit", async (req, res) => {
    try {
        const action = req.body.action;
        const updatedId = req.body.updatedNoteId;
        const updatedBody = req.body.updatedNote;

        if(action === 'delete') {
            await db.query("DELETE FROM notes WHERE id = $1;", [updatedId]);
        } 
        else if(action === 'update') {
            await db.query("UPDATE notes SET body = $1 WHERE id = $2;", [updatedBody, updatedId]);
        }
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
});

app.get("/Tasks", async (req, res) => {
    res.render("Tasks.ejs");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});