import { useState } from 'react';

interface PitchLevels {
  [key: string]: boolean;
}

function splitIntoMoras(text: string): string[] {
  const moraRegex = /[んン]|[ぁ-ゖ]ゃ|[ぁ-ゖ]ゅ|[ぁ-ゖ]ょ|[ぁ-ゖー]|[ァ-ヴ]ャ|[ァ-ヴ]ュ|[ァ-ヴ]ョ|[ァ-ヴー]/g;
  const moras = text.match(moraRegex) || [text];
  return moras;
}

export function PitchAccentViz() {
  const [inputText, setText] = useState<string>('こんにちは');
  const [pitchLevels, setPitchLevels] = useState<PitchLevels>({});

  const moras = splitIntoMoras(inputText);
  const MORA_WIDTH = 80; // Width allocated for each mora
  const svgWidth = moras.length * MORA_WIDTH;

  const togglePitch = (mora: string) => {
    setPitchLevels((prev: PitchLevels) => ({ ...prev, [mora]: !prev[mora] }));
  };

  const renderPitchGraph = () => {
    let pathD = '';

    moras.forEach((mora, index) => {
      const x = index * MORA_WIDTH + MORA_WIDTH / 2;
      const y = pitchLevels[mora] ? 10 : 30;

      if (index === 0) {
        pathD = `M ${x},${y}`;
      } else {
        pathD += ` L ${x},${y}`;
      }
    });

    return (
      <svg width={svgWidth} height="60" className="mb-2">
        <path d={pathD} stroke="#fbf0df" strokeWidth="2" fill="none" />
        {moras.map((mora, index) => {
          const x = index * MORA_WIDTH + MORA_WIDTH / 2;
          const y = pitchLevels[mora] ? 10 : 30;
          return <circle key={index} cx={x} cy={y} r="7" fill="#fbf0df" onClick={() => togglePitch(mora)} className="cursor-pointer" />;
        })}
      </svg>
    );
  };

  return (
    <div className="mt-6 mx-auto w-full max-w-2xl text-left flex flex-col gap-4">
      <input
        type="text"
        name="inputWord"
        value={inputText}
        onChange={(e) => setText(e.target.value)}
        className="w-full bg-[#1a1a1a] border-2 border-[#fbf0df] rounded-xl p-3 text-[#fbf0df] font-mono resize-y focus:border-[#f3d5a3] placeholder-[#fbf0df]/40"
        placeholder="Enter Japanese text"
      />
      <div className="relative flex flex-col items-center">
        <div className="w-full min-h-[140px] bg-[#1a1a1a] rounded-xl p-3 flex flex-col items-center justify-center">
          {renderPitchGraph()}
          <div className="flex" style={{ width: svgWidth }}>
            {moras.map((mora, index) => (
              <span
                key={index}
                className="text-[#fbf0df] font-mono text-4xl cursor-pointer text-center"
                style={{ width: MORA_WIDTH }}
                onClick={() => togglePitch(mora)}
              >
                {mora}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
