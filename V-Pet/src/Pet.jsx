import NavButton from './NavButton'

function Pet(props) {
  const petImage = props.img
  const petName = props.name

  return (
    <>
      <h3>{petName}</h3>
      <img src={petImage}></img>
    </>
  )
}

export default Pet