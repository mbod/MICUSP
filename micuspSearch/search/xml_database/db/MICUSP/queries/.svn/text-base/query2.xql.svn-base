declare namespace request="http://exist-db.org/xquery/request";
declare namespace micusp="http://micusp.elicorpora.info";


declare option exist:output-size-limit "50000";

declare function micusp:sort($discipline, $ptype, $idno, $title) {

let $sort := request:get-parameter('sort','dept')
return
    if ($sort = 'dept')
    then
        ($discipline,$ptype, $idno)
    else if ($sort = 'type')
    then
        ($ptype,$discipline, $idno)
    else if ($sort = 'title')
    then
        ($title, $discipline, $ptype)
    else
        ($idno, $discipline, $ptype)
    };

let $q := <phrase> {request:get-parameter('q','') } </phrase>
let $start := request:get-parameter('start',1) cast as xs:int
let $howmany := request:get-parameter('howmany',10) cast as xs:int

let $depts := request:get-parameter('dept','')
let $types := request:get-parameter('type','')
let $features := request:get-parameter('feature','')
let $levels := request:get-parameter('level','')

let $nativeness := request:get-parameter('native','')

let $includeAll := request:get-parameter('include_all','off')

let $deptList := document('/db/MICUSP/xml/metadata.xml')//category[catDesc='departments']/category
let $typeList := document('/db/MICUSP/xml/metadata.xml')//category[catDesc='paper-types']/category
let $featureList := document('/db/MICUSP/xml/metadata.xml')//category[catDesc='text-features']/category


let $studentLevel := ("Final Year Undergraduate", 
                      "First Year Graduate",
                      "Second Year Graduate",
                      "Third Year Graduate")



let $direction := request:get-parameter('direction','asc')

let $searchElems :=
    if ($includeAll='on')
    then
        "self::p or self::head or self::bibl or self::note or self::item"    
    else
        "self::p or self::head"
        
let $paragraphs :=  
	if ($q !='' and $depts = '')
    then
    
    let $hits :=
        if ($includeAll='on')
        then
            collection('/db/MICUSP/papers/')//TEI.2/text/body//*[self::p or self::head or self::bibl or self::note or self::item][ft:query(.,$q)]
        else
            collection('/db/MICUSP/papers/')//TEI.2/text/body//*[self::p or self::head][ft:query(.,$q)]
        
for $para in $hits 
        let $idno :=  $para/ancestor::TEI.2/teiHeader//idno
        let $plevel := substring($idno,5,2)
        let $ptype := tokenize($para/ancestor::TEI.2/teiHeader//profileDesc/textClass/catRef/@target,' ')[3]
        let $paperFeatureList := 
                               for $t in $para/ancestor::TEI.2/teiHeader//textClass//feature 
                               return $featureList//category[catDesc=$t/@type]/@id
        
        let $nativeSpeaker := matches($para/ancestor::TEI.2/teiHeader//profileDesc//person/firstLang,'english','i')
        
        
        where ($types='' or index-of($types,$ptype)>0)
        and ($features='' or count(distinct-values($paperFeatureList[.=$features])) >0)
        and ($levels = '' or index-of($levels,$plevel)>0)
        and ($nativeness = '' or ($nativeSpeaker and $nativeness='NS') or (not($nativeSpeaker) and $nativeness='NNS'))
        
        order by $idno ascending
        return $para
    else
        if ($q != '')
        then
            let $col :=
                for $d in $depts
                let $d2 := replace($d,'HIS','HIS_CLS')
		        order by $d ascending
                return
                    concat("collection('/db/MICUSP/papers/", $d2, "')")
                    
             let $hits := 
                 if ($includeAll='on')
                 then 
                     util:eval(string-join($col,", "))//TEI.2/text/body//*[self::p or self::head or self::bibl or self::note or self::item][ft:query(.,$q)]
                 else
                     util:eval(string-join($col,", "))//TEI.2/text/body//*[self::p or self::head][ft:query(.,$q)]
                 
            return
               for $para in $hits
               let $idno :=  $para/ancestor::TEI.2/teiHeader//idno
               let $plevel := substring($idno,5,2)
               let $ptype := tokenize($para/ancestor::TEI.2/teiHeader//profileDesc/textClass/catRef/@target,' ')[3]
               let $paperFeatureList := 
                                   for $t in $para/ancestor::TEI.2/teiHeader//textClass//feature 
                                   return $featureList//category[catDesc=$t/@type]/@id
               let $nativeSpeaker := matches($para/ancestor::TEI.2/teiHeader//profileDesc//person/firstLang,'english','i')
                                   
               where ($types='' or index-of($types,$ptype)>0)
               and ($features='' or count(distinct-values($paperFeatureList[.=$features])) >0)
               and ($levels = '' or index-of($levels,$plevel)>0)
               and ($nativeness = '' or ($nativeSpeaker and $nativeness='NS') or (not($nativeSpeaker) and $nativeness='NNS'))
               
               order by $idno ascending
               return $para
     
     else
            <test>No results</test>


let $papers := 
    if ($direction = 'asc')
    then
        for $h in $paragraphs/ancestor::TEI.2/teiHeader//idno        
        let $discipline := replace(substring($h,1,3),'CLS|HIS','HIS_CLS')
        
        let $title := replace($h/ancestor::teiHeader/fileDesc/titleStmt/title/text(),'[^a-zA-Z0-9]','')
        let $ptype := replace(tokenize($h/ancestor::teiHeader/profileDesc/textClass/catRef/@target,' ')[3],'Essay','AEssay')
        let $sortKey := micusp:sort($discipline,$ptype,$h,$title)
        order by $sortKey[1] ascending, $sortKey[2] ascending, $sortKey[3] ascending
        return
            $h
    else
        for $h in $paragraphs/ancestor::TEI.2/teiHeader//idno        
        let $discipline := replace(substring($h,1,3),'CLS|HIS','HIS_CLS')
        
        let $title := replace($h/ancestor::teiHeader/fileDesc/titleStmt/title/text(),'[^a-zA-Z0-9]','')
        let $ptype := replace(tokenize($h/ancestor::teiHeader/profileDesc/textClass/catRef/@target,' ')[3],'Essay','AEssay')
        let $sortKey := micusp:sort($discipline,$ptype,$h,$title)
        order by $sortKey[1] descending, $sortKey[2] ascending, $sortKey[3] ascending
        return
            $h




return
<results count="{count($paragraphs)}" q="{$q}" depts="{$depts}" papers="{count($papers)}">
	{
     for $pid at $pos in $papers[position() >= $start and position() < (if ($howmany!=-1) then ($start+$howmany) else (count($paragraphs)+1))]
    
     let $pt := tokenize($pid/ancestor::teiHeader//profileDesc/textClass/catRef/@target,' ')[3]
     let $d:= replace(substring($pid/ancestor::teiHeader//idno,1,3),'CLS|HIS','HIS_CLS')
     return
    <paper doc="{$pid}" num="{$pos+$start -1}" 
           title="{ $pid/ancestor::teiHeader/fileDesc/titleStmt/title/text() }"
           dept="{$deptList[@id=$d]/catDesc/text()}"
           type="{$typeList[@id=$pt]/catDesc/text()}"
     >
        <studentLevel>
            { 
            let $slevel := substring($pid/ancestor::teiHeader//idno,6,1)
            return
            $studentLevel[$slevel cast as xs:int + 1]
            }
        </studentLevel>
        <sex>
            {
            if ($pid/ancestor::teiHeader//profileDesc//person/@sex = 'f')
            then
            "Female"
            else
            "Male"
            }
        </sex>
        <nativeness>
            {
            let $firstLang := $pid/ancestor::teiHeader//profileDesc//person/firstLang
            return
            if (matches($firstLang,'english','i'))
            then
            "NS"
            else
            concat("NNS (L1: ", $firstLang, ")")
            }
        </nativeness>
        <features>
            
            {
            let $features := $pid/ancestor::teiHeader//textClass//feature
            return
            if (count($features)>0)
            then
            for $feature at $i in $features
            return
            if ($i < count($features))
            then
            concat($feature/@type cast as xs:string, ", ")
            else
            $feature/@type cast as xs:string
            else
            " "
            }
        </features>
        
        
        {
        for $para at $ppos in $paragraphs[ancestor::TEI.2/teiHeader//idno=$pid]
        return
            <hit num="{$ppos}" doc="{$para/ancestor::TEI.2/teiHeader//idno}">
                <p>{ 
                
                  $para/node()
                 }
                </p>
            </hit>
        }
    </paper>
     

        
	}
</results>
