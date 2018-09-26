
declare namespace util="http://exist-db.org/xquery/util";
declare namespace text="http://exist-db.org/xquery/text";
declare namespace request="http://exist-db.org/xquery/request";
declare namespace micusp="http://micusp.elicorpora.info/";

declare option exist:serialize "method=xhtml media-type=text/html highlight-matches=elements";  

let $papers := collection('/db/MICUSP/papers')

return


<html>
    <head>
        <title>MICUSP</title>
        
        

 <link type="text/css" href="http://jqueryui.com/latest/themes/base/ui.all.css" rel="stylesheet" />
  <script type="text/javascript" src="http://jqueryui.com/latest/jquery-1.3.2.js"></script>
  <script type="text/javascript" src="http://jqueryui.com/latest/ui/ui.core.js"></script>
  <script type="text/javascript" src="http://jqueryui.com/latest/ui/ui.tabs.js"></script>


          <script type="text/javascript">
         <![CDATA[
        $(document).ready(function() {
		    $("#tabs").tabs();
		      
		   });
          ]]>
        </script> 
        <style type="text/css">
        <![CDATA[
        
        table { margin-top: 20px; border-collapse: collapse;}
        th, td { border: 1px solid black; }
        
        ]]>
        </style>
    </head>
    
    <body>
    
    
    <h2>MICUSP Summary</h2>
      
    
    {
    let  $departments := doc('/db/MICUSP/xml/metadata.xml')//category[catDesc="departments"]/category
    let $levels := ("G0", "G1", "G2", "G3")
    let $deptData :=
    for $dept in $departments
        let $papers := $papers//TEI.2/teiHeader//profileDesc/textClass/catRef[starts-with(@target,$dept/@id)]

   return
    <cat>
        { $dept/@id }
        
         {   for $level in $levels
             return
                element  { $level } 
                {
                     count($papers[substring(@target,5,2)=$level])
                }
         }
    </cat>

    return
    <div id="tabs">
    <ul>
        <li><a href="#tabs1">Departments</a></li>
        <li><a href="#tabs2">Student Levels</a></li>
        <li><a href="#tabs3">Nativeness</a></li>
    </ul>
   
   <div id="tabs1">
            <h4>Departments</h4>
       <img src='{concat("http://chart.apis.google.com/chart?chds=0,", max($deptData//paper/*)+20,"&amp;chco=4D89F9,9D79EF,AD9AEF,C6D9FD&amp;chdl=G0|G1|G2|G3&amp;chbh=a,10,10&amp;chs=800x200&amp;cht=bvs&amp;chd=t:", string-join($deptData//cat/G0,','), "|", string-join($deptData//cat/G1,','),"|", string-join($deptData//cat/G2,','), "|", string-join($deptData//cat/G3,','), "&amp;chl=", string-join($deptData//cat/@id,"|"))}'/>
  
       <table>
           <thead>
           <tr>
               <th>Department</th>
               <th>Paper Total</th>
               <th>G0</th>
               <th>G1</th>
               <th>G2</th>
               <th>G3</th>
           </tr>
           </thead>
           <tbody>
               {
               for $dept in $deptData//cat
               let $total := sum($dept/*)
               order by $total descending
               return
                   <tr>
                       <td> { $dept/@id cast as xs:string } </td>
                       <td> { $total } </td>
                       <td> { $dept/G0 } </td>
                        <td> { $dept/G1 } </td>
                         <td> { $dept/G2 } </td>
                          <td> { $dept/G3 } </td>
                   </tr>
               
               }
           </tbody>
       </table>
    
    
        </div>
    
            {
        
    let  $levels := doc('/db/MICUSP/xml/metadata.xml')//category[catDesc="student levels"]/category
    
    let $levelData :=
    for $level in $levels
        
        let $paperCnt := count($papers//TEI.2/teiHeader//profileDesc/textClass/catRef[substring(@target,5,2)=$level/@id])
        let $native := count($papers//TEI.2/teiHeader//profileDesc[textClass/catRef[substring(@target,5,2)=$level/@id]]/particDesc/person/firstLang[contains(.,'English')])
   return
    <cat>
        { $level/@id }
        <paper> { $paperCnt }</paper>
        <native> { $native } </native>
        <nonnative> { $paperCnt - $native } </nonnative>
    </cat>

    return
        (
        <div id="tabs2">
            <h4>Student Levels</h4>
            
         <img src='{concat("http://chart.apis.google.com/chart?chds=0,", max($levelData//paper)+20,"&amp;chco=4D89F9,C6D9FD&amp;chm=N*f0*,000000,0,-1,11&amp;chbh=a,0,10&amp;chs=800x200&amp;cht=p&amp;chd=t:", string-join($levelData//cat/paper,','), "&amp;chl=", string-join($levelData//cat/@id,"|"))}'/>
  
  
          <table>
              <thead>
                     <tr>
                         <th>Level</th>
                         <th>Number of papers</th>
                      </tr>
              </thead>
              <tbody>
                  {
                      for $lev in $levelData//cat
                      return
                          <tr>
                              <td> { $lev/@id cast as xs:string } </td>
                              <td> { $lev/paper } </td>
                           </tr>
                    }
             </tbody>
           </table>
         </div>,
         
         <div id="tabs3">
             <h4>Nativeness</h4>
             
              <img src='{concat("http://chart.apis.google.com/chart?chds=0,", max($levelData//paper)+20,"&amp;chco=4D89F9,9D79EF&amp;chdl=native|non-native&amp;chbh=a,10,10&amp;chs=800x200&amp;cht=bvg&amp;chd=t:", string-join($levelData//cat/native,','), "|", string-join($levelData//cat/nonnative,','), "&amp;chl=G0|G1|G2|G3")}'/>
  
             
                       <table>
              <thead>
                     <tr>
                         <th>Level</th>
                         <th>Native (English as 1st Lang)</th>
                         <th>Non-native</th>
                      </tr>
              </thead>
              <tbody>
                  {
                      for $lev in $levelData//cat
                      return
                          <tr>
                              <td> { $lev/@id cast as xs:string } </td>
                              <td> { $lev/native } </td>
                              <td> { $lev/nonnative } </td>
                          </tr>
                    }
             </tbody>
           </table>
         </div>
         )
        } 
      </div>
    }
   
   
   
   
    
  
   
    </body>
    
</html>
