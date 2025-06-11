import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import "./Loading.css";

const Loading = () => {
  return (
    <FontAwesomeIcon className="loading" icon={faCircleNotch} size="2xl"/>
  )
}

export default Loading;
