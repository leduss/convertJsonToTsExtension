import { useCallback, useReducer } from "react";

type State = {
  tsOutput: string;
};

type Action =
  | { type: 'SET_OUTPUT'; payload: string }
  | { type: 'RESET_OUTPUT' };

// Fonction de réduction
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_OUTPUT':
      return { ...state, tsOutput: state.tsOutput + action.payload };
    case 'RESET_OUTPUT':
      return { ...state, tsOutput: '' };
    default:
      return state;
  }
};

export const useJsonToTsConverter = () => {
  const [state, dispatch] = useReducer(reducer, { tsOutput: '' });

  const convertJsonToTs = useCallback((jsonInput: string) => {
    dispatch({ type: 'RESET_OUTPUT' });

    try {
      const parsedJson = JSON.parse(jsonInput);
      if (typeof parsedJson === 'object' && parsedJson !== null) {
        const tsCode = generateTsCode(parsedJson);
        dispatch({ type: 'SET_OUTPUT', payload: tsCode });
      } else {
        dispatch({ type: 'SET_OUTPUT', payload: 'Entrée JSON invalide' });
      }
    } catch (error) {
      console.error('Erreur lors de la conversion:', error);
      dispatch({ type: 'SET_OUTPUT', payload: 'Erreur lors de la conversion' });
    }
  }, []);

  const generateTsCode = (obj: Record<string, unknown>): string => {
    let interfaceCode = '';

    const generatedInterfaces: Set<string> = new Set();

    const generateInterface = (name: string, obj: Record<string, unknown>): void => {
      if (generatedInterfaces.has(name)) return;

      let interfaceContent = `<span style="color: #FA33E9;">export interface</span><span style="color: cyan;"> ${name}</span> {\n`;
      for (const [key, value] of Object.entries(obj)) {
        const type = determineType(value, key);
        interfaceContent += `  <span style="color: white;">${key}</span><span style="color: #FA33E9;">:</span> <span style="color: cyan; font-style: italic">${type}</span>;\n`;
      }
      interfaceContent += '}\n\n';
      interfaceCode += interfaceContent;
      generatedInterfaces.add(name);
    };

    const determineType = (value: unknown, key: string): string => {
      if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === 'object') {
          const typeName = key.endsWith('s')
            ? capitalize(key.slice(0, -1))
            : capitalize(key);
          generateInterface(typeName, value[0]);
          return `${typeName}[]`;
        }
        return `${typeof value[0]}[]`;
      }
      if (typeof value === 'object' && value !== null) {
        const typeName = key.endsWith('s')
          ? capitalize(key.slice(0, -1))
          : capitalize(key);
        generateInterface(typeName, value as Record<string, unknown>);
        return typeName;
      }
      return typeof value;
    };

    const capitalize = (str: string): string => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    for (const [key, value] of Object.entries(obj)) {
      determineType(value, key);
    }

    interfaceCode += `<span style="color: #FA33E9;">export interface</span> <span style="color: cyan;">Data</span> {\n`;
    for (const [key, value] of Object.entries(obj)) {
      const typeName = determineType(value, key);
      interfaceCode += `  <span style="color: white;">${key}</span><span style="color: #FA33E9;">:</span> <span style="color: cyan; font-style: italic">${typeName}</span>;\n`;
    }
    interfaceCode += '}\n\n';

    return interfaceCode;
  };

  return { tsOutput: state.tsOutput, convertJsonToTs, resetOuput: () => dispatch({ type: 'RESET_OUTPUT' }) };
};