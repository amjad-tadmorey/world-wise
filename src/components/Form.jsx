// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button.jsx";
import BackButton from "./BackButton.jsx";
import { useUrlPosition } from "../hooks/useUrlPosition.js";
import Message from "./Message.jsx";
import Spinner from "./Spinner.jsx";
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../contexts/CitiesContext.jsx";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client'

function Form() {
  const [lat, lng ] = useUrlPosition() 
  const {createCity, isLoading} = useCities()
  const navigate = useNavigate()
    
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");  
  const [emoji, setEmoji] = useState("")
  const [geocodingError, setGeocodingError] = useState('')

  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false)

  useEffect(function () {

    if(!lat || !lng) return

    async function fetcCityData () {
      try {
        setIsLoadingGeocoding(true)
        setGeocodingError('')
        const res = await fetch (`${BASE_URL}?latitude=${lat}&longitude=${lng}`)
        const data = await res.json()

        if(!data.countryCode) throw new Error("this is not a city")
        
        setCityName(data.city || data.locality || "")
        setCountry(data.countryName)
        setEmoji(convertToEmoji(data.countryCode))
        
      } catch (err) {
        setGeocodingError(err.message)
      } finally {
        setIsLoadingGeocoding(false)
      }
    }
    fetcCityData()
  }, [lat, lng]) 

  async function handleSubmit (e)  {
    e.preventDefault()

    if(!date || !cityName) return;

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: {lat, lng}     
    }
    await createCity(newCity); 
    navigate('/app/cities')
  }

  if(isLoadingGeocoding) return <Spinner />

  if(!lat || !lng) return <Message message={'start by clicking somewhere in the map'}/>

  if(geocodingError) return <Message message={geocodingError}/>
  
  return (
    <form className={`${styles.form} ${isLoading ? styles.loading: ""}`} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date" 
          onChange={date => setDate(date)}
          selected={date}
          dateFormat='dd/mm/yy'
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type='primary' onClick={handleSubmit}>Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
