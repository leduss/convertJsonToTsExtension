import { useState } from 'react';

export const useJsonFormatter = () => {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [indentationCount, setIndentationCount] = useState<number>(1);
  const [justTypedOpeningBracket, setJustTypedOpeningBracket] =
    useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const { selectionStart, value } = e.currentTarget;
    if (e.key === 'Tab') {
      e.preventDefault();
      const newText = `${value.substring(0, selectionStart)}  ${value.substring(
        selectionStart
      )}`;
      setJsonInput(newText);
      e.currentTarget.setSelectionRange(selectionStart + 2, 0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const newText = `${value.substring(0, selectionStart)}\n${' '.repeat(
        2
      )}${value.substring(selectionStart)}`;
      setJsonInput(newText);
      e.currentTarget.setSelectionRange(selectionStart + 3, selectionStart + 3);
    } else if (e.key === '{') {
      e.preventDefault();
      setIndentationCount(indentationCount + 1);
      setJustTypedOpeningBracket(true);
      const spaces = ' '.repeat(2 * indentationCount);
      const newText = `${value.substring(
        0,
        selectionStart
      )}{\n${spaces}${value.substring(selectionStart)}`;
      setJsonInput(newText);

      const newPosition = selectionStart + 3 + 2 * indentationCount;
      e.currentTarget.setSelectionRange(newPosition, newPosition);
    } else if (e.key === '}') {
      e.preventDefault();
      if (justTypedOpeningBracket) {
        setJustTypedOpeningBracket(false);
        setIndentationCount(Math.max(0, indentationCount - 1));
      }
      const spaces = ' '.repeat(2 * indentationCount - 1);
      const newText = `${value.substring(
        0,
        selectionStart
      )}\n${spaces}}${value.substring(selectionStart)}`;
      setJsonInput(newText);

      const newPosition = selectionStart + 3 + 2 * indentationCount;
      e.currentTarget.setSelectionRange(newPosition, newPosition);
    } else {
      setJustTypedOpeningBracket(false);
    }
  };

  return { jsonInput, handleKeyDown, handleInputChange, resetInput: () => { setJsonInput('');  setIndentationCount(1)} };
};
