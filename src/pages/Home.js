import { Link } from "react-router-dom";
import Header from './Header';
// import itc from '../images/itc.jpg';
 
function Home() {
  const containerStyle = {
    // backgroundImage: `url(${itc})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '95vh', // Set the height of the container to the viewport height
  };
 
  return (
    <>
      <div className="flex justify-center items-center" style={containerStyle}>
        {/* Your content goes here */}
        <Link to="/login">
          <div className="h-12 flex items-center justify-center uppercase font-semibold px-8 border text-white border-black bg-black hover:bg-white hover:text-black transition duration-500 ease-in-out">
            Proceed
          </div>
        </Link>
      </div>
    </>
  );
}
 
export default Home;