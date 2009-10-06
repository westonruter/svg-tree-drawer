/**
 * SVG Tree Drawer
 * by Weston Ruter
 *
 * Initially built for Syntax Tree Diagrammer
 */
(function(){
if(typeof TreeDrawer != 'undefined')
	return;
if(typeof svgweb == 'undefined')
	throw Error("Requires the use of svgweb");

/**
 * Class that is associated with a given SVG element and contains methods and
 * properties that relate to the tree as a whole.
 */
var T = window.TreeDrawer = function(svgContainerElement, treeData, options){
	if(!options)
		options = {};
	
	if(typeof svgContainerElement == 'string')
		svgContainerElement = document.getElementById(svgContainerElement);
	if(!svgContainerElement || !svgContainerElement.nodeType == 1)
		throw Error("The param 'svgContainerElement' is not valid.");
	
	//if(options.padding)
	//	s.padding = 10;
	
	// Create the SVG document
	var obj = document.createElement('object', true);
	obj.setAttribute('type', 'image/svg+xml');
	obj.setAttribute('data', 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"></svg>');
	obj.setAttribute('width', 0);
	obj.setAttribute('height', 0);
	this.svgObject = obj;
	var that = this;
	obj.addEventListener('load', function(e){
		if(treeData)
			that.populate(treeData);
		
		//obj.width = 100;
		//obj.height = 100;
		//var circle = document.createElementNS(svgns, 'circle');
		//circle.setAttribute('cx', 50);
		//circle.setAttribute('cy', 50);
		//circle.setAttribute('r', 50);
		//circle.setAttribute('fill', 'red');
		//obj.contentDocument.documentElement.appendChild(circle);
		
	}, false);
	svgweb.appendChild(obj, svgContainerElement);

	//obj.setAttribute('data', 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"></svg>');
	
	
};

T.prototype.svgObject = null;
T.prototype.collapsed = false;

//These two following should be set with CSS
T.prototype.branchStyle = {
	height:30
};
T.prototype.labelStyle = {
	fontSize:20,
	padding:10
};


/**
 * The root TreeDrawer.Node
 */
T.prototype.root = null;


/**
 * Empty the tree
 */
T.prototype.empty = function empty(){
	var svg = this.svgObject.contentDocument.documentElement;
	for(var i = 0; i < svg.childNodes.length; i++){
		if(svg.childNodes[i].nodeName.toLowerCase() == 'g'){
			svg.removeChild(svg.childNodes[i]);
			i--;
		}
	}
}


/**
 * Renders the tree onto the SVG canvas, resizing the canvas as necessary
 * This function does the heavy lifting of the code
 */
T.prototype.draw = function draw(){
	this.empty();
	var svg = this.svgObject.contentDocument.documentElement;
	var info = _drawNode(this, svg, this.root, 0, 0, 0);
	this.svgObject.width = info.width;
	this.svgObject.height = this.labelStyle.fontSize;
	console.info(info)
};


/**
 * Recursive function called by TreeDrawer.draw()
 */
function _drawNode(tree, parentElement, treeNode, offsetLeft, offsetTop, parentWidth){
	
	var g = document.createElementNS(svgns, 'g');
	var label = document.createElementNS(svgns, 'text');
	label.appendChild(document.createTextNode(treeNode.label, true));
	label.style.fontSize = tree.labelStyle.fontSize + 'px';
	g.appendChild(label);
	label.setAttribute('y', tree.labelStyle.fontSize);
	
	var branch;
	if(parentElement.nodeName != 'svg'){
		branch = document.createElementNS(svgns, 'line');
		g.appendChild(branch);
	}
	
	parentElement.appendChild(g);
	//console.info(label.getComputedTextLength())
	
	
	
	//console.info(parentElement, treeNode, g)
	return {
		label:label,
		branch:branch,
		width:label.getComputedTextLength()
	};
}


/**
 * Populate the SVG tree with data, overriding the existing data
 * @param {object} treeData  A instance of TreeDrawer.Node
 */
T.prototype.populate = function populate(treeNode){
	if(treeNode instanceof TN)
		this.root = treeNode;
	else
		this.root = new TN(treeNode);
	this.draw();
};


/**
 * Class that represents a node in a tree
 */
var TN = T.Node = function(obj){
	this.label = obj.label;
	this.collapsed = !!obj.collapsed;
	if(obj.children && obj.children.length){
		this.children = [];
		for(var i = 0, len = obj.children.length; i < len; i++){
			this.children.push(new TN(obj.children[i]));
		}
		//console.info(this.children)
	}
};
TN.prototype.label = "";
TN.prototype.collapsed = false;
TN.prototype.children = [];


/**
 * If the node is collapsed, then expand it and draw.
 */
TN.prototype.expand = function expand(){
	if(!this.collapsed)
		return;
	this.collapsed = false;
	this.draw();
};


/**
 * If the node is expanded, then collapse it and draw.
 */
TN.prototype.collapse = function collapse(){
	if(this.collapsed)
		return;
	this.collapsed = true;
	this.draw();
};



/*
1. Convert SVG to Canvas via standard canvas API informed by positions and dimensions 
   available from SVG? Note Canvas has a measureText() method. 
   http://uupaa-js-spinoff.googlecode.com/svn/trunk/uupaa-excanvas.js/demo/8_2_canvas_measureText.html
2. Do SVG and the have a button to export to Canvas, which will iterate over all of the
   elements in the SVG document and draw them onto a corresponding canvas element.


 
 
NOTE: Must be valid JSON, otherwise someone could inject some bad JavaScript in a bad URL
QUESTION: Can we do Packer without the self-extraction code included? We can do a JavaScript implementation of GZip and then store result in hash after Base64


*/

})();

