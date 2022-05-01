// create a function to make a directions request
async function getWeather() {
  const tQuery = await fetch(
      `https://waterservices.usgs.gov/nwis/iv/?site=14211720&format=json`,
      { method: 'GET' }
    );
    const json = await tQuery.json();
    const tData = json.value.timeSeries[0].values[0].value[0];
    console.log(tData.value);
    let cTemp = document.getElementById('cTemp');
    cTemp.innerHTML = tData.value;
    let fTemp = document.getElementById('fTemp');
    fTemp.innerHTML = parseFloat(tData.value)*9/5+32;

  const wQuery = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=Portland,US&APPID=63cb903c39551c9117b8fbbb82699d36`,
      { method: 'GET' }
    );
    const wData = await wQuery.json();
    console.log(wData.wind.speed);
    let wind = document.getElementById('wind');
      wind.innerHTML = JSON.stringify(Math.round(wData.wind.speed*2.237));
}
