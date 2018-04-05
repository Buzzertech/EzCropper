const express = require('express');
var cors = require('cors')

const app = new express();

app.use(cors());
let bodyparser = require('body-parser');
app.use(bodyparser.json({
    limit: '50mb'
}));
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + '/'));

app.post('/', (req, res) => {
    if (req.body.data.length) {

        var fs = require("fs");
        var links = [];
        req.body.data.forEach(base => {
            var image = base.uri.replace(/^data:image\/\w+;base64,/, '');
            var ext = base.uri.substring("data:image/".length, base.uri.indexOf(";base64"));
            var rand = Math.random().toString(36).substring(7);
            var buffer = Buffer.from(image, 'base64');
            fs.writeFileSync(`images/${base.type}_${rand}.${ext}`, buffer);
            links.push({"url":'http://' + req.headers.host + '/images/' + base.type + '_' + rand + '.' + ext, 'type':base.type});
        });

        res.send({
            'Status': 'Saved in directory',
            'link': links,
        });

    } else {
        res.send({
            'Status': 'No valid file was attached!'
        });
    }
});

app.listen(8000, function () {
    console.log("fired");
});