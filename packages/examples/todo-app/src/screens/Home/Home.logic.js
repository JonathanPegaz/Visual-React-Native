import { useState } from 'react';

export function useHomeLogic() {
  const [buttonPressed, setButtonPressed] = useState(false);
  
  const welcomeMessage = 'This is your first Visual RN app! Edit the view visually in VS Code or modify this logic file.';
  
  const handlePress = () => {
    setButtonPressed(true);
    console.log('Welcome button pressed!');
    
    // Reset after 2 seconds
    setTimeout(() => {
      setButtonPressed(false);
    }, 2000);
  };
  
  return {
    state: {
      welcomeMessage,
      buttonPressed,
    },
    actions: {
      handlePress,
    },
  };
}