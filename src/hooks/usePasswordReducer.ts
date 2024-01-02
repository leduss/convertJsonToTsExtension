import { useReducer } from 'react';

export type PasswordState = {
  password: string;
  passwordLength: number;
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
};

type PasswordAction =
  | { type: 'GENERATE' }
  | { type: 'TOGGLE_INCLUDE'; payload: keyof PasswordState }
  | { type: 'SET_LENGTH'; payload: number };

const initialState: PasswordState = {
  password: '',
  passwordLength: 8,
  uppercase: true,
  numbers: true,
  symbols: true,
};

function passwordReducer(
  state: PasswordState,
  action: PasswordAction
): PasswordState {
  const chars: { [key: string]: string } = {
    lowercase: 'abcdefghijklmnpqrstuvwxyz',
    uppercase: state.uppercase ? 'ABCDEFGHIJKLMNPQRSTUVWXYZ' : '',
    numbers: state.numbers ? '123456789' : '',
    symbols: state.symbols ? '!@#$%^&*()_+{}[]:;<>,.?/~' : '',
  };
  const charset = Object.values(chars).join('');

  let symbolsCount;
  let uppercaseCount;

  let newPassword = '';
  let hasNumber = false;
  let hasUppercase = false;
  let hasSymbol = false;

  switch (action.type) {
    case 'GENERATE':
      if (state.passwordLength > 16) {
        uppercaseCount =
          Math.floor((Math.random() * state.passwordLength) / 3) + 1;
        symbolsCount =
          Math.floor((Math.random() * state.passwordLength) / 3) + 1;
      } else {
        uppercaseCount =
          Math.floor((Math.random() * state.passwordLength) / 2) + 1;
        symbolsCount =
          Math.floor((Math.random() * state.passwordLength) / 2) + 1;
      }

      for (let i = 0; i < state.passwordLength; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);

        if (state.numbers && charset[randomIndex]?.match(/[1-9]/)) {
          hasNumber = true;
        }

        if (state.uppercase && charset[randomIndex]?.match(/[A-Z]/)) {
          hasUppercase = true;
        }

        if (
          state.symbols &&
          charset[randomIndex]?.match(/[!@#$%^&*()_+{}[\]:;<>,.?/~]/)
        ) {
          hasSymbol = true;
        }

        if (charset[randomIndex]?.match(/[A-Z]/) && uppercaseCount === 0) {
          i--;
        } else if (
          charset[randomIndex]?.match(/[!@#$%^&*()_+{}[\]|:;<>,.?/~]/) &&
          symbolsCount === 0
        ) {
          i--;
        } else {
          newPassword += charset[randomIndex];
          if (charset[randomIndex]?.match(/[A-Z]/)) {
            uppercaseCount--;
          } else if (
            charset[randomIndex]?.match(/[!@#$%^&*()_+{}[\]:;<>,.?/~]/)
          ) {
            symbolsCount--;
          }
        }
      }

      if (state.numbers && !hasNumber) {
        const randomIndex = Math.floor(Math.random() * newPassword.length);
        const numberIndex = Math.floor(Math.random() * 9) + 1;
        newPassword =
          newPassword.substring(0, randomIndex) +
          numberIndex.toString() +
          newPassword.substring(randomIndex + 1);
      }

      if (state.uppercase && !hasUppercase) {
        const randomIndex = Math.floor(Math.random() * newPassword.length);
        const uppercaseIndex = 'ABCDEFGHIJKLMNPQRSTUVWXYZ'.charAt(
          Math.floor(Math.random() * 23)
        );
        newPassword =
          newPassword.substring(0, randomIndex) +
          uppercaseIndex +
          newPassword.substring(randomIndex + 1);
      }

      if (state.symbols && !hasSymbol) {
        const randomIndex = Math.floor(Math.random() * newPassword.length);
        const symbolIndex = '!@#$%^&*()_+{}[]:;<>,.?/~'.charAt(
          Math.floor(Math.random() * 25)
        );
        newPassword =
          newPassword.substring(0, randomIndex) +
          symbolIndex +
          newPassword.substring(randomIndex + 1);
      }

      return { ...state, password: newPassword };

    case 'TOGGLE_INCLUDE':
      return { ...state, [action.payload]: !state[action.payload] };

    case 'SET_LENGTH':
      return { ...state, passwordLength: action.payload };

    default:
      return state;
  }
}

export default function usePasswordReducer(): [
  PasswordState,
  React.Dispatch<PasswordAction>,
] {
  return useReducer(passwordReducer, initialState);
}
