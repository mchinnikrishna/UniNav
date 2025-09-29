import React, { createContext, useState, useEffect } from 'react';

interface SavedPost {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    organizerId: string;
}

interface SavedPostsContextProps {
    savedPosts: SavedPost[];
    toggleSavedPost: (post: SavedPost) => void;
}

export const SavedPostsContext = createContext<SavedPostsContextProps>({
    savedPosts: [],
    toggleSavedPost: () => {}
});

export const SavedPostsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);

    // Load saved posts from localStorage on mount
    useEffect(() => {
        const savedPostsData = localStorage.getItem('savedPosts');
        if (savedPostsData) {
            setSavedPosts(JSON.parse(savedPostsData));
        }
    }, []);

    const toggleSavedPost = (post: SavedPost) => {
        setSavedPosts(prevSavedPosts => {
            const newSavedPosts = prevSavedPosts.some(saved => saved.id === post.id)
                ? prevSavedPosts.filter(saved => saved.id !== post.id)
                : [...prevSavedPosts, post];

            // Save to localStorage
            localStorage.setItem('savedPosts', JSON.stringify(newSavedPosts));
            return newSavedPosts;
        });
    };

    return (
        <SavedPostsContext.Provider value={{ savedPosts, toggleSavedPost }}>
            {children}
        </SavedPostsContext.Provider>
    );
};
