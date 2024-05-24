import { useRef, useEffect } from "react";
import Globe from "react-globe.gl";

const GlobeComponent = () => {
  const globeEl = useRef();

  useEffect(() => {
    // Auto-rotate the globe
    const globe = globeEl.current;
    if (globe) {
      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  // Sample marker data
  const markers = [
    { id: 1, city: "New York", coordinates: [40.7128, -74.006] },
    { id: 2, city: "London", coordinates: [51.5074, -0.1278] },
    { id: 3, city: "Tokyo", coordinates: [35.6895, 139.6917] },
    { id: 4, city: "Sydney", coordinates: [-33.8688, 151.2093] },
  ];

  return (
    <div
      style={{
        marginTop: "50px",
        marginLeft: "20px",
        width: "500px",
        height: "500px",
      }}
    >
      <Globe
        ref={globeEl}
        width={400}
        height={400}
        globeImageUrl="//unpkg.com/three-globe@2.31.0/example/img/earth-day.jpg" // A lighter globe texture
        backgroundColor="rgba(0,0,0,0.01)"
        markers={markers}
        markerLabel={({ city }) => <b>${city}</b>}
        markerTooltip={({ city }) => <div>${city}</div>}
        markerColor={() => "red"}
      />
    </div>
  );
};

export default GlobeComponent;