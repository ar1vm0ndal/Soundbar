from django.urls import path
from . import views

#URLConf Module
urlpatterns = [
    path('home/', views.ret_home, name="home")
]