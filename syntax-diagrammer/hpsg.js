/**
 * HPSG Display Routines <http://github.com/westonruter/svg-tree-drawer/>
 * by Weston Ruter <http://weston.ruter.net/>, 2009
 * License: GPL 3.0 <http://www.gnu.org/licenses/gpl.html>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

"use strict";

//Important: Requires JavaScript 1.7:
//<script src="hpsg.js" type="application/javascript;version=1.7"></script>

var HPSG = {
	//Returns an HPSG XML document
	parse:null,
	
	//Returns tokens used by parse
	tokenize:null,
	
	//Converts HPSG XML document to MathML
	toMathML:null,
	
	//Define constants which identify the groups matched in the RegExp below
	WHITESPACE     : 1,
	LIST_SEPARATOR : 2,
	BAREWORD       : 3,
	TAG            : 4,
	INDEX          : 5,
	AVM_START      : 6,
	AVM_END        : 7,
	AV_SEPARATOR   : 8,
	LIST_START     : 9,
	LIST_END       : 10,
	ELLIPSIS       : 11,
	//@todo What about optionality? What about disjunctions?
	
	//Regular expression which tokenizes HPSG string
	tokenRegExp: new RegExp( '^(?:' + [
		'(\\s+)', //ignored
		
		//List item separators
		"([,;\n])",
		
		//Bareword (could be abbr, attr name, attr value, avm type, or word in lexical sequence)
		'([A-Za-z_\\-0-9]+)\\b', //\s*[:=]
		
		//Tag, preceded by sigil @
		'@([A-Z]|[0-9]+)\\s*',
		
		//Index (preceded by sigil $)
		//@todo if standalone? or _ if on another element)
		'_?\\$([a-z][0-9]*)',
		
		//AVM boundaries
		'(\\[)',
		'(\\])',
		'([:=])',
		
		//List boundaries
		'(<)',
		'(>)',
		
		//Ellipsis
		'(…)'
	].join('|') + ')')
};


/**
 * Construct a generator for iterating over the tokens
 * @param text {string}  String of text to be tokenized
 * @generator
 */
HPSG.tokenize = function(text){	
	var previous = null;
	var current = null;
	
	//Iterate over all tokens matched by regular expression; 
	let pos = 0;
	while(m = text.substr(pos).match(HPSG.tokenRegExp)){
		let thisPos = pos;
		pos += m[0].length;
		if(m[HPSG.WHITESPACE])
			continue;
		
		//Determine the type, corresponds with the constants above
		let type = HPSG.WHITESPACE+1;
		while(type < m.length && !m[type])
			type++;
		
		//Constuct token object
		let next = {
			type:type,
			value:m[type],
			pos:thisPos,
			previous:previous,
			next:null
		};
		
		//Only yield once we have a lookahead token to include
		if(current){
			current.next = next;
			yield current;
		}
		
		previous = current;
		current = next;
	}
	//The last token isn't yielded in the loop because of including the lookahead
	if(current)
		yield current;
	
	if(pos != text.length)
		throw Error("Unrecognized token at char " + pos + ": " + text.substr(pos));
}




/**
 * Take a string of HPSG and create an XML document out of it, for example:
 * >> @3 V_i2[synsem SYN:[SPR:<>,COMPS:<>],SEM:[INDEX:s,MODE:none,RESTR:<…>]]
 * @param text {string} HPSG text
 */
HPSG.parse = function(text){
	var ns = 'http://weston.ruter.net/ns/hpsg';
	var doc = document.implementation.createDocument('', '', null);
	
	//Iterate over the tokens
	var tok = HPSG.tokenize(text);
	console.info(text)
	var tokens = [];
	var max = 30; //temp
	
	for(var token in tok){
		console.info(token)
		tokens.push(token);
		
		//var nextToken = tok.next(); tok.send(-1);
		//if(token.type == HPSG.AVM_START){
		
		//}
		
		//tok.send(1); //
		
		if(!--max) break; //temp
	}
	
	return text;



	
	for(var token in tokens){
		console.info(token);
	}
	return text;
	


	
	var reTok = new RegExp( '^(?:' + [
		'(\\s+|,)', //1: whitespace
		'([A-Z]+(?!\s*[:=]))', //2: abbr
		'([a-z][0-9]*\\b)', //3: index
		'([0-9]+)', //4: tag
		'(\\[)', //5
		'(\\])', //6
		'([A-Z]+)\\b\s*[:=]', //7 attribute name 
		'(<)', //8
		'(>)', //9
		'(…)', //10
		'(\\b[a-z][a-z]+\\b)' //11 attribute value
	].join('|') + ')');
	
	console.info(text)
	return text;
	
	var index, label, tag, name, value;
	var pos = 0;
	//var tokens = [];
	//var avmStack = [], listStack = [];
	var curParent = doc;
	while(m = reTok.exec(text.substr(pos))){
		//lastIndex = reTok.lastIndex;
		pos += m[0].length;
		
		console.info(m[0])
		
		var isEnd = (pos == text.length);
		//var isTokenEnd = (m[1] || pos == text.length);
		
		//Gather abbr/index/tag
		if(m[2])      abbr = m[2];
		else if(m[3]) index = m[3];
		else if(m[4]) tag = m[4];
		
		//Opening AVM: [ or AVM that doesn't have brackets
		else if(m[5] || isEnd){ //(m[1] || pos == text.length)
			console.warn('(m[5] || isEnd')
			var el = document.createElementNS(ns, 'avm');
			if(abbr) el.setAttribute('abbr', abbr);
			if(index) el.setAttribute('index', index);
			if(tag)   el.setAttribute('tag', tag);
			curParent = curParent.appendChild(el);
			index = abbr = tag = null;
		}
		//AVM attribute name followed by separator (:|=)
		else if(m[7]){
			console.warn('m[7]')
			el = document.createElementNS(ns, 'attr');
			el.setAttribute('name', m[7]);
			curParent = curParent.appendChild(el);
		}
		//Closing AVM: ]
		else if(m[6]){
			console.warn('m[6]', index)
			//Bump up out of attr
			if(curParent.localName == 'attr'){
				if(abbr)
					curParent.appendChild(document.createTextNode(abbr));
				curParent = curParent.parentNode.parentNode;
			}
			else
				curParent = curParent.parentNode; //we're probably in an empty AVM
		}
		
		//Opening list: <
		else if(m[8]){
			console.warn('m[8]')
			var el = document.createElementNS(ns, 'list');
			if(tag) el.setAttribute('tag', tag);
			tag = null;
			curParent = curParent.appendChild(el);
		}
		//Closing list: >
		else if(m[9]){
			console.warn('m[9]')
			curParent = curParent.parentNode;
		}
		//Ellipsis: …
		else if(m[10]){
			console.warn('m[10]')
			el = document.createElementNS(ns, 'ellipsis');
			curParent.appendChild(el);
			//curParent = curParent.parentNode;
			
			
		}
		
		//
		//
		//
		////Token is made!
		//if(m[1] || pos == text.length){
		//	var el;
		//	
		//	//Construct HPSG AVM node
		//	if(label || index || tag){
		//		el = doc.createElementNS(ns, 'avm');
		//		if(abbr)
		//			el.setAttribute('abbr', abbr);
		//		if(index)
		//			el.setAttribute('index', index);
		//		if(tag)
		//			el.setAttribute('tag', tag);
		//		//doc.appendChild(el);
		//		parentNode = el;
		//	}
		//	else {
		//		
		//	}
		//	index = abbr = tag = null;
		//}
	}
	if(pos != text.length){
		throw Error("Unexpected character: " + text.substr(pos));
	}
	//catch parseError!
	
	return doc;
}




/**
 * Convert an HPSG XML document (such as created by HPSG.parse()) and convert it
 * into MathML (or whatever the provided stylesheet generates).
 * @param hpsgDoc {Document} The HPSG XML document which will be transformed
 * @param xsltURL {string}   URL to the XSLT stylesheet, defaulting to hpsg-mathml.xslt in the working directory
 */
HPSG.toMathML = function(hpsgDoc, xsltURL){
	//If xsltURL not provided, construct the likely URL for the XSLT based
	// on the directory where this script was loaded on.
	if(!xsltURL){
		let base = './';
		try {
			let thisScript = document.querySelector('script[src~="hpsg.js"]');
			base = thisScript.src.replace(/hpsg\.js.*/);
		}
		catch(e){}
		xsltURL = base + 'hpsg-mathml.xslt';
	}

	//Get the XSLT document either via XMLHttpRequest or local cache
	var xsltProcessor = new XSLTProcessor();
	if(!HPSG.toMathML.xsltCache[xsltURL]){
		let xhr = new XMLHttpRequest();
		xhr.open("GET", xsltURL, false);
		xhr.send(null);
		if(!xhr.responseXML)
			throw Error("Unable to parse XSLT: " + xsltURL);
		HPSG.toMathML.xsltCache[xsltURL] = xhr.responseXML;
	}
	xsltProcessor.importStylesheet(HPSG.toMathML.xsltCache[xsltURL]);
	
	//Return the transformed document
	return xsltProcessor.transformToDocument(hpsgDoc);
}

/**
 * Store the responseXML documents for each of the XSLT stylesheets utilized
 */
HPSG.toMathML.xsltCache = {};

