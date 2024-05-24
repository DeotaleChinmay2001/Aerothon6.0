import Head from "../components/Header";
import MainContent from "../components/MainContent";
import GlobeComponent from "../components/GlobeComponent";
import Foot from "../components/Footer";
import "../App.css";

function Welcome() {
  return (
    <div className="App">
      <Head />
      <div className="container">
        <div className="item">
          <MainContent />
        </div>
        {/* <div className="item">
          <MapComponent />
        </div> */}
        <div className="item">
          <GlobeComponent />
        </div>
      </div>
      <Foot />
    </div>
  );
}

export default Welcome;