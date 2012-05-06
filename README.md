<h1>SVG Tree Drawer</h1>

<p>This project provides a JavaScript library for constructing interactive SVG images of tree structures. This is useful in depicting parse trees as are common in linguistics and computer science. The library provides hooks for toggling the collapsing or extending branches in the tree.</p>

<h2>Background</h2>

<p>The first iteration of this project I developed back in 2004, and the <a href="http://westonruter.github.com/svg-tree-drawer/old/">old project page</a> with original demos is still available. In Autumn 2009 I took an online <a title="Linguistics 566: Introduction to Syntax for Computational Linguistics" href="http://courses.washington.edu/ling566/">syntax course</a> through the University of Washington's <a href="http://www.compling.uw.edu/"><abbr title="Professional Master's in Computational Linguistics">CLMA</abbr></a> program, and this course required a lot of tree drawing. Having previously created an SVG tree drawer, I wanted to do my course work using a browser-based technology instead of using LaTeX. However, since the course was about <abbr title="Head-driven Phrase Structure Grammar">HPSG</a>, each node in the tree was not a simple label as I had been used to, but rather a complex attribute-value matrix (AVM). So I set out to rewrite my SVG tree drawer to bring it up to date and to allow arbitrary content in each of the nodes so that I could use MathML to render the AVMs.</p>

<h2>Examples</h2>

<p>The following screenshots link to interactive SVG images of the examples:</p>

<h3><a href="http://westonruter.github.com/svg-tree-drawer/example.html">Simple tree: “The boy plays with the ball.”</a></h3>
<p><a href="http://westonruter.github.com/svg-tree-drawer/example.html"><img src="http://westonruter.github.com/svg-tree-drawer/example.png" alt="Tree of “The boy plays with the ball.”"></a></p>

<h3><a href="http://westonruter.github.com/svg-tree-drawer/syntax-diagrammer/example-tree-with-avms.xhtml">Tree with AVMs: “They seemed close to me.”</a></h3>
<p><a href="http://westonruter.github.com/svg-tree-drawer/syntax-diagrammer/example-tree-with-avms.xhtml"><img src="http://westonruter.github.com/svg-tree-drawer/syntax-diagrammer/example-tree-with-avms.png" alt="Parse tree with AVMs for “They seemed close to me.”"></a></p>

<h2>Credits</h2>

<p>Developed by <a href="http://westonruter.github.com/" rel="author">Weston Ruter</a> (<a href="https://twitter.com/westonruter">@westonruter</a>). Code licensed <a href="http://www.gnu.org/licenses/gpl.html" rel="license">GPL</a></p>
