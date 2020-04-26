import { useState, useEffect, KeyboardEvent, KeyboardEventHandler } from "react";


export function useKeyPress(targetKey: string) {
    // State for keeping track of whether key is pressed
    const [keyPressed, setKeyPressed] = useState(false);

    // If pressed key is our target key then set to true
    function downHandler({ key }: KeyboardEvent) {
        if (key === targetKey) {
            setKeyPressed(true);
        }
    }

    // If released key is our target key then set to false
    function upHandler({ key }: KeyboardEvent) {
        if (key === targetKey) {
            setKeyPressed(false);
        }
    };

    // Add event listeners
    useEffect(() => {
        window.addEventListener('keydown', downHandler as any);
        window.addEventListener('keyup', upHandler as any);
        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener('keydown', downHandler as any);
            window.removeEventListener('keyup', upHandler as any);
        };
    }); // Empty array ensures that effect is only run on mount and unmount

    return keyPressed;
}

export function useKeyDown(downHandler: KeyboardEventHandler) {

    // Add event listeners
    useEffect(() => {
        window.addEventListener('keydown', downHandler as any);
        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener('keydown', downHandler as any);
        };
    }); // Empty array ensures that effect is only run on mount and unmount
}