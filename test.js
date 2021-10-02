
const JPEG = require('jpeg-js')
const fs = require('fs')
const Jimp = require('jimp');

const urlpath = __dirname + '/uploads/'
const urlreadfile = urlpath + '/master/'
const urlpathcompress = urlpath + '/thumbnail/'

function run() {
    let search = ''
    let PATTERN = new RegExp(search);
    try {

        let dataset = []
        fs.readdir(urlreadfile, (err, files) => {
            dataList = files.filter(function (str) { return PATTERN.test(str); });
            for (let i = 0; i < dataList.length; i++) {
                let stats = fs.statSync(urlreadfile + dataList[i]);
                // console.log(stats);
                if (stats.isFile()) { // read files
                    dataset.push({ name: dataList[i], type: 'file', size: stats.size })
                }
            }
            console.log('files ---> ' + dataset.length);

            Jimp.decoders['image/jpeg'] = (data) => JPEG.decode(data, {
                maxMemoryUsageInMB: 6144,
                maxResolutionInMP: 600
            })

            let ct = 0
            for (let i = 0; i < dataset.length; i++) {
                Jimp.read(urlpath + 'master/' + dataset[i].name, (err, lenna) => {
                    if (err) throw err;
                    lenna
                        .resize(200, Jimp.AUTO) // resize
                        .quality(60) // set JPEG quality
                        .write(urlpathcompress + dataset[i].name); // save

                    ct = ct + 1
                    console.log(ct, ' --> ' + dataset[i].name);
                });
            }

        })
    } catch (error) {
        console.log(error);
    }
}

console.log('start');
run()
