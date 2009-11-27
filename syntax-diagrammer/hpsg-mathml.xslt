<?xml version="1.0"?>
<!--
XSLT to Convert HPSG XML into MathML <http://github.com/westonruter/svg-tree-drawer/>
by Weston Ruter <http://weston.ruter.net/>, 2009
License: GPL 3.0 <http://www.gnu.org/licenses/gpl.html>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

@todo: We shouldn't include CSS in here? Provide param to omit. Better to include external file?
-->
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:math="http://www.w3.org/1998/Math/MathML"
	xmlns="http://www.w3.org/1998/Math/MathML"
	xmlns:html="http://www.w3.org/1999/xhtml"
	xmlns:hpsg="http://weston.ruter.net/ns/hpsg">	
	
	<xsl:template name="css">
		<html:style type="text/css">
			<![CDATA[
			math.hpsg {
				font-size:1em;
			}
			math.hpsg .tag {
				display:inline-block;
				text-align:center;
				min-width:1.1em;
				line-height:1em;
				/*max-height:1em;*/
				font-size:1em;
				vertical-align:middle;
				border:solid 1px black;
				color:black;
				/*margin-right:0.25em;*/
				
				vertical-align:bottom;
			}
			math.hpsg .tag > mi {
				font-style:normal;
			}
			math.hpsg menclose.tag + .type {
				
			}
			math.hpsg mi.type {
				font-style:italic;
			}
			math.hpsg .reln{
				font-weight:bold !important;
			}
			math.hpsg munder > mfenced {
				font-size:1em;
			}
			math.hpsg mtd {
				text-align:left;
			}
			math.hpsg .attr-name-RELN > .attr-value {
				font-weight:bold;
			}
			math.hpsg .tag + mi {
				margin-left:0.5ex;
			}
			math.hpsg .abbr {
				font-style:normal;
				/*font-size:larger;*/
			}
			math.hpsg mi.headed {
				font-weight:bold;
				font-style:normal;
			}
			
			math.hpsg mrow.function > msub > mi {
				font-style:normal;
			}
			math.hpsg mrow.function > msub > mi.name {
				font-style:italic;
			}
			
			/*math.hpsg .tag-A, math.hpsg .tag-A ~ * { border-color:blue; color:blue; }
			math.hpsg .tag-B, math.hpsg .tag-B ~ * { border-color:red; color:red; }
			math.hpsg .tag-C, math.hpsg .tag-C ~ * { border-color:green; color:green; }
			math.hpsg .tag-D, math.hpsg .tag-D ~ * { border-color:purple; color:purple; }*/
			
			math.hpsg .tag-1, math.hpsg .tag-A  { border-color:blue; color:blue; }
			math.hpsg .tag-2, math.hpsg .tag-B  { border-color:red; color:red; }
			math.hpsg .tag-3, math.hpsg .tag-C  { border-color:green; color:green; }
			math.hpsg .tag-4, math.hpsg .tag-D  { border-color:purple; color:purple; }
			math.hpsg .tag-5, math.hpsg .tag-E  { border-color:#CC7722; color:#CC7722; }
			math.hpsg .tag-6, math.hpsg .tag-F  { border-color:brown; color:brown; }
			math.hpsg .tag-7, math.hpsg .tag-G  { border-color:#E32636; color:#E32636; }
			math.hpsg .tag-8, math.hpsg .tag-H  { border-color:magenta; color:magenta; }
			math.hpsg .tag-9, math.hpsg .tag-I  { border-color:#EC5800; color:#EC5800; }
			math.hpsg .tag-10 { border-color:#4B5320; color:#4B5320; }
			math.hpsg .tag-11 { border-color:#00008B; color:#00008B; }
			math.hpsg .tag-12 { border-color:#228B22; color:#228B22; }
			math.hpsg .tag-13 { border-color:#00416A; color:#00416A; }
			math.hpsg .tag-14 { border-color:#CF1020; color:#CF1020; }
			math.hpsg .tag-15 { border-color:#FF4500; color:#FF4500; }
			math.hpsg .tag-16 { border-color:#40404F; color:#40404F; }
			
			math.hpsg .index.index-s { background-color:#BCFFA1; }
			math.hpsg .index.index-s0 { background-color:#BCFFA1; }
			math.hpsg .index.index-s1 { background-color:#FFCCD6; }
			math.hpsg .index.index-s2 { background-color:#C7E8FF; }
			math.hpsg .index.index-s3 { background-color:#FFE9B8; }
			math.hpsg .index.index-s4 { background-color:#F8FF99; }
			math.hpsg .index.index-s5 { background-color:#E8C4FF; }
			math.hpsg .index.index-s6 { background-color:#FFD4F4; }
			math.hpsg .index.index-i { background-color:yellow; }
			math.hpsg .index.index-j { background-color:cyan; }
			math.hpsg .index.index-k { background-color:#FFD6FC; }
			math.hpsg .index.index-l { background-color:lime; }
			
			math.hpsg .index { color:black; }
			]]>
		</html:style>
	</xsl:template>
	
	
	<xsl:template match="/">
		<xsl:choose>
			<!-- Root is HPSG element -->
			<xsl:when test="hpsg:*">
				<math display="inline">
					<xsl:attribute name="class">
						hpsg
						<!--<xsl:value-of select=".@id" />-->
					</xsl:attribute>
					
					<xsl:call-template name="css" />
					<mrow><xsl:apply-templates select="hpsg:*" /></mrow>
				</math>
			</xsl:when>
			
			<!-- Root is some element in another namespace, i.e. XHTML -->
			<xsl:otherwise>
				<xsl:apply-templates  />
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	
	
	<!-- The identity template: for non-HPSG-namespaced elements (i.e. XHTML) -->
	<xsl:template match="@*|node()[not(self::hpsg:*)]"><!-- what about PIs? -->
		<!--<xsl:if test="(@id = '_firebugConsole')"><xsl:text>asdas</xsl:text></xsl:if>-->
		<xsl:copy>
			<xsl:for-each select="./@*|./node()">
				<xsl:choose>
					<!-- MathML root -->
					<xsl:when test="self::hpsg:*">
						<math display="inline" class="hpsg">
							<xsl:attribute name="id">
								<xsl:value-of select="@id" />
							</xsl:attribute>
							<mrow><xsl:apply-templates select="self::hpsg:*" /></mrow>
						</math>
					</xsl:when>
					
					<!-- Copy over all source elements -->
					<xsl:otherwise>
						<xsl:apply-templates select="." />
					</xsl:otherwise>
				</xsl:choose>
			</xsl:for-each>
			
			<!-- Add stylesheet to document -->
			<xsl:if test="self::html:head">
				<xsl:call-template name="css" />
			</xsl:if>
		</xsl:copy>
	</xsl:template>
	
	<!-- tag attributes -->
	<xsl:template match="@tag[parent::hpsg:*]">
		<menclose notation="box" class='tag'>
			<xsl:attribute name="class">tag tag-<xsl:value-of select="." /></xsl:attribute>
			<mi><xsl:value-of select="." /></mi>
		</menclose>
	</xsl:template>
	
	<!-- index attributes -->
	<xsl:template match="@index[parent::hpsg:*]">
		<xsl:choose>
			<xsl:when test="string-length(.) > 1">
				<msub>
					<!--substring(string, number, number?)-->
					<xsl:attribute name="class">index index-<xsl:value-of select="." /> index-base-<xsl:value-of select="substring(., 1, 1)" /></xsl:attribute>
					<mi class='base'><xsl:value-of select="substring(., 1, 1)" /></mi>
					<mi><xsl:value-of select="substring(., 2)" /></mi>
				</msub>
			</xsl:when>
			<xsl:otherwise>
				<mi>
					<xsl:attribute name="class">index index-<xsl:value-of select="." /></xsl:attribute>
					<xsl:value-of select="." />
				</mi>
			</xsl:otherwise>
		</xsl:choose>
		
		<!--<mi>-->
		<!--	<xsl:attribute name="class">index index-<xsl:value-of select="." /></xsl:attribute>-->
		<!--	<xsl:choose>-->
		<!--		<xsl:when test="'true'">-->
		<!--			test-->
		<!--		</xsl:when>-->
		<!--		<xsl:otherwise>-->
		<!--			<xsl:value-of select="." />-->
		<!--		</xsl:otherwise>-->
		<!--	</xsl:choose>-->
		<!--</mi>-->
	</xsl:template>
	
	<!-- abbr attributes -->
	<xsl:template match="@abbr[parent::hpsg:*]">
		<mi>
			<xsl:attribute name="class">abbr abbr-<xsl:value-of select="." /></xsl:attribute>
			<xsl:value-of select="." />
		</mi>
	</xsl:template>
	
	
	<!-- type attributes -->
	<xsl:template match="@type[parent::hpsg:*]">
		<mi class='type'>
			<xsl:value-of select="." />
		</mi>
	</xsl:template>
	
	
	<!-- defeasible attributes -->
	<xsl:template match="@defeasible[parent::hpsg:*]">
		<mo class="defeasible">/</mo>
	</xsl:template>
	
	
	<!-- Attribute-Value Matrix -->
	<xsl:template match="hpsg:avm" >
		<mrow>
			<xsl:attribute name="class">
				<xsl:if test="@index">indexed index-<xsl:value-of select="@index" /></xsl:if>
				<xsl:if test="@tag">tagged tag-<xsl:value-of select="@tag" /></xsl:if>
			</xsl:attribute>
			
			<xsl:choose>
				<!--
				If this is an empty element, then we just look at @tag and @index
					- (tag) abbr (index)
					- tag | index
				-->
				<xsl:when test="not(./hpsg:attr) and not(@type)">
					<xsl:choose>
						
						<!-- tag and index and abbr -->
						<xsl:when test="@index and (@abbr or @tag)">
							<msub>
								<mrow>
									<xsl:apply-templates select="@tag" />
									<xsl:apply-templates select="@abbr" />
								</mrow>
								<xsl:apply-templates select="@index" />
							</msub>
						</xsl:when>
						
						<!-- only index -->
						<xsl:when test="@index">
							<xsl:apply-templates select="@index" />
						</xsl:when>
						
						<!-- abbr or tag -->
						<xsl:otherwise>
							<xsl:apply-templates select="@tag" />
							<xsl:apply-templates select="@abbr" />
						</xsl:otherwise>
						
					</xsl:choose>
				</xsl:when>
				
				
				<!--
				Still don't need brackets
					- (tag) type (index)
				-->
				<xsl:when test="not(./hpsg:attr) and @type and not(@abbr)">
					<xsl:choose>
						<!-- has index (subscript) -->
						<xsl:when test="@index">
							<msub>
								<mrow>
									<xsl:apply-templates select="@tag" />
									<xsl:apply-templates select="@type" />
								</mrow>
								<xsl:apply-templates select="@index" />
							</msub>
						</xsl:when>
						
						<!-- no index (no subscript needed) -->
						<xsl:otherwise>
							<xsl:apply-templates select="@tag" />
							<xsl:apply-templates select="@type" />
						</xsl:otherwise>
					</xsl:choose>
				</xsl:when>
				
				
				<!--
				Otherwise we need to attach @index and @tag to the abbr and type
					- (tag) abbr (index) [ type ]
					- (tag) abbr (index) [ attrs ]
				-->
				<xsl:when test="@abbr and (@type or ./hpsg:attr)">
					
					
					
					
					<munder>
						<mrow>
							<xsl:choose>
								<!-- has index (subscript) -->
								<xsl:when test="@index">
									<msub>
										<mrow>
											<xsl:apply-templates select="@tag" />
											<xsl:apply-templates select="@abbr" />
										</mrow>
										<xsl:apply-templates select="@index" />
									</msub>
								</xsl:when>
								
								<!-- no index (no subscript needed) -->
								<xsl:otherwise>
									<xsl:apply-templates select="@tag" />
									<xsl:apply-templates select="@abbr" />
								</xsl:otherwise>
							</xsl:choose>
						</mrow>
						
						<!-- now put what is under -->
						<mfenced open="[" close="]">
							<mtable>
								<xsl:if test="@type">
									<mtr>
										<mtd><xsl:apply-templates select="@type" /></mtd>
									</mtr>
								</xsl:if>
								<xsl:apply-templates select="hpsg:attr" />
							</mtable>
						</mfenced>
					</munder>
				</xsl:when>
				
				
				<!--
				Otherwise we need to attach @index and @tag to whatever's inside
					- (tag) [ attrs... INDEX ] (index?)
				-->
				<xsl:when test="./hpsg:attr">
					<xsl:apply-templates select="@tag" />
					
					<mfenced open="[" close="]">
						<mtable>
							<xsl:if test="@type">
								<mtr>
									<mtd columnspan="2"><xsl:apply-templates select="@type" /></mtd>
								</mtr>
							</xsl:if>
							<xsl:apply-templates select="hpsg:attr" />
						</mtable>
					</mfenced>
					
				</xsl:when>
				
				
				<xsl:otherwise>
					<mtext style="color:red">Unexpected condition!</mtext>
				</xsl:otherwise>
			</xsl:choose>
		</mrow>
	</xsl:template>
	
	
	
	<!-- avm > attr -->
	<xsl:template match="hpsg:attr[parent::hpsg:avm]" >
		<mtr>
			<xsl:attribute name="class">
				<!--<xsl:if test="@index">indexed index-<xsl:value-of select="@index" /></xsl:if>-->
				<!--<xsl:if test="@tag">tagged tag-<xsl:value-of select="@tag" /></xsl:if>-->
				attr-name-<xsl:value-of select="@name" />
			</xsl:attribute>
			
			<mtd class='attr-name'>
				<mi><xsl:value-of select="@name" /></mi>
			</mtd>
			<mtd>
				<xsl:attribute name="class">
					attr-value
					<xsl:if test="@index">indexed index-<xsl:value-of select="@index" /></xsl:if>
					<xsl:if test="@tag">tagged tag-<xsl:value-of select="@tag" /></xsl:if>
				</xsl:attribute>
				<mrow>
					<!-- @todo:
					How do we capture the difference between @A and @A<>?
					both are represented as <list tag="A" />
					-->
					<xsl:apply-templates select="@tag" /><!-- @todo -->
					<xsl:apply-templates select="@index" />
					<xsl:apply-templates select="@defeasible" />
					
					<xsl:choose>
						<xsl:when test="not(./*)">
							<mi><xsl:value-of select="./text()" /></mi>
						</xsl:when>
						<xsl:otherwise>
							<xsl:apply-templates select="./*" />
						</xsl:otherwise>
					</xsl:choose>
				</mrow>
			</mtd>
		</mtr>
		
		<!--<xsl:apply-templates select="@tag" />-->
		<!--<mfenced open='〈' close='〉' separators=",">-->
		<!--	<xsl:apply-templates select="*" />-->
		<!--</mfenced>-->
	</xsl:template>
	
	
	
	<!-- list -->
	<xsl:template match="hpsg:list" >
		<mrow>
			<xsl:attribute name="class">
				attr-value
				<xsl:if test="@index">indexed index-<xsl:value-of select="@index" /></xsl:if>
				<xsl:if test="@tag">tagged tag-<xsl:value-of select="@tag" /></xsl:if>
			</xsl:attribute>
			<xsl:apply-templates select="@tag" />
			<!--<xsl:apply-templates select="@index" />-->
			<xsl:if test="./* or not(@tag)">
				<mfenced open='⟨' close='⟩' separators=",">
					<xsl:apply-templates select="*" />
				</mfenced>
			</xsl:if>
		</mrow>
	</xsl:template>
		
	
	<!-- sum -->
	<xsl:template match="hpsg:sum" >
		<xsl:apply-templates select="@tag" />
		<xsl:if test="./* or not(@tag)">
			<mfenced open='' close='' separators="⊕">
				<xsl:apply-templates select="*" />
			</mfenced>
		</xsl:if>
	</xsl:template>
		
	
	<!-- disjunction -->
	<xsl:template match="hpsg:switch" >
		<mfenced open='' close='' separators="|">
			<xsl:apply-templates select="*" />
		</mfenced>
	</xsl:template>
		
	
	<!-- ellipsis -->
	<xsl:template match="hpsg:ellipsis" >
		<mi class='ellipsis'>…</mi>
	</xsl:template>
	
	
	<!-- rule -->
	<xsl:template match="hpsg:rule" >
		<mrow>
			<xsl:apply-templates select="*[position() = 1]" />
			<mo>→</mo>
			<mfenced open='' close='' separators="&#x205F;">
				<xsl:for-each select="*[position() != 1]">
					<mrow>
						<xsl:if test="@headed">
							<mi class="headed">H</mi>
						</xsl:if>
						<xsl:apply-templates select="." />
					</mrow>
				</xsl:for-each>
			</mfenced>
		</mrow>
	</xsl:template>
		
		
	
	<!-- optional -->
	<xsl:template match="hpsg:optional" >
		<xsl:apply-templates select="@tag" />
		<mfenced open='&#xFD3E;' close='&#xFD3F;' separators="|">
			<!--<mrow>-->
				<xsl:apply-templates select="*" />
			<!--</mrow>-->
		</mfenced>
	</xsl:template>
		
		
		
	<!-- word -->
	<xsl:template match="hpsg:word">
		<xsl:apply-templates select="@tag" />
		<xsl:if test="./* or not(@tag)">
			<mtext class='word'><xsl:value-of select="." /></mtext>
		</xsl:if>
	</xsl:template>
		
		
		
	<!-- function -->
	<xsl:template match="hpsg:function">
		<mrow class="function">
			<msub>
				<mi>F</mi>
				<mi class='name'><xsl:value-of select="@name" /></mi>
			</msub>
			<mfenced open="(" close=")">
				<xsl:apply-templates select="*" />
			</mfenced>
		</mrow>
	</xsl:template>

</xsl:stylesheet>