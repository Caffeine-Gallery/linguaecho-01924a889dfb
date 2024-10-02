import { backend } from 'declarations/backend';

const inputText = document.getElementById('inputText');
const targetLanguage = document.getElementById('targetLanguage');
const outputText = document.getElementById('outputText');
const speakButton = document.getElementById('speakButton');
const historyList = document.getElementById('historyList');

let translationTimeout;

inputText.addEventListener('input', () => {
  clearTimeout(translationTimeout);
  translationTimeout = setTimeout(translateText, 500);
});

targetLanguage.addEventListener('change', translateText);

speakButton.addEventListener('click', speakTranslation);

async function translateText() {
  const text = inputText.value.trim();
  const lang = targetLanguage.value;

  if (text === '') {
    outputText.textContent = '';
    return;
  }

  try {
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${lang}`);
    const data = await response.json();

    if (data.responseStatus === 200) {
      const translatedText = data.responseData.translatedText;
      outputText.textContent = translatedText;

      // Save translation to backend
      await backend.addTranslation(text, translatedText, lang);
      updateTranslationHistory();
    } else {
      outputText.textContent = 'Translation error. Please try again.';
    }
  } catch (error) {
    console.error('Translation error:', error);
    outputText.textContent = 'Translation error. Please try again.';
  }
}

function speakTranslation() {
  const text = outputText.textContent;
  const lang = targetLanguage.value;

  if (text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
  }
}

async function updateTranslationHistory() {
  try {
    const history = await backend.getTranslationHistory();
    historyList.innerHTML = '';
    history.forEach(entry => {
      const li = document.createElement('li');
      li.textContent = `${entry.original} -> ${entry.translated} (${entry.targetLanguage})`;
      historyList.appendChild(li);
    });
  } catch (error) {
    console.error('Error fetching translation history:', error);
  }
}

// Initial update of translation history
updateTranslationHistory();
