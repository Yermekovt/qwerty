
const MongoClient = require('mongodb').MongoClient; //for db //npm install mongodb@2.2.32
const url = "mongodb://localhost:27017/accounts"; //for db
const express = require('express'); //install express
const session = require('express-session'); //for login system //npm install express-session
const bodyParser = require('body-parser'); //npm install body-parser
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http); //for chat system

//session for login sysetem
app.use(session({ secret: 'example' }));

//server will retrieve static pages in public folder
app.use(express.static('public'));

//POST method
app.use(bodyParser.urlencoded({
    extended: true
  }))

//for ejs
app.set('view engine', 'ejs');

//connection to db
MongoClient.connect(url, function(err, database) {
    if(!err) {
      db = database
    }
    else { //output this if there is an error related to db
      console.log("some issues with the database");
    }
  });

//films.ejs page where user can search for different films
app.get('/', function(req, res) {

    //if the user isnt logged in -> redirec to 'login' page
    if(!req.session.loggedin){res.redirect('/login');return;}
    
    //store the current user in 'currentuser' var
    var currentUser = req.session.currentUser;

    //this will be used in head.ejs to set the title name
    title = "Film Search"

    //rendering films.ejs and passing 'currentuser' and 'title' 
    res.render('pages/films', {
      nickname: currentUser,
      title: title
    })
})

//index.ejs page; acts as an intro page and retrieves credentials.
app.get('/login', function(req, res) {

    //team var that stores our team members and their role
    var team = [
        {name: 'John', role: 'Web Developer'},
        {name: 'John', role: 'Web Developer'},
        {name: 'John', role: 'Web Developer'},
        {name: 'John', role: 'Web Developer'}
    ]

    //this will be used in team info section
    var tagline = "True Professionals";

    //this will be used in head.ejs to set the title name
    var title = "Main";

    //rendering index.ejs and passing 'team', 'tagline', 'title'
    res.render('pages/index', {
        team: team,
        tagline: tagline,
        title: title
    })
})

//contacts.ejs page; just a typical contacts page
app.get('/contacts', function(req, res) {

    //this will be used in head.ejs to set the title name
    title = "Contacts"

    //rendring contacts.ejs and passing 'title'
    res.render('pages/contacts', {
      title: title
    })

})

//register.ejs page; page that allows people to sign up
app.get('/register', function(req, res) {

  //this will be used in head.ejs to set the title name
  title = "Register"

  //rendring register.ejs and passing 'title'
  res.render('pages/register', {
    title: title
  })
})

//myaccount.ejs page; page that displays details about the current user
app.get('/myaccount', function(req, res) {

  if(!db){ //output this if there is an error related to db
    console.log("some issues with the database");
  }
  

  //if the user is not logged in -> redirect to 'login' page
  if(!req.session.loggedin){res.redirect('/login');return;}
  
  //store currentUser
  var currentUser = req.session.currentUser;
  
  //this will be used in head.ejs to set the title name
  title = "My Account"

  //finding the details of the currentUser in a database
  db.collection('people').findOne({"login.username": currentUser}, function(err, result) {
    if (err) throw err;
   
    //rendring myaccount.ejs and passing 'title' and 'user' var that was retrieved from mongodb
    res.render('pages/myaccount', {
      user: result,
      title: title
    })
  });

});

//logout route; just for loggin out; redirects to '/' route
app.get('/logout', function(req, res) {
  req.session.loggedin = false;
  req.session.destroy();
  res.redirect('/');
});

//chatrooms.ejs; a page where user can choose one of three live chats
app.get('/chatrooms', function(req, res) {

  //this will be used in head.ejs to set the title name
  title = "Chat Rooms"

  //rendring chatroom.ejs and passing 'title'
  res.render('pages/chatrooms', {
    title: title
  })
})

//variable that later will store currentUser and will be used in the chat system to allow other users to see which message came from whom
var currentName;

//generalchat.ejs; chat just for general stuff
app.get('/generalchat', function(req, res) {
  //if the user isn't logged in -> redirect to 'login' page
  if(!req.session.loggedin){res.redirect('/login');return;}

  //get the current user
  currentName = req.session.currentUser;
  
  //this will be used in head.ejs to set the title name
  title = "General chat"

  //rendering generalchat.ejs and passing 'title'
  res.render('pages/generalchat', {
    title: title
  });
})

app.get('/filmchat', function(req, res) {
  if(!req.session.loggedin){res.redirect('/login');return;}

  //get the current user
  currentName = req.session.currentUser;
  
  //this will be used in head.ejs to set the title name
  title = "Film chat"

  //rendering filmchat.ejs and passing 'title'
  res.render('pages/filmchat', {
    title: title
  });
})

app.get('/serieschat', function(req, res) {
  if(!req.session.loggedin){res.redirect('/login');return;}

  //get the current user
  currentName = req.session.currentUser;
  
  //this will be used in head.ejs to set the title name
  title = "Series chat"

  //rendering serieschat.ejs and passing 'title'
  res.render('pages/serieschat', {
    title: title
  });
})

//get credentials from forum and check if they exist in database
app.post('/proceed', function(req, res) {
  
  if(!db){
    //output this if there is an error related to db
    console.log("some issues with the database");
  }

    //getting the nickname and password
    var nickname = req.body.nickname;
    var password = req.body.password;
  
  
    //checking if the entered nickname exists in a database
    db.collection('people').findOne({"login.username":nickname}, function(err, result) {
      if (err) throw err;
  
      //if the nickname doesn't exist in a database -> redirect to 'login' page
      if(!result){res.redirect('/login');return}

      //if the nickname exists -> check if the password is correct
      if(result.login.password == password){
        //session set to true and current user is stored in 'req.session.currentUser' (this will be used a lot)
        req.session.loggedin = true; 
        req.session.currentUser = nickname;
        res.redirect('/') 
      }
      
      //if the password is not correct -> redirect to 'login' page
      else{res.redirect('/login')}
    });
});

//getting the details from a signup form and saving them in a database
app.post('/newaccount', function(req, res) {

  if(!db){ //output this if an error occured related to database
    console.log("some issues with the database");
  }

    //json for new user; 
    var newuserdetails = {
    "gender":req.body.gender,
    "name":{"first":req.body.first,"last":req.body.last},
    "email":req.body.email,
    "login":{"username":req.body.username,"password":req.body.password},
    "dob":req.body.dob,"registered":Date(),
    "nat":req.body.nat}
  
  
    //passing the json into out database and saving it there
    db.collection('people').save(newuserdetails, function(err, result) {
      if (err) throw err;
      //redirecting to 'login'
      res.redirect('/login')
    })
});

  //for chat system
io.on('connection', function(socket) {

    console.log('connected');

    socket.on('disconnect', function () {
      console.log('disconnected');
    })

    //getting message from 'general' chat room; combining it with the current username and emitting it to 'general'
    socket.on('general', function(msg) {
      finalMessage = currentName + ": " + msg;
      io.emit('general', finalMessage);
    })

    //getting message from 'film' chat room; combining it with the current username and emitting it to 'film'
    socket.on('film', function(msg) {
      finalMessage = currentName + ": " + msg;
      io.emit('film', finalMessage);
    })

    //getting message from 'series' chat room; combining it with the current username and emitting it to 'series'
    socket.on('series', function(msg) {
      finalMessage = currentName + ": " + msg;
      io.emit('series', finalMessage);
    })
})

//404
app.use(function (req, res) {
   res.render('pages/404', {
     //page title; this will be inserted in head.ejs
     title: "404"
   })
})

http.listen(8080, function () {
  console.log('listening 8080')
})