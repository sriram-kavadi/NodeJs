from django.shortcuts import render
import json
import urllib.request
from datetime import datetime

def index(request):
    data = {}

    if request.method == 'POST':
        city = request.POST['city']
        api_key = "d4ef3228ab99e76899d90314889d83b9"

        source = urllib.request.urlopen(
            f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}"
        ).read()

        list_of_data = json.loads(source)

        # Temperature conversion
        temp_c = int(list_of_data['main']['temp'] - 273.15)

        # AI suggestion logic
        if temp_c > 35:
            suggestion = "🔥 Very hot! Stay hydrated"
        elif temp_c < 15:
            suggestion = "🥶 Cold! Wear warm clothes"
        elif "rain" in list_of_data['weather'][0]['description']:
            suggestion = "🌧 Carry an umbrella"
        else:
            suggestion = "😊 Weather looks good!"

        data = {
            "city": city,
            "country_code": list_of_data['sys']['country'],
            "temp": temp_c,
            "feels_like": int(list_of_data['main']['feels_like'] - 273.15),
            "pressure": list_of_data['main']['pressure'],
            "humidity": list_of_data['main']['humidity'],
            "wind": list_of_data['wind']['speed'],
            "description": list_of_data['weather'][0]['description'],
            "icon": list_of_data['weather'][0]['icon'],
            "sunrise": datetime.fromtimestamp(list_of_data['sys']['sunrise']).strftime('%H:%M'),
            "sunset": datetime.fromtimestamp(list_of_data['sys']['sunset']).strftime('%H:%M'),
            "suggestion": suggestion,
        }

    return render(request, "index.html", data)