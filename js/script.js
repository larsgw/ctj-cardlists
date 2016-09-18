var publisherIcon = {
  'Frontiers in plant science':'https://api-journal.frontiersin.org/Areas/Header/Content/Images/thin-header-logo.png',
  'Frontiers in zoology':'https://api-journal.frontiersin.org/Areas/Header/Content/Images/thin-header-logo.png',
  
  'PloS one':'https://plos.org/images/favicon.ico'
}

var articles = undefined
  , genera   = undefined //250
  , binomial = undefined //250
  
  , topic
  , getdata
  , sections
  , uri = getURI()
  , hash = getHash()

var stylesheets = {
  filter: document.styleSheets[ 0 ]
}

function getHash () {
  var res = {}
    , param = decodeURIComponent( window.location.hash.replace( /^#/, '' ) )
    
  res[ param.split( '=' )[ 0 ] ] = param.split( '=' )[ 1 ];
  
  return res
}

function getURI () {
  var res   = {}
    , param = window.location.href.split( '?' ).pop().split( '#' )[ 0 ]
    
      param = param ? param.split( '&' ) : []
    
  for ( var i = 0; i < param.length; i++ )
    res[ decodeURIComponent( param[ i ].split( '=' )[ 0 ] ) ] =
	 decodeURIComponent( param[ i ].split( '=' )[ 1 ] )
  
  return res
}

function checkHash () {
  hash = getHash ()
  
  if ( hash.articles )
    filter( hash.articles, 'articles' )
  
  else if ( hash.genus )
    filter( hash.genus, 'genus' )
  
  else if ( hash.species )
    filter( hash.species, 'species' )
  
  else
    $( 'body' ).addClass( 'shadow-top shadow-bottom' )
}

function filter ( value, prop ) {
  var prop = prop || 'articles';
  
  window.location.hash = '#' + prop + '=' + value
  
  $( 'body' )
    .addClass( 'shadow-top' )
    .removeClass( 'shadow-bottom' )
  .children( 'main' )
    .addClass( 's-details' )
  .children( 'section' )
    .removeClass( 's-item' )
    .addClass( 's-list' )
  .filter( '#' + prop )
    .removeClass( 's-list' )
    .addClass( 's-item' )
  
  /*stylesheets.filter.deleteRule( 0 )
  stylesheets.filter.insertRule( 
    'body > main > section > main > .card:not([data-' + prop + '~="' + value + '"]){' +
      'max-height:0;' +
      'margin-top:0;' +
      'margin-bottom:0;' +
      'padding:0;' +
      'overflow:hidden;' +
//       'display:block;' +
    '}'
  , 0 )*/
  
  stylesheets.filter.insertRule( 
    'body > main > section > main > .card[data-' + prop + '~="' + value + '"]{' +
      'display:block;' +
    '}'
  , 0 )
  
  stylesheets.filter.insertRule( 
    'body > main > section > main > .card:not([data-' + prop + '~="' + value + '"]){' +
      'display:none;' +
    '}'
  , 1 )
}

function clearFilter () {
  window.location.hash = '';
  $( 'body' )
    .addClass( 'shadow-top shadow-bottom' )
  .children( 'main' )
    .removeClass( 's-details' )
  .children( 'section' )
    .removeClass( 's-item' )
    .addClass( 's-list' )
  stylesheets.filter.deleteRule( 1 )
  stylesheets.filter.deleteRule( 0 )
}

function functionGetData( data ) {
  getdata = data;
  
  $( '#articles > main' ).append( Object.keys( data.articles ).slice( 0, articles ).map( function ( v, i ) {
    var article = data.articles[ v ]
      , footer  = $( '#articles > footer' )
    
    if ( i < articles )
      footer.html( i + '/' + articles )
    else
      footer.empty()
    
    return (
      '<div class="card" tabindex="-1" '+
	'data-articles="' + v + '"' +
	'data-genus="' + article.genera.join( ' ' ) + '"' +
	'data-species="' + article.species.map( function ( v ) { return v.replace( ' ', '_' ) } ).join( ' ' ) + '"' +
      '>' +
	'<header>' +
	  '<h1><a href="#articles=' + v + '">' + article.title + '</a></h1>' +
	'</header>' +
	'<aside>' +
	  '<section>' +
	    '<p>' +
	      [
		'<span>' + article.authors + '</span>' ,
		'<span><a href="https://doi.org/' + article.doi + '">' + article.doi + '</a></span>' ,
		'<span>' + article.journal + '</span>'
	      ].join( '' ) +
	    '</p>' +
	  '</section>' +
	  '<section class="hide">' +
	    '<p style="cursor:pointer;margin:8px 0 16px 0;" class="anchor" onclick="' +
	      'var $self=$(this),iframe=this' +
		'.parentNode' +
		'.insertBefore(document.createElement(\'iframe\'),this);' +
	      'iframe.setAttribute(\'src\',' +
		'\'wordcloud.html?file=..%2Fdata%2f' + topic.code + '%2Fwords.json&pmcid=' + v +
	      '\');' +
	      'iframe.style.marginBottom=\'16px\';'+
	      '$self.remove();' +
	    '">' + 'Click to load Word Cloud' + '</p>' +
	    '<p>Word Cloud created with <a href="https://www.jasondavies.com/wordcloud/">cloud.js</a> (<a href="https://github.com/jasondavies/d3-cloud">repo</a>, <a href="https://github.com/jasondavies/d3-cloud/blob/master/LICENSE">license</a>)</p>' +
	  '</section>' +
	'</aside>' +
// 	  '<img src="' + publisherIcon[ article.journal ] + '">' +
	'<main>' +
	  article.abstract +
	'</main>'+
      '</div>' )
    
  } ).join( '' ) )
  
  $( '#genus > main' ).append( Object.keys( data.genus ).slice( 0, genera ).map( function ( genus, index ) {
    var genusData = data.genus[ genus ]
      , footer  = $( '#genus > footer' )
    
    if ( index < genera )
      footer.html( index + '/' + genera )
    else
      footer.empty()
    
    return (
      '<div class="card" tabindex="-1" style="order:' + genusData.order + ';" ' +
	'data-articles="' + genusData.hits.map( function(v){ return v[ 0 ] } ).join( ' ' ) + '"' +
	'data-genus="' + genus + '"' +
	'data-species="' + genusData.species.map( function ( v ) { return v.replace( ' ', '_' ) } ).join( ' ' ) + '"' +
      '>' +
	'<header>' +
	  '<h1>' +
	    '<span class="title"><a href="#genus=' + genus + '">' + genus + '</a></span>' +
	    '<span class="total">' + genusData.total + '</span>' +
	  '</h1>' +
	'</header>' +
	'<aside>' +
	  '<section>' +
	    '<ul>' +
	      genusData.species.map( function ( v, i, a ) {
		var str = '<li><a href="#species=' + v.replace( ' ', '_' ) + '">' + v + '</a></li>'
		
		if ( ( a.length > 10 ) && ( i === 8 ) )
		  str += (
		    '<li class="read-more" onclick="' +
		      'this.parentNode.className+=\'open\';' +
		      'this.remove();' +
		    '">Click for more species</li>'
		  )
		
		return str
	      } ).join( ' ' ) +
	    '</ul>' +
	  '</section>' +
	'</aside>' +
	'<main>' +
	  '<ul>' +
	    genusData.hits.map( function ( v ) {
	      return (
		'<li>' +
		  '<span class="pmcid"><a href="#articles=' + v[ 0 ] + '">' + v[ 0 ] + '</a></span>' +
		  '<span class="count">' + v[ 1 ] + '</span>' +
		'</li>' )
	    } ).join( '' ) +
	  '</ul>' +
	'</main>' +
      '</div>' )
    
  } ).join( '' ) )
  
  $( '#species > main' ).append( Object.keys( data.binomial ).slice( 0, binomial ).map( function ( species, index ) {
    var speciesData = data.binomial[ species ]
      , footer  = $( '#species > footer' )
    
    if ( index < binomial )
      footer.html( index + '/' + binomial )
    else
      footer.empty()
    
    return (
      '<div class="card" tabindex="-1" style="order:' + speciesData.order + ';" ' +
	'data-articles="' + speciesData.hits.map( function ( v ) { return v[ 0 ] } ).join( ' ' ) + '"' +
	'data-genus="' + species.split( ' ' )[0] + '"' +
	'data-species="' + species.replace( ' ', '_' ) + '"' +
      '>' +
	'<header>' +
	  '<h1>' +
	    '<span class="title"><a href="#species=' + species.replace( ' ', '_' ) + '">' + species + '</a></span>' +
	    '<span class="total">' + speciesData.total + '</span>' +
	  '</h1>' +
	'</header>' +
	'<aside>' +
	  '<section>' +
	    '<ul>' +
	    '</ul>' +
	  '</section>' +
	'</aside>' +
	'<main>' +
	  '<ul>' +
	    speciesData.hits.map( function ( v ) {
	      return (
		'<li>' +
		  '<span class="pmcid"><a href="#articles=' + v[ 0 ] + '">' + v[ 0 ] + '</a></span>' +
		  '<span class="count">' + v[ 1 ] + '</span>' +
		'</li>' )
	    } ).join( '' ) +
	  '</ul>' +
	'</main>' +
	'<footer>' +
	  '<a href="#genus=' + species.split( ' ' )[ 0 ] + '">' + species.split( ' ' )[ 0 ] + '</a>' +
	'</footer>' +
      '</div>' )
    
  } ).join( '' ) )
  
  $( '.card a' ).click( function () {
    setTimeout( checkHash, 100 )
  } )
  
}

$(document).ready(function(){
  sections = $( 'body > main > section' )
  
  checkHash()
})

$(window).on('load',function(){
  
  $.get( '../data/topics.json', function ( data ) {
    
    topic = uri.t ? data[ uri.t ] : data[ Object.keys( data )[0] ]
    
    $.get( '../data/' + topic.code + '/data.json', functionGetData)
    
    $('#menu').prepend(
      '<h1 data-code="' + topic.code + '">' + topic.title + '</h1>' +
	'<p>' + topic.description + '</p>' +
      '<ul>' +
	'<li><b>Query:</b> ' + topic.data.query + '</li>' +
	'<li><b>Limit:</b> ' + topic.data.limit + '</li>' +
	'<li><b>Creator:</b> ' + topic.creator.name +
	  ( topic.creator.org ? ' (' + topic.creator.org + ')' : '' ) +
	'</li>' +
      '</ul>' +
      '<h1>Other datasets</h1>' +
      '<ul>' +
	Object.keys( data ).map( function ( t ) {
	  return (
	    '<li><a href="?t=' + data[ t ].code + '#" data-code="' + data[ t ].code + '">' +
	      data[ t ].title +
	    '</a></li>'
	  )
	} ).join('') +
      '</ul>'
    )
    
  } )

  sections.children('main').scroll( function () {
    var $this = $(this).parent();
    
    $this[ ( this.scrollTop < 5 ? 'add' : 'remove' ) + 'Class' ]('shadow-top')
    $this[ ( this.scrollHeight - this.clientHeight - this.scrollTop < 5 ? 'add' : 'remove' ) + 'Class' ]('shadow-bottom')
  } )

  $( 'body' ).children('main').scroll( function () {
    var $this = $(this).parent();
    
    $this[ ( this.scrollTop < 5 ? 'add' : 'remove' ) + 'Class' ]('shadow-top')
    $this[ ( this.scrollHeight - this.clientHeight - this.scrollTop < 5 ? 'add' : 'remove' ) + 'Class' ]('shadow-bottom')
  } )

  $('#searchBar input').on('change',function(){
    var val = $(this).val();
    
    if ( val.split(' ').length===2 )
      filter(val.replace(' ','_'),'species')
    
    else if ( /^PMC\d+$/.test(val) )
      filter(val,'articles')
    
    else
      filter(val,'genus')
  })

  $('#backButton span').on('click',clearFilter)

  $( 'body > main > section > header nav' ).click( function () {
    var parent = $( this ).parents( 'body > main > section' )
      , column = parent.hasClass( 'column' )
      , columnr = parent.hasClass( 'column-reverse' )
    
    parent.removeClass( 'column column-reverse' )
    
    if ( column )
      parent.addClass( 'column-reverse' )
    else if ( !columnr )
      parent.addClass( 'column' )
  })
  
});