function openSet(){
  var settingsBox = document.getElementById("setNav").style;
  if(settingsBox.opacity != "0"){
    settingsBox.opacity = "0";
  }else{
    settingsBox.opacity = "1";
  }
}

// COLOR STUFF Lines 11 - 81
function sin_to_hex(i, phase,size) {
  var sin = Math.sin(Math.PI / size * 2 * i + phase);
  var int = Math.floor(sin * 127) + 128;
  var hex = int.toString(16);

  return hex.length === 1 ? "0" + hex : hex;
}
function vectorSub(x,y){
  
  const r = x.r - y.r;
  const g = x.g - y.g;
  const b = x.b - y.b;

  return {r,g,b};
}

function vectorMag(x){
  return Math.sqrt(x.r**2 + x.g**2 + x.b**2);
}

function hexToRgb(hexCode) {

  hexCode = hexCode.replace("#", "");

  const r = parseInt(hexCode.substring(0, 2), 16);
  const g = parseInt(hexCode.substring(2, 4), 16);
  const b = parseInt(hexCode.substring(4, 6), 16);
  return { r, g, b };
}

function defaultColor(size){
  var rainbow = new Array(size);
  for (var i = 0; i < size; i++) {
      
    var red = sin_to_hex(i, 0 * Math.PI * 2 / 3,size); // 0   deg
    var blue = sin_to_hex(i, 1 * Math.PI * 2 / 3,size); // 120 deg
    var green = sin_to_hex(i, 2 * Math.PI * 2 / 3,size); // 240 deg

    rainbow[i] = "#" + red + green + blue;
  }
  return rainbow;
}

function customColor(c1,c2,c3,c4,size){
  var rainbow = new Array(size);

  const v1 = vectorMag(vectorSub(c2,c1));
  const v2 = vectorMag(vectorSub(c3,c2));
  const v3 = vectorMag(vectorSub(c4,c3));
  const vsum = v1+v2+v3;
  var e1 =  Math.floor(v1/vsum*size);       
  var e2 = Math.floor(v2/vsum*size);
  var e3 = size - e1 - e2;
  console.log(''+e1+ ' '+ e2+' '+e3);
  var hex = ''+c1.r.toString(16).padStart(2,'0') + c1.g.toString(16).padStart(2,'0') + c1.b.toString(16).padStart(2,'0');
  var r = c1.r;
  var g = c1.g;
  var b = c1.b;
  rainbow[0]= '#'+hex;
  var i = 1;

  while(i < size){
    var e;
    var vsub;
    if (i <= e1){
      e=e1;
      vsub = vectorSub(c2,c1);
    }else if (i <= e2+e1){
      e=e2;
      vsub = vectorSub(c3,c2);
    }else{         
      e=e3;
      vsub = vectorSub(c4,c3);
    }
    r = r+(vsub.r/e);
    g = g+(vsub.g/e);
    b = b+(vsub.b/e);
    hex = '' + Math.round(r).toString(16).padStart(2,'0') + Math.round(g).toString(16).padStart(2,'0') + Math.round(b).toString(16).padStart(2,'0'); 
    rainbow[i] = '#'+hex;  

    i++;       
  }
  return rainbow;
}

window.onload = function() {

  var file = document.getElementById("thefile");
  //var file2 = document.getElementById("filetwo");
  var audio = document.getElementById("audio");
  var link = document.getElementById("link");
  var colorFactor = document.getElementById("islider").value;
  var intensity = document.getElementById("intensity"); //displaying number for colorFactor
  intensity.innerHTML = colorFactor;
  
  var scheme = document.getElementById("scheme");
  
  var c1,c2,c3,c4;
  var size = 4096;
  var rainbow = new Array (size);
  rainbow = defaultColor(size);
  scheme.onchange = function(){
    if (scheme.value != ''){
      const hexes =  (scheme.value).split('/')[4];
      c1 = hexToRgb(hexes.substring(0,6));
      c2 = hexToRgb(hexes.substring(6,12));
      c3 = hexToRgb(hexes.substring(12,18));
      c4 = hexToRgb(hexes.substring(18,24));

      rainbow = customColor(c1,c2,c3,c4, size);
    }else{
      rainbow = defaultColor(size);
    }
  }

  var audioStartTime;
  var audioDelay = 0.150; // Delay in seconds
  
  islider.oninput = function() {
    colorFactor = this.value;
    intensity.innerHTML = this.value;
  }
  
  file.onchange = function() {
    var files = this.files;
    audio.src = URL.createObjectURL(files[0]);

    audio.load();
    audio.play();



    var context = new AudioContext();

    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();

    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;
    var ctx = canvas.getContext("2d");

    const canvasHeight = 600; // Set your desired fixed height
    canvas.width = window.innerWidth;
    canvas.height = canvasHeight;

    src.connect(analyser);
    analyser.connect(context.destination);

    analyser.fftSize = 4096;

    var bufferLength = analyser.frequencyBinCount;
    

    var dataArray = new Uint8Array(bufferLength);

    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;

    var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;



    audio.onplay = function() {
      audioStartTime = context.currentTime + audioDelay;
    };


    //var color = Math.floor(Math.random()*(rainbow.length-1));
    var color = 0;
    var additive;
    function renderFrame() {
      requestAnimationFrame(renderFrame);

      // Calculate the elapsed time since the audio started playing
      var elapsedTime = context.currentTime - audioStartTime;
      
      if (color == rainbow.length - 1) {
        if(c3 == null || c3 == ''){
          color = 0;
          additive = 1;
        }else{
          additive = -1
        }       
      }else if(color == 0){
        additive = 1;
      }
      color = color + additive;

      x = 0;

      analyser.getByteFrequencyData(dataArray);
      var bassDataArray = dataArray.slice(0, Math.floor(bufferLength * 500 / context.sampleRate));

      var bassAmplitude = 0;
      for (var i = 0; i < bassDataArray.length; i++) {
        bassAmplitude += bassDataArray[i];
      }
      bassAmplitude /= bassDataArray.length;

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      for (var i = 0; i < bufferLength; i++) {
        var hue;
        hue = hexToRgb(rainbow[color]);


        barHeight = Math.pow(dataArray[i], 2) * 0.01;
        barHeight *= canvasHeight / HEIGHT;

        // var b = barHeight + (25 * (i / bufferLength));
        // var g = 250 * (i / bufferLength);
        // var r = bassAmplitude;

        // var b = 250 * (i / bufferLength) + bassAmplitude * 0.25;
        // var r = bassAmplitude * 0.50;
        // var g = 50;
  

        var r = hue.r - barHeight + barHeight* (hue.r / 255) * colorFactor/50;
        var g = hue.g - barHeight + barHeight * (hue.g / 255) * colorFactor/50;
        var b = hue.b - barHeight + barHeight* (hue.b / 255) * colorFactor/50;


        //ctx.fillStyle = rainbow[color];
        if (elapsedTime >= audioDelay) {
          // Render the bars only when the delay has passed
          ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
          ctx.fillRect(x, 0.5 * (HEIGHT - barHeight), barWidth * 2, barHeight);
          ctx.fillRect(WIDTH - x - barWidth, 0.5 * (HEIGHT - barHeight), barWidth * 2, barHeight);
          x += barWidth + 1;
        }

      }
    }

    audio.play();
    renderFrame();
  };
};