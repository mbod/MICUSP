/* 
-------------------------------------------------------------------


  Functions used in the MICUSP Simple online search interface

  Version 0.1 - Aug. 2009
  Version 0.2 - December 2009


-------------------------------------------------------------------
*/

	// THESE ARE GLOBAL VARIABLES 

	var mode = 'browse';

	var plot, plot1,percentdata;
	var init = 1;
	var deptselect=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var typeselect=[0,0,0,0,0,0,0];
	var featureselect=[0,0,0,0,0,0,0,0];
	var levelselect = [0,0,0,0];
	var nativeselect = [0,0];
	var deptExpand=true;
	var typeExpand=true;
	var featureExpand=false;
	var levelExpand=false;
	var nativeExpand=false;
	var slicesGlobal = new Array();
	var captureCTX = new Array();
	var highlightsClick = new Array();
	var highlights = [];
	var totalHitCount = 0;
	var totalPaperCount = 0;
	var safariDisable = false;

	var normalizationBase = 10000;
	var normalizeResults = false;

	var searchTimerID = false;
	var needToUpdateGraphs = false;
	var currentSearchTerm = '';


	var columnNames = {
			'Paper ID' : 'pid',
			'Title' : 'title',
			'Discipline': 'dept',
			'Paper Type': 'type'
	};

	var cIDs = ['pid','title','dept','type'];
	var columnIDs = {'pid': 0, 'title': 1, 'dept': 2, 'type': 3};
	var columnStatus = [0,0,1,0];


	var typeName=Array();


	/*  -- original alpha order --
	typeName['Report']=5;
	typeName['Critique']=2;
	typeName['ResearchPaper']=4;
	typeName['Essay']=0;
	typeName['ResponsePaper']=6;
	typeName['CreativeWriting']=1;
	typeName['Proposal']=3;
	*/

	typeName['Report']=2;
	typeName['Critique']=3;
	typeName['ResearchPaper']=5;
	typeName['Essay']=0;
	typeName['ResponsePaper']=6;
	typeName['CreativeWriting']=1;
	typeName['Proposal']=4;


	var depts = [
				[0.5, 'BIO'], [1.5, 'CEE'], [2.5, 'ECO'],
				[3.5, 'EDU'], [4.5, 'ENG'], [5.5, 'HIS'],
				[6.5, 'IOE'], [7.5, 'LIN'], [8.5, 'MEC'],
				[9.5, 'NRE'], [10.5, 'NUR'], [11.5, 'PHI'],
				[12.5, 'PHY'], [13.5, 'POL'], [14.5, 'PSY'],
				[15.5, 'SOC'] 
			];


	var percentdata = [
						{ label: 'Essay', data: 0},
						{ label: 'CreativeWriting', data: 0},						
						{ label: 'Report', data: 0},
						{ label: 'Critique', data: 0},
						{ label: 'Proposal', data: 0},
						{ label: 'ResearchPaper', data: 0},
						{ label: 'ResponsePaper', data: 0}
						
				];


	var textualFeatureLabels = [ 	'abstract', 'definitions', 
					'discussion of results', 'literature review', 
					'methodology section', 'problem-solution pattern', 
					'reference to sources', 'tables, graphs, or figures'];


	var levelLabels = [ 'G0','G1','G2','G3' ];

	var nativeLabels = ['NS', 'NNS']

	var d2=Array(deptselect.length);
	var d3=Array(typeselect.length);

	var histLabels = new Array("Biology","Civil & Environmental Engineering","Economics","Education","English","History & Classical Studies",
		"Industrial & Operations Engineering","Linguistics","Mechanical Engineering","Natural Resources & Environment","Nursing","Philosophy","Physics",
		"Political Science","Psychology","Sociology");






// =====================================================================
// *** deptSelect2 ***
// function to highlight and unhighlight bars
// in the histogram using flags in the deptselect array
// =====================================================================
function deptSelect2(series, barpos){

	//alert('In deptSelect: series - ' + series + ' barpos - ' + barpos + ' d2 - ' + d2);
	if (barpos>-1) {
		if (deptselect[barpos] == 1) {
			deptselect[barpos]=0;
		} else {
			deptselect[barpos]=1;
		}
	}

	for (var i=0; i<deptselect.length; i++) {
		if (deptselect[i]==1) {
			plot.highlight(series,d2[i]);
		} else {
			plot.unhighlight(series,d2[i]);
		}
	}         
}
// ######  end of function deptSelect2 #########




// =====================================================================
// *** typeSelect ***
// function to highlight and unhighlight slices
// in the pie graph using flags in the typeselect array
// =====================================================================
function typeSelect(series, slicepos){

	//alert('In typeSelect: series - ' + series + ' slicepos - ' + slicepos + ' d2 - ' + d2);
	if (slicepos>-1) {
		if (typeselect[slicepos] == 1) {
			typeselect[slicepos]=0;
		} else {
			typeselect[slicepos]=1;
		}
	}

}
// ######  end of function typeSelect #########




// =================================
// *** updateHistogram ***
// =================================
function updateHistogram(){
	var numOfTypes = percentdata.length;
	var numOfDepts = deptselect.length;

	var data=[];
	var norm=[];
    
	for(var i=0; i< numOfDepts;i++){
		data[i] = 0;
		norm[i] = 0;
	}

	for(var i=0; i<numOfTypes;i++){
		if(typeselect[i]==1 || $(".typeNo").attr('checked')==true) {
			for(var j=0; j < numOfDepts; j++){
				data[j] = data[j]+deptTypeData[j][i];
				if (mode=='search' && normalizeResults) {
					if (normalizationData[j][i]==0) {
						norm[j] = norm[j]+0.001;
					} else {
						norm[j] = norm[j]+normalizationData[j][i];
					}
				}
			}
		}
	}
	//alert(norm);
	var totalHits=0;
	var maxY=1;
	for(var i=0; i < numOfDepts; i++){
		if (mode=='search' && normalizeResults) {
			if (normalizationBase < 1) {
				data[i] = 0;
			} else {
				data[i] = data[i]/norm[i] * normalizationBase;
			}
		
		}

		d2[i] = [i,data[i]];
		totalHits+=data[i];
		if (data[i]>maxY) { maxY=data[i]; }
	}
   
	//alert(maxY);
	
	if (mode == 'browse') { maxY=100; }
	

	// don't draw histogram if no hits?
	if (totalHits==0) {
		$('#histogram').html('');
	} else {
	plot = $.plot(  $("#histogram"), 
			[{data: d2 , bars: {show: true, clickable: true, hoverable: true  }}],
				{ xaxis: { ticks: depts}, yaxis: { max: maxY*1.1 }, grid: { clickable: true, hoverable: true },
				series: { color: "#808080",  highlightColor: "#CA2027", highlightOpacity: 1.0,
					highlightBorderColor: "#8A161A", highlightBorderOpacity: 0.8 },
				legend: { clickable: true }
			} 
		);

	highlightHistogram();
	}
	var previousPoint = null;
	if (init) {
		$("#histogram").bind("plotclick", function (event, pos, item) {
			if (item) {
				deptSelect2(item.series, item.datapoint[0]);
				var i = 0;
				var numberSelected = 0;

				var anonFunction = function(){
					if(i == item.datapoint[0]){		
						chooseDept(this);
					}

		                    	if (deptselect[i]) { numberSelected++; }
					i++;
				}

				$(".deptcheck").each(anonFunction);

				// if all departments are unselected then select deptNo
				if (numberSelected == 0) { $(".deptNo").attr('checked',true); }
				deptCheckEvent();




			 }
		});
		$("#histogram").bind("plothover", function (event, pos, item) {
			$("#x").text(pos.x.toFixed(2));
			$("#y").text(pos.y.toFixed(2));

			if (item) {
				if (previousPoint != item.datapoint) {
					previousPoint = item.datapoint;

				$("#tooltip").remove();
				var x = item.datapoint[0].toFixed(2),
				y = item.datapoint[1].toFixed(2);
                    
				showRawNumbers(item.pageX-2, item.pageY-28,
					Math.round(item.datapoint[1]*100)/100);
				}
			}
			else {
				$("#tooltip").remove();
				previousPoint = null;            
			}
		});

		$("#histogram").mouseout(
			function() {
				highlightHistogram();
				$("#tooltip").remove();
				previousPoint = null;
			}
		);

	}


	init = 0;



	var anonFunction = function(){
		var value = this.id;
		//deptselect[depts[value]]=deptselect[depts[value]] ? 0 : 1;              
		var numberSelected = 0;
		var anonFunction = function(){
			if($(this).val() == value){
				chooseDept(this);
			}
			if ($("#"+value).hasClass("highlightedHist")) { numberSelected++; }
		}
		$(".deptcheck").each(anonFunction);

		// if all paper departments are unselected then select deptNo
		if (numberSelected == 0) { $(".deptNo").attr('checked',true); }
		deptCheckEvent();
	}

	$(".tickLabelX").click(anonFunction);

	$('.tickLabelX').each(function(i){
		$(this).qtip({
			content: histLabels[i],
			show: 'mouseenter',
			hide: 'mouseleave',
			position: {
				corner: {
					target: 'topRight',
					tooltip: 'bottomLeft'
				}
			},
			style: {
				name: 'dark'
			}
		});
	});


};
// ###################### end of function updateHistogram ############################


// =================================
// *** showRawNumbers ***
// =================================
    function showRawNumbers(x, y, contents) {
        $('<div id="tooltip">' + contents + '</div>').css( {
            position: 'absolute',
            display: 'none',
            top: y + 5,
            left: x + 5,
            border: '2px solid #404040',
            padding: '2px',
		color: '#fff',
            'background-color': '#505050',
		'z-index': 1223,
            opacity: 0.80
        }).appendTo("body").fadeIn(0);
    }
// ###################### end of function showRawNumbers ############################



// =================================
// *** chooseDept ***
// =================================
function chooseDept(thisPassed) {
	if($(thisPassed).attr('checked') == true){
		$(thisPassed).attr('checked',false);
		unhighlightLabel(thisPassed.value);
	}
	else if($(thisPassed).attr('checked') == false){
		$(thisPassed).attr('checked',true);
		$(".deptNo").attr('checked',false);
		highlightLabel(thisPassed.value);
	}
	else { }
}
// ###################### end of function chooseDept ############################


// =================================
// *** updatePieGraph ***
// =================================
function updatePieGraph(){
	var numOfTypes = percentdata.length;
	var numOfDepts = deptselect.length;
	//var data=new Array(numOfTypes);
	var data=[];

	var sum=0;


	for(var i=0; i< numOfTypes;i++){
		data[i] = 0;
	}

	for(var i=0; i<numOfDepts; i++){
		if(deptselect[i] == 1 || $(".deptNo").attr('checked')==true) {
			for(var j=0; j < numOfTypes; j++){
				data[j] = data[j]+deptTypeData[i][j];
				sum = sum + deptTypeData[i][j];
			}
			//alert(i+','+j+','+data[j]+','+deptTypeData[i][j]);

		}
	}
	for(var i=0; i<numOfTypes; i++){
		data[i] = data[i]/sum;
		percentdata[i]['data'] = data[i];

	}

	//for(var i=0; i < numOfTypes; i++){
	//	percentdata[i]['data'] = data[i];
	//}


	// don't draw the piechart if no papers match
	if (sum==0) {	
		$('#piegraph').html('');
	} else {

	var labelWithSpaces;
	plot1 = $.plot($("#piegraph"), percentdata,
	{
		series:{
			pie: {
				stroke: { color: '#959595', opacity: 1, width: 2, highlightedColor: '#000000' },
				show: true,
				highlight: { opacity: 1.0, color: '#CA2027' },
				radius: 70,
				label: {
					show: 'border',
					radius: 5/6,
					formatter: function(label, series){
						labelWithSpaces = label;
						if (label == "CreativeWriting") { labelWithSpaces = "Creative Writing" }; if(label == "Essay") { labelWithSpaces = "Argumentative Essay" }; 
						if (label == "ResponsePaper") { labelWithSpaces = "Response Paper" }; if (label == "ResearchPaper") { labelWithSpaces = "Research Paper" }; 
						if (series.percent > 1){
							return '<div id="'+label+'" class="pieClass unHighlightedPie" style="font-size:7.5pt;height:10px;text-align:center;padding:2px;padding-bottom:5px;padding-top:0px;">'+labelWithSpaces+'  '+Math.round(series.percent)+'%</div>';
						} else {
							return '<div id="'+label+'" class="pieClass unHighlightedPie" style="font-size:7.5pt;height:10px;text-align:center;padding:2px;padding-bottom:5px;padding-top:0px;">'+labelWithSpaces+'  '+1+'%</div>';
						}
					},
					background: {
						opacity: 1.0,
						color: '#FFFFFF'
					}
				}
			}
		},
		grid: {
			pie: { clickable: true },
			hoverable: true
		},
		legend: {
			show: false
		}
	});

	$(".pieClass").click(function(){
		var id = this.id;
		typeselect[typeName[id]]=typeselect[typeName[id]] ? 0 : 1;
                
		var i=0;
		var numberSelected = 0;

		var anonFunction = function(){
			if($(this).val() == id){
				if($(this).attr('checked') == true){
					$(this).attr('checked',false);
				} else{
					$(this).attr('checked',true);
					$(".typeNo").attr('checked',false);
				}
			}

			if (typeselect[i]) { numberSelected++; }
			i++;
		}
		$(".typecheck").each(anonFunction);

		// if all paper types are unselected then select typeNo
		if (numberSelected == 0) { $(".typeNo").attr('checked',true); }

		updateHistogram();
		showNumSelectedMessage();
		typeCheckEvent();

		for (var i in slicesGlobal) {
			if (id == slicesGlobal[i].label) {
				plot2.highlight(slicesGlobal[i],"plotclick2");
			}
		}
	});

	//update highlighing
	highlightPieChart();


	} // endif for sum == 0?
	     
	if (init) {
		$("#piegraph").bind("plotclick2", function (event, pos, item) {
			//console.log(item);
			if (item) {
				//alert('calling typeSelect from pie chart callback ' + event + ' ' + pos + ' ' + item);
				typeSelect(item.series, item.seriesIndex);
				var i = 0;
				var numberSelected = 0;
				//alert(item + ' ' + item.series + ' ' + item.seriesIndex + ' ' + item.id);
				var anonFunction = function(){
					if(typeName[this.value] == item.seriesIndex){
						if($(this).attr('checked') == true){
							$(this).attr('checked',false);
							//numberSelected--;
						} else{
							$(this).attr('checked',true);
							$(".typeNo").attr('checked',false);
							//numberSelected++;
						}
					}
					
					if (typeselect[i]) { numberSelected++; }
					i++;
				}
				$(".typecheck").each(anonFunction);
            
				// if all types are unselected then select typeNo
				if (numberSelected == 0) { $(".typeNo").attr('checked',true); }
				
				//$(".optionbody").slideToggle(600);
				showNumSelectedMessage();
				updateHistogram();
				typeCheckEvent();
			}	
		});
	}


	$('#piegraph').mouseout(
		function() { highlightPieChart(); }
	);

}
// ###################### end of function updatePieGraph ############################


function deptNoCheckEvent(){
	if($('.deptNo').attr('checked') == true){
		var i = 0;

		var anonFunction = function(){
			$(this).attr('checked',false);
			deptselect[i] = 0;
			i++;
		}
		$(".deptcheck").each(anonFunction);	

		highlightHistogram();
		updatePieGraph();
		for (var i in depts) {
			var value = depts[i];
			unhighlightLabel(value[1]);
		}
	}
	else{
		// trying to uncheck No Restriction
		$(this).attr('checked',true);
		return;
	}
	plot2.drawClickOverlay();


	if (!deptExpand) {
		showHideNumOptionSelected('dept','show');
	}

	// if in browse mode update paper list
	if (mode == 'browse') {
		browse();
	}
	else if (mode == 'search') {
		startSearchResultsUpdateTimer();
	}
	showNumSelectedMessage();
}
// ###################### end of function deptNoCheckEvent ############################


function typeNoCheckEvent(){
	if($('.typeNo').attr('checked') == true){
		var i = 0;

		var anonFunction = function(){
			$(this).attr('checked',false);
			typeselect[i] = 0;
			i++;
		}
		$(".typecheck").each(anonFunction);

		highlightPieChart();	
		updateHistogram();
	}
	else{
		// trying to uncheck No Restriction option
		$(this).attr('checked',true);
		return;
	}
	highlightsClick.splice(0,7);
	plot2.drawClickOverlay();


	if (!typeExpand) {
		showHideNumOptionSelected('type','show');
	}

	// if in browse mode update paper list
	if (mode == 'browse') {
		browse();
	}
	else if (mode == 'search') {
		startSearchResultsUpdateTimer();
	}
	showNumSelectedMessage();
}
// ###################### end of function typeNoCheckEvent ############################


function featureNoCheckEvent(){
	if($('.featureNo').attr('checked') == true){
		var i = 0;

		var anonFunction = function(){
			$(this).attr('checked',false);
			featureselect[i] = 0;
			i++;
		}
		$(".featurecheck").each(anonFunction);
	}
	else{
		// trying to uncheck No Restriction
		$(this).attr('checked',true);
		return;
	}
	// if in browse mode update paper list
	if (mode == 'browse') {
		browse();
	}
	else if (mode == 'search') {
		startSearchResultsUpdateTimer();
	}

	needToUpdateGraphs=true;


	showNumSelectedMessage();
}
// ###################### end of function featureNoCheckEvent ############################


function levelNoCheckEvent(){
	if($('.levelNo').attr('checked') == true){
		var i = 0;

		var anonFunction = function(){
			$(this).attr('checked',false);
			levelselect[i] = 0;
			i++;
		}
		$(".levelcheck").each(anonFunction);
	}
	else{
		// Trying to uncheck No Restriction
		$(this).attr('checked',true);
		return;
	}
	// if in browse mode update paper list
	if (mode == 'browse') {
		browse();
	}
	else if (mode == 'search') {
		startSearchResultsUpdateTimer();
	}

	needToUpdateGraphs=true;
	
	showNumSelectedMessage();
}
// ###################### end of function levelNoCheckEvent ############################



function nativeNoCheckEvent(){
	if($('.nativeNo').attr('checked') == true){
		var i = 0;

		var anonFunction = function(){
			$(this).attr('checked',false);
			nativeselect[i] = 0;
			i++;
		}
		$(".nativecheck").each(anonFunction);
	}
	else{
		// Trying to uncheck No Restriction
		$(this).attr('checked',true);
		return;
	}
	// if in browse mode update paper list
	if (mode == 'browse') {
		browse();
	}
	else if (mode == 'search') {
		startSearchResultsUpdateTimer();
	}

	needToUpdateGraphs=true;
	
	showNumSelectedMessage();
}
// ###################### end of function nativeNoCheckEvent ############################




function showNumSelectedMessage(newSearch){
	$("#info").html("");
	var modeStr = "searching";
	if(mode == "browse"){
		modeStr = "browsing";
	}

	var numSelectDept = 0;
	for(var i=0; i<deptselect.length; numSelectDept+=deptselect[i++]);

	var numSelectType = 0;
	for(var i=0; i<typeselect.length; numSelectType+=typeselect[i++]);

	var numSelectFeature = 0;
	for(var i=0; i<featureselect.length; numSelectFeature+=featureselect[i++]);

	var numSelectLevel = 0;
	for(var i=0; i<levelselect.length; numSelectLevel+=levelselect[i++]);


	var numOfTypes = percentdata.length;
	var numOfDepts = deptselect.length;
	var numOfFeatures= featureselect.length;

	
	
	var totalSelectPaperCounts = 0;
	var totalSelectHitCounts = 0;
	
	totalSelectPaperCounts = totalPaperCount;	// Sets the number of PAPERS that contain the query within the user's selections
	totalSelectHitCounts = totalHitCount;		// Sets the number of HITS that contain the query within the user's selections

	


	var query = currentSearchTerm;
	var totalDept = 16;
	var totalType = 7;
	var deptStr = " disciplines";
	if(numSelectDept == 1){
		deptStr = " discipline";
	}

	var levelStr = " levels";
	if(numSelectLevel == 1){
		levelStr = " level";
	}

	var typeStr = " paper types";
	if(numSelectType == 1){
		typeStr = " paper type";
	}
	var featureStr = " textual features";
	if(numSelectFeature == 1){
		featureStr = " textual feature";
	}
	var paperStr = " papers";
	if(totalSelectPaperCounts == 1){ 
		paperStr = " paper"; 
	}
	var timesStr = " times";
	if(totalSelectHitCounts == 1){ 
		timesStr = " time"; 
	}

	var nativeStr = "";
	if(nativeselect[0] == 1 && nativeselect[1] == 0){
		nativeStr = " by native speakers";
	} else if (nativeselect[1] == 1 && nativeselect[0] == 0){
		nativeStr = " by non-native speakers";
	} else { nativeStr = ""; }

	if (newSearch) {

		totalSelectHitCounts = '<span id="searchHitCount"><img src="/search/img/info_spinner.gif" alt="searching.."/></span>';
		totalSelectPaperCounts = '<span id="searchPaperCount"><img src="/search/img/info_spinner.gif" alt="searching.."/></span>';
	} else {
		totalSelectHitCounts = '<span id="searchHitCount"><img src="/search/img/info_spinner.gif" alt="searching.."/></span>';
		totalSelectPaperCounts = '<span id="searchPaperCount"><img src="/search/img/info_spinner.gif" alt="searching.."/></span>';
	}

	var msg = "";
	var postSearchInfo = "";

	// Infobox text for the results of a search
	if (numSelectDept == 0) { numSelectDept = 16; } 
	if (numSelectType == 0) { numSelectType = 7; } 
	if (numSelectFeature == 0) { numSelectFeature = 8; }
	if (numSelectLevel == 0) { numSelectLevel = 4; }	

	msg = "\""+query+"\" occurs "+totalSelectHitCounts+timesStr+" in "+totalSelectPaperCounts+paperStr+"<br/> (You searched in "+numSelectDept+deptStr+" at " + numSelectLevel+levelStr + " of "+numSelectType+typeStr+" with "+numSelectFeature+featureStr+nativeStr+")"; 

	// Infobox text when browsing and when search radio button 
	// has been selected but no search has been done yet.

	if((prevSearchInfo != "No results found. ") && (mode == 'search'))
	{ 
		$("#info").html(msg+postSearchInfo); 
		if (!newSearch) {
			updateHitCount();
		}
	}
	else if ((prevSearchInfo == "No results found. ") && (mode == 'search'))
	{ 
		//$("#info").html(prevSearchInfo); 
		$("#info").html('');
	}
	else {
		if (numSelectDept == 0) { numSelectDept = 16; } if (numSelectType == 0) { numSelectType = 7; } if (numSelectFeature == 0) { numSelectFeature = 8; }
		if (mode == 'browse') { $("#info").html("You are "+modeStr+" papers in "+numSelectDept+deptStr+" at " + numSelectLevel+levelStr + " of "+numSelectType+typeStr+" with "+numSelectFeature+featureStr+nativeStr+"."); } 
		else if (mode == 'search') { $("#info").html("Your search will be carried out in "+numSelectDept+deptStr+" at " + numSelectLevel+levelStr + " of "+numSelectType+typeStr+" with "+numSelectFeature+featureStr+nativeStr+"."); }
	}


	// ??? REMOVE ??
	// Text for the graph text box below the graphs.  Does not currently change at all.
	//	$("#graphinfotext").html("Please click on the graphs above or checkboxes on the right to narrow down your results. To deselect click again.");
}
// ###################### end of function showNumSelectedMessage ############################


function unhighlightLabel(id){
	if ($("#"+id).hasClass("tickLabelX")) {
		$("#"+id).addClass("unHighlightedHist");
	} else if ($("#"+id).hasClass("pieClass")) {
		$("#"+id).addClass("unHighlightedPie");
	}	
	$("#"+id).removeClass("highlightedHist highlightedPie");
}
// ###################### end of function unhighlightLabel ############################


function highlightLabel(id){
	if ($("#"+id).hasClass("unHighlightedHist")) { 
		$("#"+id).addClass("highlightedHist");
	} else if ($("#"+id).hasClass("unHighlightedPie")) { 
		$("#"+id).addClass("highlightedPie");
	}
	$("#"+id).removeClass("unHighlightedPie unHighlightedHist");
}
// ###################### end of function highlightLabel ############################


function highlightHistogram(){
	// is it better to use the deptselect variable
	// instead of checking the UI? 
	var i =0;
	var selectedI = 0;

	var anonFunction = function(){
		if($(this).attr('checked') == true){
			plot.highlight(0,i);
			deptselect[i] = 1;
			selectedI++;
			highlightLabel(this.value);
		}else{
			deptselect[i] = 0;
			plot.unhighlight(0,i);
			unhighlightLabel(this.value);
		}
		i++;
	}
	$(".deptcheck").each(anonFunction);

	if(selectedI == 0){
		$(".deptNo").attr('checked',true);
	}

}
// ###################### end of function highlightHistogram ############################


function highlightPieChart(){
	var i =0;
	var selectedI = 0;

	var anonFunction = function(){
		if($(this).attr('checked') == true){
			highlightLabel($(this).val());
			typeselect[typeName[this.value]] = 1;
			selectedI++;
		}else{
			unhighlightLabel($(this).val());
			typeselect[typeName[this.value]] = 0;
		}
		i++;
	}

	$(".typecheck").each(anonFunction);

	if(selectedI == 0){
		$(".typeNo").attr('checked',true);
	}
}
// ###################### end of function highlightPieChart ############################


function startSearchResultsUpdateTimer() {

	if (searchTimerID) {
		clearTimeout(searchTimerID);
	}	
	
	if (mode == 'browse') {
		searchTimerID = setTimeout('doBrowse()',2000)
	} else {
		searchTimerID = setTimeout('doSearch()',2000)
	}


}
// ###################### end of function startSearchResultsUpdateTimer ############################


function deptCheckEvent() {
	$(".deptNo").attr('checked',false);
	
	// if in browse mode update paper list
	if (mode == 'browse') {
		browse();
	}
	else if (mode == 'search') {
		startSearchResultsUpdateTimer();
	}

	if (!deptExpand) {
		showHideNumOptionSelected('dept','show');
	}

	highlightHistogram();
	updatePieGraph();
	

	for (var i in typeselect) {
		if (typeselect[i] == 1) {
			if (slicesGlobal[i].angle != 0) {
				plot2.drawClickOverlay();
			}
		}
	}

	showNumSelectedMessage();


}
// ###################### end of function deptCheckEvent ############################


function typeCheckEvent(){
	var numtype;

	$(".typeNo").attr('checked',false);
	// if in browse mode update paper list
	if (mode == 'browse') {
		browse();
	}
	else if (mode == 'search') {
		startSearchResultsUpdateTimer();
	}

	if (!typeExpand) {
		showHideNumOptionSelected('type','show');
	}


	highlightPieChart();
	updateHistogram();
	showNumSelectedMessage();
	if (this.value) {
		for (var i in slicesGlobal) {
			if ((this.value == slicesGlobal[i].label) && (slicesGlobal[i].angle != 0)) {
				plot2.highlight(slicesGlobal[i],"plotclick2");
			}
		}
	}
}
// ###################### end of function typeCheckEvent ############################


function featureCheckEvent(){
	/* NEED TO CHANGE THE SEARCH BROWSE MESSAGE & if in browse mode redraw the graphs... a new call to dept */

	$(".featureNo").attr('checked',false);


	var featureCheckCount=0;
	for (var i in textualFeatureLabels) {
		if (this.id == textualFeatureLabels[i]) {
			if (featureselect[i] == 0) {
				featureselect[i] = 1;
			}
			else if (featureselect[i] == 1) {
				featureselect[i] = 0;
			}
		}
		featureCheckCount += featureselect[i];

	}

	if (featureCheckCount == 0) { $(".featureNo").attr('checked',true); }

	// if in browse mode update paper list
	if (mode == 'browse') {
		browse();
	}
	else if (mode == 'search') {
		startSearchResultsUpdateTimer();
	}

	needToUpdateGraphs=true;

	showNumSelectedMessage();
}
// ###################### end of function featureCheckEvent ############################


function levelCheckEvent(){

	$(".levelNo").attr('checked',false);

	var levelCheckCount=0
	for (var i in levelLabels) {
		if (this.value == levelLabels[i]) {
			if (levelselect[i] == 0) {
				levelselect[i] = 1;
			}
			else if (levelselect[i] == 1) {
				levelselect[i] = 0;
			}
		}
		levelCheckCount+=levelselect[i];

	}

	if (levelCheckCount == 0) { $(".levelNo").attr('checked',true); }

	// if in browse mode update paper list
	if (mode == 'browse') {
		browse();
	}
	else if (mode == 'search') {
		startSearchResultsUpdateTimer();
	}

	needToUpdateGraphs=true;

	showNumSelectedMessage();
}
// ###################### end of function levelCheckEvent ############################

function nativeCheckEvent(){

	$(".nativeNo").attr('checked',false);

	var nativeCheckCount=0
	for (var i in nativeLabels) {
		if (this.value == nativeLabels[i]) {
			if (nativeselect[i] == 0) {
				nativeselect[i] = 1;
			}
			else if (nativeselect[i] == 1) {
				nativeselect[i] = 0;
			}
		}
		nativeCheckCount+=nativeselect[i];

	}

	if (nativeCheckCount == 0) { $(".nativeNo").attr('checked',true); }

	// if in browse mode update paper list
	if (mode == 'browse') {
		browse();
	}
	else if (mode == 'search') {
		startSearchResultsUpdateTimer();
	}

	needToUpdateGraphs=true;

	showNumSelectedMessage();
}
// ###################### end of function nativeCheckEvent ############################



/* ==========================

	UPDATE -- 

============================= */
function update(){

	needToUpdateGraphs=false;
	
	$("#histogram").html("<p><img src='/search/img/ajax-loader.gif'/></p>");

	$("#piegraph").html("<p><img src='/search/img/ajax-loader.gif'/></p>");
	

	var url = "/search/dept/";

	if (mode == 'search') { url = "/search/searchSummary/"; }

       $.get(url,$("#searchform").serialize(),
		function(data) {
			eval(data);
			updateHitCount();
			updatePieGraph();
			updateHistogram();	
			plot2.drawClickOverlay();	
	  	}	
	);

	return;	

}
// ###################### end of function update ############################


// based on the current selections for paper type and discipline
// calculate and update hits count
function updateHitCount() {

	var totalHitCount = 0;
	for (var dept in deptselect) {
		deptSelected =  1 & $('.deptNo').attr('checked') || deptselect[dept];
		for (var ptype in typeselect) {

			typeSelected =  1 & $('.typeNo').attr('checked') || typeselect[ptype];

			if (deptSelected && typeSelected) {
				totalHitCount = totalHitCount + deptTypeData[dept][ptype];
			}
		}
	}
	$('#searchHitCount').html(totalHitCount);

}
// ###################### end of function updateHitCount() ############################



function initMenu(){
	//$(".optionbody").hide();

	$("#levelbody").hide();
	$("#nativebody").hide();
	$("#featurebody").hide();
	

	$("#depthead").click(
                function(){
			if(deptExpand == true){
				deptExpand = false;
				$("#deptCollapseTriangle").html("<img src='/search/img/right.png' alt='Show Disciplines'/>");
				showHideNumOptionSelected('dept','show');

			}
			else{
				deptExpand = true;
				$("#deptCollapseTriangle").html("<img src='/search/img/down.png' alt='Hide Disciplines'/>");
				showHideNumOptionSelected('dept','hide');

			}
			$("#deptbody").slideToggle(600);
                }
        );
	$("#typehead").click(
		function(){
			if(typeExpand == true){
				typeExpand = false;
				$("#typeCollapseTriangle").html("<img src='/search/img/right.png' alt='Show Paper Types'/>");
				showHideNumOptionSelected('type','show');

			}
			else{
				typeExpand = true;
				$("#typeCollapseTriangle").html("<img src='/search/img/down.png' alt='Hide Paper Types'/>");
				showHideNumOptionSelected('type','hide');

			}
			$("#typebody").slideToggle(600);
		}
	);

	$("#featurehead").click(
		function(){
			if(featureExpand == true){
				featureExpand = false;
				$("#featureCollapseTriangle").html("<img src='/search/img/right.png' alt='Show Features'/>");
				showHideNumOptionSelected('feature','show');
			}
			else{
				featureExpand = true;
				$("#featureCollapseTriangle").html("<img src='/search/img/down.png' alt='Hide Features'/>");
				showHideNumOptionSelected('feature','hide');
			}
			$("#featurebody").slideToggle(600);
		}
	);


	$("#levelhead").click(
		function(){
			if(levelExpand == true){
				levelExpand = false;
				$("#levelCollapseTriangle").html("<img src='/search/img/right.png' alt='Show Levels'/>");
				showHideNumOptionSelected('level','show');
			}
			else{
				levelExpand = true;
				$("#levelCollapseTriangle").html("<img src='/search/img/down.png' alt='Hide Levels'/>");
				showHideNumOptionSelected('level','hide');
			}
			$("#levelbody").slideToggle(600);
		}
	);

	$("#nativehead").click(
		function(){
			if(nativeExpand == true){
				nativeExpand = false;
				$("#nativeCollapseTriangle").html("<img src='/search/img/right.png' alt='Show Nativeness Values'/>");
				showHideNumOptionSelected('native','show');
			}
			else{
				nativeExpand = true;
				$("#nativeCollapseTriangle").html("<img src='/search/img/down.png' alt='Hide Nativeness Values'/>");
				showHideNumOptionSelected('native','hide');
			}
			$("#nativebody").slideToggle(600);
		}
	);





}
// ###################### end of function initMenu ############################


function showHideNumOptionSelected(optionType,mode) {

	var numChecked=0;

	var elementID = '#' + optionType + 'Cnt';

	if (mode=='hide') {
		$(elementID).html('');
		return;
	}		


	var selectObj = eval(optionType+'select');
	for (var i in selectObj) {
		numChecked += selectObj[i];
	}
	
	if (numChecked>0) {
		$(elementID).html("("+numChecked+")");
	} else {
		$(elementID).html('');
		
	}
	
}
// ###################### end of function showHideNumOptionSelected ############################


function next(start,dir) {
	if (dir=='+') {
		dir=10;
	} else {
		dir=-10;
	}

	modeURL='search';
	if (mode=='browse') {
		modeURL='browse';
		dir=dir*2;
	}

	// get sort options
	var sortOptions = getSortOptions();
			
	params = $('#searchform').serialize();
	params += "&start="+ (start+dir) + "&sort=" + sortOptions[0] + "&direction=" + sortOptions[1];


	$("#text").html("<p><img src='/search/img/ajax-loader.gif'/></p>");

	$('.qtip-active').qtip('hide');

	$.get('/search/'+modeURL+'/',
		params,
		function(data) { $("#text").html(data); 
			//$("#queryinfo").html("");
		}
	);
	//$("#queryinfo").html("");
}
// ###################### end of function next ############################



function doSearch() {


	

	// change mode value to
	// fix issue when radio button for search mode not activated
	mode='search';

	//$('input[name=mode]')[1].checked=true;

	// set the results pane to loading spinner
	$("#text").html("<p><img src='/search/img/ajax-loader.gif'/></p>");
	
	// get current discipline and type selections
	params = $("#searchform").serialize();


	// get current sort options		
	var sortOptions = getSortOptions();
		
	params += "&sort=" + sortOptions[0] + "&direction=" + sortOptions[1];

	$.get('/search/search/',
		params,                                	
		function(data) {
		$("#text").html(data);

		$('#searchPaperCount').html(totalPaperCount);

		}
 	);


	if (needToUpdateGraphs) {
	
	/*	$.post('/search/searchSummary/',
			params,
			function(data) {
				$('#searchHitCount').html('###');
			}	
		);
	*/
	
	//	normalizeResults=false;
		$('#normalizationOptions').show();
		update();
	}



	$('.qtip-active').qtip('hide');

}
// ###################### end of function doSearch ############################


function getSortOptions() {
	var sortCol='';
	var direction='asc';
	for (var i=0; i<columnStatus.length; i++) {
		if (columnStatus[i]!=0) {
			sortCol=cIDs[i];
			if (columnStatus[i]==-1)  {
				direction='desc';
			}
		}	
	}
	return [sortCol,direction];
};
// ###################### end of function getSortOptions ############################


function browse() {
		startSearchResultsUpdateTimer();
}


function doBrowse() {

	if (mode=='browse') {
		$("#text").html("<p><img src='/search/img/ajax-loader.gif'/></p>");

		// get current discipline and type selections
		params = $("#searchform").serialize();

		// get current sort options		
		var sortOptions = getSortOptions();
		

		/*
		var q = $("#searchbox").val();
		var paperidRegex = /(BIO|CEE|CLS|ECO|EDU|ENG|HIS|IOE|LIN|MEC|NRE|NUR|PHI|PHY|POL|PSY|SOC)(\.G[0123](\.[0-5](\.[1-8])?)?)?/;

		if (paperidRegex.test(q)) {
			params += "&paperid=" + q
		}
		*/

		params += "&start=1&sort=" + sortOptions[0] + "&direction=" + sortOptions[1];

		$.get('/search/browse/',
			params,
			function(data) {
				$("#text").html(data);

			}
 		);

		$('.qtip-active').qtip('hide');

		if (needToUpdateGraphs) {
			update();
		}

	}

}
// ###################### end of function doBrowse ############################




// toggle the normalizeResults boolean
function normalizationOption() {
	
	/*
	if (normalizeResults) {
		normalizeResults = false;
	} else {
		normalizeResults = true;
	}
	*/

	if ($(".normalize:checked").val()=='norm') {
		normalizeResults = true;
	} else {
		normalizeResults = false;
	}
	


	updateHistogram();

}
// ###################### end of function normalizationOption ############################



function clearSelection(feature) {

	if ($(feature).attr('checked')) {
		return false;
	} else {

		$(feature).attr('checked',true);
		if (feature=='.deptNo') {
			deptNoCheckEvent();
		} else {
			typeNoCheckEvent();
		}
		return false;

	}
}
// ###################### end of function clearSelection ############################



function printResults(var1) {
	window.open(url='/search/print?url='+escape(var1));
	//window.open(var1);

}
// ###################### end of function printResults ############################



function downloadResults(var1) {
	//setTimeout("window.open('/search/img/test.csv','Download')",1000);
	window.open(url=var1);
}
// ###################### end of function downloadResults ############################



function linkResults(var1) {
	
}
// ###################### end of function linkResults ############################
