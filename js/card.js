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

function getColumns ( columns ) {
  var dicts       = JSON.parse( fs.readFileSync( '../js/dict.json', 'utf8' ) )
    , nodeDict    = dicts.nodeDict
  
  return columns
    .split( ',' )
    .filter( function ( v ) { return nodeDict.hasOwnProperty( v ) } )
    .map( function ( v ) { return nodeDict[ v ] } )
}

program
  .version('0.1.1')
  .usage ('[options]')
  .option('-p, --project <path>',
          'CProject folder',
          cleanDirectoryName)
  .option('-c, --columns <items>',
          'Columns',
          getColumns)
  .parse(process.argv);

if ( !process.argv.slice(2).length )
  program.help();

 input = program.project + '/data.json'
output = '../data/' + program.project.replace(/\.\.\/data\/(.{3})\/data/,'$1') + '/data.json'

console.log(  'Input file: ' +  input )
console.log( 'Output file: ' + output )
console.log(     'Columns: ' + program.columns.join( ', ' ) )

// Get JSON
var data    = JSON.parse( fs.readFileSync( input, 'utf8' ) )
  , out     = {
    articles   : {},
    genus      : {},
    binomial   : {},
    frequencies: {}
  }

// Convert JSON:

// - articles
Object.keys( data.articles ).forEach( function ( article ) {
  var metadata = data.articles[ article ].metadata
    , amires   = data.articles[ article ].AMIResults
  
  out.articles[ article ] = {
    title    : metadata.title,
    authors  : metadata.authorString,
    doi      : metadata.doi,
    abstract : metadata.abstractText || '',
    journal  : metadata.journalInfo[ 0 ].journal[ 0 ].title[ 0 ],
    species  : ( amires.binomial || [] ).map( function ( v ) { return v.match } ),
    genera   : ( amires.genus || [] ).map( function ( v ) { return v.match } )
  }
} )

for ( var columnIndex = 0; columnIndex < program.columns.length; columnIndex++ ) {
  var column = program.columns[ columnIndex ]
  
  if (
    data.hasOwnProperty( column )
  ) Object.keys( data[ column ] ).forEach( function ( jsonItem ) {
    var json  =  data[ column ][ jsonItem ]
      , hits  = []
      , total = json.length
    
    // Hits per article
    json
      .slice()
      .map( function ( v ) {
	return v.pmc
      } )
      .sort()
      .forEach( function ( v ) {
	var last = hits[ hits.length-1 ] || [];
	if ( last[ 0 ] === v )
	  last[ 1 ]++
	else hits.push( [ v, 1 ] )
      } )
    
    switch ( column ) {
      case 'binomial':
	
	var genus = jsonItem.split( ' ' )[0]
	
	if ( out.genus.hasOwnProperty( genus ) )
	  out.genus[ genus ].species.push( jsonItem )
	
	break;
      
      case 'genus':
	
	out[ column ][ jsonItem ].species = []
	
	break;
      
      case 'frequencies':
	
	hits = []
	
	json
	  .slice()
	  .map( function ( v ) {
	    return [ v.pmc, parseInt( v.count ) ]
	  } )
	  .sort()
	  .forEach( function ( v ) {
	    var last = hits[ hits.length-1 ] || [];
	    if ( last[ 0 ] === v[ 0 ] )
	      last[ 1 ] += v[ 1 ]
	    else hits.push( v )
	  } )
	
	break;
    }
    
    hits = hits.sort( function ( a, b ) {
      if ( a[ 1 ] !== b[ 1 ] ) return b[ 1 ] - a[ 1 ];
      if ( a[ 0 ]  <  b[ 0 ] ) return -1;
      if ( a[ 0 ]  >  b[ 0 ] ) return  1;
			       return  0;
    } )
    
    out[ column ][ jsonItem ] = {
      total: total,
      hits : hits
    }
  })
}

// Sorting
var genusKeys    = Object.keys( out.genus       || {} )
  , binomialKeys = Object.keys( out.binomial    || {} )
  , wordKeys     = Object.keys( out.frequencies || {} )

if ( genusKeys.length ) {
  genusKeys.forEach( function ( v ) {
    out.genus[ v ].species = out.genus[ v ].species.sort()
  } )

  genusKeys.sort( function ( b, a ) {
    return ( out.genus[ a ].total - out.genus[ b ].total )
  } ).forEach( function ( v, i ) {
    out.genus[ v ].order = i;
  } )
}

if ( binomialKeys.length ) {
  binomialKeys.sort( function ( b, a ) {
    return ( out.binomial[ a ].total - out.binomial[ b ].total )
  } ).forEach( function ( v, i ) {
    out.binomial[ v ].order = i;
  } )
}

if ( wordKeys.length ) {
  wordKeys.sort( function ( b, a ) {
    return ( out.frequencies[ a ].total - out.frequencies[ b ].total )
  } ).forEach( function ( v, i ) {
    out.frequencies[ v ].order = i;
  } )
}

// Saving file
fs.writeFileSync( output, JSON.stringify( out,null,2 ) )