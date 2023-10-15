from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def ret_index(request):
    return render(request,'login/index.html')