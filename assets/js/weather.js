async function getWeather() {
  const tQuery = await fetch(
    `https://waterservices.usgs.gov/nwis/iv/?site=14211720&format=json`,
    { method: "GET" }
  );
  const json = await tQuery.json();
  const tData = json.value.timeSeries[0].values[0].value[0];
  console.log(tData.value);
  let cTemp = document.getElementById("cTemp");
  cTemp.innerHTML = Math.round(tData.value);
  let fTemp = document.getElementById("fTemp");
  fTemp.innerHTML = Math.round((parseFloat(tData.value) * 9) / 5 + 32);

  const wQuery = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=Portland,US&APPID=63cb903c39551c9117b8fbbb82699d36`,
    { method: "GET" }
  );
  const wData = await wQuery.json();
  // console.log(wData.wind.speed);
  console.log(wData.main.temp);
  let wind = document.getElementById("wind");
  wind.innerHTML = JSON.stringify(Math.round(wData.wind.speed * 2.237));
  let aircTemp = document.getElementById("aircTemp");
  aircTemp.innerHTML = JSON.stringify(Math.round(wData.main.temp - 273.15));
  let airfTemp = document.getElementById("airfTemp");
  airfTemp.innerHTML = JSON.stringify(
    Math.round((wData.main.temp * 9) / 5 - 459.67)
  );
}
