const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const vader = require('vader-sentiment');

static_path = path.join(__dirname + '../public')

app.use(express.static(static_path))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.set("view engine", "hbs")


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening to the port ${port}`);
})

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/sent', (req, res) => {
    res.render('sent_output')
})

app.post('/sent', (req, res) => {
    console.log(req.body.sentence);
    const input = req.body.sentence;
    const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(input);
    console.log(intensity);
    const pos = intensity.pos;
    const neg = intensity.neg;
    const neu = intensity.neu;
    var output;
    if (pos > neg && pos > neu) {
        output = 'Positive';
    }
    else if (neg > neu) {
        output = 'Negative';
    }
    else {
        output = 'Neutral';
    }

    res.status(201).render('sent_output', {
        intensity,
        sentence: req.body.sentence,
        output
    })
})

app.get('*', (req, res) => {
    res.render('404');
})
