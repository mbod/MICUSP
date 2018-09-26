
declare namespace util="http://exist-db.org/xquery/util";
declare namespace text="http://exist-db.org/xquery/text";
declare namespace request="http://exist-db.org/xquery/request";
declare namespace micusp="http://micusp.elicorpora.info/";

declare option exist:serialize "method=xhtml media-type=text/html highlight-matches=elements";  


declare function micusp:tagmatch($term as xs:string, $node as text(), $args as item()*) as element() { 
    <span class="match">{$term}</span> 
}; 

declare function micusp:processNode($node as item()*, $match as xs:string) {
    if (count($node) = 0 )
    then
        ()
    else
        if (matches($node/node()[1],$match,'i'))
        then
            "MATCH"
        else
            $node/node()[1],
        if (count($node)>1) 
        then
            micusp:processNode($node/node()[position()>1], $match)
        else
            ()
};

let $callback := util:function("micusp:tagmatch", 3) 
let $term := request:get-parameter('term','#@!$')

let $results := collection('/db/MICUSP/papers')//TEI.2/text//p[matches(.,request:get-parameter('term','#@!$'),'i')]
    
return

let $data :=
<cats>
{
let  $departments := doc('/db/MICUSP/xml/metadata.xml')//category[catDesc="departments"]/category

for $dept in $departments
let $paperCnt := count($results/ancestor::TEI.2/teiHeader//profileDesc/textClass/catRef[starts-with(@target,$dept/@id)])
let $hitsCnt := count($results//p[ancestor::TEI.2/teiHeader//profileDesc/textClass/catRef[starts-with(@target,$dept/@id)]])

return
    <cat>
        { $dept/@id }
        <tot>{ $hitsCnt }</tot>
         <paper> { $paperCnt }</paper>
 
    </cat>

}
</cats>

return

<html>
    <head>
        <style>
            <![CDATA[
            @namespace exist url('xmlns:exist="http://exist.sourceforge.net/NS/exist');
            .match { color: red }
            p:before { content: attr(id); padding-right: 12pt; color: blue;} 
            .float { position: relative; vertical-align:top; float: left; }
            ]]>
        </style>
    </head>
    <body>
    
    <form method="get" action="search.xql">
        Search for: <input type="text" value="{if ($term!='#@!$') then $term else ''}" name="term" id="term"/>
        <input type="submit"/>
    </form>

    <div id="results">
    
    <span class="float">
     {  count($results//p) }   hits in {  count($results//p/ancestor::TEI.2//idno)   }  papers    </span>
    <span class="float">
    <img src="{concat("http://chart.apis.google.com/chart?chds=0,", max($data//tot)+20,"&amp;chco=4D89F9,C6D9FD&amp;chm=N*f0*,000000,0,-1,11|N*f0*,000000,1,-1,11&amp;chbh=a,0,10&amp;chs=800x200&amp;cht=bvg&amp;chd=t:", string-join($data//cat/tot,','), "|", string-join($data//cat/paper,','), "&amp;chl=", string-join($data/cat/@id,"|"))}"/>
     </span>   
     </div>
    
    <br style="clear: both"/>
    <div>
    {
    for $p in $results
        let $idno := $p/ancestor::TEI.2/teiHeader/fileDesc/publicationStmt/idno
         return
        <p>
            
            <a href="../papers/{concat(substring-before($idno,'.'),'/',$idno,'.xml')}?_xsl=/db/MICUSP/xslt/paper.xsl"> { $idno }</a>
            {
                  $p/node()
            }
        </p>
    }
       </div>
        
     </body>
</html>