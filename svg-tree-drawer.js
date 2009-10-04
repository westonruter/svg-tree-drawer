/**
 * SVG Tree Drawer
 * by Weston Ruter
 *
 * 
 */
(function(){

/*
1. Convert SVG to Canvas via standard canvas API informed by positions and dimensions 
   available from SVG? Note Canvas has a measureText() method. 
   http://uupaa-js-spinoff.googlecode.com/svn/trunk/uupaa-excanvas.js/demo/8_2_canvas_measureText.html
2. Do SVG and the have a button to export to Canvas, which will iterate over all of the
   elements in the SVG document and draw them onto a corresponding canvas element.


 
 
NOTE: Must be valid JSON, otherwise someone could inject some bad JavaScript in a bad URL
QUESTION: Can we do Packer without the self-extraction code included? We can do a JavaScript implementation of GZip and then store result in hash after Base64
{
	'label':'S',
	'children':[
		{
			'label':'NP',
			'children':[
				{
					'label':'N',
					'children':[
						{
							'label':"boy"
						}
					],
					'collapsed':false
				}
			],
			'collapsed':true
		}
	],
	'collapsed':false
}

*/

var example = {
	'label':'S',
	'children':[
		{
			'label':'NP',
			'children':[
				{
					'label':'N',
					'children':[
						{
							'label':"boy"
						}
					],
					'collapsed':false
				}
			],
			'collapsed':true
		},
		{
			'label':'NP',
			'children':[
				{
					'label':'N',
					'children':[
						{
							'label':"boy"
						}
					],
					'collapsed':false
				}
			],
			'collapsed':true
		},
		{
			'label':'NP',
			'children':[
				{
					'label':'N',
					'children':[
						{
							'label':"boy"
						}
					],
					'collapsed':false
				}
			],
			'collapsed':true
		}
	],
	'collapsed':false
};

window.addEventListener('load', function(e){

	//console.info(JSON.stringify(example).length)
	//console.info(encode64(lzw_encode(JSON.stringify(example))).length)
	//console.info(lzw_decode(lzw_encode(JSON.stringify(example))))

	
	
	// note the extra 'true' argument
	//var frag = document.createDocumentFragment(true);
	//for (var i = 0; i < 100; i++) {
	  var circle = document.createElementNS(svgns, 'circle');
	  circle.setAttribute('cx', 100);
	  circle.setAttribute('cy', 100);
	  circle.setAttribute('r', 50);
	  circle.setAttribute('fill', 'red');
	  // append to DocumentFragment
	  //frag.appendChild(circle);
	//}
	
	var svg = document.getElementsByTagNameNS(svgns, 'svg')[0];
	svg.appendChild(circle);


}, false)














// This code was written by Tyler Akins and has been placed in the
// public domain.  It would be nice if you left this header intact.
// Base64 code from Tyler Akins -- http://rumkin.com

var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

function encode64(input) {
   var output = "";
   var chr1, chr2, chr3;
   var enc1, enc2, enc3, enc4;
   var i = 0;

   do {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
         enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
         enc4 = 64;
      }

      output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + 
         keyStr.charAt(enc3) + keyStr.charAt(enc4);
   } while (i < input.length);
   
   return output;
}

function decode64(input) {
   var output = "";
   var chr1, chr2, chr3;
   var enc1, enc2, enc3, enc4;
   var i = 0;

   // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
   input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

   do {
      enc1 = keyStr.indexOf(input.charAt(i++));
      enc2 = keyStr.indexOf(input.charAt(i++));
      enc3 = keyStr.indexOf(input.charAt(i++));
      enc4 = keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
         output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
         output = output + String.fromCharCode(chr3);
      }
   } while (i < input.length);

   return output;
}

/***** From jsolait library: lgpl license *****************/

// LZW-compress a string
function lzw_encode(s) {
    var dict = {};
    var data = (s + "").split("");
    var out = [];
    var currChar;
    var phrase = data[0];
    var code = 256;
    for (var i=1; i<data.length; i++) {
        currChar=data[i];
        if (dict[phrase + currChar] != null) {
            phrase += currChar;
        }
        else {
            out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
            dict[phrase + currChar] = code;
            code++;
            phrase=currChar;
        }
    }
    out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
    for (var i=0; i<out.length; i++) {
        out[i] = String.fromCharCode(out[i]);
    }
    return out.join("");
}

// Decompress an LZW-encoded string
function lzw_decode(s) {
    var dict = {};
    var data = (s + "").split("");
    var currChar = data[0];
    var oldPhrase = currChar;
    var out = [currChar];
    var code = 256;
    var phrase;
    for (var i=1; i<data.length; i++) {
        var currCode = data[i].charCodeAt(0);
        if (currCode < 256) {
            phrase = data[i];
        }
        else {
           phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
        }
        out.push(phrase);
        currChar = phrase.charAt(0);
        dict[code] = oldPhrase + currChar;
        code++;
        oldPhrase = phrase;
    }
    return out.join("");
}


})();