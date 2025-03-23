import errorGuy from "../assets/I_am_Error.png";

export default function MyNameIsError404() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <h1>404</h1>
      <img src={errorGuy} alt="I am Error. Screenshot from Zelda II." />
    </div>
  );
}
