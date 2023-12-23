import './App.css';
import {useState, useEffect, useCallback} from "react"
import Select from 'react-select';

function App() {
  const [presidents, setPresidents] = useState([]);
  const [selectedPresident, setSelectedPresident] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const options = presidents.map((president) => ({
    value: president.id,
    label: president.name,
  }));
  const defaultOption = {value: '', label: 'Type or select a president\'s name'};
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [guesses, setGuesses] = useState(5);
    
  const handleOptionChange = (selectedOption) => {
    if (guesses === 0) {
      console.log("No guesses left")
      return;
    }
    setGuesses(guesses - 1);
    console.log(selectedOption)
    setSelectedOptions([...selectedOptions, selectedOption]);
  };
 
  const fetchData = useCallback(async () => {
  try {
    setIsLoading(true); // Set loading state to true at the start of fetch
    const response = await fetch('https://api.sampleapis.com/presidents/presidents');
    const presidentsArray = await response.json();

    setPresidents(presidentsArray);
    setSelectedPresident(getRandomPresident(presidentsArray));

    setIsLoading(false);
  } catch (error) {
    console.log('**Fetch exception:', error);

    setIsLoading(false);
  }
  }, []);
 
  const getRandomPresident = (presidentsArray) => {
    const randomIndex = Math.floor(Math.random() * presidentsArray.length);
    return presidentsArray[randomIndex];
  };
 
  useEffect(() => {
    fetchData();
  }, [fetchData]);

return (
  <div className="App">
    <h1>Presidendle</h1>
    <h3>Try To Guess Who The President Is!</h3>
    {isLoading ? null : selectedPresident ? (
      <>
        <div className='image'>
          <img src={selectedPresident.photo} alt="" onLoad={() => setIsImageLoaded(true)}/>
        </div>
        {isImageLoaded && (
          <>
          <div className='container'>
            <Select
              options={options}
              value={defaultOption}
              onChange={handleOptionChange}
              isSearchable={true}
              className='select'
            />
          </div>
          <div className='container'>
            {selectedOptions.map((option, index) => (
              <div key={index}>{option.label}</div>
            ))}
          </div>
          </>
        )}
      </>
    ) : (
      <p>Unable to Access Data ERROR</p>
    )}
  </div>
);
 }

export default App;
