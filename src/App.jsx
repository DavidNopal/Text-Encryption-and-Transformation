import { useState } from "react";
import arrow from "./assets/arrow2.png";
import "./App.css";

function App() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [shift, setShift] = useState(3);
  const [history, setHistory] = useState([]);
  const [explanation, setExplanation] = useState("");
  const [copied, setCopied] = useState(false);

  function reverseText() {
    const reversed = inputText.split("").reverse().join("");
    setOutputText(reversed);
    setExplanation(createExplanation("Reverse", inputText, reversed));
    addToHistory("Reverse", inputText, reversed);
  }

  function convertToAscii() {
    const ascii = inputText
      .split("")
      .map((char) => char.charCodeAt(0))
      .join(" ");

    setOutputText(ascii);
    setExplanation(createExplanation("ASCII", inputText, ascii));
    addToHistory("Text to ASCII", inputText, ascii);
  }

  function asciiToText() {
    const text = inputText
      .split(" ")
      .map((code) => String.fromCharCode(Number(code)))
      .join("");

    setOutputText(text);
    setExplanation(createExplanation("ASCII to Text", inputText, text));
    addToHistory("ASCII to Text", inputText, text);
  }

  function caesarCipher(text, shiftAmount) {
    return text
      .split("")
      .map((char) => {
        const code = char.charCodeAt(0);

        // Uppercase 
        if (code >= 65 && code <= 90) {
          return String.fromCharCode(((code - 65 + shiftAmount + 26) % 26) + 65);
        }

        // Lowercase 
        if (code >= 97 && code <= 122) {
          return String.fromCharCode(((code - 97 + shiftAmount + 26) % 26) + 97);
        }

        // Keeps spaces, numbers, and symbols unchanged
        return char;
      })
      .join("");
  }

  function encryptCaesar() {
    const result = caesarCipher(inputText, Number(shift));
    setOutputText(result);
    setExplanation(createExplanation("Caesar Encrypt", inputText, result));
    addToHistory(`Caesar Encrypt (shift ${shift})`, inputText, result);
  }

  function decryptCaesar() {
    const result = caesarCipher(inputText, -Number(shift));
    setOutputText(result);
    setExplanation(createExplanation("Caesar Decrypt", inputText, result));
    addToHistory(`Caesar Decrypt (shift ${shift})`, inputText, result);
  }

  function encodeBase64() {
    try {
      const result = btoa(inputText);
      setOutputText(result);
      setExplanation(createExplanation("Base64 Encode", inputText, result));
      addToHistory("Base64 Encode", inputText, result);
    } catch {
      setOutputText("Error: Could not encode text.");
      setExplanation("Encoding failed.");
    }
  }

  function decodeBase64() {
    try {
      const result = atob(inputText);
      setOutputText(result);
      setExplanation(createExplanation("Base64 Decode", inputText, result));
      addToHistory("Base64 Decode", inputText, result);
    } catch {
      setOutputText("Error: Invalid Base64 text.");
      setExplanation("Decoding failed because the input was not valid Base64.");
    }
  }
  function copyOutput() {
    navigator.clipboard.writeText(outputText);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  function downloadOutput() {
    const file = new Blob([outputText], { type: "text/plain" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(file);
    link.download = "transformed-text.txt";
    link.click();

    URL.revokeObjectURL(link.href);
  }

  function makeUppercase() {
    const result = inputText.toUpperCase();
    setOutputText(result);
    setExplanation(createExplanation("Uppercase", inputText, result));
    addToHistory("Uppercase", inputText, result);
  }

  function makeLowercase() {
    const result = inputText.toLowerCase();
    setOutputText(result);
    setExplanation(createExplanation("Lowercase", inputText, result));
    addToHistory("Lowercase", inputText, result);
  }

  function addToHistory(action, input, output) {
    const newEntry = {
      action,
      input,
      output,
    };

    setHistory((prev) => [newEntry, ...prev]);
  }

  function clearText() {
    setInputText("");
    setOutputText("");
  }

  function createExplanation(action, input, output) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    if (action === "ASCII") {
      const chart = input
        .split("")
        .map((char) => `[ ${char === " " ? "space" : char} → ${char.charCodeAt(0)} ]`)
        .join("   |   ");

      return `ASCII Conversion Chart

${chart}

Input:
${input}

Output:
${output}`;
    }

    if (action === "ASCII to Text") {
      const chart = input
        .split(" ")
        .map((code) => `[ ${code} → ${String.fromCharCode(Number(code))} ]`)
        .join("   |   ");

      return `ASCII to Text Conversion Chart

${chart}

Input:
${input}

Output:
${output}`;
    }

    if (action === "Caesar Encrypt") {
      const letters = alphabet.split("");
      let rows = [];

      for (let i = 0; i < letters.length; i += 6) {
        const row = letters
          .slice(i, i + 6)
          .map((letter) => {
            const shifted = caesarCipher(letter, Number(shift));
            return `${letter} → ${shifted}`;
          })
          .join("     ");

        rows.push(row);
      }

      const chart = rows.join("\n");

      return `Caesar Cipher Shift Chart (Shift ${shift})

${chart}

Input:
${input}

Encrypted Output:
${output}`;
    }

    if (action === "Caesar Decrypt") {
      const letters = alphabet.split("");
      let rows = [];

      for (let i = 0; i < letters.length; i += 6) {
        const row = letters
          .slice(i, i + 6)
          .map((letter) => {
            const shifted = caesarCipher(letter, -Number(shift));
            return `${letter} → ${shifted}`;
          })
          .join("     ");

        rows.push(row);
      }

      const chart = rows.join("\n");

      return `Caesar Cipher Decryption Chart (Shift ${shift})

${chart}

Input:
${input}

Decrypted Output:
${output}`;
    }

    if (action === "Base64 Encode") {
      return `Base64 Encoding Explanation

Plain Text:
${input}

Base64 Output:
${output}

Base64 converts text into a different representation using letters, numbers, +, /, and =.`;
    }

    if (action === "Base64 Decode") {
      return `Base64 Decoding Explanation

Base64 Input:
${input}

Decoded Text:
${output}`;
    }

    if (action === "Reverse") {
      return `The text was reversed from:
${input}

to:
${output}`;
    }

    if (action === "Uppercase") {
      return `Each letter was converted to uppercase:
${output}`;
    }

    if (action === "Lowercase") {
      return `Each letter was converted to lowercase:
${output}`;
    }

    if (action === "Chain") {
      return `Transformations applied in order:
${chain.join(" → ")}

Final Result:
${output}`;
    }

    return "";
  }

  return (
    <div className="app">
      <div className="header">
        <h1>Crypta</h1>
        <p className="subtitle">
          Transform, encode, and decode your text with ease.
        </p>
      </div>

      <h2 className="instructions">Choose how you want to encrypt or decrypt your text below:</h2>

      <img src={arrow} className="arrow" alt="Arrow pointing down" />

      <div className="buttons">
        <button onClick={convertToAscii}>Text → ASCII</button>
        <button onClick={asciiToText}>ASCII → Text</button>
        <button onClick={encodeBase64}>Base64 Encode</button>
        <button onClick={decodeBase64}>Base64 Decode</button>
        <button onClick={encryptCaesar}>Encrypt Caesar</button>
        <button onClick={decryptCaesar}>Decrypt Caesar</button>
        <button onClick={reverseText}>Reverse Text</button>
        <button onClick={makeUppercase}>Uppercase</button>
        <button onClick={makeLowercase}>Lowercase</button>
      </div>

      <div className="shift-control">
        <label>Caesar Cypher Shift: {shift}</label>
        <input
          type="range"
          min="1"
          max="25"
          value={shift}
          onChange={(e) => setShift(e.target.value)}
        />
      </div>

      <div className="container">
        <div className="box">
          <h2>Input</h2>
          <textarea
            placeholder="Type your message here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button className="clear-btn" onClick={clearText}>Clear</button>

        </div>

        <div className="box">
          <h2>Output</h2>
          <textarea
            placeholder="Your transformed text will appear here..."
            value={outputText}
            readOnly
          />
          <button className="copy-btn" onClick={copyOutput} disabled={!outputText}>Copy Output</button>
        </div>
      </div>

      {copied && <p className="copied-msg">Copied to clipboard!</p>}

      <div className="explanation-panel">
        <h2>Explanation</h2>
        {explanation ? (
          <pre>{explanation}</pre>
        ) : (
          <p>No explanation yet. Run a transformation to see how it works.</p>
        )}
      </div>


      <div className="history">
        <h2>History</h2>

        {history.length === 0 ? (
          <p>No transformations yet.</p>
        ) : (
          history.map((item, index) => (
            <div key={index} className="history-item">
              <p><strong>Action:</strong> {item.action}</p>
              <p><strong>Input:</strong> {item.input}</p>
              <p><strong>Output:</strong> {item.output}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;