declare namespace request="http://exist-db.org/xquery/request";



declare option exist:output-size-limit "50000";


let $q := request:get-parameter('q','')
let $start := request:get-parameter('start',1) cast as xs:int
let $howmany := request:get-parameter('howmany',10) cast as xs:int

let $depts := request:get-parameter('dept','')
let $types := request:get-parameter('type','')

let $paragraphs :=  
	if ($q !='' and $depts = '')
    then

        for $para in collection('/db/MICUSP/papers/')//TEI.2/text/body//p[ft:query(.,$q)] 
        let $idno :=  $para/ancestor::TEI.2/teiHeader//idno
        let $ptype := tokenize($para/ancestor::TEI.2/teiHeader//profileDesc/textClass/catRef/@target,' ')[3]
        where $types='' or index-of($types,$ptype)>0
        order by $idno ascending
        return $para
    else
        if ($q != '')
        then
            let $col :=
                for $d in $depts
		        order by $d ascending
                return
                    concat("collection('/db/MICUSP/papers/", $d, "')")
            return
               for $para in  util:eval(string-join($col,", "))//TEI.2/text/body//p[ft:query(.,$q)] 
               let $idno :=  $para/ancestor::TEI.2/teiHeader//idno
               let $ptype := tokenize($para/ancestor::TEI.2/teiHeader//profileDesc/textClass/catRef/@target,' ')[3]
               where $types='' or index-of($types,$ptype)>0
               order by $idno ascending
               return $para
     
     else
            <test>No results</test>

let $papers := 
    for $h in $paragraphs/ancestor::TEI.2/teiHeader//idno
    return
        $h

return
<results count="{count($paragraphs)}" q="{$q}" depts="{$depts}" papers="{count($papers)}">
	{
     for $p at $pos in $paragraphs[position() >= $start and position() < $start+$howmany]
     
     return 
		if ($p/name() = 'test')
		then	
			$p
		else
        <hit num="{$pos+$start -1}" doc="{$p/ancestor::TEI.2/teiHeader//idno}">{ $p }</hit>
	}
</results>
