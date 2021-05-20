const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const buscar = document.querySelector(".top-banner .buscar");
const list = document.querySelector(".ajax-section .cities");
const API_KEY = "16e3ac909192b6d2ae3ae65598d56e2f";
const climas = {'Rain':'blKdw9Py-0E', 'Clouds':'N30xWvKdpQ4', 'Clear':'aEiN6sgAnp8', 'Snow':'hU_pIFsq-VM'};

      var player;
      function reproductorClima(id){
       return new YT.Player('player', {
          height: '360',
          width: '640',
          videoId: id,
          playerVars: {'autoplay':1, 'controls':0, 'loop':1, 'playlist':id, 'mute':1, 'rel':0, 'showinfo':0, 'modestbranding':1, 'version':3, 'frameborder':0, 'autohide':1, 'fs':0, 'disablekb':1, 'cc_load_policy':1, 'iv_load_policy':3},
          events: {
            'onReady': function(event){event.target.playVideo();},
          }
        });
      }
window.onload = function(e){
  buscarClimas(localStorage.getItem('city'));
}

form.addEventListener("submit", climasbuscados => {
  climasbuscados.preventDefault(); 
  const inputVal = input.value;
  buscarClimas(inputVal);
  buscar.textContent = "";
  form.reset();
  input.focus();
});

function buscarClimas(inputVal){
  const listItems = list.querySelectorAll(".ajax-section .city");
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${API_KEY}&units=metric&lang=es`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const { main, name, sys, weather, temp_min, temp_max, humidity, pressure, wind, feels_like} = data;
      localStorage.setItem('city', name);
      if (player !== undefined){player.destroy();}
      console.log(data.weather[0].main);
      player = reproductorClima(climas[data.weather[0].main]);
      //if(YT.PlayerState.PLAYING !== player.getPlayerState()){player.startVideo();}
      const icon = `https://openweathermap.org/img/wn/${
        weather[0]["icon"]
      }@2x.png`;

      const li = document.createElement("li");
      li.classList.add("city");
      const markup = `
        <h2 class="city-name" data-name="${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <div> <p>Min ${Math.round(main.temp_min)}<sup>°C</sup> Max${Math.round(main.temp_max)}<sup>°C</sup></p></div>
        <div>Sensación termica: ${Math.round(main.feels_like)}<sup>°C</sup></div>
        <div> <p>Humedad: ${Math.round(main.humidity)}%</div>
        <div> <p>Presión Atmosférica: ${Math.round(main.pressure)}hPa</div>
        <div> <p>Viento: ${Math.round(wind.speed)}km/h</div>
        <figure>
          <img class="city-icon" src=${icon} alt=${weather[0]["main"]}>
          <figcaption>${weather[0]["description"]}</figcaption>
        </figure>
      `;
      li.innerHTML = markup;
      list.innerHTML = '';
      list.appendChild(li);
    })
    .catch(() => {
      buscar.textContent = "Coloque una ciudad válida. Ej: Buenos Aires";
    });
}


