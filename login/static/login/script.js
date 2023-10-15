document.documentElement.style.setProperty('--glow-color', '#' + randomColor());

window.onload = () => {
  var button = document.getElementById("enter");
  var flickertxt = document.getElementById("flicker");
  var txt = document.getElementById("glow-txt");
  var firsttxt = document.getElementById("first-txt");
  var lasttxt = document.getElementById("last-txt");
  var popup = document.getElementById("popup");
  var exit = document.getElementById("popup-exit");

  
  function logoTransition(){    
    button.classList.add('expanded');  
    txt.classList.add('expanded'); 
    firsttxt.textContent = 'U'
    flickertxt.textContent = 'R';
    lasttxt.textContent = 'ORA';
    setTimeout(()=>{flickertxt.classList.add('faulty-letter'); },7000);
  }
  
  

  logoTransition();
  button.addEventListener('click', function () {
    popup.classList.toggle("popup-appear");

  });  

  exit.addEventListener('click', () =>{
    popup.classList.toggle("popup-appear");
  })
};

function randomColor() {
  return (Math.floor((Math.random()*0.25 +0.75) * 16777215).toString(16));
  
}

