const express = require('express')
const fs = require('fs')
const path = require('path');
const Jimp = require('jimp');

const app = express()

app.use(express.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const port = 3000
const urlpath = __dirname + '/uploads/'

app.get('/', (req, res) => {
    // const { search } = req.body
    let search = ''
    let PATTERN = new RegExp(search);
    try {
        const urlreadfile = urlpath + '/master/'

        if (!fs.existsSync(urlreadfile)) fs.mkdirSync(urlreadfile); // create folrder if not exists

        dataset = []
        fs.readdir(urlreadfile, (err, files) => {
            dataList = files.filter(function (str) { return PATTERN.test(str); });
            for (let i = 0; i < dataList.length; i++) {
                let stats = fs.statSync(urlreadfile + dataList[i]);
                // console.log(stats);
                if (stats.isFile()) { // read files
                    dataset.push({ name: dataList[i], type: 'file', size: stats.size })
                }
                // if (stats.isDirectory()) { // read folder
                //     dataset.push({ name: dataList[i], type: 'folder' })
                // }
            }

            res.render('index', { dataset: dataset })
        })
    } catch (error) {
        console.log(error);
    }
})

app.post('/compress', (req, res) => {
    const { namefile } = req.body

    const urlpathcompress = urlpath + '/thumbnail/'

    if (!fs.existsSync(urlpathcompress)) fs.mkdirSync(urlpathcompress); // create folrder if not exists

    const JPEG = require('jpeg-js')
    Jimp.decoders['image/jpeg'] = (data) => JPEG.decode(data, {
        maxMemoryUsageInMB: 6144,
        maxResolutionInMP: 600
    })

    Jimp.read(urlpath +'master/'+ namefile, (err, lenna) => {
        if (err) throw err;
        lenna
            .resize(200, Jimp.AUTO) // resize
            .quality(60) // set JPEG quality
            .write(urlpathcompress + namefile); // save
    });

    res.send({ status: 'true', message: 'Image Compress' })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})