/**
 * SVG Tree Drawer
 * by Weston Ruter
 *
 * Initially built for Syntax Tree Diagrammer
 * @todo We need to be able to define different style for the leaf nodes.
 * @todo branchHeight, labelPadding
 * @todo Implement collapsing (triangles) which are toggled by clicking the nodes
 * @todo Work up a condensed datastructure?
 * @todo Stylesheet should be named? Or when we serialize, we can just get all of the rules from all of the stylesheets.
 * @todo Try disabling native support (use the OBJECT); and try forcing Flash to see if it'll work in IE
 * @todo Publicize on MozHacks: SVG + MathML + ContentEditable + hashchange + JSON.parse/stringify
 * @todo extend/retract -- pushing the leaf nodes to the bottom
 * @todo expand/collapse -- on each node, toggling the rectangle?
 */
(function(){
if(typeof TreeDrawer != 'undefined')
	return;

var svgns = 'http://www.w3.org/2000/svg';
var xlinkns = 'http://www.w3.org/1999/xlink';

/**
 * Class that is associated with a given SVG element and contains methods and
 * properties that relate to the tree as a whole.
 */
var T = window.TreeDrawer = function(fallbackElement, treeData){
	if(typeof fallbackElement == 'string')
		fallbackElement = document.getElementById(fallbackElement);
	if(!fallbackElement || !fallbackElement.nodeType == 1)
		throw Error("The param 'fallbackElement' is not valid.");
	this.root = treeData;
	
	var isNativeSVG = !!document.createElementNS(svgns, 'text').getComputedTextLength;
	
	// Create the SVG document
	if(isNativeSVG){
		var svg = document.createElementNS(svgns, 'svg');
		svg.setAttribute('width', 0);
		svg.setAttribute('height', 0);
		fallbackElement.parentNode.replaceChild(svg, fallbackElement);
		this.svgElement = svg;
		
		// Add the stylesheet
		var defs = document.createElementNS(svgns, 'defs');
		var style = document.createElementNS(svgns, 'style');
		style.setAttribute('type', 'text/css');
		//style.appendChild(document.createTextNode(this.cssStylesheet));
		defs.appendChild(style);
		this.svgElement.appendChild(defs);
		style.appendChild(document.createTextNode(this.cssStylesheet))
		//for(var i = 0, len = this.cssStyleRules.length; i < len; i++){
			//style.sheet.insertRule(this.cssStyleRules[i], i);
			//console.info(this.cssStyleRules[i])
		//}
		
		//if(treeData)
		//	this.populate(treeData);
	}
	// Utilize svgweb
	else {
		//if(typeof svgweb == 'undefined')
		throw Error("The SVGWeb implementation is not currently ready.");
		
		var obj = document.createElement('object', true);
		obj.setAttribute('type', 'image/svg+xml');
		//obj.setAttribute('data', 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"></svg>');
		obj.setAttribute('data', 'blank.svg');
		obj.setAttribute('width', 0);
		obj.setAttribute('height', 0);
		this.svgObject = obj;
		var that = this;
		obj.addEventListener('load', function(e){ //TODO: We need to get rid of this async event
			try{
				that.svgDocument = this.contentDocument;
				that.svgElement = that.svgDocument.documentElement;
			
				// Add the stylesheet
				var defs = document.createElementNS(svgns, 'defs');
				var style = document.createElementNS(svgns, 'style');
				style.setAttribute('type', 'text/css');
				style.appendChild(document.createTextNode(that.cssStylesheet));
				
				defs.appendChild(style);
				//that.svgElement.appendChild(defs); //TODO
				
				if(treeData)
					that.populate(treeData);
			}
			catch(e){
				console.error(e)
			}
		}, false);
		svgweb.appendChild(obj, svgContainerElement);
	}
};

T.prototype.svgDocument = null; //readonly (only set when using svgweb)
T.prototype.svgObject = null; //readonly (only set when using svgweb)
T.prototype.svgElement = null; //readonly
//T.prototype.collapsed = false; //readonly
T.prototype.width = 0; //readonly
T.prototype.height = 0; //readonly

//T.prototype.cssStylesheet = 'line, path { dominant-baseline:middle; }';
T.prototype.cssStylesheet = [
	"line, path { stroke-width:1px; stroke:black; }",
	"text { dominant-baseline:text-after-edge !important; }", //TODO: Does not work in WebKit
	//"svg {font-size:20px; }",
	//"svg > g > g > text { font-size:120px; }"
].join("\n");

/**
 * The root TreeDrawer.Node
 */
T.prototype.root = null;


/**
 * Empty the tree
 */
T.prototype.empty = function empty(){
	var svg = this.svgElement;
	//while(svg.firstChild){
	//	svg.parentNode.removeChild(svg.firstChild)
	//}
	for(var i = 0; i < svg.childNodes.length; i++){
		if(svg.childNodes[i].nodeName.toLowerCase() == 'g'){
			svg.removeChild(svg.childNodes[i]);
			i--;
		}
	}
	
	this.width = 0;
	this.height = 0;
	if(this.svgObject){
		this.svgObject.width = this.width;
		this.svgObject.height = this.height;
	}
	else {
		this.svgElement.setAttribute('width', this.width);
		this.svgElement.setAttribute('height', this.height);
	}
}


/**
 * Renders the tree onto the SVG canvas, resizing the canvas as necessary
 * This function does the heavy lifting of the code
 * @param optional treeData The data structure to be drawn; if not specified, uses this.root
 * @see _drawNode()
 */
T.prototype.draw = function draw(treeData){
	this.empty();
	
	//Get the tree data set up
	if(treeData)
		this.root = treeData;
	if(!this.root)
		throw Error("No tree data has been supplied.");
	if(!(this.root instanceof TN))
		this.root = new TN(this.root);
	
	//var fontSize = parseFloat(window.getComputedStyle(this.svgElement, null).fontSize);
	var info = _drawNode(this, this.svgElement, this.root, 0, 0, this.labelPadding, this.branchHeight);
	
	//Fire 'done' event
	
	if(this.svgObject){
		this.svgObject.width = this.width;
		this.svgObject.height = this.height;
	}
	else {
		this.svgElement.setAttribute('width', this.width);
		this.svgElement.setAttribute('height', this.height);
	}
};


//Die for loops, die!
var forEach = Array.forEach || function forEach(object, block, context) {
	for (var i = 0; i < object.length; i++) {
		block.call(context, object[i], i, object);
	}
};


/**
 * Recursive function called by TreeDrawer.draw()
 * @param offsetTop The distance from the top to the bottom of the lower end of the branches
 * @todo In Firefox <3 getBoundingClientRect doesn't include width and height
 * @todo <line> should be <path> instead
 */
function _drawNode(tree, parentElement, treeNode, offsetLeft, offsetTop, inheritedLabelPadding, inheritedBranchHeight){
	// Make container (not really necessary, but aids readibility of DOM)
	// And allows styles to scope rules
	var g = document.createElementNS(svgns, 'g');
	parentElement.appendChild(g);
	
	// Make label
	var isForeignObject;
	var label;
	if(typeof treeNode.label == 'string'){
		label = document.createElementNS(svgns, 'text');
		label.appendChild(document.createTextNode(treeNode.label, true));
		isForeignObject = false;
	}
	else {
		isForeignObject = true;
		label = document.createElementNS(svgns, 'foreignObject');
		// Set width/height to non-zero value so that display isn't disabled;
		// after the label is inserted into the SVG tree, then the offsetHeight
		// and offsetWidth will be used to provide the proper dimensions.
		// This is to facilitate writing CSS style rule selectors.
		//   label.setAttribute('width', treeNode.label.offsetWidth);
		//   label.setAttribute('height', treeNode.label.offsetHeight);
		label.setAttribute('width', 1);
		label.setAttribute('height', 1); 
		label.appendChild(treeNode.label);
	}
	//TODO: Allow this node to be filtered before insertion (i.e. replace with foreignobject)
	g.appendChild(label);
	
	//Create branch which will connect this label with the parent label
	var branch, branchHeight, branchStyle;
	if(parentElement.localName != 'svg'){
		branch = document.createElementNS(svgns, 'line');
		g.appendChild(branch);
		var branchStyle = window.getComputedStyle(branch, null);
		var branchHeight = parseFloat(branchStyle.fontSize);
		offsetTop += branchHeight;
	}
	// Allow this to be filtered
	
	//Get styles and dimensions
	var labelStyle = window.getComputedStyle(label, null);
	var labelFontSize = parseFloat(labelStyle.fontSize);
	var labelPadding = {
		top:parseFloat(labelStyle.paddingTop), //TEMP
		right:parseFloat(labelStyle.paddingRight),
		bottom:parseFloat(labelStyle.paddingBottom),
		left:parseFloat(labelStyle.paddingLeft)
	};
	
	//var labelRect = label.getBoundingClientRect(); //TODO: If doesn't include height, then calculate the height
	//if(!labelRect.width)
	//	labelRect.width = label.getComputedTextLength(); //labelRect.right - labelRect.left;
	//if(!labelRect.height)
	//	labelRect.height = labelFontSize; //labelRect.bottom - labelRect.top;
	var labelRect;
	if(isForeignObject){
		labelRect = {
			width:label.firstChild.offsetWidth,
			height:label.firstChild.offsetHeight
		};
		label.setAttribute('width', labelRect.width);
		label.setAttribute('height', labelRect.height);
	}
	//else if(label.width && label.height){
	//	labelRect = {
	//		width:label.width.baseVal.value,
	//		height:label.height.baseVal.value
	//	};
	//}
	else if(label.getComputedTextLength){
		labelRect = {
			width:label.getComputedTextLength(), //shouldn't this always include labelPadding.left + labelPadding.right ???
			height:labelFontSize
		};
	}
	else {
		throw Error("Unable to determine dimensions for node.");
	}
	var labelWidth = labelRect.width;
	var labelHeight = labelRect.height;
	
	//Process each of the children
	var subtreeElements = [label];
	if(branch)
		subtreeElements.push(branch);
	var childrenWidth = 0;
	var childrenInfo = [];
	for(var i = 0, len = treeNode.children.length; i < len; i++){ //forEach
		var childInfo = _drawNode(
			tree,
			g,
			treeNode.children[i],
			offsetLeft + childrenWidth,
			offsetTop + labelPadding.top
			          + labelHeight
			          + labelPadding.bottom
			          //+ branchHeight //value of child branch's height is added
		);
		childrenWidth += childInfo.width;
		
		forEach(childInfo.subtreeElements, function(el){
			subtreeElements.push(el);
		});
		childrenInfo.push(childInfo);
	}
	
	//Get coordinates for label and position
	var labelY = offsetTop + labelPadding.top;
	if(label.nodeName == 'text')
		labelY += labelFontSize; //labelHeight;
	
	var labelX;
	//If there are children, then x is in the middle of their first and last children
	//TODO: if labelWidth > childrenWidth, we could pass in the labelWidth
	if(childrenInfo.length){
		var firstChildLabel = childrenInfo[0].label;
		var lastChildLabel = childrenInfo[childrenInfo.length-1].label;
		var leftX = parseFloat(firstChildLabel.getAttribute('x')) + (firstChildLabel.width ? firstChildLabel.width.baseVal.value : firstChildLabel.getComputedTextLength())/2;
		var rightX = parseFloat(lastChildLabel.getAttribute('x')) + (lastChildLabel.width  ? lastChildLabel.width.baseVal.value : lastChildLabel.getComputedTextLength())/2;
		labelX = leftX + (rightX - leftX)/2 - labelWidth/2;
		
		//Make sure that parent labels which are wider than their children don't get placed outside of viewbox
		labelX = Math.max(0, labelX, offsetLeft+labelPadding.left);
		
		// If the children were narrower than the the parent label, then distribute
		// the children out under the parent. Requires that all subtree graphic
		// elements to be shifted over to the right
		var labelWidthBeyondChildrenWidth = labelWidth + labelPadding.left + labelPadding.right - childrenWidth;
		if(labelWidthBeyondChildrenWidth > 0){
			var shiftLeft = labelWidthBeyondChildrenWidth/(childrenInfo.length+1);
			forEach(childrenInfo, function(child, i){
				forEach(child.subtreeElements, function(el){
					//try {
						//Text
						if(el.x){
							//el.x.baseVal.getItem(0).value += shiftLeft*(i+1); //) //convertToSpecifiedUnits(5 /*SVG_LENGTHTYPE_PX*/)
							//TODO: WebKit doesn't implement the above, but instead needs the one below
							el.setAttribute('x', el.x.baseVal.getItem(0).value + shiftLeft*(i+1));
							//el.x.baseVal.replaceItem(el.x.baseVal.getItem(0).value + shiftLeft*(i+1), 0);
						}
						//Line
						if(el.x1){
							el.x1.baseVal.value += shiftLeft*(i+1);
						}
						//Line
						if(el.x2){
							el.x2.baseVal.value += shiftLeft*(i+1);
						}
						//Path???
					//}
					//catch(e){
					//	console.error(e)
					//}
				});
			});
		}
	}
	//No children, so left edge is simply offsetLeft
	else {
		labelX = offsetLeft + labelPadding.left;
	}
	label.setAttribute('x', labelX + 'px');
	label.setAttribute('y', labelY + 'px');
	
	var rect = document.createElementNS(svgns, 'rect');
	rect.setAttribute('x', labelX + 'px');
	rect.setAttribute('y', (offsetTop + labelPadding.top) + 'px');
	rect.setAttribute('height', labelHeight + 'px');
	rect.setAttribute('width', labelWidth + 'px');
	rect.setAttribute('style', 'fill:none; stroke:lime; stroke-width:1px;');
	g.appendChild(rect);

	//TEMP: offsetLeft
	//var line = document.createElementNS(svgns, 'line');
	//line.setAttribute('style', 'stroke:red; stroke-width:2px; fill:none;');
	//line.setAttribute('x1', offsetLeft + 'px');
	//line.setAttribute('x2', offsetLeft + 'px');
	//line.setAttribute('y1', offsetTop + labelPadding.left + 'px');
	//line.setAttribute('y2', offsetTop + labelPadding.left + labelHeight + 'px');
	//g.appendChild(line);
	
	
	//Position branch directly above the label
	if(branch){
		branch.setAttribute('x2', labelX + labelWidth/2  + 'px');
		branch.setAttribute('y2', offsetTop + 'px');
	}
	
	//Connect branches from child labels to parent label
	for(var i = 0, len = childrenInfo.length; i < len; i++){
		childrenInfo[i].branch.setAttribute('x1', labelX + labelWidth/2 + 'px');
		childrenInfo[i].branch.setAttribute('y1', offsetTop + labelPadding.top + labelPadding.bottom + labelHeight + 'px');
	}

	//Update the dimensions of the entire "canvas"
	tree.height = Math.max(
		tree.height,
		offsetTop + labelPadding.top + labelHeight + labelPadding.bottom
	);
	tree.width = Math.max(
		tree.width,
		offsetLeft + childrenWidth,
		offsetLeft + labelWidth + labelPadding.left + labelPadding.right,
		labelX + labelWidth + labelPadding.left + labelPadding.right
	);
	
	return {
		label:label,
		branch:branch,
		//containerElement:g,
		subtreeElements:subtreeElements,
		width:Math.max(labelWidth + labelPadding.left + labelPadding.right, childrenWidth)
	};
}


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
	}
};
TN.prototype.label = "";
TN.prototype.collapsed = false;
TN.prototype.extended = false;
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

