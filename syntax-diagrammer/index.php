<!DOCTYPE>
<html>
	<head>
		<meta charset="utf8">
		<title>HPSG Diagrammer with SVG Tree Drawer</title>
		<script src="../svg-tree-drawer.js"></script>
		<link rel="stylesheet" href="style.css" type="text/css" />
	</head>
	<body>
		<hgroup>
			<h2><a href="http://weston.ruter.net/projects/svg-tree-drawer/">SVG Tree Drawer</a>:</h2>
			<h1>Syntax Diagrammer</h1>
			<p>With support for <abbr title="Head-driven phrase structure grammar">HPSG</abbr></p>
		</hgroup>
		
		<!--<p>Explanation: The tree below is constructed via the </p>-->
		
		<div id="treeContainer">
			<p id="treePlaceholder"><em>Loading tree…</em></p>
		</div>
		
		<script>
		/**
		 * Take a DOM element and its children and convert it into a data
		 * structure acceptable as input for TreeDrawer. Usually the DOM element
		 * will be a hierarchical UL or an OL, but any DOM tree is acceptable as
		 * long as its first node is text, and it optionally is followed by
		 * further elements which serve as child nodes.
		 * @param el {DOMElement}
		 * @returns {Object} Input suitable for TreeDrawer data structure
		 */
		//parseDomTreeForTreeDrawer
		
		/**
		 * Parse HTML list item and its nested lists into a data structure
		 * acceptable as input for TreeDrawer. First node of an LI element
		 * must be a text node, and the child nodes are child elements of a
		 * subsequent UL or OL element.
		 * @param el {DOMElement}
		 * @returns {Object} Input suitable for TreeDrawer data structure
		 * @todo Implementation would be much nicer if querySelectorAll had scope
		 */
		function parseListItemForTreeDrawer(el){
			var node = {
				label:'',
				children:[]
			};
			if(el.nodeName.toLowerCase() != 'li')
				throw Error('Expected a list item (LI) element');
			
			if(!el.firstChild)
				return node;
				
			//Get the label
			var labelNode = el.firstChild;
			while(labelNode){
				if(labelNode.nodeType == 1/*Element*/){
					if(/^(ol|ul)$/i.test(labelNode.nodeName))
						break;
					if(typeof labelNode.value == 'string')
						node.label += labelNode.value;
					else
						node.label += labelNode.textContent;
				}
				else if(labelNode.nodeType == 3/*Text*/){
					node.label += labelNode.data;
				}
				labelNode = labelNode.nextSibling;
			}
			node.label = node.label.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
			
			//Get the first UL or OL
			var list = el.firstChild;
			while(list = list.nextSibling){
				if(list.nodeType == 1/*Element*/ && /^(ol|ul)$/i.test(list.nodeName)){
					var li = list.firstChild;
					while(li){
						if(li.nodeType == 1/*Element*/ && li.nodeName.toLowerCase() == 'li'){
							node.children.push(parseListItemForTreeDrawer(li));
						}
						li = li.nextSibling;
					}
					break;
				}
			}
			return node;
		}
		//NOTE: We could do tags like
		// @1[ no]
		</script>
		
		<p>You may modify the tree above by editing the following hierarchical list:</p>
		<!--
		@todo: Upon clicking a node, set the background color of the corresponding node in the tree above.
		Upon editing a node, translate it into HPSG XML, and then run the XSLT transformation on it
		@todo: We need to be able to add new nodes!
		-->
		<ul id="ui">
			<li><textarea>S[phrase HEAD=@1 VAL=[COMPS=&lt;&gt; SPR=&lt;&gt;]]</textarea>
				<ul>
					<li><textarea>@2N[word HEAD=[noun AGR=@3] VAL=[ COMPS=&lt;&gt; SPR=&lt;&gt; ] ]</textarea><ul>
						<li><textarea>They</textarea></li>
					</ul></li>
					<li><textarea>VP[phrase HEAD=@1[verb AGR=@3 VAL=@4[ COMPS=&lt;&gt; SPR=&lt;@2&gt; ]]]</textarea>
						<ul>
							<li><textarea>V[word   HEAD=@1[verb AGR=[plural NUM=pl PER=3rd] ]  VAL=@4[ COMPS=&lt;@5&gt;  SPR=&lt;@2&gt; ]  ]</textarea><ul>
								<li><textarea>seemed</textarea></li>
							</ul></li>
							<li><textarea>@5A[word HEAD=@7[adj]  VAL=@4[ COMPS=&lt;&gt; SPR=&lt;&gt; ]]</textarea>
								<ul>
									<li><textarea>close</textarea></li>
								</ul>
							</li>
						</ul>
					</li>
				</ul>
			</li>
		</ul>
		<script>
		var data = parseListItemForTreeDrawer(document.querySelector('#ui > li'));
		//data.extended = true;
		
		var tree = new TreeDrawer(
			document.getElementById('treePlaceholder'),
			data
		);
		tree.draw();
		
		//Redraw the tree when the form fields change
		document.getElementById('ui').addEventListener('change', function(e){
			var treeContainer = document.getElementById('treeContainer');
			treeContainer.style.minHeight = tree.svgElement.height.baseVal.value + 'px';
			var data = parseListItemForTreeDrawer(document.querySelector('#parseTreeList > li'));
			tree.draw(data);
			treeContainer.style.minHeight = '';
		}, false);
		
		//parseDomTreeForTreeDrawer(document.getElementById('parseTreeList').getElementsByTagName('li')[0]);
		
		//The “indent” and “outdent” execCommand will actually indent the entire
		//contenteditable region! Workaround: check to make sure your selection is not
		//directly parented by your edit region before executing this command. For the
		//moment the following is working for me: Before an indent/outdent, I
		//execCommand(“formatblock”, null, “p”) if there was no good parent already, in
		//order to wrap the current selection or back in a <p>.
		
		
		</script>
		<!-- @todo: Make the  -->
		
		<hr>
		<footer>
			<address><a href="http://weston.ruter.net/" rel="author">Weston Ruter</a></address>
			<time pubdate>2009-11-12</time>
		</footer>
	</body>
</html>