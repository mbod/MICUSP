declare option exist:serialize "method=xhtml media-type=text/html";  


let $data :=
<cats>
{
let  $departments := doc('/db/MICUSP/xml/metadata.xml')//category[catDesc="departments"]/category

for $dept in $departments
let $paperCnt := count(collection('/db/MICUSP/papers')//profileDesc/textClass/catRef[starts-with(@target,$dept/@id)])
let $scnt :=
       for $s in ('G0','G1','G2','G3')
       return
           if ($dept/@id = 'HIS_CLS')
           then
              count(collection('/db/MICUSP/papers')//profileDesc/textClass/catRef[matches(@target,concat('(CLS|HIS)', ' ', $s))])
           else
               count(collection('/db/MICUSP/papers')//profileDesc/textClass/catRef[starts-with(@target,concat($dept/@id, ' ', $s))])
return
    <cat>
        { $dept/@id }
        <tot>{ $paperCnt }</tot>
       {
        for $s at $p in ('G0','G1','G2','G3')
       return
           element {$s}  {$scnt[$p] }
       }
    </cat>

}
</cats>

return

<html>

    <body>

    <img src="{concat("http://chart.apis.google.com/chart?chxt=y&amp;chs=600x200&amp;cht=p3&amp;chd=t:", string-join($data//cat/tot,','), "&amp;chl=", string-join($data/cat/@id,"|"))}"/>
        
        <br/>
        
      
    <img src="{concat("http://chart.apis.google.com/chart?chxt=y&amp;chs=600x200&amp;cht=bvs&amp;chdl=G0|G1|G2|G3&amp;chco=4D89F9,76D9FD,A489F9,C6D9FD&amp;chd=t:", string-join($data//cat/G0,','), "|",  string-join($data//cat/G1,','), "|",  string-join($data//cat/G2,','), "|",  string-join($data//cat/G3,',') ,"&amp;chl=", string-join($data/cat/@id,"|"))}"/>
        
        
     </body>
</html>