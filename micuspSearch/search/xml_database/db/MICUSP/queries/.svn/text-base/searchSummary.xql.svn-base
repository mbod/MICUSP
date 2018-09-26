
declare namespace micusp="http://micusp.elicorpora.info/xquery";
declare namespace request="http://exist-db.org/xquery/request";


<results>
{
let $q := request:get-parameter('q','')
let $features := request:get-parameter('feature','')
let $levels := request:get-parameter('level','')

let $nativeness := request:get-parameter('native','')

let $featureList := document('/db/MICUSP/xml/metadata.xml')//category[catDesc='text-features']/category

let $includeAll := request:get-parameter('include_all','off')

let $q2 := concat('"', $q, '"')

let $searchElems :=
    if ($includeAll='on')
    then
        "self::p or self::head or self::bibl or self::note or self::item"    
    else
        "self::p or self::head"


(:
for $p at $num in collection('/db/MICUSP/papers/')//TEI.2//text//body//*[self::p or self::head or self::bibl or self::note or self::item][ft:query(., $q )]
:)
for $p at $num in util:eval(concat("collection('/db/MICUSP/papers/')//TEI.2/text/body//*[",$searchElems,"][ft:query(.,$q)]")) 

    let $ref := tokenize($p/ancestor::TEI.2/teiHeader//textClass/catRef/@target, ' ')
    let $paperFeatureList := 
        for $t in $p/ancestor::TEI.2/teiHeader//textClass//feature 
        return $featureList//category[catDesc=$t/@type]/@id
    
    let $nativeSpeaker := matches($p/ancestor::TEI.2/teiHeader//profileDesc//person/firstLang,'english','i')
    
    
    where ($levels = '' or index-of($levels,$ref[2])>0)
    and ($features='' or count(distinct-values($paperFeatureList[.=$features])) >0) 
    and ($nativeness = '' or ($nativeSpeaker and $nativeness='NS') or (not($nativeSpeaker) and $nativeness='NNS'))
    
return



	<hit num="{$num}">
    
	    { attribute dept { replace($ref[1],'CLS','HIS')  }} 
		{ attribute type { $ref[3] }}
		
	
		{
				for $tn in $p//text()
	            return
		            concat($tn,' ')
		}
	</hit>

}
</results>