import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function App() {
  const [text, setText] = useState("");
  const [history, setHistory] = useState([{ text: "", index: 0 }]);
  const [customSeparator, setCustomSeparator] = useState("");
  const textAreaRef = useRef(null);

  const handleTextChange = (e) => {
    setText(e.target.value);
    setHistory((prev) => [
      ...prev.slice(0, prev.length - 1),
      { text: e.target.value, index: prev.length },
    ]);
  };

  const convertCase = (converter) => {
    setText(converter(text));
  };

  const undo = () => {
    if (history.length > 1) {
      const lastIndex = history[history.length - 2].index;
      setText(history[lastIndex].text);
      setHistory((prev) => prev.slice(0, -1));
    }
  };

  const redo = () => {
    if (history.length < history.length) {
      const nextIndex = history[history.length - 1].index + 1;
      if (history[nextIndex]) {
        setText(history[nextIndex].text);
        setHistory((prev) => [...prev, history[nextIndex]]);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey) {
        if (e.key === "z") undo();
        if (e.key === "y") redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [history]);

  const downloadTxtFile = () => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "converted_text.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <div className="bg-gradient-to-br from-gray-300 to-gray-500 min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-3xl p-4 shadow-xl bg-white bg-opacity-80">
        <CardHeader>
          <CardTitle className="text-center text-white bg-gray-800 p-4">
            Text Case Converter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            ref={textAreaRef}
            value={text}
            onChange={handleTextChange}
            className="w-full h-40 p-2 border rounded-md mb-4 resize-y"
          />
          <div className="mb-4">
            <Input
              value={customSeparator}
              onChange={(e) => setCustomSeparator(e.target.value)}
              placeholder="Enter separator"
            />
            <Button
              onClick={() =>
                convertCase((t) => t.split(/\s+/).join(customSeparator))
              }
              className="ml-2 bg-gradient-to-r from-purple-500 to-purple-700"
            >
              Custom Case
            </Button>
          </div>
          <Counters text={text} />
          <div className="flex flex-wrap gap-2">
            {[
              "Lowercase",
              "Uppercase",
              "Capitalized Case",
              "Sentence Case",
            ].map((caseType) => (
              <CaseButton
                key={caseType}
                caseType={caseType}
                convertCase={convertCase}
                text={text}
              />
            ))}
            <Button
              onClick={() =>
                convertCase((t) =>
                  t.replace(/\. /g, ".\n").replace(/\.\n/g, ".\n\n")
                )
              }
              className="bg-blue-500 hover:bg-blue-700"
            >
              Line Break
            </Button>
            <Button
              onClick={() => convertCase((t) => t.replace(/\n/g, " "))}
              className="bg-blue-500 hover:bg-blue-700"
            >
              Remove Line Break
            </Button>
            <Button
              onClick={() => convertCase((t) => t.replace(/\s+/g, " "))}
              className="bg-blue-500 hover:bg-blue-700"
            >
              Remove Spaces
            </Button>
            <Button
              onClick={downloadTxtFile}
              className="ml-auto bg-gradient-to-r from-green-400 to-green-600"
            >
              Download
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Counters({ text }) {
  const words = text.trim().split(/\s+/).length;
  const characters = text.length;
  const sentences = text.split(/[.!?]+/).length - 1;

  return (
    <div className="flex justify-between mb-4">
      <span>Words: {words}</span>
      <span>Characters: {characters}</span>
      <span>Sentences: {sentences}</span>
    </div>
  );
}

function CaseButton({ caseType, convertCase, text }) {
  const converters = {
    Lowercase: (t) => t.toLowerCase(),
    Uppercase: (t) => t.toUpperCase(),
    "Capitalized Case": (t) =>
      t
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" "),
    "Sentence Case": (t) =>
      t.replace(/(^\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase()),
  };

  return (
    <Button
      onClick={() => convertCase(converters[caseType])}
      className="bg-gradient-to-r from-blue-400 to-blue-600"
    >
      {caseType}
    </Button>
  );
}
