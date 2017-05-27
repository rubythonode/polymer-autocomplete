/**
 * Created by user on 2017. 5. 23..
 */

/**
 * Module
 */
const fs = require('fs');
const xml2js = require('xml2js');

/**
 * Custom Module
 */
const elementAnalyze = require('./data_set.js');

/**
 * Global Variable
 */
let inputDir = './input';
let outputDir = './output';

/**
 * Recursive Search
 */
var targetPaths = [];
(function searchDir(dir) {
    var files = fs.readdirSync(dir);

    files.forEach(function (file) {
        let path = [dir,file].join('/');
        let stats = fs.statSync(path);

        (stats.isDirectory()) ? searchDir(path): targetPaths.push(path);
    });

    //File Process
    function fileProcess(path) {
        var paths = path.split('.');
        var pathsLen = paths.length;

        //HTML Validation
        if(paths[pathsLen - 1] !== 'html') {
            console.warn(path, "- This file is not a HTML file");
            return;
        }

        //Analysis Polymer Element
        elementAnalyze(path)
            .then((result) => { console.log(result) });

        /*//JSON to XML
         var builder = new xml2js.Builder();
         var xml = builder.buildObject(result);

         //Additory Working for Output File
         //Get TemplateSet

         //Write File
         fs.writeFile('./output/Result.xml', xml, (err) => {
         if (err) throw err;
         console.log('The file has been saved!');
         });*/


    }
})(inputDir);

((targetPaths) => {

    let promises = targetPaths.map(function (path) {
        return elementAnalyze(path);
    });

    Promise.all(promises)
        .then((result) => {
            //JSON to XML
            let builder = new xml2js.Builder();
            let xml = builder.buildObject({
                template: {template: result}
            });

            //Write File
            fs.writeFile('./output/Result.xml', xml, (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });
        });
})(targetPaths);

