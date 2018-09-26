


let $paraDist :=

    for $paper in collection('/db/MICUSP/papers')//TEI.2//text//div[@type='main']
    return
        count($paper//p) cast as xs:string
        
return
      string-join($paraDist,',')
