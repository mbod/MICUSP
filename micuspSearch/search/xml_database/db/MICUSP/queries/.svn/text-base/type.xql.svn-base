
declare namespace micusp="http://micusp.elicorpora.info/xquery";
declare namespace request="http://exist-db.org/xquery/request";

declare option exist:serialize "method=xml media-type=text/xml indent=yes";

declare function micusp:typefun($resultSet) {
	let  $types := doc('/db/MICUSP/xml/metadata.xml')//category[catDesc="paper-types"]/category
	return
        <types>
        {
           for $type in $types
		   let $totald := $resultSet
           let $d := $resultSet//TEI.2/teiHeader//profileDesc/textClass/catRef[contains(@target,$type/@id)]
           let $levels := ("G0", "G1", "G2", "G3")
           return
                <type>
                     { $type/@id }
                     <total>{ count($d) div count($totald) * 100}</total>
                     {   for $level in $levels
                         return
                            element  { $level } 
                            {
                                 count($d[substring(@target,5,2)=$level])
                            }
                     }
                </type>
        }
        </types>
};

let $depts := request:get-parameter('dept','[A-Z]+')

let $types := request:get-parameter('type','[a-zA-Z]+')

let $q := request:get-parameter('q','')
let $deptList := replace(replace(string-join($depts,'|'),'ALL','[A-Z]+'),'HIS_CLS','(HIS|CLS)')
let $typeList := replace(string-join($types,'|'),'ALL','[a-zA-Z]+')

let $matchRegexp := concat('(',$deptList,') G\d (', $typeList, ')')

let $papers := 
    if ($q!='')
    then
        collection('/db/MICUSP/papers/')//TEI.2[matches(teiHeader//profileDesc/textClass/catRef/@target,$matchRegexp)][.//text//p[ft:query(.,$q)]]  
    else
        collection('/db/MICUSP/papers/')//TEI.2[matches(teiHeader//profileDesc/textClass/catRef/@target,$matchRegexp)]
return
    <div>
       { 
    micusp:typefun($papers) }
    </div>