import React, {
  useState,
  useEffect,
  ChangeEvent,
  useRef,
  KeyboardEvent,
} from "react";
import Lottie from "react-lottie";

import bombData from "./assets/bomb.json";
import Victory from "./components/Victory";
import Explosion from "./components/Explosion";
import { formatTime } from "./utils";
import { SUPPORTED_KEYS } from "./constants";
import "./App.css";

const bombConfig = {
  loop: true,
  autoplay: true,
  animationData: bombData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const App = () => {
  const [timer, setTimer] = useState(30 * 60);
  const [victory, setVictory] = useState(false);
  const [error, setError] = useState("");
  const [output, setOutput] = useState("");
  const [userInput, setUserInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [currentCommandIndex, setCurrentCommandIndex] = useState(-1);
  // Use interval ref so we can cancel timer in any part of the code
  const intervalRef: React.MutableRefObject<any> = useRef(null);
  // Use textarea ref so we can scroll element on any change
  const areaRef: React.MutableRefObject<HTMLTextAreaElement | null> =
    useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          clearInterval(intervalRef.current);
          return prevTimer;
        } else {
          return prevTimer - 1;
        }
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const onDefuse = () => {
    var regex = /\bdefuse\b/;
    // Prevent pasting "defuse" in an input field
    if (regex.test(userInput)) {
      setError("Don't try to cheat yourself!");
      setUserInput("");

      setTimeout(() => setError(""), 4000);
      return;
    }

    let evolvedValue = "";

    try {
      evolvedValue = eval(userInput);
    } catch (e) {
      setError(
        "Syntax error, please check your code better, don't play with the bomb!"
      );

      setTimeout(() => setError(""), 4000);
      return;
    }

    if (evolvedValue === "defuse") {
      setVictory(true);
      clearInterval(intervalRef.current);
    }

    if (typeof evolvedValue === "string") {
      // Make distinction in console when type is string
      evolvedValue = `"${evolvedValue}"`;
    } else if (Array.isArray(evolvedValue)) {
      // Cover case when array is coerced to an empty string
      evolvedValue = "[]";
    }

    setOutput((prevState) => prevState + "\n" + evolvedValue);
    setHistory((prevState) => [...prevState, userInput]);
    setUserInput("");

    if (currentCommandIndex >= 0) setCurrentCommandIndex(-1);

    setTimeout(() => {
      areaRef?.current?.scrollTo && areaRef.current.scrollTo(0, 100000);
    }, 0);
  };

  const populateHistory = (event: KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    const copyPaste = event.metaKey && ["v", "c"].includes(key);

    if (!SUPPORTED_KEYS.includes(key) && !copyPaste) {
      event.preventDefault();
      return;
    }

    if (key === "ArrowUp") {
      if (!currentCommandIndex) return;

      let index = 0;

      if (currentCommandIndex < 0) {
        index = history.length - 1;
      } else {
        index = currentCommandIndex - 1;
      }

      setCurrentCommandIndex(index);
      setUserInput(String(history.at(index)));
    }

    if (key === "ArrowDown") {
      if (currentCommandIndex === history.length - 1) return;

      let index = currentCommandIndex + 1;

      setCurrentCommandIndex(index);
      setUserInput(String(history.at(index)));
    }

    if (key === "Enter" && userInput.length) onDefuse();
  };

  return (
    <div className="app">
      {!timer && <Explosion />}
      {!!timer && victory && <Victory />}

      {!!timer && !victory && (
        <>
          <Lottie options={bombConfig} height={300} width={300} />
          <h1 className="title">Defuse the bomb!</h1>
          <p className="text">
            A little game for JS developers. Think of a bomb above as ChatGPT
            that will blow up the market and reduce demand for developer
            services, only your deep understanding of JS can secure your
            position. You have a simple task, just print <b>defuse</b> in input
            field below...but...you can use only 6 characters <b>( ) [ ] ! +</b>
            , all others are forbidden...simple, isn't it? 😉
            <br />
            <br />
            Time has already been ticking for a while...Good luck!
          </p>
          <p className="text">
            <b>TIP</b>: Coercion, sounds familiar? Try as many times as you
            want, follow the console to see the results.
          </p>
          <div className="timer">{formatTime(timer)}</div>
          <input
            type="text"
            onChange={handleInputChange}
            value={userInput}
            onKeyDown={populateHistory}
          />

          {error && <span className="error">{error}</span>}

          <button disabled={!userInput.length} onClick={onDefuse}>
            Defuse
          </button>
          <textarea ref={areaRef} disabled cols={6} value={output} />
        </>
      )}
    </div>
  );
};

export default App;
