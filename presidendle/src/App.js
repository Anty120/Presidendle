import './App.css';
import { useState, useEffect, useCallback } from "react"
import Select from 'react-select';
import { findPresident } from 'us-presidents';
import ReactModal from 'react-modal'
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

function App() {
    const [presidents, setPresidents] = useState([]);
    const [selectedPresident, setSelectedPresident] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [guesses, setGuesses] = useState(5);
    const [successModalIsOpen, setSuccessModalIsOpen] = useState(false);

    const options = presidents.map((president) => ({
        value: president.id,
        label: president.name,
    }));

    const defaultOption = { value: '', label: 'Type or select a president\'s name' };

    ReactModal.setAppElement('#root');

    const openSuccessModal = () => {
        setSuccessModalIsOpen(true);
    };

    const closeModal = () => {
        setSuccessModalIsOpen(false);
    };
    const handleOptionChange = (selectedOption) => {
        if (guesses === 0) {
            console.log("SHOULD TRIGGER LOSE MODAL NOW")
            return;
        }

        setGuesses(guesses - 1);

        if (selectedOption.value === selectedPresident.id) {
            openSuccessModal()
        } else {
            console.log(selectedOption)
            const arrow = selectedOption.value < selectedPresident.id ? <FaArrowDown /> : <FaArrowUp />;
            setSelectedOptions([...selectedOptions,
            { label: selectedOption.label, arrow: arrow, value: selectedOption.value }
            ]);
        }
    };

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true); // Set loading state to true at the start of fetch
            const response = await fetch('https://api.sampleapis.com/presidents/presidents');
            const presidentsArray = await response.json();

            const filteredPresidentsArray = presidentsArray.filter((_, index) => index !== 1 && index !== 20 && index !== 40 && index !== 25); //I got rid of some indexes, due to missing data from APIs. Currently, John Adams, Chester Arthur, Theodore Roosevelt, and George H. W. Bush are ommitted for that reason.
            console.log(filteredPresidentsArray)
            setPresidents(filteredPresidentsArray);
            setSelectedPresident(getRandomPresident(filteredPresidentsArray));

            setIsLoading(false);
        } catch (error) {
            console.log('**Fetch exception:', error);
            setIsLoading(false);
        }
    }, []);

    const getRandomPresident = (presidentsArray) => {
        const randomIndex = Math.floor(Math.random() * presidentsArray.length);
        console.log(presidentsArray[randomIndex])
        return presidentsArray[randomIndex];
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <>
            <div className="app">
                <h1>Presidendle</h1>
                <h3>Try To Guess Who The President Is!</h3>
                {isLoading ? null : selectedPresident ? (
                    <>
                        <div className='image'>
                            <img src={selectedPresident.photo} alt="" onLoad={() => setIsImageLoaded(true)} />
                        </div>
                        {isImageLoaded && (
                            <>
                                <div className='container'>
                                    <Select
                                        options={options}
                                        value={defaultOption}
                                        onChange={handleOptionChange}
                                        // isSearchable={true}
                                        className='select'
                                    />
                                </div>
                                <div className='selected-options-container'>
                                    {selectedOptions.map((option, index) => (
                                        <div key={index} className='selected-options'>
                                            <span style={{ color: 'red' }}>X</span>
                                            <div className='vertical-line'></div>
                                            <span>{option.label}</span>
                                            <div className='vertical-line' />
                                            {option.arrow}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )} {/* <- isImageLoaded */}
                        <ReactModal
                            isOpen={successModalIsOpen}
                            onRequestClose={closeModal}
                            shouldCloseOnOverlayClick={false}
                            contentLabel="Modal"
                            className="modal"
                        >
                            <h2>You Guessed Correctly!</h2>
                            <p>{findPresident(selectedPresident.name).description}</p>
                            <button onClick={() => { closeModal(); fetchData(); setSelectedOptions([]) }}>New Game {'>'}</button>
                        </ReactModal>
                    </>
                ) : ( // <- isLoading
                    <p>Unable to Access Data ERROR</p>
                )}
            </div>

            <button onClick={openSuccessModal}>Open Modal</button>
        </>
    );
}

export default App;
