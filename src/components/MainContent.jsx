import React from 'react'
import Grid from '@mui/material/Unstable_Grid2';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Prayer from './Prayer';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';
import { useState ,useEffect} from 'react';
import moment, { duration } from 'moment/moment';
import "moment/dist/locale/ar";

moment.locale("ar");
export default  function MainContent() {
  

  //STATES
  const [nextPrayerIndex, setNextPrayerIndex]= useState(2);
  const [timings, setTimings] = useState({
    Fajr:"04:20",
    Dhuhr:"11:50",
    Asr:"15:18",
    Sunset: "18:03",
    Isha :"19:33",
  });
const [remainingTime, setRemainingTime] = useState("")

  const[selectedCity, setSelctedCity] = useState({
    displayName: "مكة المكرمة",
    apiName: "Makkah al Makkarramah",
  });

  const [today, setToday] = useState("");

  
  const avilableCities =[
    {
      displayName: "مكة المكرمة",
      apiName: "Makkah al Makkarramah",
    },
    {
      displayName: "المدينة المنورة",
      apiName: "Madina",
    },
    {
      displayName: "الرياض",
      apiName: "Riyadh",
    },
    {
      displayName: "ابها",
      apiName: "Abha",
    },
    {
      displayName: "الطائف",
      apiName: "Taif",
    },
    {
      displayName: "الدمام",
      apiName: "Dammam",
    },
    {
      displayName: "جده",
      apiName: "Jeddah",
    },
    {
      displayName: "صنعاء",
      apiName: "Sanaa",
    },
    {
      displayName: "مقديشو",
      apiName: "Mogadishu",
    },
    {
      displayName: "مسقط",
      apiName: "Muscat",
    },
    {
      displayName: "ابو ظبى",
      apiName: "Abu Dhabi",
    },
    {
      displayName: "دبى",
      apiName: "Dubai",
    },
    {
      displayName: "الدوحه",
      apiName: "Doha",
    },
    {
      displayName: "المنامة",
      apiName: "Manama",
    },
    {
      displayName: "الكويت",
      apiName: "Kuwait",
    },
    {
      displayName: "بغداد",
      apiName: "Baghdad",
    },
    {
      displayName: "عمان",
      apiName: "Ammaan Jordan",
    },
    {
      displayName: "دمشق",
      apiName: "Damascus",
    },
    {
      displayName: "حلب",
      apiName: "Aleppo",
    },
    {
      displayName: "بيروت",
      apiName: "Beirut",
    },
    {
      displayName: "القدس",
      apiName: "Jerusalem",
    },
    {
      displayName: "القاهرة",
      apiName: "Cairo",
    },
    {
      displayName: "الاسكندرية",
      apiName: "Alexandria",
    },
    {
      displayName: "اسوان",
      apiName: "Aswan",
    },
    {
      displayName: "الخرطوم",
      apiName: "Khartoum",
    },
    {
      displayName: "طرابلس",
      apiName: "Tripoli",
    },
    {
      displayName: "تونس",
      apiName: "Tunisia",
    },
    {
      displayName: "وهران",
      apiName: "Oran",
    },
    {
      displayName: "مراكش",
      apiName: "marrakech",
    },
  ];

  const prayersArray = [
    {key: "Fajr", displayName:"الفجر"},
    {key: "Dhuhr", displayName:"الظهر"},
    {key: "Asr", displayName:"العصر"},
    {key: "Sunset", displayName:"المغرب"},
    {key: "Isha", displayName:"العشاء"},
  
  ];
  const getTimings = async () => {
    console.log("calling the api")
    const response = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?country=SA&city=${selectedCity.apiName}`
    );
        setTimings(response.data.data.timings);
  };

  
  useEffect(()=> {
    getTimings();
    
    const t = moment();
    setToday(t.format("MMM DO YYYY | h:mm"));
    console.log("the time isss", t.format("hh:mm"));

   
    //return () => {
    //  clearInterval(interval)
    //}
  }, [selectedCity]);

  useEffect (() =>{
    let interval = setInterval(() => {
      console.log("calling timer");
      setupCountdownTimer();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  },[timings]);
  
  const setupCountdownTimer = () => {
    const momentNow = moment();

    let prayerIndex = 2;

    if(
      momentNow.isAfter(moment(timings["Fajr"],"hh:mm")) && 
      momentNow.isBefore(moment(timings["Dhuhr"],"hh:mm"))
      ) {
        prayerIndex = 1;
      
    }else if (
      momentNow.isAfter(moment(timings["Dhuhr"],"hh:mm")) && 
      momentNow.isBefore(moment(timings["Asr"],"hh:mm")) 
    ) {
      prayerIndex = 2;
    }else if (
      momentNow.isAfter(moment(timings["Asr"],"hh:mm")) && 
      momentNow.isBefore(moment(timings["Sunset"],"hh:mm")) 
    ) {
      prayerIndex = 3;
    }else if (
      momentNow.isAfter(moment(timings["Sunset"],"hh:mm")) && 
      momentNow.isBefore(moment(timings["Isha"],"hh:mm")) 
    ) {
      prayerIndex = 4;
    }else {
      prayerIndex = 0;
    }
    setNextPrayerIndex(prayerIndex);
      // now after knowing what the next prayer is, we can setup the countdown timer by getting the prayer's time
      const nextPrayerObject = prayersArray[prayerIndex];
      const nextPrayerTime =timings[nextPrayerObject.key];
      const nextPrayerTimeMoment = moment (nextPrayerTime, "hh:mm");

      let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);

      if(remainingTime < 0){
        const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
        const fajrToMidnightDiff =nextPrayerTimeMoment.diff(
            moment("00:00:00", "hh:mm:ss")
          );
          const totalDiffernce = midnightDiff + fajrToMidnightDiff;
          remainingTime = totalDiffernce;

      }
      console.log(remainingTime);

      
      const durationRemainingTime = moment.duration(remainingTime);

      setRemainingTime(
        `${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()}: ${durationRemainingTime.hours()}`
      );
      console.log("duration issss",
       durationRemainingTime.hours(),
       durationRemainingTime.minutes(),
      durationRemainingTime.seconds()
         );
      
      //console.log("next prayer time issss", nextPrayerTime);
      //console.log(momentNow.isBefore(moment(timings["Fajr"],"hh:mm")));

     
      
    //const Isha = timings["Isha"];
    //const IshaMoment = moment(Isha, "hh:mm");
    //console.log(momentNow.isBefore(IshaMoment));


  };
  const handleCityChange = (event) => {
    const cityObject = avilableCities.find((city) => {
      return city.apiName == event.target.value;
    });
    console.log("the new value is", event.target.value);
    setSelctedCity(cityObject);
  };
  return (<>
  <Grid container >
        <Grid xs={6}>
            <div>
                <h2>{today}</h2>
                <h1>{selectedCity.displayName}</h1>

                
            </div>
        </Grid>
        <Grid xs={6}>
            <div>
                <h2>متبقى حتى صلاة {prayersArray[nextPrayerIndex].displayName}</h2>
                <h1 >{remainingTime}</h1>
            </div>
        </Grid>
  </Grid>
    <Divider style={{borderColor:"black",opacity:"0.3"}} />

    <Stack direction="row" justifyContent="space-around" style={{marginTop: "50px"}} >
      <Prayer
       name="الفجر"
        time={timings.Fajr} 
        image="/src/img/1.png"
        />
      <Prayer 
       name="الظهر"
       time={timings.Dhuhr} 
       image="/src/img/2.png"
       />
      <Prayer 
       name="العصر" 
       time={timings.Asr} 
       image="/src/img/3.png"
       />
      <Prayer
       name="المغرب"
        time={timings.Sunset} 
       image="/src/img/4.png"
       />
      <Prayer
       name="العشاء" 
       time={timings.Isha}  
       image="/src/img/5.png"
       />
    </Stack>
      <Stack direction="row" justifyContent={"center"} style={{marginTop:"30px"}}>
      <FormControl style={{width:"20%"}}>
        <InputLabel id="demo-simple-select-label"><span style={{color:"red"}} >المدينة</span></InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          //value={age}
          label="Age"
          onChange={handleCityChange}
          >
          {avilableCities.map((city) => {
            return (
              <MenuItem value={city.apiName} key={city.apiName}>
                {city.displayName}
                </MenuItem>
            );
            
          })}
        
          
          
        </Select>
      </FormControl>
      </Stack>
  </>
  );
}


