
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:output method="text"/>

	<xsl:template match="/">
		<xsl:apply-templates/>
	</xsl:template>



	<xsl:template match="results">
<xsl:text>

Paper ID	Title	Discipline	Paper Type	Student Level	Nativeness	Sex	Features	
</xsl:text>
<xsl:apply-templates select="paper"/>
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
<xsl:text>
</xsl:text>
<xsl:value-of select="@doc"/>
<xsl:text>	</xsl:text>
<xsl:value-of select="title"/>
<xsl:text>	</xsl:text>
<xsl:value-of select="discipline"/>
<xsl:text>	</xsl:text>
<xsl:value-of select="paperType"/>
<xsl:text>	</xsl:text>
<xsl:value-of select="studentLevel"/>
<xsl:text>	</xsl:text>
<xsl:value-of select="nativeness"/>
<xsl:text>	</xsl:text>
<xsl:value-of select="sex"/>
<xsl:text>	</xsl:text>

	</xsl:template>

</xsl:stylesheet>
