import './globals.css';
import { Textarea } from './components/ui/textarea';
import { Button } from './components/ui/button';
import { useJsonToTsConverter } from './hooks/useJsonToTsConverter';
import { useJsonFormatter } from './hooks/useJsonFormatter';
import { Card } from './components/ui/card';
import { useState } from 'react';
import { ClipboardCopy } from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  const { tsOutput, convertJsonToTs, resetOuput, error } = useJsonToTsConverter();
  const { jsonInput, handleKeyDown, handleInputChange, resetInput } = useJsonFormatter();
  const [isHovered, setIsHovered] = useState(false);


  const placeholder = {
    "user": {
      "name": "John",
      "age": 30,
      "email": "john@example.com",
    },
    "orders": [
      {
        "id": 1,
        "product": "Laptop",
      },
      {
        "id": 2,
        "product": "Phone",
      },
    ],
  };

  const stripHtmlTags = (htmlString: string): string => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Interface copied to clipboard', {
        position: 'top-center',
        style: { background: '#07bc0c', color: '#fff', fontSize: '14px' },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickPaste = () => {
    const plainTextOutput = stripHtmlTags(tsOutput);
    copyToClipboard(plainTextOutput);
  };

  const errorPosition = error.match(/line (\d+)/);
  const errorLineNumber = errorPosition ? parseInt(errorPosition[1], 10) : null;
  const lines = jsonInput.split('\n').map((_, index) => index + 1);
  const lineNumbers = lines.map((line) => (
    <div
      className={`text-xs ${errorLineNumber === line ? 'text-red-500' : ''}`}
      key={line}
    >
      {jsonInput === '' ? '' : line}
    </div>
  ))

  return (
    <div className="flex flex-col items-center w-[600px] h-[500px] p-1">
      <h1 className="text-lg">JSON to TypeScript Converter</h1>
      <div className="flex gap-4 mt-1 mb-2">
        <Button
          className="text-xs"
          size="sm"
          onClick={() => convertJsonToTs(jsonInput)}
        >
          Convert JSON
        </Button>
        <Button
          className="text-xs"
          size="sm"
          onClick={() => {
            resetOuput();
            resetInput();
          }}
        >
          Reset
        </Button>
      </div>
      <div className="flex h-full w-full gap-6">
        <div className={`flex w-1/2 ${jsonInput !== '' ? "gap-2" : ""}`}>
          {jsonInput !== '' ? (
            <div className="line-numbers mt-[9.5px] h-full overflow-y-auto">
              {lineNumbers}
            </div>
          ) : null}
          <Textarea
            placeholder={JSON.stringify(placeholder, null, 2)}
            value={jsonInput}
            onChange={handleInputChange}
            className="w-full h-full p-2 text-xs"
            onKeyDown={handleKeyDown}
            style={{
              resize: 'none',
              borderColor: error ? 'red' : undefined,
            }}
          />
        </div>
        <Card
          className="w-1/2 h-full p-2 relative overflow-y-auto overflow-x-none "
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {error ? (
            <p className="text-sm break-all">{error}</p>
          ) : (
            <pre
              className="w-full overflow-none text-xs"
              dangerouslySetInnerHTML={{ __html: tsOutput }}
            ></pre>
          )}
          {isHovered ? (
            <div className="absolute top-2 right-2 z-10 ">
              <Button variant="outline" size="icon" onClick={handleClickPaste}>
                <ClipboardCopy className="" size={24} />
              </Button>
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
