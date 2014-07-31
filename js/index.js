$(function() {
	FastClick.attach(document.body);
});

(function( $, undefined ) {
	//special click handling to make widget work remove after nav changes in 1.4
	var href,
		ele = "";
	$( document ).on( "click", "a", function( e ) {
		href = $( this ).attr( "href" );
		var hash = $.mobile.path.parseUrl( href );
		if( typeof href !== "undefined" && hash !== "" && href !== href.replace( hash,"" ) && hash.search( "/" ) !== -1 ){
			//remove the hash from the link to allow normal loading of the page.
			var newHref = href.replace( hash,"" );
			$( this ).attr( "href", newHref );
		}
		ele = $( this );
	});
	$( document ).on( "pagebeforechange", function( e, f ){
			f.originalHref = href;
	});
	$( document ).on("pagebeforechange", function( e,f ){
		var hash = $.mobile.path.parseUrl(f.toPage).hash,
			hashEl, hashElInPage;

		try {
			hashEl = $( hash );
		} catch( e ) {
			hashEl = $();
		}

		try {
			hashElInPage = $( ".ui-page-active " + hash );
		} catch( e ) {
			hashElInPage = $();
		}

		if( typeof hash !== "undefined" &&
			hash.search( "/" ) === -1 &&
			hash !== "" &&
			hashEl.length > 0 &&
			!hashEl.hasClass( "ui-page" ) &&
			!hashEl.hasClass( "ui-popup" ) &&
			hashEl.data('role') !== "page" &&
			!hashElInPage.hasClass( "ui-panel" ) &&
			!hashElInPage.hasClass( "ui-popup" ) ) {
			//scroll to the id
			var pos = hashEl.offset().top;
			$.mobile.silentScroll( pos );
			$.mobile.navigate( hash, '', true );
		} else if( typeof f.toPage !== "object" &&
			hash !== "" &&
			$.mobile.path.parseUrl( href ).hash !== "" &&
			!hashEl.hasClass( "ui-page" ) && hashEl.attr('data-role') !== "page" &&
			!hashElInPage.hasClass( "ui-panel" ) &&
			!hashElInPage.hasClass( "ui-popup" ) ) {
			$( ele ).attr( "href", href );
			$.mobile.document.one( "pagechange", function() {
				if( typeof hash !== "undefined" &&
					hash.search( "/" ) === -1 &&
					hash !== "" &&
					hashEl.length > 0 &&
					hashElInPage.length > 0 &&
					!hashEl.hasClass( "ui-page" ) &&
					hashEl.data('role') !== "page" &&
					!hashElInPage.hasClass( "ui-panel" ) &&
					!hashElInPage.hasClass( "ui-popup" ) ) {
					hash = $.mobile.path.parseUrl( href ).hash;
					var pos = hashElInPage.offset().top;
					$.mobile.silentScroll( pos );
				}
			} );
		}
	});
	$( document ).on( "mobileinit", function(){
		hash = window.location.hash;
		$.mobile.document.one( "pageshow", function(){
			var hashEl, hashElInPage;

			try {
				hashEl = $( hash );
			} catch( e ) {
				hashEl = $();
			}

			try {
				hashElInPage = $( ".ui-page-active " + hash );
			} catch( e ) {
				hashElInPage = $();
			}

			if( hash !== "" &&
				hashEl.length > 0 &&
				hashElInPage.length > 0 &&
				hashEl.attr('data-role') !== "page" &&
				!hashEl.hasClass( "ui-page" ) &&
				!hashElInPage.hasClass( "ui-panel" ) &&
				!hashElInPage.hasClass( "ui-popup" ) &&
				!hashEl.is( "body" ) ){
				var pos = hashElInPage.offset().top;
				setTimeout( function(){
					$.mobile.silentScroll( pos );
				}, 100 );
			}
		});
	});
	//h2 widget
	$( document ).on( "mobileinit", function(){
		$.widget( "mobile.h2linker", {
			options:{
				initSelector: ":jqmData(quicklinks='true')"
			},

			_create:function(){
				var self = this,
					bodyid = "ui-page-top",
					panel = "<div data-role='panel' class='jqm-nav-panel jqm-quicklink-panel' data-position='right' data-display='overlay' data-theme='a'><ul data-role='listview' data-inset='false' data-theme='a' data-divider-theme='a' data-icon='false' class='jqm-list'><li data-role='list-divider'>Quick Links</li></ul></div>",
					first = true,
					h2dictionary = new Object();
					if(typeof $("body").attr("id") === "undefined"){
						$("body").attr("id",bodyid);
					} else {
						bodyid =  $("body").attr("id");
					}
					this.element.find("div.jqm-content>h2").each(function(){
						var id, text = $(this).text();

						if(typeof $(this).attr("id") === "undefined"){
							id = text.replace(/[^\.a-z0-9:_-]+/gi,"");
							$(this).attr( "id", id );
						} else {
							id = $(this).attr("id");
						}

						h2dictionary[id] =  text;
						if(!first){
							$(this).before( "<a href='#" + bodyid + "' class='jqm-deeplink ui-icon-carat-u ui-alt-icon'>Top</a>");
						} else {
							$(this).before("<a href='#' data-ajax='false' class='jqm-deeplink jqm-open-quicklink-panel ui-icon-carat-l ui-alt-icon'>Quick Links</a>");
						}
						first = false;
					});
					this._on(".jqm-open-quicklink-panel", {
						"click": function(){
							$(".ui-page-active .jqm-quicklink-panel").panel("open");
							return false;
						}
					});
					this._on( document, {
						"pagebeforechange": function(){
							this.element.find(".jqm-quicklink-panel").panel("close");
							this.element.find(".jqm-quicklink-panel .ui-btn-active").removeClass("ui-btn-active");
						}
					});
					if( $(h2dictionary).length > 0 ){
						this.element.prepend(panel)
						this.element.find(".jqm-quicklink-panel").panel().find("ul").listview();
					}
					$.each(h2dictionary,function(id,text){
						self.element.find(".jqm-quicklink-panel ul").append("<li><a href='#"+id+"'>"+text+"</a></li>");
					});
					self.element.find(".jqm-quicklink-panel ul").listview("refresh");

			}
		});
	});
	$( document ).bind( "pagecreate create", function( e ) {
		var initselector = $.mobile.h2linker.prototype.options.initSelector;
		if($(e.target).data("quicklinks")){
			$(e.target).h2linker();
		}
	});
})( jQuery );



$( document ).on( "pagecreate", ".jqm-demos", function( event ) {
	var search,
		page = $( this ),
		that = this,
		searchUrl = ( $( this ).hasClass( "jqm-home" ) ) ? "_search/" : "../_search/",
		searchContents = $( ".jqm-search ul.jqm-list" ).find( "li:not(.ui-collapsible)" ),
		version = $.mobile.version || "dev",
		words = version.split( "-" ),
		ver = words[0],
		str = words[1] || "",
		text = ver;

	// Insert jqm version in header
	if ( str.indexOf( "rc" ) == -1 ) {
		str = str.charAt( 0 ).toUpperCase() + str.slice( 1 );
	} else {
		str = str.toUpperCase().replace( ".", "" );
	}

	if ( $.mobile.version && str ) {
		text += " " + str;
	}

	$( ".jqm-version" ).html( text );

	// Global navmenu panel
	$( ".jqm-navmenu-panel ul" ).listview();

	$( document ).on( "panelopen", ".jqm-search-panel", function() {
		$( this ).find( "input" ).focus();
	})

	$( ".jqm-navmenu-link" ).on( "click", function() {
		page.find( ".jqm-navmenu-panel:not(.jqm-panel-page-nav)" ).panel( "open" );
	});

	// Turn off autocomplete / correct for demos search
	$( this ).find( ".jqm-search input" ).attr( "autocomplete", "off" ).attr( "autocorrect", "off" );

	// Global search
	$( ".jqm-search-link" ).on( "click", function() {
		page.find( ".jqm-search-panel" ).panel( "open" );
	});

	// Initalize search panel list and filter also remove collapsibles
	$( this ).find( ".jqm-search ul.jqm-list" ).html( searchContents ).listview({
		inset: false,
		theme: null,
		dividerTheme: null,
		icon: false,
		autodividers: true,
		autodividersSelector: function ( li ) {
			return "";
		},
		arrowKeyNav: true,
		enterToNav: true,
		highlight: true,
		submitTo: searchUrl
	}).filterable();

	// Initalize search page list and remove collapsibles
	$( this ).find( ".jqm-search-results-wrap ul.jqm-list" ).html( searchContents ).listview({
		inset: true,
		theme: null,
		dividerTheme: null,
		icon: false,
		arrowKeyNav: true,
		enterToNav: true,
		highlight: true
	}).filterable();

	// Fix links on homepage to point to sub directories
	if ( $( event.target ).hasClass( "jqm-home") ) {
		$( this ).find( "a" ).each( function() {
			$( this ).attr( "href", $( this ).attr( "href" ).replace( "../", "" ) );
		});
	}

	// Search results page get search query string and enter it into filter then trigger keyup to filter
	if ( $( event.target ).hasClass( "jqm-demos-search-results") ) {
		search = $.mobile.path.parseUrl( window.location.href ).search.split( "=" )[ 1 ];
		setTimeout(function() {
			e = $.Event( "keyup" );
			e.which = 65;
			$( that ).find( ".jqm-content .jqm-search-results-wrap input" ).val( search ).trigger(e).trigger( "change" );
		}, 0 );
	}
});

// Append keywords list to each list item
$( document ).one( "pagecreate", ".jqm-demos", function( event ) {
	$( this ).find( ".jqm-search-results-list li, .jqm-search li" ).each(function() {
		var text = $( this ).attr( "data-filtertext" );

		$( this )
			.find( "a" )
			.append( "<span class='jqm-search-results-keywords ui-li-desc'>" + text + "</span>" );
	});
});



// View demo source code

function attachPopupHandler( popup, sources ) {
	popup.one( "popupbeforeposition", function() {
		var
			collapsibleSet = popup.find( "[data-role='collapsibleset']" ),
			collapsible, pre;

		$.each( sources, function( idx, options ) {
			collapsible = $( "<div data-role='collapsible' data-collapsed='true' data-theme='" + options.theme + "' data-iconpos='right' data-collapsed-icon='carat-l' data-expanded-icon='carat-d' data-content-theme='b'>" +
					"<h1>" + options.title + "</h1>" +
					"<pre class='brush: " + options.brush + ";'></pre>" +
				"</div>" );
			pre = collapsible.find( "pre" );
			pre.append( options.data.replace( /</gmi, '&lt;' ) );
			collapsible
				.appendTo( collapsibleSet )
				.on( "collapsiblecollapse", function() {
					popup.popup( "reposition", { positionTo: "window" } );
				})
				.on( "collapsibleexpand", function() {
					var doReposition = true;

					collapsibleSet.find( ":mobile-collapsible" ).not( this ).each( function() {
						if ( $( this ).collapsible( "option", "expanded" ) ) {
							doReposition = false;
						}
					});

					if ( doReposition ) {
						popup.popup( "reposition", { positionTo: "window" } );
					}
				});
			SyntaxHighlighter.highlight( {}, pre[ 0 ] );
		});

		collapsibleSet.find( "[data-role='collapsible']" ).first().attr( "data-collapsed", "false" );
		popup.trigger( "create" );
	});
}

function getSnippet( type, selector, source ) {
	var text = "", el, absUrl, hash;

	if ( selector === "true" ) {
		selector = "";
	}

	// First, try to grab a tag in this document
	if ( !$.mobile.path.isPath( selector ) ) {
		el = source.find( type + selector );
		// If this is not an embedded style, try a stylesheet reference
		if ( el.length === 0 && type === "style" ) {
			el = source.find( "link[rel='stylesheet']" + selector );
		}
		text = $( "<div></div>" ).append( el.contents().clone() ).html();
		if ( !text ) {
			text = "";
			selector = el.attr( "href" ) || el.attr( "src" ) || "";
		}
	}

	// If not, try to SJAX in the document referred to by the selector
	if ( !text && selector ) {
		absUrl = $.mobile.path.makeUrlAbsolute( selector );
		hash = $.mobile.path.parseUrl( absUrl ).hash;

		// selector is a path to SJAX in
		$.ajax( absUrl, { async: false, dataType: "text" } )
			.success( function( data, textStatus, jqXHR ) {
				text = data;
				// If there's a hash we assume this is an HTML document that has a tag
				// inside whose ID is the hash
				if ( hash ) {
					text = $( "<div></div>" ).append( $( data ).find( hash ).contents().clone() ).html();
				}
			});
	}

	return text;
}

$( document ).bind( "pagebeforechange", function( e, data ) {
	var popup, sources;
	if ( data.options && data.options.role === "popup" && data.options.link ) {
		sources = data.options.link.jqmData( "sources" );
		if ( sources ) {
			popup = $( "<div id='jqm-view-source' class='jqm-view-source' data-role='popup' data-theme='none' data-position-to='window'>" +
								"<div data-role='collapsibleset' data-inset='true'></div>" +
							"</div>" );

			attachPopupHandler( popup, sources );
			popup
				.appendTo( $.mobile.activePage )
				.popup()
				.bind( "popupafterclose", function() {
					popup.remove();
				})
				.popup( "open" );

			e.preventDefault();
		}
	}
});

function makeButton() {
	var d = document.createElement( "div" )
		a = document.createElement( "a" ),
		txt = document.createTextNode( "View Source" );

	a.className = "jqm-view-source-link ui-btn ui-corner-all ui-btn-inline ui-mini";

	a.setAttribute( "href", "#popupDemo" );
	a.setAttribute( "data-rel", "popup" );
	a.appendChild( txt );

	d.appendChild( a );

	return $( d );
}



(function($) {
	var types = ['DOMMouseScroll', 'mousewheel'];

	if ($.event.fixHooks) {
		for ( var i=types.length; i; ) {
			$.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
		}
	}
	$.event.special.mousewheel = {
		setup: function() {
			if ( this.addEventListener ) {
				for ( var i=types.length; i; ) {
					this.addEventListener( types[--i], handler, false );
				}
			} else {
				this.onmousewheel = handler;
			}
		},
		teardown: function() {
			if ( this.removeEventListener ) {
				for ( var i=types.length; i; ) {
					this.removeEventListener( types[--i], handler, false );
				}
			} else {
				this.onmousewheel = null;
			}
		}
	};
	$.fn.extend({
		mousewheel: function(fn) {
			return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
		},

		unmousewheel: function(fn) {
			return this.unbind("mousewheel", fn);
		}
	});
	function handler(event) {
		var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
		event = $.event.fix(orgEvent);
		event.type = "mousewheel";

		// Old school scrollwheel delta
		if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
		if ( orgEvent.detail     ) { delta = -orgEvent.detail/3; }
		// New school multidimensional scroll (touchpads) deltas
		deltaY = delta;
		// Gecko
		if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
			deltaY = 0;
			deltaX = -1*delta;
		}
		// Webkit
		if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
		if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }
		// Add event and delta to the front of the arguments
		args.unshift(event, delta, deltaX, deltaY);

		return ($.event.dispatch || $.event.handle).apply(this, args);
	}
})(jQuery);


//perso//

$( document ).on( "pagebeforecreate", function() {

	$( "div#footer" ).html( '<div data-role="navbar" data-grid="b">\
    <ul>\
        <li><a href="tel:0022501091010"><i style="color:#FEB302"  class="fa fa-2x fa-phone"></i></a></li>\
        <li><a href="index.html" data-ajax="false"><i class="fa fa-2x fa-home"></i></a></li>\
        <li><a href="chat.html" data-ajax="false" ><i style="color:#FEB302" class="fa fa-2x fa-comments"></i></a></li>\
    </ul>\
</div><!-- /navbar -->	' );
	$( "#cfooter" ).append( '<div data-role="navbar" data-grid="b">\
    <ul>\
        <li><a href="tel:0022501091010"><i style="color:#FEB302" class="fa fa-2x fa-phone"></i></a></li>\
        <li><a href="index.html" data-ajax="false"><i class="fa fa-2x fa-home"></i></a></li>\
        <li><a href="chat.html" data-ajax="false" ><i style="color:#FEB302" class="fa fa-2x fa-comments"></i></a></li>\
    </ul>\
</div><!-- /navbar -->	' );
	$("div#header").html('  <h2 class="ui-title" role="heading" aria-level="1"><img style="height:  50px; width: auto; text-align: left;" alt="jQuery Mobile" src="img/mtn/logo_normal.png"/></h2><a href="#" class="jqm-navmenu-link ui-btn ui-btn-icon-notext ui-corner-all ui-icon-bars ui-nodisc-icon ui-alt-icon ui-btn-left">Menu</a>');
	$("div#panel").html('	    	<ul class="jqm-list ui-alt-icon ui-nodisc-icon">\
<li data-icon="home"><a href="index.html" data-ajax="false">Home</a></li>\
<li data-role="collapsible" data-collapsed-icon="carat-d" data-expanded-icon="carat-u" data-iconpos="right" data-inset="false">\
	<h3>A propos de MTN</h3>\
	<ul>\
        			<li><a href="apropos.html#dg" data-ajax="false">Message du CEO</a></li>\
        			<li><a href="apropos.html#qui_som_nous" data-ajax="false">Qui sommes-nous?</a></li>\
        			<li><a href="apropos.html#couverture" data-ajax="false">Notre couverture</a></li>\
        			<li><a href="apropos.html#agence" data-ajax="false">Service clientèle</a></li>\
        			</ul>\
</li>\
<li data-role="collapsible" data-collapsed-icon="carat-d" data-expanded-icon="carat-u" data-iconpos="right" data-inset="false">\
	<h3>Fondation MTN</h3>\
	<ul>\
        			<li><a href="fondation.html#fondationmtn" data-ajax="false">Présentation</a></li>\
        			<li><a href="fondation.html#projet" data-ajax="false">Projets de la Fondation</a></li>\
        		</ul>\
</li>\
<li data-role="collapsible" data-collapsed-icon="carat-d" data-expanded-icon="carat-u" data-iconpos="right" data-inset="false">\
	<h3>Y\'ello Moments</h3>\
	<ul>\
	        		<li><a href="moment.html#ju2013" data-ajax="false">Evènements 2013</a></li>\
        			<li><a href="#" data-ajax="false">Evènements 2012</a></li>\
        			<li><a href="#" data-ajax="false">Evènements 2011</a></li>\
        			<li><a href="#" data-ajax="false">Evènements 2010</a></li>\
        			<li><a href="moment.html#yello" data-ajax="false">Evènements 2009</a></li>\
        			<li><a href="moment.html#ev2008" data-ajax="false">Evènements 2008</a></li>\
        			<li><a href="moment.html#ev2007" data-ajax="false">Evènements 2007</a></li>\
	</ul>\
</li>\
<li data-role="collapsible" data-collapsed-icon="carat-d" data-expanded-icon="carat-u" data-iconpos="right" data-inset="false">\
	<h3>Produits & Services</h3>\
	<ul>\
	        		<li><a href="http://www.mtnplay.bj/shop/French/defaultindex.aspx" data-ajax="false">MTN Play</a></li>\
        			<li><a href="services.html#asyougo" data-ajax="false">MTN Pay as you Go</a></li>\
        			<li><a href="services.html#month" data-ajax="false">MTN Pay Monthly</a></li>\
        			<li><a href="services.html#pratique" data-ajax="false">Services Pratiques</a></li>\
        			<li><a href="services.html#appel" data-ajax="false">Service d\'appel</a></li>\
        			<li><a href="services.html#message" data-ajax="false">Service message</a></li>\
        			<li><a href="services.html#multimedia" data-ajax="false">Services Multimédias</a></li>\
        			<li><a href="services.html#roaming" data-ajax="false">Roaming</a></li>\
        			<li><a href="services.html#momo" data-ajax="false">Mobile Money</a></li>\
        			<li><a href="services.html#numero" data-ajax="false">Numéros courts</a></li>\
        			<li><a href="services.html#entreprises" data-ajax="false">Services Entreprises</a></li>\
        			<li><a href="services.html#prestige" data-ajax="false">MTN Prestiges club</a></li>\
	</ul>\
</li>\
<!--<li><a href="faq.html" data-ajax="false">FAQ</a></li>-->\
<li><a href="tel:0022501091010">Appeler le Service Client</a></li>\
<li><a href="tel:0022501091011">Appeler le Serveur Vocal</a></li>\
<li><a href="chat.html" data-ajax="false"id="hd" data-theme="b" >Y\'ello Chat</a></li>\
<li><a href="qoe.html" data-ajax="false"id="hd" data-theme="b" >Boîte à suggestions</a></li>\
<li><a href="#" data-ajax="false">Version <span class="jqm-version"></span> WBC R&D</a></li>\
	</ul>');

});
var hd = function () {
    $("div[role='main']").html('<iframe src="http://webcoom.net/hd/chat/index.php" style="border:0px;height:100%;width:100%;position:absolute" data-ajax="false"></iframe>');

};

$(document ).on( "pagebeforecreate", function() {
if (!localStorage.getItem('numero')) {
$('#xchatmain').html('\
        <form action="index.html"><div style="padding:10px 20px;">\
            <h3>Veuillez vous identifier!</h3>\
            <input type="tel" name="numero" id="numero" data-theme="a" placeholder="Votre numéro moov">\
            <button type="submit" class="ui-btn ui-corner-all ui-shadow ui-btn-b" id="sublog">ENTRER</button>\
        </div>\
    </form>');
};

$('#sublog').on('click', function () {
if ($('#numero').val() == '') {alert('Veuillez remplire le champ!');}
else { localStorage.setItem('numero',$('#numero').val());
};
});
});
        //app.initialize();
        //$(function() {FastClick.attach(document.body);});
        
function goChat() {

        if (document.getElementById("username").value=="") {
            alert("Veuillez nous donner votre nom!");
            document.getElementById("username").focus();
            return;
        }
        if (document.getElementById("email").value=="") {
            alert("Veuillez nous donner votre email!");
            document.getElementById("email").focus();
            return;
        }
        var host="10.41.14.249:8080";
        //var host="41.74.10.73:8465";
var url="http://"+host+"/ChatServer/guest/application.jsp?lang="+document.getElementById("lang").value+"&clientType=GUEST&userName="+document.getElementById("username").value +"&flag="+(new Date().getTime())+"&userEmail="
                +document.getElementById("email").value+"&attachedData={\\\"CHATTYPE\\\": \\\""+document.getElementById("brand").value+"\\\",\\\"REGNUM\\\": \\\"111222333\\\",\\\"CUSTOMERNAME\\\": \\\"Johny Walker\\\"}"
  ;
        var ref = window.open(url, '_blank', 'location=yes');
        ref.addEventListener('loadstop', function() {
            alert("Css injection");
            ref.insertCSS({file: "css/chat.css"});
        });
         //window.location="discussion.html";

        //////////////start aheeva custom code////////////
        /*
        var milliseconds = new Date().getTime();
        var url = "http://41.74.10.73:8465/ChatServer/guest/application.jsp?lang="+document.getElementById("lang").value+"&clientType=GUEST&userName="+document.getElementById("username").value +"&flag="+(new Date().getTime())+"&userEmail="
                +document.getElementById("email").value+"&attachedData={\\\"CHATTYPE\\\": \\\""+document.getElementById("brand").value+"\\\",\\\"REGNUM\\\": \\\"111222333\\\",\\\"CUSTOMERNAME\\\": \\\"Johny Walker\\\"}";
        //window.open(url,"chatwin"+milliseconds,'_self');
            window.location = url;
          */  
        ////////////end aheeva custom code//////////////



        }
        
function goQoe(){
    if($("#username").val()==$("#username").val()){
        alert("of");
    }
}
