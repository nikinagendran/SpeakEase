import React, { useState, useEffect } from 'react';
import './App.css';

const languageCodes = {
    english: 'en',
    spanish: 'es',
    french: 'fr',
    german: 'de',
    italian: 'it',
    tamil: 'ta',
    portuguese: 'pt',
    dutch: 'nl',
    russian: 'ru',
    chinese: 'zh',
    hindi: 'hi', 
    korean: 'ko' 
};

function App() {
    const [transcription, setTranscription] = useState('');
    const [recognition, setRecognition] = useState(null);
    const [sourceLanguage, setSourceLanguage] = useState('english');
    const [targetLanguage, setTargetLanguage] = useState('spanish');
    const [recording, setRecording] = useState(false);
    const [error, setError] = useState('');
    const [translatedText, setTranslatedText] = useState('');

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const rec = new SpeechRecognition();
            rec.lang = languageCodes[sourceLanguage] || 'en';
            rec.interimResults = false;
            rec.onresult = (event) => {
                setTranscription(event.results[0][0].transcript);
            };
            rec.onend = () => {
                setRecording(false);
            };
            rec.onerror = (event) => {
                setError('An error occurred during speech recognition.');
            };
            setRecognition(rec);
        } else {
            setError('SpeechRecognition API not supported.');
        }
    }, [sourceLanguage]);

    const startRecording = () => {
        if (recognition) {
            setRecording(true);
            recognition.start();
        }
    };

    const stopRecording = () => {
        if (recognition) {
            setRecording(false);
            recognition.stop();
        }
    };

    const saveTranscription = () => {
        const blob = new Blob([transcription], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transcription.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    const translateText = async (text) => {
        try {
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${languageCodes[sourceLanguage]}|${languageCodes[targetLanguage]}`);
            const data = await response.json();
            return data.responseData.translatedText;
        } catch (error) {
            setError('Translation failed.');
            return text;
        }
    };

    useEffect(() => {
        if (transcription) {
            translateText(transcription).then(setTranslatedText);
        }
    }, [transcription, sourceLanguage, targetLanguage]);

    return (
        <div className="App">
            <h1>Speech to Text</h1>
            <div className="dropdowns">
                <div>
                    <label htmlFor="source-language">Source Language: </label>
                    <select
                        id="source-language"
                        value={sourceLanguage}
                        onChange={(e) => setSourceLanguage(e.target.value)}
                    >
                        {Object.keys(languageCodes).map(lang => (
                            <option key={lang} value={lang}>
                                {lang.charAt(0).toUpperCase() + lang.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="target-language">Target Language: </label>
                    <select
                        id="target-language"
                        value={targetLanguage}
                        onChange={(e) => setTargetLanguage(e.target.value)}
                    >
                        {Object.keys(languageCodes).map(lang => (
                            <option key={lang} value={lang}>
                                {lang.charAt(0).toUpperCase() + lang.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="controls">
                <button onClick={startRecording} disabled={recording}>Start Recording</button>
                <button onClick={stopRecording} disabled={!recording}>Stop Recording</button>
                <button onClick={saveTranscription} disabled={!transcription}>Save Transcription</button>
            </div>
            <div className="transcription">
                <p><strong>Original Text:</strong> {transcription}</p>
                <p><strong>Translated Text:</strong> {translatedText}</p>
            </div>
            {error && <div className="error">{error}</div>}
            <div className={`recording-status ${recording ? 'active' : 'inactive'}`}>
                {recording ? 'Recording...' : 'Not Recording'}
            </div>
        </div>
    );
}

export default App;
