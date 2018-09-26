declare namespace request="http://exist-db.org/xquery/request";
declare namespace util="http://exist-db.org/xquery/util";
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

declare function micusp:sortOrder() {
    "descending"
};


let $start := request:get-parameter('start',1) cast as xs:int
let $howmany := request:get-parameter('howmany',20) cast as xs:int

let $depts := request:get-parameter('dept','')
let $types := request:get-parameter('type','')
let $features := request:get-parameter('feature','')
let $levels := request:get-parameter('level','')

let $direction := request:get-parameter('direction','asc')

let $nativeness := request:get-parameter('native','')


let $deptList := document('/db/MICUSP/xml/metadata.xml')//category[catDesc='departments']/category
let $typeList := document('/db/MICUSP/xml/metadata.xml')//category[catDesc='paper-types']/category
let $featureList := document('/db/MICUSP/xml/metadata.xml')//category[catDesc='text-features']/category

let $studentLevel := ("Final Year Undergraduate", 
                      "First Year Graduate",
                      "Second Year Graduate",
                      "Third Year Graduate")




let $papers :=  
	if ($depts = '')
    then
        if ($direction = 'asc') 
        then
            for $p in collection('/db/MICUSP/papers/')//TEI.2 
            let $idno :=  $p//teiHeader//idno
            let $discipline := replace(substring($idno,1,3),'CLS|HIS','HIS_CLS')
            let $plevel := substring($idno,5,2)
            let $title := replace($p//teiHeader/fileDesc/titleStmt/title/text(),'[^a-zA-Z0-9]','')
        	let $ptype := tokenize($p//teiHeader//profileDesc/textClass/catRef/@target,' ')[3]
        	let $paperFeatureList := 
        	                    for $t in $p//teiHeader//textClass//feature 
        	                    return $featureList//category[catDesc=$t/@type]/@id
        	                    
            let $ptypeName := $typeList[@id=$ptype]
			let $sortKey := micusp:sort($discipline,$ptypeName,$idno,$title)
			let $nativeSpeaker := matches($p//teiHeader//profileDesc//person/firstLang,'english','i')
			    
            where ($types='' or index-of($types,$ptype)>0)
            and ($features='' or count(distinct-values($paperFeatureList[.=$features])) >0)
            and ($levels = '' or index-of($levels,$plevel)>0)
            and ($nativeness = '' or ($nativeSpeaker and $nativeness='NS') or (not($nativeSpeaker) and $nativeness='NNS'))
            order by $sortKey[1] ascending, $sortKey[2] ascending, $sortKey[3] ascending
            return $p
         else
            for $p in collection('/db/MICUSP/papers/')//TEI.2 
            let $idno :=  $p//teiHeader//idno
            let $discipline := replace(substring($idno,1,3),'CLS|HIS','HIS_CLS')
            let $plevel := substring($idno,5,2)
            let $title := replace($p//teiHeader/fileDesc/titleStmt/title/text(),'[^a-zA-Z0-9]','')
            let $paperFeatureList := 
                                for $t in $p//teiHeader//textClass//feature 
                                return $featureList//category[catDesc=$t/@type]/@id

            let $nativeSpeaker := matches($p//teiHeader//profileDesc//person/firstLang,'english','i')


            let $ptype := tokenize($p//teiHeader//profileDesc/textClass/catRef/@target,' ')[3]
            let $ptypeName := $typeList[@id=$ptype]
            let $sortKey := micusp:sort($discipline,$ptypeName,$idno,$title)
            where ($types='' or index-of($types,$ptype)>0)
            and ($features='' or count(distinct-values($paperFeatureList[.=$features])) >0)
            and ($levels = '' or index-of($levels,$plevel)>0)
            and ($nativeness = '' or ($nativeSpeaker and $nativeness='NS') or (not($nativeSpeaker) and $nativeness='NNS'))
            
            order by $sortKey[1] descending, $sortKey[2] ascending, $sortKey[3] ascending
            return $p        
    else
        if ($depts != '')
        then
            let $col :=
                for $d in $depts
                let $d2 := replace($d,'HIS','HIS_CLS')
                order by $d ascending 
                return
                    concat("collection('/db/MICUSP/papers/", $d2, "')")
            return
            if ($direction = 'asc') 
            then            
               for $p in  util:eval(string-join($col,", "))//TEI.2 
               let $idno :=  $p//teiHeader//idno
               let $discipline := replace(substring($idno,1,3),'CLS|HIS','HIS_CLS')
               let $plevel := substring($idno,5,2)
               let $title := replace($p//teiHeader/fileDesc/titleStmt/title/text(),'[^a-zA-Z0-9]','')
               let $ptype := tokenize($p//teiHeader//profileDesc/textClass/catRef/@target,' ')[3]
			   let $paperFeatureList := 
			                           for $t in $p//teiHeader//textClass//feature 
			                           return $featureList//category[catDesc=$t/@type]/@id

               let $nativeSpeaker := matches($p//teiHeader//profileDesc//person/firstLang,'english','i')
			                           
			
               let $ptypeName := $typeList[@id=$ptype]
               let $sortKey := micusp:sort($discipline,$ptypeName,$idno,$title)
               
               where ($types='' or index-of($types,$ptype)>0)
               and ($features='' or count(distinct-values($paperFeatureList[.=$features])) >0)
               and ($levels = '' or index-of($levels,$plevel)>0)
               and ($nativeness = '' or ($nativeSpeaker and $nativeness='NS') or (not($nativeSpeaker) and $nativeness='NNS'))
               
               order by $sortKey[1] ascending, $sortKey[2] ascending, $sortKey[3] ascending
               return $p
            else
               for $p in  util:eval(string-join($col,", "))//TEI.2 
               let $idno :=  $p//teiHeader//idno
               let $discipline := replace(substring($idno,1,3),'CLS|HIS','HIS_CLS')
               let $plevel := substring($idno,5,2)
               let $title := replace($p//teiHeader/fileDesc/titleStmt/title/text(),'[^a-zA-Z0-9]','')
               let $ptype := tokenize($p//teiHeader//profileDesc/textClass/catRef/@target,' ')[3]
               let $paperFeatureList := 
                                   for $t in $p//teiHeader//textClass//feature 
                                   return $featureList//category[catDesc=$t/@type]/@id
               let $ptypeName := $typeList[@id=$ptype]
               let $sortKey := micusp:sort($discipline,$ptypeName,$idno,$title)
               
               let $nativeSpeaker := matches($p//teiHeader//profileDesc//person/firstLang,'english','i')
               
               
               where ($types='' or index-of($types,$ptype)>0)
               and ($features='' or count(distinct-values($paperFeatureList[.=$features])) >0)
               and ($levels = '' or index-of($levels,$plevel)>0)
               and ($nativeness = '' or ($nativeSpeaker and $nativeness='NS') or (not($nativeSpeaker) and $nativeness='NNS'))
               
               order by $sortKey[1] descending, $sortKey[2] ascending, $sortKey[3] ascending
               return $p
     
     else
            <test>No results</test>


return
<results depts="{$depts}" papers="{count($papers)}" features="{$features}">
	{
	 
     for $p at $pos in $papers[position() >= $start and position() < (if ($howmany!=-1) then ($start+$howmany) else (count($papers)+1))]
    
     
     return 
		if ($p/name() = 'test')
		then	
			$p
		else
    <paper num="{$pos+$start -1}" doc="{$p//teiHeader//idno}">
        <title>{ $p//teiHeader/fileDesc/titleStmt/title/text() }</title>
        <discipline>
            { 
            let $d:= replace(substring($p//teiHeader//idno,1,3),'CLS|HIS','HIS_CLS')
            return
                $deptList[@id=$d]/catDesc/text() 
             }
        </discipline>
        <paperType>{ 
            let $pt := tokenize($p//teiHeader//profileDesc/textClass/catRef/@target,' ')[3]
           
            return
                
                if ($typeList[@id=$pt]/catDesc/text())
                then
                    $typeList[@id=$pt]/catDesc/text()
                else
                    "other"
    
            
            }</paperType>
        <studentLevel>
            { 
                let $slevel := substring($p//teiHeader//idno,6,1)
                return
                    $studentLevel[$slevel cast as xs:int + 1]
            }
        </studentLevel>
        <sex>
            {
                if ($p//teiHeader//profileDesc//person/@sex = 'f')
                then
                    "Female"
                else
                    "Male"
            }
        </sex>
        <nativeness>
            {
                let $firstLang := $p//teiHeader//profileDesc//person/firstLang
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
                let $features := $p//teiHeader//textClass//feature
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
    </paper>
	}
</results>
