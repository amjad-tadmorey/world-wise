import styles from './CityList.module.css'
import Spinner from './Spinner.jsx'
import CityItem from './CityItem.jsx'
import Message from './Message.jsx'
import { useCities } from '../contexts/CitiesContext.jsx'

export default function CityList() {

    const {cities, isLoading} = useCities()

    if(isLoading) return  <Spinner />

    if(!cities.length) return <Message message={'add you first city'}/>

  return (
    <ul className={styles.cityList}>
        {cities.map(city => <CityItem city={city} key={city.id}/>)}
    </ul>
  )
}
