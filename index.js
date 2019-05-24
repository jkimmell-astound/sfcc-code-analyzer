const fs = require('fs');
const path = require('path');

const glob = require('glob'); // Find files with a specified 'glob' pattern
const prompt = require('prompt'); // Interactive Command Line Prompt
const optimist = require('optimist'); // Handle the parameters passed to this script
const chalk = require('chalk'); // Pretty Command Line Formatting

const getRegex = /server\.get\(.*?'(.*?)'/gi;
const postRegex = /server\.post\(.*?'(.*?)'/gi;

const lineDivider = '=========================================';

const promptSchema = {
    properties: {
	repo: {
	    message: 'The repository that should be analyzed',
	    required: true,
	    default: '/',
	},
    },
};

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

/**
 * Controllers
 */
function contollers(repo) {
    const fileGlob = path.join(repo, '**', 'cartridge', 'controllers', '*.js');

    console.log(chalk.blue(`\n${lineDivider}\nControllers\n${lineDivider}`));

    const globOptions = {
	'ignore': 'node_modules'
    };

    glob(fileGlob, (err, globOptions, files) => {
	if (err) {
	    console.error(err);
	}

	const rawEndpoints = [];

	files.forEach((file) => {
	    const controllerFile = file
		.split('/')
		.pop()
		.replace('.js', '');
	    const fileContents = fs.readFileSync(file).toString();
	    console.log(typeof fileContents);
	    const cleanFileContents = fileContents.replace(/\r?\n|\r|\n/g, '');

	    let matchArray;

	    while ((matchArray = getRegex.exec(cleanFileContents))) { // eslint-disable-line
		rawEndpoints.push(`${controllerFile}-${matchArray[1]}`);
	    }

	    while ((matchArray = postRegex.exec(cleanFileContents))) { // eslint-disable-line
		rawEndpoints.push(`${controllerFile}-${matchArray[1]}`);
	    }
	});

	const endpoints = rawEndpoints.sort().filter(onlyUnique);

	console.log(endpoints.reduce((prev, curr) => `${prev}\n${curr}`));
	console.log(lineDivider);
    });
}


prompt.override = optimist.argv;

prompt.start();

// Retrieve the results of the prompt and execute the compiliation of the JS files
prompt.get(promptSchema, function (err, results) {
    if (err) {
	console.error(err);
	return;
    }

    contollers(results.repo);
});

/**
 * Pipelines
 */
// glob('cartridges/**/cartridge/pipelines/*.xml', function (er, files) {
//     let rawEndpoints = [];

//     files.forEach((file) => {
//         const pipelineFile = file.split('/').pop().replace('.xml', '');
//         // const fileContents = fs.readFileSync(file) + '';

//         console.log(file);
//         // const cleanFileContents = fileContents.replace(/\r?\n|\r|\n/g, '');

//         // let matchArray;

//         // while (matchArray = getRegex.exec(cleanFileContents)) {
//         //     rawEndpoints.push(`${controllerFile}-${matchArray[1]}`);
//         // }
//     });

//     // endpoints = rawEndpoints.sort().filter(onlyUnique);

//     // let output = endpoints.reduce((prev, curr) => {
//     //     return `${prev}\n${curr}`;
//     // });

//     // console.log(output);
// });

// glob('cartridges/**/cartridge/templates/default/rendering/category/*.isml', function (er, files) {
//     let output = files.reduce((prev, curr) => {
//         return `${prev}\n${curr}`;
//     });

//     console.log(output);
//     console.log('------------------------');
// });

// glob('cartridges/**/cartridge/templates/default/slots/**/*.isml', function (er, files) {
//     files.sort();

//     files = files.map((file) => {
//         return file.replace('cartridges/', '').replace('/cartridge/templates/default', '');
//     });

//     let output = files.reduce((prev, curr) => {
//         return `${prev}\n${curr}`;
//     });

//     console.log(output);
//     console.log('------------------------');
// });

// glob('cartridges/**/cartridge/templates/default/content/**/*.isml', function (er, files) {
//     let output = files.reduce((prev, curr) => {
//         return `${prev}\n${curr}`;
//     });

//     console.log(output);
//     console.log('------------------------');
// });

// glob('cartridges/**/cartridge/templates/default/rendering/folder/*.isml', function (er, files) {
//     let output = files.reduce((prev, curr) => {
//         return `${prev}\n${curr}`;
//     });

//     console.log(output);
//     console.log('------------------------');
// });
