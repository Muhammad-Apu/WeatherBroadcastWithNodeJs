const http=require("http");
const fs=require("fs");
const requests=require("requests")


const homeFile=fs.readFileSync("./public/home.html", "utf-8");

const Changing=(apiData,homeFile)=>{
    let changedHomeFile=homeFile.replace("{%WeatherStatus%}",apiData.weather[0].description)
    const imgStr=`<img src="https://openweathermap.org/img/wn/${apiData.weather[0].icon}@2x.png" alt="">`
    changedHomeFile=changedHomeFile.replace("{%img%}",imgStr)

    changedHomeFile=changedHomeFile.replace("{%City%}",apiData.name)
    changedHomeFile=changedHomeFile.replace("{%Country%}",apiData.sys.country)
    changedHomeFile=changedHomeFile.replace("{%Temperature%}",apiData.main.temp)
    changedHomeFile=changedHomeFile.replace("{%MinTemperature%}",apiData.main.temp_min)
    changedHomeFile=changedHomeFile.replace("{%MaxTemperature%}",apiData.main.temp_max)
    changedHomeFile=changedHomeFile.replace("{%feelsLike%}",apiData.main.feels_like)
    changedHomeFile=changedHomeFile.replace("{%msgDis%}","d-none")
    changedHomeFile=changedHomeFile.replace("{%contentDis%}","d-block")
    
    return changedHomeFile
}

// console.log(data)

const server=http.createServer();

server.on('request', async(req, res) => {
    if(req.method=="GET" && req.url=="/"){
        res.end(homeFile);
    }else if(req.method=="POST" && req.url=="/"){
        let cityName;
        req.on("data",(chunk)=>{
            cityName=chunk.toString().split("=")[1];
        }).on("end",()=>{
            let apiData;
            requests(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=65f0d4e42f1c6ce7d250515293e3ce1c&units=metric`, { stream:true })
                .on('data', function (chunk) {
                // console.log(chunk)
                    apiData=JSON.parse(chunk)
                })
                .on('end', function (err) {
                    if(apiData.cod===200){
                        const changedHomeFile=Changing(apiData,homeFile)
                        res.end(changedHomeFile)
                    }else{
                        let chngedfile=homeFile.replace("{%msg%}","d-block");
                        
                        // console.log(chngedfile)
                        res.end(chngedfile);
                    }
                
            });
        })


    }
    
});
  
server.listen(8000,()=>{
    console.log("listening to port 8000");
})





