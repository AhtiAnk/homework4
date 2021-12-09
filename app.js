const express = require('express'); 
const pool = require('./database'); 
const cors = require('cors');
 
const app = express(); 
 
app.set('view engine', 'ejs'); 
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); 
app.use(express.static('Public'));
 
app.listen(3000, () => { 
    console.log("Server is listening to port 3000") 
});

app.get('/addnewpost', (req, res) => {
        res.render('addnewpost'); 
    })

app.get('/', async(req, res) => { 
    try { 
        console.log("get posts request has arrived"); 
        const posts = await pool.query( 
            "SELECT * FROM posts" 
        ); 
        res.render('posts', { posts: posts.rows });
    } catch (err) { 
        console.error(err.message); 
    } 
});

app.post('/', async(req, res) => { 
    try { 
        const post = req.body; 
        console.log(post); 
        console.log("add new post request has arrived");
        const newpost = await pool.query( 
            "INSERT INTO posts(comment, time) values ($1, $2) RETURNING*", [post.comment, post.time] 
        ); 
        res.redirect('/'); 
    } catch (err) { 
        console.error(err.message) 
    } 
}); 