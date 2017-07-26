const fs = require('fs-extra');
const path = require('path');

/**
 * Reasty.
 * @constructor
 */
module.exports = class Reasty {

    constructor(components) {
        this.config_file_name = '.reastyrc';
        this.config = null;
        this.components = components;
    }

    create() {
        this._getConfigFile();
        this.components.forEach(component => {
            const basePath = !!this.config ? `./${this.config.basedir}/` : './';
            const splitted = component.split(/\\|\//).filter(i => i.length > 0);
            const [absolutePath, componentName] = [splitted.join('/'), splitted.pop()];
            const endPath = path.normalize(basePath + absolutePath);

            fs.pathExists(endPath).then(exists => {
                if (!exists) {
                    fs.ensureDirSync(endPath);
                    this._writeFilesList(componentName, this.config.files, endPath);
                } else {
                    console.error('Directory already exists! Process stopped, to prevent overriding.')
                }
            }).catch(err => {
                throw new Error(err);
            })
        })
    }

    /**
     * Create files
     *
     */
    _writeFilesList(componentName, files, endPath) {
        for (const key in files) {
            if (!files.hasOwnProperty(key)) {
                continue;
            }

            const file = files[key];
            const filename = file.filename === '{{NAME}}' ? componentName : file.filename;
            let content = !!file.content.length ?
                this._replaceVars(file.content, {
                    'NAME': componentName,
                    'NEWLINE': this.config.newline,
                    'INDENT': this.config.indent
                }) : null;

            if (file.styleImport) {
                let styleImport = [];
                if (!Array.isArray(file.styleImport)) {
                    styleImport = [file.styleImport]
                } else {
                    styleImport = [...file.styleImport]
                }

                styleImport.forEach(i => {
                    content = `@import '${files[i].filename}.${files[i].extension}'${this.config.newline + content}`;
                })
            }
            const newFile = path.normalize(`${endPath}/${filename}.${file.extension}`);
            fs.outputFileSync(newFile, content, this.config.file_write_options);
            console.info(`Created ${newFile}.`);
        }
    }

    /**
     * Get file with options
     *
     * @returns {undefined|Boolean}
     */
    _getConfigFile() {
        try {
            this.config = fs.readJsonSync(this.config_file_name);
        } catch (err) {
            console.error('.reastyrc doesn\'t exist or Json is invalid');
            return false;
        }
    }

    /**
     * Replace template vars
     *
     * @param {String} template - string to replace
     * @param {Object} values - object of values
     * @returns {String}
     */
    _replaceVars(template, values) {
        let varname,
            search;
        for (varname in values) {
            search = new RegExp('{{' + varname + '}}', 'g');
            template = template.replace(search, values[varname]);
        }
        return template;
    }
};
