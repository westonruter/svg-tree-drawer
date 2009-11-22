/**
 * HPSG Formatting Utilities <http://github.com/westonruter/svg-tree-drawer/>
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

/**
 * Take an HPSG XML document, as is output by convertTextToHPSG() and apply an
 * XSLT stylesheet to it.
 */
function convertHPSGToMathML(hpsg, xslt){
	if(!xslt)
		xslt = 'hpsg-mathml.xslt';

	//Get the xslt
	var xsltProcessor = new XSLTProcessor();
	
	if(!convertHPSGToMathML.xsltCache[xslt]){
		var xhr = new XMLHttpRequest();
		xhr.open("GET", xslt, false);
		xhr.send(null);
		if(!xhr.responseXML)
			throw Error("Unable to load XSLT: " + xslt);
		convertHPSGToMathML.xsltCache[xslt] = xhr.responseXML;
	}
	xsltProcessor.importStylesheet(convertHPSGToMathML.xsltCache[xslt]);

	return xsltProcessor.transformToDocument(hpsg);
}
convertHPSGToMathML.xsltCache = {};


/**
 * This currently only allows a single entity with an abbr, tag, or index
 */
function convertTextToHPSG(text){
	/* Tokens:
	Abbr: [A-Z]+
	Index: [a-z]\d*
	Tag: \d
	Avm: \[\s*(?<type>\w+)?(\s*\w+\s)\s*\]
	List: <…>
	*/
	
	var ns = 'http://weston.ruter.net/ns/hpsg';
	var doc = document.implementation.createDocument('', '', null);
	
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