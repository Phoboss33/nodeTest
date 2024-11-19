const express = require('express');
const router = express.Router();

router.use(logger)

router.get('/', (req, res) => {
    res.send("User List")
})

router.get('/new', (req, res) => {
    res.render("users/new", {firstName: "Test"});
})

router.post('/', (req, res) => {
    console.log(req.body.firstName)
    res.send("hi")
})

router.route("/:userId")
    .get((req, res) => {
        console.log(req.user)
        res.send(`Get User With ID ${req.params.userId}`)
    })
    .put((req, res) => {
        res.send(`Update User With ID ${req.params.userId}`)
    })
    .delete((req, res) => {
        res.send(`Delete User With ID ${req.params.userId}`)
    })

const users = [{name: "John"}, {name: "Doe"}];

router.param('userId', (req,res, next, id)=>{
    req.user = users[id];
    next()
})

function logger(req, res, next) {
    console.log(req.originalUrl);
    next()
}

module.exports = router;