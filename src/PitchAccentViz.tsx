import { useState, useEffect, useRef } from 'react';

interface PitchLevels {
  [key: string]: boolean;
}

function splitIntoMoras(text: string): string[] {
  const moraRegex = /[んン]|[ぁ-ゖ]ゃ|[ぁ-ゖ]ゅ|[ぁ-ゖ]ょ|[ぁ-ゖー]|[ァ-ヴ]ャ|[ァ-ヴ]ュ|[ァ-ヴ]ョ|[ァ-ヴー]/g;
  const moras = text.match(moraRegex) || [text];
  return moras;
}

export function PitchAccentViz() {
  const [inputText, setText] = useState<string>('だだだだんご');
  const [isCopied, setIsCopied] = useState(false);
  const [pitchLevels, setPitchLevels] = useState<PitchLevels>({});

  const moras = splitIntoMoras(inputText);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const moraWidth = Math.min(
    (containerWidth - 32) / moras.length, // available width divided by number of moras
    80, // max width per mora
  );
  const svgWidth = moras.length * moraWidth;

  const copyToClipboard = async () => {
    try {
      const html = `
      <div style="font-family: monospace;">
        <div style="margin-bottom: 10px;">
          ${moras
            .map(
              (mora, _) =>
                ` <span style="display: inline-block; min-width: ${moraWidth}px; text-align: center;"> ${pitchLevels[mora] ? '↑' : '↓'} </span> `,
            )
            .join('')}
        </div>
        <div>
          ${moras.map((mora, _) => ` <span style="display: inline-block; min-width: ${moraWidth}px; text-align: center;"> ${mora} </span> `).join('')}
        </div>
      </div>
    `;

      // Create a Blob with HTML content
      const blob = new Blob([html], { type: 'text/html' });
      const clipboardItem = new ClipboardItem({ 'text/html': blob });

      await navigator.clipboard.write([clipboardItem]);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset copied state after 2 seconds
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const togglePitch = (mora: string, index: number) => {
    const uniqueKey = `${mora}-${index}`;
    setPitchLevels((prev: PitchLevels) => ({ ...prev, [uniqueKey]: !prev[uniqueKey] }));
  };

  const renderPitchGraph = () => {
    let pathD = '';

    moras.forEach((mora, index) => {
      const x = index * moraWidth + moraWidth / 2;
      const y = pitchLevels[`${mora}-${index}`] ? 20 : 40;

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
          const x = index * moraWidth + moraWidth / 2;
          const y = pitchLevels[`${mora}-${index}`] ? 20 : 40;
          const r = moraWidth / 4;
          return <circle key={index} cx={x} cy={y} r={r} fill="#fbf0df" onClick={() => togglePitch(mora, index)} className="cursor-pointer" />;
        })}
      </svg>
    );
  };

  return (
    <div ref={containerRef} className="mt-6 mx-auto w-full max-w-[640px] text-left flex flex-col gap-4">
      <div className="flex gap-3 w-full">
        <input
          type="text"
          name="inputWord"
          value={inputText}
          onChange={(e) => setText(e.target.value)}
          className="flex-9 bg-[#1a1a1a] border-2 border-[#fbf0df] rounded-xl p-3
        text-[#fbf0df] font-mono focus:border-[#f3d5a3]
        placeholder-[#fbf0df]/40"
          placeholder="Enter Japanese text"
        />
        <button
          onClick={copyToClipboard}
          className="px-4 bg-[#1a1a1a] text-[#fbf0df] border-2 border-[#fbf0df]
          rounded-xl hover:bg-[#2a2a2a] hover:border-[#f3d5a3] transition-all
          duration-200 font-mono flex-1"
        >
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="relative flex flex-col items-center ">
        <div className="min-h-[240px] bg-[#1a1a1a] rounded-xl p-3 flex flex-col items-center justify-center">
          {renderPitchGraph()}
          <div className="flex">
            {moras.map((mora, index) => (
              <span
                key={`${mora}-${index}`}
                className="text-[#fbf0df] font-mono text-4xl cursor-pointer text-center"
                style={{
                  width: moraWidth,
                  fontSize: `${Math.max(Math.min(moraWidth * 0.6, 36), 16)}px`,
                }}
                onClick={() => togglePitch(mora, index)}
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
