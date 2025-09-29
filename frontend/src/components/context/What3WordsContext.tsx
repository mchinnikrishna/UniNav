import React, { createContext, useState, useContext, ReactNode } from 'react';


// Define the context type
interface What3WordsContextType {
    selectedW3words: string | null;
    selectedLatLng: { lat: number, lng: number } | null;
    setSelectedW3words: (w3w: string) => void;
    setSelectedLatLng: (latLng: { lat: number, lng: number }) => void;
}

// Create the context
const What3WordsContext = createContext<What3WordsContextType | undefined>(undefined);

// Define the provider component
export const What3WordsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedW3words, setSelectedW3words] = useState<string | null>(null);
    const [selectedLatLng, setSelectedLatLng] = useState<{ lat: number, lng: number } | null>(null);

    return (
        <What3WordsContext.Provider
            value={{ selectedW3words, setSelectedW3words, selectedLatLng, setSelectedLatLng }}
        >
            {children}
        </What3WordsContext.Provider>
    );
};

// Custom hook to use the context
export const useWhat3Words = () => {
    const context = useContext(What3WordsContext);
    if (!context) {
        throw new Error('useWhat3Words must be used within a What3WordsProvider');
    }
    return context;
};
