from django.http import HttpResponse
from django.shortcuts import render_to_response, get_object_or_404
from view_cache_utils import cache_page_with_prefix
from django.conf import settings

#from forms import SearchForm

import urllib, urllib2
import xml.dom.minidom as mdom
import re, csv

from lxml import etree


cache_time_minutes = 60000

# for each discipline a tuple of paper numbers and total token count
dept_size = {
'BIO': (67,174112), 
'CEE': (31,98213), 
'ECO': (25,77668),
'EDU': (46,149099), 
'ENG': (98,265396), 
'HIS_CLS': (40,180523), 
'IOE': (42,124527), 
'LIN': (41,154160), 
'MEC': (32,122176), 
'NRE': (62,173071), 
'NUR': (42,157785), 
'PHI': (44,127290), 
'PHY': (21,44866), 
'POL': (62,208223), 
'PSY': (104,322808), 
'SOC': (72,214087) 
}

map_dept = { 
	'BIO': 0,
	'CEE': 1,
	'ECO': 2,
	'EDU': 3,
	'ENG': 4,
	'HIS': 5,
	'HIS_CLS': 5,
	'IOE': 6,
	'LIN': 7,
	'MEC': 8,
	'NRE': 9,
	'NUR': 10,
	'PHI': 11,
	'PHY': 12,
	'POL': 13,
	'PSY': 14,
	'SOC': 15
	}

'''
map_type = {
	'Report': 4,
	'Critique': 2,
	'ResearchPaper': 5,
	'Essay': 0,
	'ResponsePaper': 6,
	'CreativeWriting': 1,
	'Proposal': 3,
	}
'''

map_type = {
	'Report': 2,
	'Critique': 3,
	'ResearchPaper': 5,
	'Essay': 0,
	'ResponsePaper': 6,
	'CreativeWriting': 1,
	'Proposal': 4,
	}



def print_view(request):
	url = request.GET['url']
	return render_to_response('print_frame.html', { 'url': url })


def browse_key_prefix(request):
	
	include_params = ['q', 'native', 'level', 'feature', 'dept', 'type','sort', 'start', 'direction','howmany']

	#if not (request.GET and request.POST):
	#	return None	

	if request.GET:
		params = request.GET.lists() 	

	if request.POST:
		params = request.POST.lists()

	#params = filter(lambda x: x[0] in include_params, params)

	params.sort()
	return 'br-'+'_'.join(["%s=%s" % (i[0], '_'.join(i[1])) for i in params]).replace(' ','')


@cache_page_with_prefix(60 * cache_time_minutes, browse_key_prefix)
def browse(request):
	url = "http://localhost:4444/exist/rest/db/MICUSP/queries/browse.xql"


	url2 = "http://localhost:4444/exist/rest/db/MICUSP/queries/getby_paperID.xql"
	
	sort=None
	direction={}
	save={ 'link': '', 'download': '', 'print': '' }
	mode="browse"

	if request.method=='POST':
		param={}
		if request.POST.has_key('dept'):
			param['dept']= request.POST.getlist('dept')

		if request.POST.has_key('type'):
			param['type'] = request.POST.getlist('type')


		if request.POST.has_key('feature'):
			param['feature'] = request.POST.getlist('feature')


		if request.POST.has_key('level'):
			param['level'] = request.POST.getlist('level')


		if request.POST.has_key('native'):
			param['native'] = request.POST.getlist('native')


		if request.POST.has_key('start'):
			param['start'] = request.POST['start']
		
		if request.POST.has_key('howmany'):
			param['howmany'] = request.POST['howmany']

		if request.POST.has_key('sort'):
			param['sort'] = request.POST['sort']
			sort=request.POST['sort']

		if request.POST.has_key('direction'):
			dir = request.POST['direction']
			param['direction'] = dir
			direction['img'] = dir == 'asc' and '/search/img/up.png' or '/search/img/down.png'
			direction['alt'] = dir == 'asc' and 'Sort ascending' or 'Sort descending'

		if param.has_key('native'):
			if len(param['native'])>1:
				param.pop('native') 


		if request.POST.has_key('mode'):
			mode=request.POST['mode']

		data = urllib.urlencode(param,doseq=1)
		
		r=urllib2.urlopen(url,data)


	elif request.method=='GET':
		param={}
		if request.GET.has_key('dept'):
			param['dept']= request.GET.getlist('dept')

		if request.GET.has_key('type'):
			param['type'] = request.GET.getlist('type')


		if request.GET.has_key('feature'):
			param['feature'] = request.GET.getlist('feature')


		if request.GET.has_key('level'):
			param['level'] = request.GET.getlist('level')

		if request.GET.has_key('native'):
			param['native'] = request.GET.getlist('native')

		if request.GET.has_key('start'):
			param['start'] = request.GET['start']
		
		if request.GET.has_key('howmany'):
			param['howmany'] = request.GET['howmany']

		if request.GET.has_key('sort'):
			param['sort'] = request.GET['sort']
			sort=request.GET['sort']

		if request.GET.has_key('direction'):
			dir = request.GET['direction']
			param['direction'] = dir
			direction['img'] = dir == 'asc' and '/search/img/up.png' or '/search/img/down.png'
			direction['alt'] = dir == 'asc' and 'Sort ascending' or 'Sort descending'


		if param.has_key('native'):
			if len(param['native'])>1:
				param.pop('native')
		

		if request.GET.has_key('mode'):
			mode=request.GET['mode']

		if mode=='print' or mode=='download':
			param['howmany']=-1

		data = urllib.urlencode(param,doseq=1)

		save['print']='/search/browse/?mode=print&%s' % data
		save['download']='/search/browse/?mode=download&%s' % data
		save['link']='/savedBrowse?%s' % data

		
		r=urllib2.urlopen(url,data)

	else:
                r=urllib2.urlopen(url)





        results = []
        
        doc=mdom.parse(r).getElementsByTagName("results")[0]


	if mode == 'print':
		#xslt = etree.parse('/Users/micusp/micusp-search/micusp/search/templates/browse_print.xsl')
		xslt = etree.parse(settings.STATIC_ROOT+'/search/templates/browse_print.xsl')

		transform = etree.XSLT(xslt)
		html = transform(etree.fromstring(doc.toxml('utf-8')))
		return HttpResponse(str(html))		

	elif mode == 'download':
		response = HttpResponse(mimetype='text/csv')
		response['Content-Disposition'] = 'attachment; filename=micusp_papers.csv'
		
		writer = csv.writer(response)

		headers="PAPER ID,TITLE,DISCIPLINE,PAPER TYPE,STUDENT LEVEL,SEX,NATIVENESS,TEXTUAL FEATURES"
		writer.writerow(headers.split(','))

		for p in doc.getElementsByTagName("paper"):
			row = []
			row.append(p.attributes['doc'].value)
			for c in p.childNodes:
				if c.nodeType==1:
					d = unicode(c.firstChild.data)
					row.append(d.encode('utf-8'))
			writer.writerow(row)

		return response		


	try:
		papers = doc.attributes['papers'].value

		start = doc.getElementsByTagName("paper")[0].attributes['num'].value

		last = papers == doc.getElementsByTagName("paper")[-1].attributes['num'].value

		paper_elements = doc.getElementsByTagName("paper")

	        for d in paper_elements:
			results.append({'doc': d.attributes['doc'].value, 
					'title': d.getElementsByTagName('title')[0].firstChild.data,
                        	        'dept': d.getElementsByTagName('discipline')[0].firstChild.data,
					'type': d.getElementsByTagName('paperType')[0].firstChild.data,
					'paper_info': '''
							<table class="paper_info"><tbody>
							<tr><td class="label">Discipline:</td><td>%s</td></tr>
							<tr><td class="label">Student Level:</td><td>%s</td></tr>
							<tr><td class="label">Sex:</td><td>%s</td></tr>
							<tr><td class="label">Native speaker status:</td><td>%s</td></tr>
							<tr><td class="label">Paper type:</td><td>%s</td></tr>
							<tr><td class="label">Textual features:</td><td>%s</td></tr>
							</tbody></table>
						      '''
						% (d.getElementsByTagName('discipline')[0].firstChild.data,
						   d.getElementsByTagName('studentLevel')[0].firstChild.data,
						   d.getElementsByTagName('sex')[0].firstChild.data,
						   d.getElementsByTagName('nativeness')[0].firstChild.data,
						   d.getElementsByTagName('paperType')[0].firstChild.data,
						   d.getElementsByTagName('features')[0].firstChild.data)				
					
					})

	except:
		papers=[]
		start=0
		last=1
		paper_elements=[]

        return render_to_response('browse.html',{'results':results, 'papers': papers, 
				  'start': start, 'num': len(paper_elements) + int(start) - 1, 
				  'last': last, 'sort': sort, 'direction': direction, 'save': save })



def dept_key_prefix(request):
	
	include_params = ['q', 'native', 'level', 'feature', 'dept', 'type','sort']

	#if not (request.GET and request.POST):
	#	return None	

	if request.GET:
		params = request.GET.lists() 	

	if request.POST:
		params = request.POST.lists()

	params = filter(lambda x: x[0] in include_params, params)

	params.sort()
	return 'dt-'+'_'.join(["%s=%s" % (i[0], '_'.join(i[1])) for i in params]).replace(' ','')


@cache_page_with_prefix(60 * cache_time_minutes, dept_key_prefix)
def dept(request):
	url = "http://localhost:4444/exist/rest/db/MICUSP/queries/distribution.xql"
	url2 = "http://localhost:4444/exist/rest/db/MICUSP/queries/searchQuery.xql"

	if request.method=='POST':
		param={'dept': request.POST.getlist('dept'), 'type': request.POST.getlist('type'), 
			'feature': request.POST.getlist('feature'), 'level': request.POST.getlist('level'),
			'native': request.POST.getlist('native'),
			'q': '"%s"' % request.POST['q'].encode('UTF8')}

		if len(param['native'])>1:
			param.pop('native')

		data = urllib.urlencode(param,doseq=1)
		r=urllib2.urlopen(url,data)
		q2 = request.POST['q']


		#if q2!='':
		#	param['howmany']=-1
		#	data = urllib.urlencode(param,doseq=1)
		#	r2=urllib2.urlopen(url2,data)
		#	return HttpResponse(r2)

	elif request.method=='GET' and request.GET.has_key('q'):
		param={'dept': request.GET.getlist('dept'), 'type': request.GET.getlist('type'), 
			'feature': request.GET.getlist('feature'), 'level': request.GET.getlist('level'),
			'native': request.GET.getlist('native'),
			'q': '"%s"' % request.GET['q'].encode('UTF8')}

		if len(param['native'])>1:
			param.pop('native')

		data = urllib.urlencode(param,doseq=1)
		r=urllib2.urlopen(url,data)
		q2 = request.GET['q']

	else:
                r=urllib2.urlopen(url)
                q2=''


        depts=[]
        doc=mdom.parse(r)
        deptType = []
        for d in doc.getElementsByTagName("dept"):
                typeList = [0,0,0,0,0,0,0]
                i = 0
                for t in d.childNodes:
                        if t.nodeName != '#text' and t.nodeName != 'total':
                                #typeList.append(d.getElementsByTagName(t.nodeName)[0].firstChild.data)
				typeList[map_type[t.nodeName]]=t.firstChild.data
				
                deptType.append(typeList)
	
        for d in doc.getElementsByTagName("dept"):
                depts.append(d.getElementsByTagName("total")[0].firstChild.data)
	
	return render_to_response('base_histogram.html', { 'points': depts, 'q': q2, 'deptType':deptType})


def type(request):
	typeurl = "http://localhost:4444/exist/rest/db/MICUSP/queries/type.xql"
	if request.method=='POST':
		typeparam={'type': request.POST.getlist('type'), 'dept': request.POST.getlist('dept'), 'q': '"%s"' % request.POST['q']
.encode('UTF8')}
		typedata = urllib.urlencode(typeparam,doseq=1)
                typer=urllib2.urlopen(typeurl,typedata)
		q2 = request.POST['q']
	else:
                q2=''
		typer=urllib2.urlopen(typeurl)
	types = []
	typedoc=mdom.parse(typer)
        for d in typedoc.getElementsByTagName("type"):
                types.append({'name': d.attributes['id'].value,'percent': d.getElementsByTagName("total")[
0].firstChild.data})
	return render_to_response('base_type.html', { 'types': types, 'q': q2 })	



def search_summary_key_prefix(request):
	
	include_params = ['q', 'native', 'level', 'feature', 'include_all']

	#if not (request.GET and request.POST):
	#	return None	

	if request.GET:
		params = request.GET.lists() 	

	if request.POST:
		params = request.POST.lists()

	params = filter(lambda x: x[0] in include_params, params)

	params.sort()
	return 'ss-'+'_'.join(["%s=%s" % (i[0], '_'.join(i[1])) for i in params]).replace(' ','')


@cache_page_with_prefix(60 * cache_time_minutes, search_summary_key_prefix)
def search_summary(request):
        url = "http://localhost:4444/exist/rest/db/MICUSP/queries/searchSummary.xql"
	url2 = "http://localhost:4444/exist/rest/db/MICUSP/queries/wordCounts.xql"

	data_frame = [

		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0]

	]

	token_frame = [

		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0]
	];


	if request.method=='POST':
		param={ 'feature': request.POST.getlist('feature'),
			'level': request.POST.getlist('level'),
			'native': request.POST.getlist('native'),
			'q': '"%s"' % request.POST['q'].encode('UTF8')}

		if request.POST.has_key('include_all'):
			param['include_all'] = request.POST['include_all']
		
		q2 = request.POST['q']

	elif request.method=='GET' and request.GET.has_key('q'):
		param={	'feature': request.GET.getlist('feature'),
			'level': request.GET.getlist('level'),
			'native': request.GET.getlist('native'),
			'q': '"%s"' % request.GET['q'].encode('UTF8')}

		if request.GET.has_key('include_all'):
			param['include_all'] = request.GET['include_all']

		q2 = request.GET['q']


	else:
		return HttpResponse(data_frame)

	if len(param['native'])>1:
		param.pop('native')

	data = urllib.urlencode(param,doseq=1)
	r=urllib2.urlopen(url,data)

	r2=urllib2.urlopen(url2,data)

	results = etree.parse(r).xpath('//hit')


	# escape periods for things like i.e.
	q2 = re.sub('[.]','[.]',q2)

       	q2 = re.sub('([-,])','(\\1| )', re.sub(' ','[-,?!.:]?[ -]',q2.lower()))
 	
	if q2.endswith('[.]'):
		qregex = re.compile('\\b(%s)' % q2, re.IGNORECASE)
	else:
		qregex = re.compile('\\b(%s)\\b' % q2, re.IGNORECASE)

	#pid=None
	for result in results:
		dept = result.attrib['dept']
		type = result.attrib['type']
		#paper_id = result.attrib['id']
		#if pid!=paper_id:
		#	pid=paper_id
		#	token_frame[map_dept[dept]][map_type[type]]+=int(result.attrib['wc'])
		hits = len(re.findall(qregex,result.text))

		data_frame[map_dept[dept]][map_type[type]]+=hits

	depts = [ sum(r) for r in data_frame ]

	tokens = etree.parse(r2).xpath('//dept')
	for d in tokens:
		dept = d.attrib['id']
		for t in d.getchildren():
			ptype = t.attrib['id']
			token_frame[map_dept[dept]][map_type[ptype]]+=int(t.text)

	return render_to_response('base_histogram.html', { 'points': depts, 'q': q2, 'deptType':data_frame, 'token_frame': token_frame})



def main(request):
        url = "http://localhost:4444/exist/rest/db/MICUSP/queries/distribution.xql"
	typeurl = "http://localhost:4444/exist/rest/db/MICUSP/queries/type.xql"

	#form=SearchForm(request.GET, auto_id=True)
	dept={}
	type={}
	native={}
	level={}
	feature={}
	q=""

	if request.GET.has_key('q'):
		q=request.GET['q'].replace('"','')	

	if request.GET.has_key('mode'):
		mode=request.GET['mode']
	else:
		mode='browse'

	if request.GET.has_key('dept'):
		deptList = request.GET.getlist('dept')
		dept=dict(zip(deptList,['checked="checked"']*len(deptList)))

	if request.GET.has_key('type'):
		typeList = request.GET.getlist('type')
		type=dict(zip(typeList,['checked="checked"']*len(typeList)))


	if request.GET.has_key('feature'):
		featureList = request.GET.getlist('feature')
		feature=dict(zip(featureList,['checked="checked"']*len(featureList)))


	if request.GET.has_key('native'):
		nativeList = request.GET.getlist('native')
		native=dict(zip(nativeList,['checked="checked"']*len(nativeList)))

	if request.GET.has_key('level'):
		levelList = request.GET.getlist('level')
		level=dict(zip(levelList,['checked="checked"']*len(levelList)))


        if request.method=='POST':
                param={'dept': '|'.join(request.POST.getlist('dept')), 'type': '|'.join(request.POST.getlist('type')),'q': '"%s"' % request.POST['q'].encode('UTF8')}

                data = urllib.urlencode(param)
                r=urllib2.urlopen(url,data)
                q2 = request.POST['q']
		#pie graph
		typeparam={'type': '|'.join(request.POST.getlist('type')),'dept': '|'.join(request.POST.getlist('dept')), 'q': '"%s"' % request.POST['q'].encode('UTF8')}
		typedata = urllib.urlencode(typeparam)
		
        else:
                r=urllib2.urlopen(url)
                q2=''


        depts=[]
        doc=mdom.parse(r)

	deptType = []
	for d in doc.getElementsByTagName("dept"):
		typeList = [0,0,0,0,0,0,0]
		i = 0
		for t in d.childNodes:
			if t.nodeName != '#text' and t.nodeName != 'total':
				typeList[map_type[t.nodeName]]=t.firstChild.data

		deptType.append(typeList)

        for d in doc.getElementsByTagName("dept"):
                depts.append(d.getElementsByTagName("total")[0].firstChild.data)
		
        types=[]

        return render_to_response('base.html', { 'points': depts, 'q': q2, 'r':r, 'deptType':deptType,
			
			 'dept': dept, 'type': type, 'level': level, 'native': native, 'feature': feature,
			'q': q, 'mode': mode
	 })





def search_key_prefix(request):
	
	include_params = ['q', 'native', 'level', 'feature', 'dept', 'type','sort', 'start', 'direction','howmany','include_all']

	params=[]
	#if not (request.GET and request.POST):
	#	return None	

	if request.GET:
		params = request.GET.lists() 	

	if request.POST:
		params = request.POST.lists()

	params = filter(lambda x: x[0] in include_params, params)

	params.sort()
	return 'sh-'+'_'.join(["%s=%s" % (i[0], '_'.join(i[1])) for i in params]).replace(' ','')


@cache_page_with_prefix(60 * cache_time_minutes, search_key_prefix)
def search(request):
        url = "http://localhost:4444/exist/rest/db/MICUSP/queries/query2.xql"

	lookupPaperID = False
	param={}
	sort=None
	direction={}
	save={ 'link': '', 'download': '', 'print': '' }
	mode="search"
	q=''
        if request.method=='POST':
                param={'q': '"%s"' % request.POST['q'].encode('UTF8'), 'mode': 'search'}

		if request.POST.has_key('dept'):
			param['dept']= request.POST.getlist('dept')
			#param['dept'] = request.POST.getlist('dept')[0:2]

		if request.POST.has_key('type'):
			param['type'] = request.POST.getlist('type')

		if request.POST.has_key('feature'):
			param['feature'] = request.POST.getlist('feature')

		if request.POST.has_key('level'):
			param['level'] = request.POST.getlist('level')

		if request.POST.has_key('native'):
			param['native'] = request.POST.getlist('native')

		if request.POST.has_key('start'):
			param['start'] = request.POST['start']
		
		if request.POST.has_key('howmany'):
			param['howmany'] = request.POST['howmany']


		if request.POST.has_key('sort'):
			param['sort'] = request.POST['sort']
			sort=request.POST['sort']

		if request.POST.has_key('direction'):
			dir = request.POST['direction']
			param['direction'] = dir
			direction['img'] = dir == 'asc' and '/search/img/up.png' or '/search/img/down.png'
			direction['alt'] = dir == 'asc' and 'Sort ascending' or 'Sort descending'
		if request.POST.has_key('include_all'):
			param['include_all'] = request.POST['include_all']


		if param.has_key('native'):
			if len(param['native'])>1:
				param.pop('native')


		if request.POST.has_key('mode'):
			param['mode'] = request.POST['mode']

			if param['mode']=='print':
				param['howmany']=-1


                data = urllib.urlencode(param,doseq=1)
                r=urllib2.urlopen(url,data)
                q=request.POST['q']


        elif request.method=='GET':
                param={'q': '"%s"' % request.GET['q'].encode('UTF8'), 'mode': 'search', 'include_all': 'off'}

		if request.GET.has_key('dept'):
			param['dept']= request.GET.getlist('dept')
			#param['dept'] = request.GET.getlist('dept')[0:2]

		if request.GET.has_key('type'):
			param['type'] = request.GET.getlist('type')

		if request.GET.has_key('feature'):
			param['feature'] = request.GET.getlist('feature')

		if request.GET.has_key('level'):
			param['level'] = request.GET.getlist('level')

		if request.GET.has_key('native'):
			param['native'] = request.GET.getlist('native')

		if request.GET.has_key('start'):
			param['start'] = request.GET['start']
		
		if request.GET.has_key('howmany'):
			param['howmany'] = request.GET['howmany']


		if request.GET.has_key('sort'):
			param['sort'] = request.GET['sort']
			sort=request.GET['sort']

		if request.GET.has_key('direction'):
			dir = request.GET['direction']
			param['direction'] = dir
			direction['img'] = dir == 'asc' and '/search/img/up.png' or '/search/img/down.png'
			direction['alt'] = dir == 'asc' and 'Sort ascending' or 'Sort descending'

		if request.GET.has_key('include_all'):
			param['include_all'] = request.GET['include_all']
			

		if param.has_key('native'):
			if len(param['native'])>1:
				param.pop('native')


		if request.GET.has_key('mode'):
			param['mode'] = request.GET['mode']
			mode=param['mode']
			if param['mode'] in ('print','download'):
				param['howmany']=-1

	
                q=request.GET['q']
                

		data = urllib.urlencode(param,doseq=1)

		p2 = param.copy()
		try:
			p2.pop('mode')
		except:
			pass

		p2['q']=p2['q'].replace('"','')
	
		data2 = urllib.urlencode(p2,doseq=1)		
		
		save['download']='/search/search/?mode=download&%s' % data2
		save['print']='/search/search/?mode=print&%s' % data2
		save['link']='/savedSearch?mode=search&%s' % data2


                r=urllib2.urlopen(url,data)


        else:
		param['q'] = 'gold'
		data = urllib.urlencode(param)
                r=urllib2.urlopen(url,data)

        results = []
        doc=mdom.parse(r).getElementsByTagName("results")[0]



	# ------------- DIFFERENT OUTPUT FOR PRINT and DOWNLOAD modes ---------
	# check mode

	if mode == 'print':
		# absolute address encoded?... make relative
		#xslt = etree.parse('/Users/micusp/micusp-search/micusp/search/templates/search_print.xsl')
		xslt = etree.parse(settings.STATIC_ROOT+'/search/templates/search_print.xsl')
		transform = etree.XSLT(xslt)
		
		# add highlighting of search term - should be extracted out into a function
		xml_string = doc.toxml('utf-8')
		
		html = transform(etree.fromstring())
		
		return HttpResponse(str(html))		

	elif mode == 'download':
		response = HttpResponse(mimetype='text/csv')
		response['Content-Disposition'] = 'attachment; filename=micusp_papers.csv'
		
		writer = csv.writer(response)

		headers="PAPER ID,TITLE,DISCIPLINE,PAPER TYPE,STUDENT LEVEL,SEX,NATIVENESS,TEXTUAL FEATURES"
		writer.writerow(headers.split(','))

		for p in doc.getElementsByTagName("paper"):
			row = []
			row.append(p.attributes['doc'].value)
			for c in p.childNodes:
				if c.nodeType==1:
					d = unicode(c.firstChild.data)
					row.append(d.encode('utf-8'))
			writer.writerow(row)

		return response	

	# ---------- end of section dealing with print and download modes --------------


	papers = doc.attributes['papers'].value
        count = doc.attributes['count'].value

	try: 
		start = doc.getElementsByTagName("paper")[0].attributes['num'].value

		last = papers == doc.getElementsByTagName("paper")[-1].attributes['num'].value



		# escape periods
		q2 = re.sub('[.]','[.]',q.lower())
		
		q2 = re.sub('([-,])','(\\1| )', re.sub(' ','[-,?!.:]?[ -]',q2))

 	
		if q2.endswith('[.]'):
			qregex = re.compile('\\b(%s)' % q2, re.IGNORECASE)
		else:
			qregex = re.compile('\\b(%s)\\b' % q2, re.IGNORECASE)

		total_hits=0

		for paper in doc.getElementsByTagName("paper"):
			hits=[]
			paper_hits=0
	        	for d in paper.getElementsByTagName("hit"):
	                	ptext = re.sub('</?p[^>]*>','',d.getElementsByTagName("p")[0].toxml())
			
				apply_regex = re.subn(qregex,'<span class="query">\\1</span>', ptext.strip())  

				num_of_hits = apply_regex[1]
				ptext = apply_regex[0]

				paper_hits+= num_of_hits

				hits.append((num_of_hits,ptext))

			results.append({'doc': d.attributes['doc'].value, 
					'title': paper.attributes['title'].value, 
					'dept': paper.attributes['dept'].value,
					'type': paper.attributes['type'].value,
					'data': hits,
					'paper_hits' : paper_hits,
					'paper_info': '''
						<table class="paper_info" q2="%s"><tbody>
						<tr><td class="label">Discipline:</td><td>%s</td></tr>
						<tr><td class="label">Student Level:</td><td>%s</td></tr>
						<tr><td class="label">Sex:</td><td>%s</td></tr>
						<tr><td class="label">Native speaker status:</td><td>%s</td></tr>
						<tr><td class="label">Paper type:</td><td>%s</td></tr>
						<tr><td class="label">Textual features:</td><td>%s</td></tr>
						</tbody></table>
					      '''
					% (q2.endswith('[.]'),paper.attributes['dept'].value,
					   paper.getElementsByTagName('studentLevel')[0].firstChild.data,
					   paper.getElementsByTagName('sex')[0].firstChild.data,
					   paper.getElementsByTagName('nativeness')[0].firstChild.data,
					   paper.attributes['type'].value,
					   paper.getElementsByTagName('features')[0].firstChild.data)				

					})

			total_hits += paper_hits

	        return render_to_response('search_results.html', 
                                   {'results':results, 'papers': papers, 'count': count,
                                   'q': q, 'q2': q2, 'start': start, 'last': last, 
                                   'num' : len(results) + int(start) -1, 
				   'direction': direction, 'sort': sort,
				   'total_hits': total_hits,
				   'save': save,
    				   'include_all': param['include_all']

				})
	except:
		return HttpResponse('<script>var totalPaperCount=0;</script><div class="results_message">No results found</div>')







def view(request):
        url = "http://localhost:4444/exist/rest/db/MICUSP/queries/view.xql"

	if request.GET:
		q2=''
		param = {
			 'pid': request.GET['pid'] }

		if request.GET.has_key('q'):
			q=request.GET['q']
			param['q']= '"%s"' % q
	        	q2 = re.sub('([-,])','(\\1| )', re.sub(' ','[-,?!.:]? ',q.lower()))

		if request.GET.has_key('include_all'):
			param['include_all']=request.GET['include_all']


		data = urllib.urlencode(param)
                r=urllib2.urlopen(url,data)

	        doc=etree.parse(r)
		try:
			doc2=doc.xpath('//div[@id="text"]')[0]
		except:
			pass
		paras = doc2.xpath('//div[@id="text"]//*[@class="hit"]')

		for p in paras:
			if p.attrib.has_key('class'):
				
	                	p2 = etree.XML(re.sub('(?i)\\b(%s)\\b' % q2,'<span class="term">\\1</span>', etree.tostring(p)))
				p.getparent().replace(p,p2)

		pdiv=etree.tostring(doc2)
		hdiv=etree.tostring(doc.xpath('//div[@id="header"]')[0])

	else:
		pdiv="<div>NO PAPER FOUND</div>"
		hdiv=""

	return render_to_response('view_paper.html', {'paperHead': hdiv, 'paperDiv': pdiv, 'pid': request.GET['pid']})		





