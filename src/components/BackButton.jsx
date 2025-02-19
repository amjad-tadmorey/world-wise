import { useNavigate } from 'react-router-dom'

import Button from './Button.jsx'

export default function BackButton(){
  const navigate = useNavigate()

  return (
    <Button type='back' onClick={() => {navigate(-1)}}>&larr; Back</Button>
  )
}
