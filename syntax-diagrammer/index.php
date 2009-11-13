<!DOCTYPE>
<html>
	<head>
		<meta charset="utf8">
		<title>Syntax Tree Diagrammer with SVG Tree Drawer</title>
		<script src="../svg-tree-drawer.js"></script>
		<link rel="stylesheet" href="style.css" type="text/css" />
	</head>
	<body>
		<hgroup>
			<h2><a href="http://weston.ruter.net/projects/svg-tree-drawer/">SVG Tree Drawer</a>:</h2>
			<h1>Syntax Tree Diagrammer</h1>
			<p>With support for <abbr title="Head-driven phrase structure grammar">HPSG</abbr></p>
		</hgroup>
		
		<!--<p>Explanation: The tree below is constructed via the </p>-->
		
		<div id="treeContainer">
			<p id="treePlaceholder"><em>Loading tree…</em></p>
		</div>
		
		<p>You may modify the tree above by editing the following hierarchical list:</p>
		<!--
		@todo: Upon clicking a node, set the background color of the corresponding node in the tree above.
		Upon editing a node, translate it into HPSG XML, and then run the XSLT transformation on it
		@todo: We need to be able to add new nodes!
		-->
		<ul id="ui">
			<!--<li><textarea>S[phrase HEAD=@1 VAL=[COMPS=&lt;&gt; SPR=&lt;&gt;]]</textarea>-->
			<!--	<ul>-->
			<!--		<li><textarea>@2N[word HEAD=[noun AGR=@3] VAL=[ COMPS=&lt;&gt; SPR=&lt;&gt; ] ]</textarea><ul>-->
			<!--			<li><textarea>They</textarea></li>-->
			<!--		</ul></li>-->
			<!--		<li><textarea>VP[phrase HEAD=@1[verb AGR=@3 VAL=@4[ COMPS=&lt;&gt; SPR=&lt;@2&gt; ]]]</textarea>-->
			<!--			<ul>-->
			<!--				<li><textarea>V[word   HEAD=@1[verb AGR=[plural NUM=pl PER=3rd] ]  VAL=@4[ COMPS=&lt;@5&gt;  SPR=&lt;@2&gt; ]  ]</textarea><ul>-->
			<!--					<li><textarea>seemed</textarea></li>-->
			<!--				</ul></li>-->
			<!--				<li><textarea>@5A[word HEAD=@7[adj]  VAL=@4[ COMPS=&lt;&gt; SPR=&lt;&gt; ]]</textarea>-->
			<!--					<ul>-->
			<!--						<li><textarea>close</textarea></li>-->
			<!--					</ul>-->
			<!--				</li>-->
			<!--			</ul>-->
			<!--		</li>-->
			<!--	</ul>-->
			<!--</li>-->
		</ul>
		<button type="reset">Start Over</button>
		
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.js"></script>
		<script src="helpers.js"></script>
		<script src="main.js"></script>
		<hr>
		<footer>
			<address><a href="http://weston.ruter.net/" rel="author">Weston Ruter</a></address>
			<time pubdate>2009-11-12</time>
		</footer>
	</body>
</html>