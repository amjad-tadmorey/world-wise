import styles from './CountryList.module.css'
import Spinner from './Spinner.jsx'
import Message from './Message.jsx'
import CountryItem from './CountryItem.jsx'
import { useCities } from '../contexts/CitiesContext.jsx'

export default function CountriesList () {

    const {cities, isLoading} = useCities()

    const countries= cities.reduce((arr, city) => {
      if (!arr.map(el => el.country).includes(city.country)) {
        return [...arr, {country: city.country, emoji: city.emoji}]
      } else {
        return arr
      }
    }, [])

    if(isLoading) return  <Spinner />

    if(!cities.length) return <Message message={'add you first city'}/>

  return (
    <ul className={styles.countryList}>
        {countries.map(country => <CountryItem country={country} key={country.country}/>)}
    </ul>
  )
}
