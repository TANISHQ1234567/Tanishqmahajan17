if(process.env.NODE_ENV != 'production') { 
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const Localstrategy = require('passport-local');
const path = require('path');
const ExpressError = require('./utils/ExpressError.js');
const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');
const User = require('./models/user.js');
const port = 8080;

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true})); 
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));

const URL = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl: URL,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,
});

store.on('error', () => {
    console.log('error in mongo session store', err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req, res) => {
    res.redirect('/listings');
});

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
});

main()
.then(() => {
    console.log('Connected successfully!');
})
.catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect(URL);
}

app.use('/listings/:id/reviews', reviewRouter);
app.use('/listings', listingRouter);
app.use('/', userRouter);

// app.get('/demouser', async (req, res) => {
//     let fakeUser = new User({
//         email: 'student@gmail.com',
//         username: 'new-student',
//     });

//     const newUser = await User.register(fakeUser, 'helloworld');
//     res.send(newUser);
// })

app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page Not Found!'));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message ='Something went wrong!' } = err;
    res.status(statusCode).render('error.ejs', { err })
});

app.listen(port, () => {
    console.log(`App is listening on http://localhost:${port}/listings`);
});