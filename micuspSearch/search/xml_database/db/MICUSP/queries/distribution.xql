
declare namespace micusp="http://micusp.elicorpora.info/xquery";
declare namespace request="http://exist-db.org/xquery/request";

declare function micusp:departments($resultSet) {

    let  $departments := doc('/db/MICUSP/xml/metadata.xml')//category[catDesc="departments"]/category
    let  $types := doc('/db/MICUSP/xml/metadata.xml')//category[catDesc="paper-types"]/category/@id
    let $levels := ("G0", "G1", "G2", "G3")

    return
        <departments>
        {							
           for $dept in $departments
           let $regex := replace($dept/@id,'HIS_CLS','(HIS|CLS)')
           let $d := $resultSet//teiHeader/profileDesc/textClass/catRef[matches(@target,$regex)]

           return
                <dept>
                     { $dept/@id }
                     <total>{ count($d) } </total>
                     {   for $type in $types
           				 let $regex2 := concat('^',replace($dept/@id,'HIS_CLS','(HIS|CLS)'),' G\d ',$type)
		                 return
                            element  { replace($type,' ','_') } 
                            {
							
		count($d[matches(@target, $regex2)])		
                            }
                     }
                </dept>
        }
        </departments>
};


let $depts := request:get-parameter('dept','[A-Z]+')
let $types := request:get-parameter('type','[a-zA-Z]+')
let $features := request:get-parameter('feature','')
let $levels := request:get-parameter('level','')

let $q := request:get-parameter('q','')

let $nativeness := request:get-parameter('native','')

let $ignoreParams := 1

let $deptList := replace(replace(string-join($depts,'|'),'ALL','[A-Z]+'),'HIS(_CLS)?','(HIS|CLS)')

let $typeList := replace(string-join($types,'|'),'ALL','[a-zA-Z]+')

let $featureList := document('/db/MICUSP/xml/metadata.xml')//category[catDesc='text-features']/category

(:
let $matchRegexp := concat('(',$deptList,') G\d (', $typeList, ')')
:)
let $matchRegexp := concat('\S+ G\d (', $typeList, ')')

let $papers := 
    if (replace($q,'&#34;','')!='')
    then
        if ($ignoreParams) 
        then
            for $p in collection('/db/MICUSP/papers/')//TEI.2[.//text//p[ft:query(.,$q)] ]
            let $paperFeatureList := 
                                    for $t in $p//teiHeader//textClass//feature 
                                    return $featureList//category[catDesc=$t/@type]/@id
            
            let $plevel := substring($p//idno,5,2)
        
            let $nativeSpeaker := matches($p//teiHeader//profileDesc//person/firstLang,'english','i')
       
    
            where ($features='' or count(distinct-values($paperFeatureList[.=$features])) >0)
            and ($nativeness = '' or ($nativeSpeaker and $nativeness='NS') or (not($nativeSpeaker) and $nativeness='NNS'))
            and ($levels = '' or index-of($levels,$plevel)>0 )
            return
                $p
        else
            collection('/db/MICUSP/papersx/')//TEI.2[matches(teiHeader//profileDesc/textClass/catRef/@target,$matchRegexp)][.//text//p[ft:query(.,$q)]]  
    else
  
        (:
        for $p in collection('/db/MICUSP/papers/')//TEI.2[matches(teiHeader//profileDesc/textClass/catRef/@target,$matchRegexp)]
        :)
        for $p in collection('/db/MICUSP/papers/')//TEI.2
        let $paperFeatureList := 
                            for $t in $p//teiHeader//textClass//feature 
                            return $featureList//category[catDesc=$t/@type]/@id
        
        let $plevel := substring($p//idno,5,2)
        let $nativeSpeaker := matches($p//teiHeader//profileDesc//person/firstLang,'english','i')
                            
        where ($features='' or count(distinct-values($paperFeatureList[.=$features])) >0)
        and ($nativeness = '' or ($nativeSpeaker and $nativeness='NS') or (not($nativeSpeaker) and $nativeness='NNS'))
        and ($levels = '' or index-of($levels,$plevel)>0 )
        return
            $p


return
    <div rg="{$matchRegexp}" features="{$features}" q='{$q}'> 
       { 
    micusp:departments($papers) }
    </div>
    
    