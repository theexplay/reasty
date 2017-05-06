var fs = require('fs-extra');
var path = require('path');

module.exports = class Reasty {

    constructor(components) {
        this._components = components;
        this.CONFIG_FILE_NAME = '.reastyrc';
    }

    create() {
        this._components.forEach(item => {
            let basePath = './';
            let splitted = item.split('/');
            let [path, comp] =  [[...splitted.slice(0, splitted.length - 1)].join('/'), splitted[splitted.length - 1]];

            console.log(basePath+path)


            fs.pathExists(path, (err, exists) => {

                if (err) {
                    throw new Error();
                }

                if (exists) {
                    console.log('Error! Directory already exists!');
                    return;
                }
            })

            fs.ensureDirSync(basePath+path)

        })
    }
}

