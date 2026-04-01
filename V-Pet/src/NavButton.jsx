import { useLocation, useNavigate } from 'react-router';

function NavButton(props) {
  const targetPage = props.target
  const buttonTitle = props.name

  const location = useLocation();
  const navigate = useNavigate();
  const handleClick = () =>{
      navigate(targetPage);
  }
  return (
    <>
      <button onClick={handleClick} className={props.className}>{buttonTitle}</button>
    </>
  )
}

export default NavButton