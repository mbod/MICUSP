
declare namespace micusp="http://micusp.elicorpora.info/xquery";
declare namespace request="http://exist-db.org/xquery/request";


<results>

{
let $features := request:get-parameter('feature','')
let $levels := request:get-parameter('level','')
let $includeAll := request:get-parameter('include-all','off')

let $featureList := document('/db/MICUSP/xml/metadata.xml')//category[catDesc='text-features']/category

let $featureNames :=
    for $f in $features
    return
        $featureList//category[@id=$f]/text()

for $dept in document('/db/MICUSP/xml/metadata.xml')//category[catDesc='departments']/category/@id
return
    <dept id="{$dept}">
    {    
    
        for $ptype in document('/db/MICUSP/xml/metadata.xml')//category[catDesc='paper-types']/category/@id
        return
        <type id="{$ptype}">
            {
             if ($levels='' and $features='') 
              then
                 sum(collection(concat('/db/MICUSP/papers/', $dept))//TEI.2[matches(.//catRef/@target,concat(' ',$ptype,' '),'i')]//wordcount)
              else 
                 if ($features = '')
                 then
                     sum(collection(concat('/db/MICUSP/papers/', $dept))//TEI.2[matches(.//catRef/@target,concat('(',string-join($levels,'|'),') ',$ptype,' '))]//wordcount)
                 else
                     if ($levels != '')
                     then
                         (: features and levels :)
                         sum(collection(concat('/db/MICUSP/papers/', $dept))//TEI.2[matches(.//catRef/@target,concat('(',string-join($levels,'|'),') ',$ptype,' '))][matches(string-join(.//catRef/features/feature/@type,' '),concat('(',string-join($featureNames,'|'),')'))]//wordcount)
                     else
                         (: just features :)
                         sum(collection(concat('/db/MICUSP/papers/', $dept))//TEI.2[matches(.//catRef/@target,concat(' ',$ptype,' '))][matches(string-join(.//catRef/features/feature/@type,' '),concat('(',string-join($featureNames,'|'),')'))]//wordcount)
            }
        </type>
    }
    </dept>


}
</results>
