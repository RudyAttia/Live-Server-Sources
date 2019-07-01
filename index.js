#!/usr/bin/env node
const url = require('url');
const express = require("express")
const app = express()
const path = require("path")
const fs = require("fs")
const mime = require('./modules/mime')
const users = require('./modules/users')

app.use(express.json())

app.use(express.static(path.join(__dirname, 'public')))

app.use(function (req, res, next) {
    if (req.url === '/api/users') { next() }
    else {
        let searchuser = users.find(user => user.id === req.connection.remoteAddress)
        let nameuser = searchuser ? searchuser.name : "Anonymous";
        console.log(req.connection.remoteAddress + " : " + "\x1b[36m" + nameuser + "\x1b[0m" + " -> " + req.url);
        next();
    }
})

app.post('/api/users', (req, res) => {
    ipadress = req.connection.remoteAddress;
    console.log(req.connection.remoteAddress + " : " + "\x1b[35m" + "Username : " + req.body.name + "\x1b[0m")
    const newUser = {
        id: ipadress,
        name: req.body.name
    }
    if (!newUser.name || newUser.name === "") {
        res.status(400).json({ Error: 'Please include name ...' });
    }
    else {
        const user = users.find(user => user.id === newUser.id)
        if (user) {
            user.name = newUser.name
        }
        else {
            users.push(newUser);
        }
    }
    res.end()
})

app.get('/api/users', (req, res) => {
    res.status(200).json(users);
})

app.get('/api/dirname', (req, res) => {
    res.status(200).write(process.cwd());
    res.end();
})

app.get('/api/folders', (req, res) => {
    let query = url.parse(req.url, true).query
    let pathi = query.pathi || './';
    fs.readdir(pathi, { withFileTypes: true }, (err, entries) => {
        if (!err) {
            let folders = ""
            let files = ""
            entries.forEach(entry => {
                if (entry.isDirectory()) {
                    if (folders !== "") { folders += "," }
                    folders += `{"${entry.name}":"${pathi + entry.name}/"}`
                }
                else if (entry.isFile()) {
                    if (files !== "") { files += "," }
                    let filesize;
                    try { filesize = fs.statSync(pathi + entry.name).size }
                    catch (err) { filesize = 0; }
                    files += `{"${entry.name}":"${pathi + entry.name}","size":${filesize}}`
                }
            })
            let buffer = `{"folders":[${folders}],"files":[${files}]}`
            res.status(200).json(JSON.parse(buffer))
        }
        else {
            res.status(200).json({ error: "error!" })
        }
    })
})

app.get('/api/files', (req, res) => {
    let query = url.parse(req.url, true).query;
    let pathi = query.pathi
    let patharray = pathi.split('/');
    let filepa = (patharray[patharray.length - 1]).split('.');
    let ext = filepa[filepa.length - 1].toLowerCase();

    fs.readFile(pathi.replace(/%p%s/g, "\'"), (err, data) => {
        if (!err) {
            if (mime(ext).split('/')[0] === "application") {
                res.setHeader('Content-disposition', 'attachment; filename=' + patharray[patharray.length - 1]);
            }
            res.setHeader('Content-Type', mime(ext))
            res.status(200).write(data);
            res.end();
        }
        else {
            res.setHeader('Content-Type', 'text/plain')
            res.status(404).write("Error 404 not found");
            res.end();
        }
    })
})

app.listen(4040, () => {
    console.log('---------------------------------')
    console.log('\x1b[33m%s\x1b[0m', 'Live Server Sources starting and running on port 4040')
    let ips = require('./modules/adresses').ips
    console.log("Available on:")
    for(i=0;i<ips.length;i++){
        console.log("\x1b[32m%s\x1b[0m", "  " + ips[i])
    }
    console.log('---------------------------------')
})