<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"><xsl:output method="text"/><xsl:param name="metadata">yes</xsl:param><xsl:param name="body_only">yes</xsl:param><xsl:strip-space elements="*"/><xsl:template match="TEI.2"><xsl:apply-templates select="teiHeader"/><xsl:choose><xsl:when test="$body_only='yes'"><xsl:apply-templates select="text/body/div[@type='main']"/></xsl:when><xsl:otherwise><xsl:apply-templates select="text"/></xsl:otherwise></xsl:choose></xsl:template><xsl:template match="teiHeader"><xsl:choose><xsl:when test="$metadata='yes'"><xsl:variable name="native"><xsl:choose><xsl:when test="contains(.//profileDesc//person/firstLang,'English')">NS</xsl:when><xsl:otherwise>NNS</xsl:otherwise></xsl:choose></xsl:variable>
&lt;header sex="<xsl:value-of select="translate(.//profileDesc//person/@sex,'mf','MF')"/>" nativeSpeaker="<xsl:value-of select="$native"/>"&gt;             
            </xsl:when></xsl:choose></xsl:template>
   <!-- 
    <xsl:template match="div[@type='closer']"/>
    --><xsl:template match="p|head|listBibl|div[@type='footnotes']"><xsl:text>
    
</xsl:text><xsl:apply-templates/></xsl:template><xsl:template match="q|soCalled|quote|cquote|squote"><xsl:text>'</xsl:text><xsl:apply-templates/><xsl:text>'</xsl:text></xsl:template><xsl:template match="bibl|note[@type='footnote']"><xsl:text>
</xsl:text><xsl:apply-templates/></xsl:template></xsl:stylesheet>