const express = require('express');
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs')

/*app.get('/', (req, res) => {
    //console.log('Hi!');
    //res.json({message: 'Whoops!'});
    res.render('index', {not_text: "World"});
})*/



const userRouter = require('./routes/users')

app.use('/users', userRouter);

app.listen(3000)