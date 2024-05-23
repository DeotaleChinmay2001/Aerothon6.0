import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useSocket } from "../context/SocketProvider";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

function SensorData() {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const { sensorData } = useSocket();
  const thresholds = {
    'setting1': [-0.0009, 0.0009],
    'setting2': [-0.0002, 0.0002],
    'setting3': [100, 100],
    's1': [518.67, 518.67],
    's2': [642.44, 642.87],
    's3': [1587.6, 1592.77],
    's4': [1404.34, 1412.04],
    's5': [14.62, 14.62],
    's6': [21.61, 21.61],
    's7': [553.05, 553.81],
    's8': [2388.06, 2388.12],
    's9': [9055.91, 9065.86],
    's10': [1.3, 1.3],
    's11': [47.41, 47.63],
    's12': [521.16, 521.78],
    's13': [2388.06, 2388.12],
    's14': [8136.07, 8145.25],
    's15': [8.4233, 8.4555],
    's16': [0.03, 0.03],
    's17': [392, 394],
    's18': [2388, 2388],
    's19': [100, 100],
    's20': [38.75, 38.91],
    's21': [23.2508, 23.3427]
  };
  
  
  // Filter out "id" and "cycle" from sensor keys
  const sensorKeys = Object.keys(sensorData).filter(key => !["id", "cycle"].includes(key));

  const divCount = Array.from({ length: sensorKeys.length }, (_, index) => index + 1);
  const elementsPerColumn = Math.ceil(divCount.length / 5);

  // Split the divCount array into arrays, one for each column
  const columns = Array.from({ length: 5 }, (_, colIdx) => divCount.slice(colIdx * elementsPerColumn, (colIdx + 1) * elementsPerColumn));
  
  const [colr, setColor] = useState(Array(sensorKeys.length).fill("green"));
  const [labData, setLabData] = useState([]);

  const [chartData, setChartData] = useState(
    sensorKeys.map(key => ({
      label: key.toUpperCase(),
      data: [0],
      borderColor: "",
      backgroundColor: "rgba(0,130,126,0.5)",
    }))
  );

  const options = {
    responsive: true,
    tension: 0.4,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  const labels = labData;
  const dt = { labels, datasets: chartData };

  useEffect(() => {
    const generateRandomNumbers = () => {
      const numbers = sensorKeys.map(key => parseFloat(sensorData[key]));
      const col = numbers.map((num, index) => {
        const thresholdsForKey = thresholds[sensorKeys[index]];
        if (num <= thresholdsForKey[0]) return "green";
        else if (num <= thresholdsForKey[1] && num > thresholdsForKey[0]) return "orange";
        else return "red";
      });
      setColor(col);
    };

    const updateChart = () => {
      const arr = chartData.map((data, index) => {
        let newData = { ...data };
        newData.data.push(sensorData[sensorKeys[index]]);
        newData.borderColor = colr[index];
        return newData;
      });
      setChartData(arr);
      let d = new Date();
      let t = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
      setLabData(prevData => [...prevData, t]);
    };

    const timer = setTimeout(() => {
      generateRandomNumbers();
      updateChart();
    }, 7000);

    return () => clearTimeout(timer);
  }, [sensorData]);

  return (
    <div className="flex flex-col py-4 lg:px-12 md:px-8 px-4 h-screen overflow-y-auto w-full">
      <h2 className="text-3xl mb-4">Sensor Data</h2>
      <div className="md:flex md:space-x-2 py-6">
        {columns.map((column, colIdx) => (
          <div key={colIdx} className="flex flex-col rounded-md border w-[180px] h-[150px] p-3 justify-center mb-4 md:mb-0">
            {column.map((index) => (
              <div key={index} className="flex items-center mb-1">
                <p className="w-8 text-right mr-2 text-sm">{sensorKeys[index -1 ]}</p>
                <div style={{ background: colr[index -1] }} className="flex-1 h-6 border-2 border-black ml-2 flex items-center justify-center text-xs">
                  {sensorData[sensorKeys[index - 1]]}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    
      <div className="flex flex-col lg:flex-row lg:space-x-8 py-6 w-full">
        <div className="flex flex-col rounded-md border w-full lg:w-2/3 p-5 justify-center">
          <Line style={{ height: "100px" }} options={options} data={dt} />
        </div>
        <div className="flex flex-col rounded-md border w-full lg:w-1/3 p-5 justify-center bg-red-200">
          <div className="text-center text-lg font-semibold">Health Report</div>
        </div>
      </div>
    </div>
  );
}

export default SensorData;
