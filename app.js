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

/*app.get('/:id', async(req, res) => {
    try {
    console.log("get a post request has arrived");
    const posts = await pool.query(
    "SELECT * FROM posts WHERE id = $1", [id]
    );
    res.render('posts', { posts: posts.rows });
    res.json(posts.rows);
    } catch (err) {
    onsole.error(err.message);
    }
   });*/

app.delete('/posts/:id', async(req, res) => {
    try {
    const { id } = req.params;
    const post = req.body;
    console.log("delete a post request has arrived");
    const deletepost = await pool.query(    
    "DELETE FROM posts WHERE id = $1", [id]
    );
    res.json(post);
    } catch (err) {
    console.error(err.message);
    }
   });
   