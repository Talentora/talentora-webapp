import React, { createContext, ReactNode, useState } from 'react';

/**
 * Represents the shape of the character context.
 */
interface CharacterContextType {
  /** The current character value. */
  character: number;
  /** Function to update the character value. */
  setCharacter: (value: number) => void;
}

/**
 * Context for managing the current character state.
 */
export const CharacterContext = createContext<CharacterContextType>({
  character: 0,
  setCharacter: () => {
    throw new Error('setCharacter function must be overridden');
  }
});
CharacterContext.displayName = 'CharacterContext';

/**
 * Props for the CharacterProvider component.
 */
type CharacterProviderProps = {
  /** Child components to be wrapped by the provider. */
  children: ReactNode;
};

/**
 * Provider component for the CharacterContext.
 * Manages the character state and provides it to child components.
 *
 * @param {CharacterProviderProps} props - The component props.
 * @returns {JSX.Element} The provider component.
 */
export const CharacterProvider: React.FC<
  React.PropsWithChildren<CharacterProviderProps>
> = ({ children }) => {
  const [character, setCharacter] = useState<number>(0);

  return (
    <CharacterContext.Provider value={{ character, setCharacter }}>
      {children}
    </CharacterContext.Provider>
  );
};
