import React, {useState } from "react";

export function APITester() {
  const [inputText, setText] = useState("こんにちは")
  return (
    <div className="mt-8 mx-auto w-full max-w-2xl text-left flex flex-col gap-4">
        <input
          type="text"
          name="inputWord"
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-[#1a1a1a] border-2 border-[#fbf0df] rounded-xl p-3 text-[#fbf0df] font-mono resize-y focus:border-[#f3d5a3] placeholder-[#fbf0df]/40"
          placeholder={inputText}
        />
      <textarea
        readOnly
        value={inputText}
        className="w-full min-h-[140px] bg-[#1a1a1a] border-2 border-[#fbf0df] rounded-xl p-3 text-[#fbf0df] font-mono resize-y focus:border-[#f3d5a3] placeholder-[#fbf0df]/40"
      >
      </textarea>
    </div>
  );
}
