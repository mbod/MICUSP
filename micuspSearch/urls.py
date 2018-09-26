from django.conf.urls.defaults import *

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Example:
    # (r'^micuspSearch/', include('micuspSearch.foo.urls')),

    #(r'^/?', include('micuspSearch.search.urls')),
    (r'^simple/', include('micuspSearch.search.urls')),
    (r'^search/', include('micuspSearch.search.urls')),
    (r'^$', include('micuspSearch.search.urls')),

    #(r'^classify/', include('micuspSearch.classify.urls')),


    # Uncomment the admin/doc line below and add 'django.contrib.admindocs' 
    # to INSTALLED_APPS to enable admin documentation:
    # (r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    (r'^admin/', include(admin.site.urls)),


   

)
