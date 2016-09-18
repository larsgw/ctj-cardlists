/*
 * Transform ctj.js output to my desired format, mainly to minify file size etc.
 * 
 */


// Include
var program = require( 'commander' )
  , fs      = require( 'fs'        )

// Constants
var  input = ''
  , output = ''

function cleanDirectoryName ( directory ) {
  return directory.replace( /\/$/, '' )
}

program
  .version('0.0.1')
  .usage ('[options]')
  .option('-p, --project <path>',
          'CProject folder',
          cleanDirectoryName)
  .parse(process.argv);

if ( !process.argv.slice(2).length )
  program.help();

 input = program.project + '/data.json'
output = '../data/' + program.project.replace(/\.\.\/data\/(.{3})\/data/,'$1') + '/words.json'

// Get JSON
var data    = JSON.parse( fs.readFileSync( input, 'utf8' ) )
  , out     = {
    articles: {}
  }

// Convert JSON:

// - articles
Object.keys( data.articles ).forEach( function ( article ) {
  var amires = data.articles[ article ].AMIResults
  
  out.articles[ article ] = {
    AMIResults: { frequencies: amires.frequencies }
  }
} )

// Saving file
fs.writeFileSync( output, JSON.stringify( out ) )