/**
 * Syntax Tree Diagrammer
 * Copyright: 2009, Weston Ruter <http://weston.ruter.net/>. GPL license.
 *  
 * GNU General Public License, Free Software Foundation <http://creativecommons.org/licenses/GPL/2.0/>
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *  
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
 */


/**
 * This tree data is displayed in the case that their is no existing user data
 * provided in the URL fragment or in DOM storage.
 */
var defaultTreeData = {
	label:'S[phrase HEAD=@1 VAL=[COMPS=<> SPR=<>]]',
	children:[
		{label:'@2Ni[word HEAD=[noun AGR=@3] VAL=[ COMPS=<> SPR=<> ] ]', children:[
			{label:'They'}
		]},
		{label:'VP[phrase HEAD=@1[verb AGR=@3 VAL=@4[ COMPS=<> SPR=<@2> ]]]', children:[
			{label:'V[word   HEAD=@1[verb AGR=[plural NUM=pl PER=3rd] ]  VAL=@4[ COMPS=<@5>  SPR=<@2> ]  ]', children:[
				{label:'seemed'}
			]},
			{label:'@5A[word HEAD=@7[adj]  VAL=@4[ COMPS=<> SPR=<> ]]', children:[
				{label:'close'}
			]}
		]}
	]
};

var initialTreeData;


/**
 * Initialize the application
 */
jQuery(function(){
	
	//@todo Parse any data located in the URL fragment identifier or DOM storage
	initialTreeData = defaultTreeData;
	
	var $ui = $('#ui');
	$ui.empty();

	//Draw the tree with the initial data
	var tree = new TreeDrawer(
		document.getElementById('treePlaceholder'),
		initialTreeData
	);
	tree.draw();
	
	//Reset button
	$('button[type=reset]').click(function(){
		tree.draw(initialTreeData);
		$ui.empty().append(constructInterfaceFromTreeNode(initialTreeData));
		window.scrollTo(0,0);
	});
	
	//Set up the user interface with the initial data
	$ui.append(constructInterfaceFromTreeNode(initialTreeData));
	
	
	//Redraw the tree when the form fields change
	$('#ui textarea')
		.live('change', function(e){
			var container = tree.svgElement.parentNode;
			container.style.minHeight = tree.svgElement.height.baseVal.value + 'px';
			var data = constructTreeNodeFromInterface($ui.find('>li:first')[0]);
			tree.draw(data);
			container.style.minHeight = '';
			
			//@todo When changing the contents of a node, redraw the actual 
		})
		.live('focus', function(e){
			
		})
		.live('blur', function(e){
			
		});
	
	//$('ui').addEventListener('change', function(e){
	//	var treeContainer = document.getElementById('treeContainer');
	//	treeContainer.style.minHeight = tree.svgElement.height.baseVal.value + 'px';
	//	var data = parseListItemForTreeDrawer($('#ui > li:first')[0]);
	//	tree.draw(data);
	//	treeContainer.style.minHeight = '';
	//}, false);
});


/**
 * Convert HPSG shorthand into XML which can then be transformed using XSLT
 */
function parseTextIntoHPSGXML(text){
	
}



/**
 * Take the tree data and construct a hierarchical list with textareas
 */
function constructInterfaceFromTreeNode(treeNode){
	var li = document.createElement('li');
	var textarea = document.createElement('textarea');
	textarea.value = treeNode.label;
	li.appendChild(textarea);
	if(treeNode.children && treeNode.children.length){
		var ul = document.createElement('ul');
		$(treeNode.children).each(function(){
			ul.appendChild(constructInterfaceFromTreeNode(this));
		});
		li.appendChild(ul);
	}
	return li;
}


/**
 * Parse HTML list item and its nested lists into a data structure
 * acceptable as input for TreeDrawer. First node of an LI element
 * must be a text node, and the child nodes are child elements of a
 * subsequent UL or OL element.
 * @param el {DOMElement}
 * @returns {Object} Input suitable for TreeDrawer data structure
 * @todo Implementation would be much nicer if querySelectorAll had scope
 */
function constructTreeNodeFromInterface(li){
	var node = {
		label:'',
		children:[]
	};
	if(!$(li).is('li'))
		throw Error('Expected a list item (LI) element');
	
	//Get the label
	node.label = $(li).find('>textarea:first').value().replace(/^\s+|\s+$/, '').replace(/\s+/, ' ');
	
	//Get the children
	$(el).find('> ul > li, > ol > li').each(function(){
		node.children.push(parseListItemForTreeDrawer(this));
	});
	
	return node;
}
//function parseListItemForTreeDrawer(el){
//	var node = {
//		label:'',
//		children:[]
//	};
//	if(!$(el).is('li'))
//		throw Error('Expected a list item (LI) element');
//	
//	if(!el.firstChild)
//		return node;
//		
//	//Get the label
//	var labelNode = el.firstChild;
//	while(labelNode){
//		if(labelNode.nodeType == 1/*Element*/){
//			if(/^(ol|ul)$/i.test(labelNode.nodeName))
//				break;
//			if(typeof labelNode.value == 'string')
//				node.label += labelNode.value;
//			else
//				node.label += labelNode.textContent;
//		}
//		else if(labelNode.nodeType == 3/*Text*/){
//			node.label += labelNode.data;
//		}
//		labelNode = labelNode.nextSibling;
//	}
//	node.label = node.label.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
//	
//	//Get the first UL or OL
//	$(el).find('> ul > li, > ol > li').each(function(){
//		node.children.push(parseListItemForTreeDrawer(this));
//	});
//	return node;
//}
