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
  , sections = $([])
  , uri = getURI()
  , hash = getHash()

var stylesheets = {
  filter: document.styleSheets[ 0 ]
}

function getHash () {
  var param = decodeURIComponent( window.location.hash.replace( /^#/, '' ) )
    , parts = param.split( '=' )
    
  res = {
    key: parts[ 0 ],
    val: parts[ 1 ]
  }
  
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

function getShortLink () {
  var uriTopic   = uri.t || ''
    , uriColumns = uri.c || ''
  
    , hash = '#' + uriTopic + uriColumns.split( ',' ).join( '' ) + window.location.hash
    , link = window.location.href.replace( /\/cardlist.*$/, '' )
  
  window.prompt( 'Use this link:', link + hash )
  
  return ( link + hash )
}

function checkHash () {
      hash = getHash()
  var type =
    Object
      .keys( columnsDict )
      .map( function ( v ) { return columnsDict[ v ] } )
      .filter( function ( v, i, a ) { return a.indexOf( v ) === i } )
  
  if ( type.indexOf( hash.key ) > -1 )
    filter( hash.val, hash.key )
  
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
  
  stylesheets.filter.deleteRule( 1 )
  stylesheets.filter.deleteRule( 0 )
  stylesheets.filter.insertRule( 
    'main.s-details section .card[data-' + prop + '~="' + value + '"]{' +
      'display:block;' +
    '}'
  , 0 )
  stylesheets.filter.insertRule( 
    'main.s-details section .card:not([data-' + prop + '~="' + value + '"]){' +
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
  stylesheets.filter.insertRule( '*{}' , 0 )
  stylesheets.filter.insertRule( '*{}' , 1 )
}

var columnsDict
  , propDict

function functionGetData( columns ) {
  return function ( data ) {
    getdata = data;
    
    columns.forEach( function ( column ) {
      
      var $elm   = $( '#target' ).clone()
        , column = columnsDict[ column ]
        , json   = data[ propDict[ column ] ]
        , html   = ''
      
      $elm.attr( 'id', column )
      $elm.attr( 'class', 'shadow-top s-list' )
      $elm.children( 'header' ).children( 'span' ).text( column )
      
      if ( json !== null && typeof json === 'object' ) Object.keys( json ).forEach( function ( key, index, array ) {
	
	var value   = json[ key ]
	  , $footer = $elm.children( 'footer' )
	
	$footer.html( index + '/' + array.length )
	
	switch ( column ) {
	  case 'articles':
	    
	    html += (
	      '<div class="card" tabindex="-1" '+
		'data-articles="' + key + '"' +
		'data-genus="' + value.genera.join( ' ' ) + '"' +
		'data-species="' + value.species.map( function ( v ) { return v.replace( ' ', '_' ) } ).join( ' ' ) + '"' +
	      '>' +
		'<header>' +
		  '<h1><a href="#articles=' + key + '">' + value.title + '</a></h1>' +
		'</header>' +
		'<aside>' +
		  '<section>' +
		    '<p>' +
		      [
			'<span>' + value.authors + '</span>' ,
			'<span><a href="https://doi.org/' + value.doi + '">' + value.doi + '</a></span>' ,
			'<span>' + value.journal + '</span>'
		      ].join( '' ) +
		    '</p>' +
		  '</section>' +
		  '<section class="hide">' +
		    '<p style="cursor:pointer;margin:8px 0 16px 0;" class="anchor" onclick="' +
		      'var $self=$(this),iframe=this' +
			'.parentNode' +
			'.insertBefore(document.createElement(\'iframe\'),this);' +
		      'iframe.setAttribute(\'src\',\'' +
			'wordcloud.html?file=..%2Fdata%2f' + topic.code + '%2Fwords.json&pmcid=' + key +
		      '\');' +
		      'iframe.style.marginBottom=\'16px\';'+
		      '$self.remove();' +
		    '">' + 'Click to load Word Cloud' + '</p>' +
		    '<p>Word Cloud created with <a href="https://www.jasondavies.com/wordcloud/">cloud.js</a> (<a href="https://github.com/jasondavies/d3-cloud">repo</a>, <a href="https://github.com/jasondavies/d3-cloud/blob/master/LICENSE">license</a>)</p>' +
		  '</section>' +
		'</aside>' +
	// 	  '<img src="' + publisherIcon[ value.journal ] + '">' +
		'<main>' +
		  value.abstract +
		'</main>'+
	      '</div>'
	    )
	    
	    break;
	    
	  case 'species':
	    
	    html += (
	      '<div class="card" tabindex="-1" style="order:' + value.order + ';" ' +
		'data-articles="' + value.hits.map( function ( v ) { return v[ 0 ] } ).join( ' ' ) + '"' +
		'data-genus="' + key.split( ' ' )[ 0 ] + '"' +
		'data-species="' + key.replace( ' ', '_' ) + '"' +
	      '>' +
		'<header>' +
		  '<h1>' +
		    '<span class="title"><a href="#species=' + key.replace( ' ', '_' ) + '">' + key + '</a></span>' +
		    '<span class="total">' + value.total + '</span>' +
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
		    value.hits.map( function ( v ) {
		      return (
			'<li>' +
			  '<span class="pmcid"><a href="#articles=' + v[ 0 ] + '">' + v[ 0 ] + '</a></span>' +
			  '<span class="count">' + v[ 1 ] + '</span>' +
			'</li>' )
		    } ).join( '' ) +
		  '</ul>' +
		'</main>' +
		'<footer>' +
		  '<a href="#genus=' + key.split( ' ' )[ 0 ] + '">' + key.split( ' ' )[ 0 ] + '</a>' +
		'</footer>' +
	      '</div>'
	    )
	    
	    break;
	    
	  case 'genus':
	    
	    html += (
	      '<div class="card" tabindex="-1" style="order:' + value.order + ';" ' +
		'data-articles="' + value.hits.map( function(v){ return v[ 0 ] } ).join( ' ' ) + '"' +
		'data-genus="' + key + '"' +
		'data-species="' + value.species.map( function ( v ) { return v.replace( ' ', '_' ) } ).join( ' ' ) + '"' +
	      '>' +
		'<header>' +
		  '<h1>' +
		    '<span class="title"><a href="#genus=' + key + '">' + key + '</a></span>' +
		    '<span class="total">' + value.total + '</span>' +
		  '</h1>' +
		'</header>' +
		'<aside>' +
		  '<section>' +
		    '<ul>' +
		      value.species.map( function ( v, i, a ) {
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
		    value.hits.map( function ( v ) {
		      return (
			'<li>' +
			  '<span class="pmcid"><a href="#articles=' + v[ 0 ] + '">' + v[ 0 ] + '</a></span>' +
			  '<span class="count">' + v[ 1 ] + '</span>' +
			'</li>' )
		    } ).join( '' ) +
		  '</ul>' +
		'</main>' +
	      '</div>'
	    )
	    
	    break;
	    
	  case 'frequencies':
	    
	    html += (
	      '<div class="card" tabindex="-1" style="order:' + value.order + ';" ' +
		'data-articles="' + value.hits.map( function ( v ) { return v[ 0 ] } ).join( ' ' ) + '"' +
	      '>' +
		'<header>' +
		  '<h1>' +
		    '<span class="title"><a href="#frequencies=' + encodeURIComponent( key ) + '">' + key + '</a></span>' +
		    '<span class="total">' + value.total + '</span>' +
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
		    value.hits.map( function ( v ) {
		      return (
			'<li>' +
			  '<span class="pmcid"><a href="#articles=' + v[ 0 ] + '">' + v[ 0 ] + '</a></span>' +
			  '<span class="count">' + v[ 1 ] + '</span>' +
			'</li>' )
		    } ).join( '' ) +
		  '</ul>' +
		'</main>' +
	      '</div>'
	    )
	    
	    break;
	}
	
      })
      
      $elm.children( 'main' ).prepend( html )
      
      $( 'body > main' ).append( $elm )
      
      sections.add( $elm )
      
    } )
    
    $( '#target' ).remove();
    
    $( '.card a' ).click( function () {
      setTimeout( checkHash, 100 )
    } )
    
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
    
    sections.children('main').scroll( function () {
      var $this = $(this).parent()
	, page  = 50
	, child = this.childElementCount
	, min   = 0
	, max   = child - ( child % page )
	, index = parseInt( $this.attr( 'data-index' ) )
	, top   = index > min ? index - page : min
	, bottom= index < max ? index + page : max
      
      if ( this.scrollTop < 5 ) {
	$this.addClass( 'shadow-top' )
	$this.attr( 'data-index', top )
      } else {
	$this.removeClass( 'shadow-top' )
      }
      
      if ( this.scrollHeight - this.clientHeight - this.scrollTop < 5 ) {
	$this.addClass( 'shadow-bottom' + ( index === max ? ' max' : '' ) )
	$this.attr( 'data-index', bottom )
      } else {
	$this.removeClass( 'shadow-bottom' )
      }
    } )
    
    checkHash()
  }
}

function functionGetTopics ( data ) {
    
      topic  =   uri.t ? data[ uri.t ] : data[ Object.keys( data )[0] ]
  var columns= ( uri.c || 'a,c,b' )
		  .split( ',' )
		  .filter( function ( v ) { return topic.data.columns.indexOf( v ) > -1 } )
		  .slice( 0, 3 )
  
  $.getJSON( '../data/' + topic.code + '/data.json', functionGetData( columns ) )
  
  $('#menu').prepend(
    '<h1 data-code="' + topic.code + '">' + topic.title + '</h1>' +
      '<p>' + topic.description + '</p>' +
    '<ul>' +
      '<li><b>Query:</b> ' + topic.data.query + '</li>' +
      '<li><b>Limit:</b> ' + topic.data.limit + '</li>' +
      '<li><b>Columns:</b> ' + topic.data.columns + '</li>' +
      '<li><b>Creator:</b> ' + topic.creator.name +
	( topic.creator.org ? ' (' + topic.creator.org + ')' : '' ) +
      '</li>' +
    '</ul>' +
    '<hr />' +
    '<h1>Other datasets</h1>' +
    '<ul>' +
      Object.keys( data ).map( function ( t ) {
	return (
	  '<li><a href="?t=' + data[ t ].code + '#" data-code="' + data[ t ].code + '">' +
	    data[ t ].title +
	  '</a></li>'
	)
      } ).join('') +
    '</ul>' +
    '<p><a href="https://github.com/larsgw/ctj-cardlists#submitting-a-topic">Add your own topics</a></p>'
  )
  
}

$(window).on('load',function(){
  
  $.get( '../js/dict.json', function ( data ) {
    propDict    = data.propDict   ,
    columnsDict = data.columnsDict
    
    $.get( '../data/topics.json', functionGetTopics )
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

  $('#backButton').on('click',clearFilter)
  $('#linkButton').on('click',getShortLink)
  
  $( '#menuButton').on('focus',function(){$(this).addClass('focus')})
  $('#closeButton').on('focus',function(){$('#menuButton').removeClass('focus')})
  
});
