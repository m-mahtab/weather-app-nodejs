const http = require('http');
const fs = require('fs');
var requests = require('requests');

const replaceVal = (tempVal, orgVal) => {
    let dataVal = tempVal.replace("{%tempval%}", (orgVal.main.temp - 273.15).toFixed(2));
    dataVal = dataVal.replace("{%tempmin%}", (orgVal.main.temp_min - 273.15).toFixed(2));
    dataVal = dataVal.replace("{%tempmax%}", (orgVal.main.temp_max - 273.15).toFixed(2));
    dataVal = dataVal.replace("{%location%}", orgVal.name);
    dataVal = dataVal.replace("{%country%}", orgVal.sys.country);

    return dataVal;
}
const homeFile = fs.readFileSync("home.html", "utf-8");
const cssContent = fs.readFileSync("index.css", "utf-8");

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Sargodha&appid=38b3d02c9eee775d927442aea27b2e6a")
            .on('data', (chunk) => {
                const objData = JSON.parse(chunk);
                const arrData = [objData];

                const realData = arrData.map((val) => replaceVal(homeFile, val))
                    .join("")

                const styledHTML = `<style>${cssContent}</style>${realData}`;
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(styledHTML);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);

                res.end();
            });
    }
    else {
        res.end();
    }
})

server.listen(8000, '127.0.0.1', () => {
    console.log('Server is running at http://127.0.0.1:8000/');
});


