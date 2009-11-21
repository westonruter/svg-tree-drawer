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
	var parentNode = doc;
	
	var reTok = new RegExp( [
		'(\\s+)', //1: whitespace
		'([A-Z]+)', //2: abbr
		'([a-z][0-9]*)', //3: index
		'([0-9]+)' //4: tag
		//…
	].join('|'), 'g');
	
	var index;
	var abbr;
	var tag;
	var lastIndex = 0;
	while(m = reTok.exec(text)){
		lastIndex = reTok.lastIndex;
		
		if(m[2])      abbr = m[2];
		else if(m[3]) index = m[3];
		else if(m[4]) tag = m[4];
		
		//Token is made!
		if(m[1] || lastIndex == text.length){
			var el;
			
			//Construct HPSG AVM node
			if(abbr || index || tag){
				el = doc.createElementNS(ns, 'avm');
				if(abbr)
					el.setAttribute('abbr', abbr);
				if(index)
					el.setAttribute('index', index);
				if(tag)
					el.setAttribute('tag', tag);
				doc.appendChild(el);
			}
			
			index = abbr = tag = null;
		}
	}
	if(lastIndex != text.length)
		throw Error("Unexpected character: " + text.substr(lastIndex));
	//catch parseError!
	
	
	return doc;
}