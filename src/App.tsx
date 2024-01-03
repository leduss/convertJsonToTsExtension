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
  const { tsOutput, convertJsonToTs, resetOuput } = useJsonToTsConverter();
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
      toast.success('Texte copié dans le presse-papier', {
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

  return (
    <div className="flex flex-col items-center h-screen w-screen p-3">
      <h1>JSON to TypeScript Converter</h1>
      <div>
        <Button className="m-2" onClick={() => convertJsonToTs(jsonInput)}>
          Convertir en TS
        </Button>
        <Button
          className="m-2"
          onClick={() => {
            resetOuput();
            resetInput();
          }}
        >
          Reset
        </Button>
      </div>
      <div className="flex h-full w-full gap-10">
        <Textarea
          placeholder={JSON.stringify(placeholder, null, 2)}
          value={jsonInput}
          onChange={handleInputChange}
          className="w-full h-full p-2"
          onKeyDown={handleKeyDown}
        />
        <Card
          className="w-full h-full p-2 relative "
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <pre dangerouslySetInnerHTML={{ __html: tsOutput }}></pre>
          {isHovered ? (
            <div className="absolute top-2 right-2 z-10 ">
              <Button variant="outline" onClick={handleClickPaste}>
                <ClipboardCopy className="z-10" />
              </Button>
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
