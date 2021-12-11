const express = require('express'); 
const pool = require('./database'); 
const cors = require('cors');
 
const app = express(); 
 
app.set('view engine', 'ejs'); 
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); 
app.use(express.static('Public'));

/*  1.4?
    app.get('*', function(req, res){
    res.send('what???', 404);
  });*/
 
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
        res.render('singlepost', { posts: posts.rows[0] }); 
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
    const { id } = req.params;
    const post = req.body;
    console.log("delete a post request has arrived");
    const deletepost = await pool.query(    
    "DELETE FROM posts WHERE id = $1", [id]
    );
    res.redirect('posts');
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
app.get('*', function(req, res){
    res.send('Webpage does not exist!', 404);
});
