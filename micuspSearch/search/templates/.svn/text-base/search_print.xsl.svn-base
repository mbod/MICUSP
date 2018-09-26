
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:output method="xml"/>

	<xsl:template match="/">
		<html>
			<head>
				<title>MICUSP</title>
				<style type="text/css">
					tr.paperhead td { font-weight: bold; padding-top: 12pt;}
					.resultnum { text-align: right; vertical-align: top; padding-right: 12pt; }
				</style>
			</head>
			<body>
				<xsl:apply-templates/>
			</body>
		</html>
	</xsl:template>



	<xsl:template match="results">

		<div>
			Results for: <xsl:value-of select="@q"/> found in <xsl:value-of select="count(.//hit)"/> paragraphs in <xsl:value-of select="count(paper)"/> papers
		</div>

		<table>
			<!--
			<thead>
				<tr>
					<th>Paper ID</th>
					<th>Title</th>
					<th>Discipline</th>
					<th>Paper Type</th>
				</tr>
			</thead>
			-->
			<tbody>
				<xsl:apply-templates select="paper"/>
			</tbody>
		</table>
	</xsl:template>


	<xsl:template match="paper">
		<!--
    			<paper doc="ENG.G0.02.1" num="1">
        			<title>The Vicar of Wakefield as a Failed Morality Story</title>
        			<discipline>English</discipline>
        			<paperType>Argumentative Essay</paperType>
        			<studentLevel>Final Year Undergraduate</studentLevel>
        			<sex>Female</sex>
        			<nativeness>NS</nativeness>
        			<features>Reference to sources</features>
    			</paper>
		-->
		<tr class="paperhead">
			<td><xsl:number/>.</td>
			<td><xsl:value-of select="@doc"/></td>
			<td><xsl:value-of select="@title"/></td>
			<td><xsl:value-of select="@dept"/></td>
			<td><xsl:value-of select="@type"/></td>
		</tr>
		<xsl:apply-templates select="hit"/>
	</xsl:template>

	<xsl:template match="hit">
		<tr>
			<td class="resultnum"><xsl:number format="a"/>.</td>
			<td colspan="4"><xsl:apply-templates/></td>
		</tr>
	</xsl:template>
</xsl:stylesheet>
