"use client"

import { useState,FormEvent } from "react";
import { Card,CardHeader,CardDescription,CardTitle,CardContent } from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudIcon,MapPinIcon,ThermometerIcon } from "lucide-react";



interface Weather{
    temperature: number;
    description: string;
    location:string;
    unit: string;
}

export default function WeatherWidget(){
    const [location ,setLocation] = useState<string>("");
    const [weather,setWeather] = useState<Weather | null>(null);
    const [error,setError] = useState<string|null>(null);
    const [isloading,setIsLoading] = useState<boolean>(false);

  
    const searchHandle = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        const trimmedLoaction =location.trim();
        if(trimmedLoaction === ""){
            setError("Please Enter a Valid Location.");
            setWeather(null);
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLoaction}`
            );
            if(!response.ok){
                throw new Error("City not found");
            }
            const data = await response.json()
            const weatherData:Weather ={
                temperature: data.current.temp_c,
                description: data.current.condition.text,
                location: data.location.name,
                unit:"C",
            };
            setWeather(weatherData);            
        } catch (error) {
            setError("City not found.Please try again");
            setWeather(null);
            
        }finally{
            setIsLoading(false);
        }
    };

    function getTemperature(temperature:number,unit:string):string{
        if(unit === "C"){
            if(temperature < 0){
                return `It's freezing at ${temperature}°C! Bundle Up!`;
            }else if(temperature < 10){
                return`It's quite cold at ${temperature}°C. Wear Warm Clothes!`;
            }else if(temperature < 20){
                return`The Temperature is ${temperature}°C. Comfortable for a light jacket!`;
            }else if(temperature < 3){
                return`It's a pleasant ${temperature}°C. Enjoy the Nice Weather!`;
            }else{
                return`It's hot at ${temperature}°C. stay hydreated!`;
            }

        }else{
            return`${temperature} °${unit}`;
        }
    }

    function getWeathermessage(description:string):string{
        switch(description.toLowerCase()){
            case "sunny":
                return "It's a Sunny Day";
            case "partly cloudy":
                return "Expect some clouds and sunshine.";  
            case "cloudy":
                return "It's Cloudy Day.";
            case "overcast":
                return "The sky is overcast.";
            case "rain":
                return "Don't forget your umbrella! It's raining.";  
            case "thunderstrom":
                return "Thunderstroms are expected today.";
            case "snow":
                return "Bundle up! It's snowing.";  
            case "mist":
                return "It's misty outside.";
            case "fog":
                return "be careful, there's fog outside.";
            default:
                return description;
        }
    }

    function getLocationMessage(location:string):string{
        const currentHour = new Date().getHours();
        const isNight = currentHour >= 18 || currentHour < 6;
        return`${location} ${isNight? "at Night" : "During the Day"}`;
    }

    return(
        <div className="flex justify-center items-center h-screen bg-gradient-to-bl from-yellow-300 to-indigo-500 ">
            <Card className="w-full max-w-md mx-auto text-center"> 
                <CardHeader >
                    <CardTitle>Weather Widget</CardTitle>
                    <CardDescription>Search for the Current Weather Condition in Your City. </CardDescription>
                </CardHeader>
                <CardContent>
                <form onSubmit={searchHandle} className="flex items-center gap-2">
                    <Input
                    type="text"
                    placeholder="Enter a City Name"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    />
                    <Button type="submit" disabled={isloading}>
                        {isloading?"Loading...": "Search"}
                    </Button>
                </form>
                {error && <div className="mt-4 text-red-500 ">{error}</div>}
                {weather && (
                    <div className="mt-4 grid gap-2">
                        <div className="flex items-center gap-2 ">
                            <ThermometerIcon className="w-6 h-6"/>
                            {getTemperature(weather.temperature,weather.unit)}
                        </div>
                        
                        <div className="flex items-center gap-2 ">
                            <CloudIcon className="w-6 h-6"/>
                            {getWeathermessage(weather.description)}
                        </div>
                        <div className="flex items-center gap-2 ">
                            <MapPinIcon className="w-6 h-6"/>
                            {getLocationMessage(weather.location)}
                        </div>
                    </div>
                    
                )}
                </CardContent>
            </Card>
        </div>
    );
}
