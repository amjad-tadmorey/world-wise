import styels from './AppNav.module.css'
import { NavLink } from 'react-router-dom'

export default function AppNav() {
  return (
    <nav className={styels.nav}>
      <ul>
        <li>
          <NavLink to={'cities'}>Cities</NavLink>
        </li>
        <li>
          <NavLink to={'countries'}>Countries</NavLink>
        </li>
      </ul>
    </nav>
  )
}
