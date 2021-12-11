const express = require('express'); 
const pool = require('./database'); 
const cors = require('cors');
const { identity } = require('lodash');
const methodOverride = require("method-override");
 
const app = express(); 
 
app.set('view engine', 'ejs'); 
 
app.use(methodOverride('_method'));
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

app.get('/singlepost/:id', async(req, res) => { 
    try { 
        const id = req.params.id; 
        console.log(req.params.id); 
        console.log("get a single post request has arrived"); 
        const posts = await pool.query( 
            "SELECT * FROM posts WHERE id = $1", [id] 
        ); 
        res.render('singlepost', { posts: posts.rows[0]}); 
    } catch (err) { 
        console.error(err.message); 
    } 
});   

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


app.delete('/:id', async(req, res) => {
    try {
        const id = req.params.id; 
    const post = req.body;
    console.log("delete a post request has arrived with id "+id);
    const deletepost = await pool.query(    
    "DELETE FROM posts WHERE id = $1", [id]
    );
    res.redirect('/');
    } catch (err) {
    console.error(err.message);
    }
   });
   
app.post('/addnewpost', async(req, res) => { 
    try { 
        const post = req.body; 
        console.log(post); 
        console.log("add new post request has arrived");
        let currentdate = new Date(); 
        let datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
        console.log(datetime);
        const newpost = await pool.query( 
            "INSERT INTO posts(comment, time) values ($1, $2) RETURNING*", [post.comment, datetime] 
        ); 
        res.redirect('/'); 
    } catch (err) { 
        console.error(err.message) 
    } 
});

app.post('/', async(req, res) => { 
    try { 
        console.log(req.body); 
        const post = req.body; 
        console.log("add a like request")
        let likes = parseInt(post.likes) + 1;
        const addlike = await pool.query( 
            "UPDATE posts SET likes = $1 WHERE id = $2", [likes, post.id] 
        );
        res.redirect('/');  
    } catch (err) { 
        console.error(err.message) 
    } 
}); 
app.get('*', function(req, res){
    res.send('Webpage does not exist!', 404);
});
