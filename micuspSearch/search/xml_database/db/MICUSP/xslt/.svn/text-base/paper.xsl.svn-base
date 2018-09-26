<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:exist="http://exist.sourceforge.net/NS/exist" version="1.0"><xsl:param name="term"/><xsl:template match="/"><html><head><title/><style type="text/css">
                        #outline, #text { position: relative; float: left;  height: 100%; }
                        #outline { border: 1px solid #505050; padding: 10px; height: 100%;}
                        #text { margin-left: 20px; }
                        .match { color: red; }
                    </style><script>
                        var highlighted=False;
                        function highlight(node) {
                          
                            if (highlighted) {
                                    var current = document.getElementById(highlighted);   
                                    current.style.background="#FFFFFF";
                            }
                            var newNode = document.getElementById(node);
                            
                            newNode.style.setAttribute('background',"#F7A7A7");
                            highlighted=node;
                        }
                    </script></head><div id="outline"><xsl:apply-templates select="//body" mode="outline"/></div><div id="text"><xsl:apply-templates select="//body"/></div></html></xsl:template><xsl:template match="body" mode="outline"><ul><xsl:apply-templates select="*" mode="outline"/></ul></xsl:template><xsl:template match="*" mode="outline"><xsl:choose><xsl:when test="ancestor::p"/><xsl:otherwise><li><span onclick="highlight('{generate-id()}')"><xsl:value-of select="name()"/></span><ul><xsl:apply-templates select="*" mode="outline"/></ul></li></xsl:otherwise></xsl:choose></xsl:template><xsl:template match="*"><xsl:copy><xsl:attribute name="id"><xsl:value-of select="generate-id()"/></xsl:attribute><xsl:apply-templates/></xsl:copy></xsl:template><xsl:template match="head"><div><xsl:attribute name="id"><xsl:value-of select="generate-id()"/></xsl:attribute><xsl:apply-templates/></div></xsl:template><xsl:template match="listBibl"><ul><xsl:attribute name="id"><xsl:value-of select="generate-id()"/></xsl:attribute><xsl:apply-templates/></ul></xsl:template><xsl:template match="bibl"><li><xsl:attribute name="id"><xsl:value-of select="generate-id()"/></xsl:attribute><xsl:apply-templates/></li></xsl:template></xsl:stylesheet>