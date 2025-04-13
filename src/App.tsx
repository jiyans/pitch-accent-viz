import './index.css';
import { PitchAccentViz as PitchAccentViz } from './PitchAccentViz';

export function App() {
  return (
    <div className="max-w-7xl mx-auto p-4 text-center relative z-10">
      <h1 className="text-4x1 sm:text-6xl font-bold my-4 leading-tight">ダンゴネーション</h1>
      <p>カタカナを入れて、文字をクリックしてみてー</p>
      <PitchAccentViz />
    </div>
  );
}

export default App;
