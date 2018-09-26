from django.conf.urls.defaults import *
from django.conf import settings

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()


urlpatterns = patterns('micuspSearch.search.views',
    # Example:
    # (r'^micusp/', include('micusp.foo.urls')),

    # Uncomment the admin/doc line below and add 'django.contrib.admindocs' 
    # to INSTALLED_APPS to enable admin documentation:

    # Uncomment the next line to enable the admin:
    # (r'^admin/', include(admin.site.urls)),
    (r'^paper/', 'paper'),
    #(r'^summary/', 'summary'),

    (r'^search/', 'search'),
    (r'^main/','main'),
    (r'^dept/','dept'),
    (r'^type/','type'),
    (r'^view/','view'),
    (r'^browse/','browse'),
    (r'^saved(?:Browse|Search)/','main'),
    (r'^searchSummary/', 'search_summary'),

    (r'^$','main'),

    (r'^print/?','print_view'),
)

urlpatterns += patterns('', 
    (r'^js/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_ROOT+'/search/js'}),
    (r'^css/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_ROOT+'/search/css'}),
    (r'^img/(?P<path>.*)$','django.views.static.serve',{'document_root':settings.STATIC_ROOT+'/search/img'}),

    (r'^viewPaper/(?P<path>.*\.pdf)$', 'django.views.static.serve',{'document_root': settings.STATIC_ROOT+'/search/pdfs'}),

)