import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const TextCaseConverter = () => {
  const [text, setText] = useState("");
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [customSeparator, setCustomSeparator] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        undo();
      } else if (e.ctrlKey && e.key === "y") {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [text, undoStack, redoStack]);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setUndoStack([...undoStack, text]);
    setRedoStack([]);
    setText(newText);
  };

  const undo = () => {
    if (undoStack.length > 0) {
      const prevText = undoStack[undoStack.length - 1];
      setRedoStack([...redoStack, text]);
      setText(prevText);
      setUndoStack(undoStack.slice(0, -1));
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const nextText = redoStack[redoStack.length - 1];
      setUndoStack([...undoStack, text]);
      setText(nextText);
      setRedoStack(redoStack.slice(0, -1));
    }
  };

  const convertCase = (type) => {
    setUndoStack([...undoStack, text]);
    setRedoStack([]);
    switch (type) {
      case "lowercase":
        setText(text.toLowerCase());
        break;
      case "uppercase":
        setText(text.toUpperCase());
        break;
      case "capitalized":
        setText(
          text
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        );
        break;
      case "sentence":
        setText(
          text
            .toLowerCase()
            .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
        );
        break;
      case "lineBreak":
        setText(text.replace(/([.!?])\s*/g, "$1\n"));
        break;
      case "removeLineBreak":
        setText(text.replace(/\n/g, " "));
        break;
      case "removeSpaces":
        setText(text.replace(/\s/g, ""));
        break;
      case "customCase":
        setText(text.split(" ").join(customSeparator));
        break;
      default:
        break;
    }
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted_text.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const characterCount = text.length;
  const sentenceCount = text
    .split(/[.!?]+/)
    .filter((sentence) => sentence.trim().length > 0).length;

  const buttonTypes = [
    "lowercase",
    "uppercase",
    "capitalized",
    "sentence",
    "lineBreak",
    "removeLineBreak",
    "removeSpaces",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg bg-white bg-opacity-70 backdrop-blur-sm">
        <CardHeader className="bg-gray-800 bg-opacity-90 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-center">
            Text Case Converter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <Textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Enter or paste your text here..."
            className="w-full h-40 p-3 border rounded-lg shadow-inner bg-white"
          />
          <div className="text-sm text-gray-600 flex flex-wrap justify-between bg-gray-100 bg-opacity-70 p-3 rounded-lg">
            <span>Words: {wordCount}</span>
            <span>Characters: {characterCount}</span>
            <span>Sentences: {sentenceCount}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Input
              type="text"
              value={customSeparator}
              onChange={(e) => setCustomSeparator(e.target.value)}
              placeholder="Enter custom separator"
              className="flex-grow bg-white"
            />
            <Button
              onClick={() => convertCase("customCase")}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 transition-colors w-1/3"
            >
              Custom Case
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {buttonTypes.map((type) => (
              <Button
                key={type}
                onClick={() => convertCase(type)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-colors"
              >
                {type.charAt(0).toUpperCase() +
                  type
                    .slice(1)
                    .replace(/([A-Z])/g, " $1")
                    .trim()}
              </Button>
            ))}
            <Button
              onClick={handleDownload}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-colors md:col-start-4 md:row-start-2"
            >
              Download
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function App() {
  return <TextCaseConverter />;
}
