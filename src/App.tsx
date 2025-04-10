import "./index.css";
import { PitchAccentViz as PitchAccentViz } from "./PitchAccentViz";

import logo from "./logo.svg";
import reactLogo from "./react.svg";

export function App() {
  return (
    <div className="max-w-7xl mx-auto p-8 text-center relative z-10">
      <h1 className="text-5xl font-bold my-4 leading-tight">高低アクセントツール</h1>
      <p>
        下記のBox に高低アクセントを入れてみてほしい。
      </p>
      <PitchAccentViz />
    </div>
  );
}

export default App;
