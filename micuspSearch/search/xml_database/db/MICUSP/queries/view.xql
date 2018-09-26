declare namespace request="http://exist-db.org/xquery/request";
declare namespace micusp="http://micusp.elicorpora.info";
declare namespace transform="http://exist-db.org/xquery/transform";

declare option exist:output-size-limit "50000";

declare function micusp:processMain($elem, $hits) {

    element { $elem/name() } {
    
    (
        $elem/@*
    ,
    
    if ($elem/name()='p' or $elem/name()='note' or $elem/name()='bibl') 
    then
        if (index-of($hits,$elem))
        then
            attribute hit { 1 }
        else
            ()
     else
             ()
    ,
    
    
    for $e in $elem/node()
    return
        if ($e/name())
        then
            micusp:processMain($e,$hits)
        else
            $e
    )
    
    
    }
    

};



let $q := request:get-parameter('q','')
let $paperID := request:get-parameter('pid','')
let $includeAll := request:get-parameter('include_all','off')

return
    if ($paperID='')
    then
        <error>No IDNO specified</error>
    else
        let $paper := collection('/db/MICUSP/papers')//TEI.2[teiHeader//idno=$paperID]
        return
            if (not($paper//TEI.2))
            then
                <error>Paper with IDNO {$paperID} not found</error>
            else
                let $hits := 
                    if ($q!='')
                    then
                        $paper//text/body//*[self::p or self::head or self::bibl or self::note or self::item][ft:query(.,$q)]
                    else
                         ()
                let $pxml :=
                
                    if ($q='')
                    then
                        $paper
                    else
                
                    <TEI.2>
                   
                    {
                        $paper//TEI.2/teiHeader
                    }
                    <text>
                    {
                        $paper//TEI.2/text/body/div[@type='opener']
                    }
                    {
                        micusp:processMain($paper//TEI.2/text/body/div[@type='main'], $hits)
                    }
                    {
                        if ($includeAll='on')
                        then
                            micusp:processMain($paper//TEI.2/text/body/div[@type='closer'], $hits)
                        else
                            $paper//TEI.2/text/body/div[@type='closer']
                    }
                    </text>
                    
                 </TEI.2>
                return
                  
                       transform:transform($pxml, 'xmldb:///db/MICUSP/xslt/paper2html.xsl', <parameters/>)
                