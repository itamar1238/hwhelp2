import Server from 'bare-server-node';
import http from 'http';
import nodeStatic from 'node-static';
import fs from 'fs';
import pug from "pug";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

var games = [{name: '1v1.lol', img: 'https://www.giantbomb.com/a/uploads/scale_small/45/454004/3160840-1v1.lol%20official%20logo.jpg', description: '1v1.lol is a fast paced web based FPS game.', l: '1v1.lol'},{name: 'JustFall.lol', img: 'https://th.bing.com/th/id/OIP.gBUw3nDEDdBvcnJbypR3nwHaHa?pid=ImgDet&rs=1', description: 'A fallguys clone made on the web!', l: 'justfall.lol'}, {name: 'Paper.io', img: 'https://is2-ssl.mzstatic.com/image/thumb/Purple128/v4/76/23/b6/7623b619-0abc-d87e-0b5d-84af189ca809/source/1280x1280bb.jpg', description: 'A territorial game where you need to cellect the most paper!', l: 'paper.io'}, {name: 'Shell Shockers', img: 'https://opimg.s3.amazonaws.com/2f9f3d3a1a.jpg', description: 'A fast paced FPS web-based game... but youre and egg!', l: 'shellshock.io'},{name: 'Cookie Clicker', img: 'https://th.bing.com/th/id/R.bea6a7f093ac47758ac709dfebcdb766?rik=z5%2bKs8BJuJUUXA&riu=http%3a%2f%2fmaxlevel.org%2fwp-content%2fuploads%2f2013%2f09%2fcookie9.png&ehk=eYuuHq%2bcU5SXegy1LFa5AtpcIonfvLIQAnIVUC%2f7RS8%3d&risl=&pid=ImgRaw&r=0', description: 'An idle style game where you need to bake the most cookies!', l: 'orteil.dashnet.org'}, {name: 'GeForce Now', img: 'https://th.bing.com/th/id/OIP.ePDzkGoSxKkGLJ0sjd7aJgHaE7?pid=ImgDet&rs=1', description: 'GeForce Now is a cloud based gaming website! You can play all your favorite games from Fortnite  to Brawlhalla!', l: 'play.geforcenow.com'}]

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var directorypath = path.join(__dirname, 'static')

const bare =  new Server('/bare/', '');
const serve = new nodeStatic.Server('static/');

const server = http.createServer();

server.on('request', (request, response) => {
    if (bare.route_request(request, response)) return true;
    serve.serve(request, response, () => {
        if(request.method == 'GET') {
            if (request.url === "/") {
                var readableData = pug.renderFile('./static/index.pug');
                response.write(readableData)
                response.end();
                return
            } else if (request.url === "/hi") {
                var readableData = pug.renderFile('./static/hi.pug', {hi: 'Yo'});
                response.write(readableData)
                response.end();
                return
            } else if (request.url === "/games") {
                var readableData = pug.renderFile('./static/games.pug', {games: games});
                response.write(readableData)
                response.end();
                return
            } else if (request.url === "/disclaimer") {
                var readableData = pug.renderFile('./static/disclaimer.pug');
                response.write(readableData)
                response.end();
                return
            } else {
                games.forEach((game) => {
                    if (request.url === `/${game.l}`) {
                        var readableData = pug.renderFile('./static/load.pug', {game: game});
                        response.write(readableData)
                        response.end();
                        return
                    }
                })
            }
            // } else {
            //     // fs.readdir(directorypath, function (err, files) {
            //     //     if (err) {
            //     //         return console.log(err)
            //     //     }
            //     //     files.forEach(function (file) {
            //     //         console.log(request.url)
            //     //         if (request.url.startsWith('/' + file)) {
            //     //             return
            //     //         }
            //     //     })
            //     // })
            //     // response.write('<h1>404</h1>')
            //     // response.end();
            //     // console.log('404 ended!')
            //     // return
            // }
            
        }
    });
});

server.on('upgrade', (req, socket, head) => {
	if(bare.route_upgrade(req, socket, head))return;
	socket.end();
});

server.listen(process.env.PORT || 8080, '0.0.0.0');