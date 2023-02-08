const fs = require('fs');
const express = require('express');
const app = express();
app.use(express.json());

let db = JSON.parse(fs.readFileSync("db.json",'utf-8'))
//console.log(db["genres"]);

// get all data
app.get("/",(req, res)=>{
    res.send(JSON.stringify(db,null,4))
});

// get all genres
app.get("/genres",(req, res)=>{
    res.send(JSON.stringify(db["genres"], null, 4))
})
// get genres name from id
app.get("/genres/:id",(req,res)=>{
    const gid = req.params.id;
    const result = db["genres"].filter(genre=>genre.id==gid);
    if(result.length < 1) {
        return res.status(400).send({
            message: 'This id does not exit!'
        });
    }
    res.send(result[0]);
})

// get all movies data
app.get("/movies",(req, res)=>{
    res.send(db["movies"])
})

// get movie info from movie id
app.get("/movies/id/:id",(req,res)=>{
    const mid = req.params.id;
    const result = db["movies"].filter(movie=>movie.id==mid);
    if (result.length < 1) {
        return res.status(400).send({
            message: 'movie id does not exit!'
        });
    }
    res.send(result);
})

// get movie info from title
app.get("/movies/title/:title", (req, res)=>{
    const title = req.params.title;
    const result = db["movies"].filter(movie=>movie.title.toLowerCase()==title.toLowerCase());
    if (result.length < 1) {
        return res.status(400).send({
            message: 'Movie title does not exit!'
        });
    }
    res.send(result);
})

// get movies from genres
app.get("/movies/genre/:gid", (req, res)=>{
    const gid = parseInt(req.params.gid);
    const result = db["movies"].filter(movie=>movie.genre_ids.includes(gid));

    if (result.length < 1) {
        return res.status(400).send({
            message: 'This type of movie does not exit!'
        });
    }
    res.send(result);
})

// get movies info from my_list
app.get("/mylist",(req,res)=>{
    const result = db["movies"].filter(movie=>movie.my_list);
    if (result.length < 1) {
        return res.status(400).send({
            message: 'My list is empty!'
        });
    }
    res.send(result);
})

// add movie to my_list through title
app.put("/addlist",(req, res)=>{
    const title = req.query.title;
    const result = db["movies"].filter(movie=>movie.title.toLowerCase()==title.toLowerCase());
    if (result.length < 1) {
        return res.status(400).send({
            message: 'This movie does not exit!'
        });
    }
    if (result[0].my_list) {
        return res.send("This movie has already in my list!")
    }
    result[0].my_list=true;
    res.send("Movie " + title + " is added to my list!")
    
})

// remove movie from my_list through title
app.put("/rmlist",(req,res)=>{
    const title = req.query.title;
    const result = db["movies"].filter(movie=>movie.title.toLowerCase()==title.toLowerCase());
    if (result.length < 1) {
        return res.status(400).send({
            message: 'This movie does not exit!'
        });
    }
    if (!result[0].my_list) {
        return res.send("This movie is not in my list!")
    }
    result[0].my_list=false;
    res.send("Movie " + title + " is removed from my ist!")
})





const PORT =5000;
app.listen(PORT,()=>console.log("Server is running"));