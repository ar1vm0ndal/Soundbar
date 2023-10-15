from django.shortcuts import render
import os
from pytube import *
# Create your views here.
def ret_home(request):
    audio_file_path = ''
    if request.method == 'POST':
        link = request.POST['link']
        video = YouTube(link)

        stream = video.streams.get_audio_only()
        out_file= stream.download()
        base, ext = os.path.splitext(out_file)
        new_file = base + '.mp3'
        os.rename(out_file, new_file)
        audio_file_path = new_file
        print(new_file)
    return render(request,'visualizer/index.html', {'audio_file_path': audio_file_path})
