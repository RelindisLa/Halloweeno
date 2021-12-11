function init() {
  document.getElementById('sound_button').addEventListener('click',changeHTMLContent);
}
  
onClick="changeHTMLContent()"

function changeHTMLContent() {
  let snd = document.getElementById("sound"); 
  let snd_btn = document.getElementById("sound_button"); 
  snd.muted = !snd.muted; 
  if(snd.muted){ 
    snd_btn.innerHTML = "<img alt='Music stop' title='Music paused' src='assets/images/icon_music_stop.png' />";
    } else{ 
     snd_btn.innerHTML = "<img alt='Music play' title='Music playing' src='assets/images/icon_music_play.png' />"; 
    } 
}