import { useEffect } from 'react';
import { toast } from 'sonner';
import { ThemeToggle } from './components/theme/ThemeToggle';
import usePasswordReducer, { PasswordState } from './hooks/usePasswordReducer';
import './globals.css';
import { Button } from './components/ui/button';
import { Slider } from './components/ui/slider';
import { Label } from './components/ui/label';
import { Switch } from './components/ui/switch';
import { Card } from './components/ui/card';
import { Typography } from './components/ui/Typography';
import { Loader } from './components/ui/loader';

export default function Home() {
  const [state, dispatch] = usePasswordReducer();
  const {
    password,
    passwordLength,
    uppercase,
    numbers,
    symbols,
  }: PasswordState = state;

  useEffect(() => {
    dispatch({ type: 'GENERATE' });
  }, [dispatch]);

  const handleChange = (value: number[]) => {
    dispatch({ type: 'SET_LENGTH', payload: value[0] || 0 });
  };

  const handleClick = () => {
    dispatch({ type: 'GENERATE' });
  };

  const handleToogleUppercase = () => {
    dispatch({ type: 'TOGGLE_INCLUDE', payload: 'uppercase' });
  };

  const handleToogleNumbers = () => {
    dispatch({ type: 'TOGGLE_INCLUDE', payload: 'numbers' });
  };

  const handleToogleSymbols = () => {
    dispatch({ type: 'TOGGLE_INCLUDE', payload: 'symbols' });
  };

  const handleClickPaste = () => {
    const copy = navigator.clipboard.writeText(password);

    if (Promise.resolve(copy) instanceof Promise) {
      copy
        .then(() => {
          toast.success('Mot de passe copié dans le presse-papiers', {
            position: 'top-center',
            style: { background: '#07bc0c', color: '#fff', fontSize: '14px' },
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <div className="flex flex-col ml-52 mt-20 m-4 pt-10 relative w-96">
      <h1 className="text-xl text-center font-bold">
        Génrateur de mot de passe
      </h1>
      <div className="flex flex-col justify-center items-center gap-2 pb-2 mt-4 mb-6">
        <Button
          size="icon"
          className="text-center bg-primary rounded-lg cursor-default "
        >
          {passwordLength}
        </Button>
        <Slider
          defaultValue={[passwordLength]}
          min={0}
          max={32}
          step={1}
          onValueChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-3 mb-2">
        <div className="flex items-center justify-between gap-4 w-full">
          <Label>Majuscules (A-Z)</Label>
          <Switch onClick={handleToogleUppercase} checked={uppercase} />
        </div>
        <div className="flex items-center justify-between gap-4 w-full">
          <Label>Chiffres (1-9)</Label>
          <Switch onClick={handleToogleNumbers} checked={numbers} />
        </div>
        <div className="flex items-center justify-between gap-4 w-full">
          <Label>Caractères speciaux (!@#$%^&*...)</Label>
          <Switch onClick={handleToogleSymbols} checked={symbols} />
        </div>
      </div>

      <Card className="p-2 mt-4">
        <Typography className="text-lg text-center">
          {password ? password : <Loader className="m-auto" />}
        </Typography>
      </Card>
      <div className="flex justify-between gap-20 mt-2">
        <Button onClick={handleClick} className="text-base w-full">
          Générer
        </Button>
        <Button
          onClick={handleClickPaste}
          className="text-base w-full cursor-copy"
        >
          Copier
        </Button>
      </div>

      <div className="absolute top-0 left-0 ">
        {' '}
        <ThemeToggle />
      </div>
    </div>
  );
}
