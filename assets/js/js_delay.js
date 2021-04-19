const litespeed_ui_events = [
	'mouseover',
	'click',
	'keydown',
	'wheel',
	"touchmove",
	"touchstart",
];
var litespeed_delay_i=0;
var urlCreator = window.URL || window.webkitURL;

// const litespeed_js_delay_timer = setTimeout( litespeed_load_delayed_js, 4000 );

litespeed_ui_events.forEach( function( e ) {
	window.addEventListener( e, litespeed_load_delayed_js_forced, { passive: true } );
} );

function litespeed_load_delayed_js_forced() {
	console.log( 'start delay load js' );
	// clearTimeout( litespeed_js_delay_timer );
	litespeed_ui_events.forEach( function( e ) {
		window.removeEventListener( e, litespeed_load_delayed_js_forced, { passive: true } );
	} );
	litespeed_load_delayed_js( true );

	document.querySelectorAll( 'iframe[litespeed-src]' ).forEach( function( e ) {
		e.setAttribute( 'src', e.getAttribute( 'litespeed-src' ) );
	} );
}

function litespeed_load_delayed_js( is_forced ) {
	if ( is_forced ) {
		console.log( 'Force runing delay JS' );
	}

	litespeed_load_one();
}

function litespeed_inline2src( data ) {
	try {
		var src = urlCreator.createObjectURL( new Blob( [ data.replace( /^(?:<!--)?(.*?)(?:-->)?$/gm, "$1" ) ], {
			type: "text/javascript"
		}));
	} catch (e) {
		var src = "data:text/javascript;base64," + btoa( data.replace( /^(?:<!--)?(.*?)(?:-->)?$/gm, "$1" ) );
	}

	return src;
}

function litespeed_load_one() {
	litespeed_delay_i ++;
	var e = document.querySelector( 'script[type="litespeed/javascript"][litespeed_i="'+litespeed_delay_i+'"]' );
	if ( ! e ) {
		console.log( 'all loaded' );
		return;
	}

	console.log( 'load i=' + e.getAttribute( 'litespeed_i' ), '-----',e );

	var e2 = document.createElement( 'script' );

	e2.addEventListener( 'load', function(){
		console.log('loaded --- ' + e2.getAttribute('litespeed_i'));
		litespeed_load_one();
	}, { passive: true } );

	var attrs = e.getAttributeNames();

	attrs.forEach( function( aname ) {
		if ( aname == 'type') return;
		e2.setAttribute( aname, e.getAttribute( aname ) );
	} );
	e2.type = 'text/javascript';
	if ( ! e.src && e.textContent ) {
		e2.src = litespeed_inline2src( e.textContent );
		// e2.textContent = e.textContent;
	}
	// setTimeout(function(){
		e.after( e2 );
		// document.head.appendChild(e2);
		e.remove();
	// },0);
	// e2 = e.cloneNode(true)
	// e2.setAttribute( 'type', 'text/javascript' );
	// e2.setAttribute( 'data-delayed', '1' );
}