<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:exist="http://exist.sourceforge.net/NS/exist" version="1.0"><xsl:param name="term"/><xsl:variable name="upper">ABCDEFGHIJKLMNOPQRSTUVWXYZ</xsl:variable><xsl:variable name="lower">abcdefghijklmnopqrstuvwxyz</xsl:variable><xsl:template match="/"><div><div id="header"><table class="titleTable"><tbody><tr><td class="bar paperID"><xsl:value-of select="//teiHeader//idno"/></td><td colspan="3" class="bar"><xsl:value-of select="//teiHeader//title"/></td><td class="pdf-link"><a href="/search/viewPaper/{//teiHeader//idno}.pdf" target="_pdf">| View original paper (PDF)</a></td></tr></tbody></table><table id="paperDataTable"><tbody><tr class="odd"><td class="label">Discipline:</td><td class="values"><xsl:call-template name="discipline"><xsl:with-param name="disciplineCode" select="substring-before(//teiHeader//textClass/catRef/@target,' ')"/></xsl:call-template></td></tr><tr><td class="label">Student Level:</td><td class="values"><xsl:call-template name="studentLevel"><xsl:with-param name="level" select="substring-before(substring-after(//teiHeader//textClass/catRef/@target,' '),' ')"/></xsl:call-template></td></tr><tr class="odd"><td class="label">Sex:</td><td class="values"><xsl:variable name="sex" select="//teiHeader//profileDesc//person/@sex"/><xsl:choose><xsl:when test="$sex='f'">Female</xsl:when><xsl:when test="$sex='m'">Male</xsl:when></xsl:choose></td></tr><tr><td class="label">Native speaker status:</td><td class="values"><xsl:variable name="firstLang" select="//teiHeader//profileDesc//person/firstLang"/><xsl:choose><xsl:when test="contains(translate($firstLang,$upper,$lower),'english')">NS</xsl:when><xsl:otherwise>NNS (L1: <xsl:value-of select="$firstLang"/>)</xsl:otherwise></xsl:choose></td></tr><tr class="odd"><td class="label">Paper type:</td><td class="values"><xsl:call-template name="paperType"><xsl:with-param name="ptype" select="substring-before(substring-after(substring-after(//teiHeader//textClass/catRef/@target,' '),' '),' ')"/></xsl:call-template></td></tr><tr><td class="label">Paper contains following features:</td><td class="values"><xsl:for-each select="//teiHeader//textClass//feature"><xsl:value-of select="@type"/><xsl:if test="not(position()=last())"><xsl:text>, </xsl:text></xsl:if></xsl:for-each></td></tr><tr class="odd"><td class="label">Word count:</td><td class="values"><xsl:value-of select="//teiHeader//wordcount/@body"/>
                                (<xsl:value-of select="//teiHeader//wordcount/text()"/> including notes and references)
                            </td></tr></tbody></table><div id="wordle"><span class="wordleCloud"><img src="../img/wordle/{//teiHeader//idno}small.png" id="wordleImage" alt="Click to view larger version of this image"/></span></div></div><div id="text"><xsl:apply-templates select="//text/*"/></div></div></xsl:template><xsl:template match="body" mode="outline"><ul><xsl:apply-templates select="*" mode="outline"/></ul></xsl:template><xsl:template match="*" mode="outline"><xsl:choose><xsl:when test="ancestor::p"/><xsl:otherwise><li><span onclick="highlight('{generate-id()}')"><xsl:value-of select="name()"/></span><ul><xsl:apply-templates select="*" mode="outline"/></ul></li></xsl:otherwise></xsl:choose></xsl:template><xsl:template match="*"><xsl:copy>
            <!--
            <xsl:attribute name="id">
                <xsl:value-of select="generate-id()"/>
            </xsl:attribute>
            --><xsl:if test="@hit"><xsl:attribute name="class">hit</xsl:attribute></xsl:if><xsl:apply-templates/></xsl:copy></xsl:template><xsl:template match="div[@type='opener']/head"><div class="paper_title"><xsl:apply-templates/></div></xsl:template><xsl:template match="div[@type='opener']/div[@type='abstract']"><div class="abstract"><xsl:apply-templates/></div></xsl:template><xsl:template match="div[@type='main']"><div class="dynacloud"><xsl:apply-templates/></div></xsl:template><xsl:template match="div[@type='main']//head"><div class="{parent::div/@type}">
            <!--
            <xsl:attribute name="id">
                <xsl:value-of select="generate-id()"/>
            </xsl:attribute>
            --><xsl:apply-templates/></div></xsl:template><xsl:template match="div[@type='closer']//head"><div class="head_1"><xsl:apply-templates/></div></xsl:template><xsl:template match="listBibl"><ul><xsl:attribute name="id"><xsl:value-of select="generate-id()"/></xsl:attribute><xsl:apply-templates/></ul></xsl:template><xsl:template match="bibl"><li><xsl:attribute name="id"><xsl:value-of select="generate-id()"/></xsl:attribute><xsl:if test="@hit"><xsl:attribute name="class">hit</xsl:attribute></xsl:if><xsl:apply-templates/></li></xsl:template><xsl:template match="soCalled"><xsl:text>'</xsl:text><xsl:apply-templates/><xsl:text>'</xsl:text></xsl:template><xsl:template match="lb"><br/></xsl:template>
    
    <!-- footnotes --><xsl:template match="note"><div id="{@id}"><xsl:if test="@hit"><xsl:attribute name="class">hit</xsl:attribute></xsl:if><a href="#fnref_{@id}"><xsl:number/>.</a><xsl:text> </xsl:text><xsl:apply-templates/></div></xsl:template><xsl:template match="ptr"><a id="fnref_{@target}" href="#{@target}" class="fnref"><xsl:value-of select="substring-after(@target,'fn')"/></a></xsl:template><xsl:template match="div[@type='footnotes']"><div class="footnotes"><xsl:apply-templates/></div></xsl:template>
    
    <!-- gap tags --><xsl:template match="gap"><div class="gap"><xsl:call-template name="map_gap_desc"><xsl:with-param name="desc"><xsl:value-of select="@desc"/></xsl:with-param></xsl:call-template>
            
            here
        </div></xsl:template>
    

    <!-- *************
        MAPPING TEMPLATES
         *************  --><xsl:template name="paperType"><xsl:param name="ptype"/><xsl:value-of select="$ptype"/></xsl:template><xsl:template name="studentLevel"><xsl:param name="level"/><xsl:choose><xsl:when test="$level='G0'">Final Year Undergraduate</xsl:when><xsl:when test="$level='G1'">First Year Graduate</xsl:when><xsl:when test="$level='G2'">Second Year Graduate</xsl:when><xsl:when test="$level='G3'">Third Year Graduate</xsl:when></xsl:choose></xsl:template><xsl:template name="discipline"><xsl:param name="disciplineCode"/><xsl:value-of select="//TEI.2/teiHeader//category[catDesc/text()='departments']/category[@id=$disciplineCode]/catDesc"/></xsl:template><xsl:template name="map_gap_desc">
        <!-- values:
            table
            figure
            survey
            letter
            form
            formula
            code
            figure'
            table/figure/formula
            student-comment 
        --><xsl:param name="desc"/><span><xsl:value-of select="translate(substring($desc,1,1),$lower,$upper)"/><xsl:value-of select="substring($desc,2)"/></span></xsl:template></xsl:stylesheet>