/**
 * SVG Tree Drawer
 * by Weston Ruter
 *
 * Initially built for Syntax Tree Diagrammer
 * @todo We need to somehow get a stylesheet from the parent document to get imported.
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
	}, false);
	svgweb.appendChild(obj, svgContainerElement);
};

T.prototype.svgObject = null;
T.prototype.collapsed = false;
T.prototype.width = 0;
T.prototype.height = 0;

//These two following should be set with CSS
T.prototype.branchStyle = {
	height:20
};
T.prototype.labelStyle = {
	fontSize:30,
	padding:{
		top:5,
		left:10,
		right:10,
		bottom:10
	}
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
	this.width = 0;
	this.height = 0;
}


/**
 * Renders the tree onto the SVG canvas, resizing the canvas as necessary
 * This function does the heavy lifting of the code
 */
T.prototype.draw = function draw(){
	this.empty();
	var svg = this.svgObject.contentDocument.documentElement;
	
	var info = _drawNode(this, svg, this.root, 0, 0, 0);
	this.svgObject.width = this.width;
	this.svgObject.height = this.height;
};


/**
 * Recursive function called by TreeDrawer.draw()
 * @todo In Firefox <3 getBoundingClientRect doesn't include width and height
 */
function _drawNode(tree, parentElement, treeNode, offsetLeft, offsetTop){
	offsetTop |= 0;
	offsetLeft |= 0;
	
	//Make label
	var label = document.createElementNS(svgns, 'text');
	label.appendChild(document.createTextNode(treeNode.label, true));
	label.setAttribute('style', 'text-anchor:middle; font-size:' + tree.labelStyle.fontSize + 'px;'); //Move to stylesheet?
	
	//Make container (not really necessary, but aids readibility of DOM)
	var g = document.createElementNS(svgns, 'g');
	g.appendChild(label);
	g.appendChild(label);
	parentElement.appendChild(g);
	
	//Create branch which will connect this label with the parent label
	var branch;
	if(parentElement.nodeName != 'svg'){
		branch = document.createElementNS(svgns, 'line');
		branch.setAttribute('style', 'stroke:black; stroke-width:2px;');
		g.appendChild(branch);
	}
	
	//Calculate width of this label
	var labelWidth = label.getComputedTextLength();
	labelWidth += tree.labelStyle.padding.left + tree.labelStyle.padding.right;
	
	//var rect = label.getBoundingClientRect();
	//console.info(rect.height)
	//console.info(label)
	//window.label = label; //TEMP
	//console.info(rect)
	
	//Process each of the children
	var childrenWidth = 0;
	var childrenInfo = [];
	for(var i = 0, len = treeNode.children.length; i < len; i++){
		var childInfo = _drawNode(
			tree,
			g,
			treeNode.children[i],
			offsetLeft+childrenWidth,
			offsetTop + tree.labelStyle.padding.bottom + tree.branchStyle.height + tree.labelStyle.padding.top  + tree.labelStyle.fontSize
		);
		childrenWidth += childInfo.width;
		childrenInfo.push(childInfo);
	}
	
	
	//Position label
	var y = offsetTop + tree.labelStyle.padding.top + tree.labelStyle.fontSize;
	var x;
	if(childrenInfo.length){
		var firstChild = parseFloat(childrenInfo[0].label.getAttribute('x'));
		var lastChild = parseFloat(childrenInfo[childrenInfo.length-1].label.getAttribute('x'));
		x = firstChild + (lastChild - firstChild)/2;
	}
	else {
		x = offsetLeft + labelWidth/2;
	}
	label.setAttribute('x', x + 'px');
	label.setAttribute('y', y + 'px');
	
	
	//Position branch directly above the label
	if(branch){
		branch.setAttribute('x2', label.getAttribute('x'));
		branch.setAttribute('y2', offsetTop + 'px');
	}
	
	//Connect branches from child labels to parent label
	for(var i = 0, len = childrenInfo.length; i < len; i++){
		childrenInfo[i].branch.setAttribute('x1', x + 'px');
		childrenInfo[i].branch.setAttribute('y1', (y + tree.labelStyle.padding.bottom) + 'px');
	}

	
	//Update the dimensions of the entire "canvas"
	tree.height = Math.max(y + tree.labelStyle.padding.bottom, tree.height);
	tree.width = Math.max(offsetLeft + childrenWidth, tree.width);	
	
	return {
		label:label,
		branch:branch,
		width:Math.max(labelWidth, childrenWidth)
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

