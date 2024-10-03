import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function App() {
  const [text, setText] = useState("");
  const [history, setHistory] = useState([{ text: "", cursor: 0 }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [customSeparator, setCustomSeparator] = useState("");
  const textRef = useRef(null);

  const updateText = (newText, cursorPosition) => {
    setText(newText);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ text: newText, cursor: cursorPosition });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndoRedo = (e) => {
    if (e.ctrlKey && e.key === "z") {
      e.preventDefault();
      if (historyIndex > 0) {
        const prevState = history[historyIndex - 1];
        setText(prevState.text);
        setHistoryIndex(historyIndex - 1);
        textRef.current.setSelectionRange(prevState.cursor, prevState.cursor);
      }
    } else if (e.ctrlKey && e.key === "y") {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const nextState = history[historyIndex + 1];
        setText(nextState.text);
        setHistoryIndex(historyIndex + 1);
        textRef.current.setSelectionRange(nextState.cursor, nextState.cursor);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleUndoRedo);
    return () => document.removeEventListener("keydown", handleUndoRedo);
  }, [historyIndex]);

  const countWords = (str) => str.trim().split(/\s+/).length;
  const countChars = (str) => str.length;
  const countSentences = (str) => str.split(/[.!?]+/).length - 1;

  const textActions = {
    lowercase: (t) => t.toLowerCase(),
    uppercase: (t) => t.toUpperCase(),
    capitalized: (t) => t.replace(/\b\w/g, (l) => l.toUpperCase()),
    sentence: (t) =>
      t.replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase()),
    lineBreak: (t) => t.replace(/\.\s*/g, ".\n"),
    removeLineBreak: (t) => t.replace(/\n/g, " "),
    removeSpaces: (t) => t.replace(/\s+/g, " "),
    custom: (t) => t.replace(/\s+/g, customSeparator || " "),
  };

  const handleAction = (action) => {
    const newText = textActions[action](text);
    updateText(newText, textRef.current.selectionEnd);
  };

  const downloadText = () => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "converted_text.txt";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-200 to-gray-400 p-4">
      <Card className="w-full max-w-lg bg-white bg-opacity-80 shadow-lg">
        <CardHeader className="bg-gray-800 text-center">
          <CardTitle className="text-white">Text Case Converter</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            ref={textRef}
            value={text}
            onChange={(e) => updateText(e.target.value, e.target.selectionEnd)}
            className="w-full h-40 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter or paste your text here"
          />
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Input
              placeholder="Custom separator"
              value={customSeparator}
              onChange={(e) => setCustomSeparator(e.target.value)}
              className="w-full sm:w-auto"
            />
            <Button
              onClick={() => handleAction("custom")}
              className="bg-gradient-to-r from-purple-500 to-purple-700"
            >
              Custom Case
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap justify-between gap-2">
            {[
              "lowercase",
              "uppercase",
              "capitalized",
              "sentence",
              "lineBreak",
              "removeLineBreak",
              "removeSpaces",
            ].map((action) => (
              <Button
                key={action}
                onClick={() => handleAction(action)}
                className="bg-gradient-to-r from-blue-500 to-blue-700 flex-grow"
              >
                {action.charAt(0).toUpperCase() + action.slice(1)}
              </Button>
            ))}
            <Button
              onClick={downloadText}
              className="bg-gradient-to-r from-green-500 to-green-700 flex-grow"
            >
              Download
            </Button>
          </div>
          <div className="mt-4 flex justify-between">
            <span>Words: {countWords(text)}</span>
            <span>Characters: {countChars(text)}</span>
            <span>Sentences: {countSentences(text)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
