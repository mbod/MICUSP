
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:output method="xml"/>

	<xsl:template match="/">
		<html>
			<head>
				<title>MICUSP</title>
			</head>
			<body>
				<xsl:apply-templates/>
			</body>
		</html>
	</xsl:template>



	<xsl:template match="results">
		<table>
			<thead>
				<tr>
					<th>Paper ID</th>
					<th>Title</th>
					<th>Discipline</th>
					<th>Paper Type</th>
				</tr>
			</thead>
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
		<tr>
			<td><xsl:value-of select="@doc"/></td>
			<td><xsl:value-of select="title"/></td>
			<td><xsl:value-of select="discipline"/></td>
			<td><xsl:value-of select="paperType"/></td>
		</tr>
	</xsl:template>

</xsl:stylesheet>
