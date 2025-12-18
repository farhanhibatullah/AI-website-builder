
import React, { useState, useEffect } from 'react';
import { WebsiteBlueprint, AppState } from './types';
import LandingPage from './components/LandingPage';
import SetupForm from './components/SetupForm';
import GeneratingState from './components/GeneratingState';
import Editor from './components/Editor';
import { generateBlueprint, generatePageCode } from './geminiService';

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppState>('LANDING');
  const [blueprint, setBlueprint] = useState<WebsiteBlueprint | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [currentGenerationStep, setCurrentGenerationStep] = useState(0);

  const handleStartSetup = () => setScreen('SETUP');

  const handleGenerate = async (formData: any) => {
    setScreen('GENERATING');
    setCurrentGenerationStep(1); // Analyzing

    try {
      const newBlueprint = await generateBlueprint({
        goal: formData.goal,
        audience: formData.audience,
        type: formData.type,
        pagesRequested: formData.pages,
        colors: formData.colors,
        tone: formData.tone,
      });

      setBlueprint(newBlueprint);
      setCurrentGenerationStep(2); // Building Structure

      // Start generating the home page first for immediate preview
      const homeSlug = newBlueprint.pages[0].slug;
      const homeCode = await generatePageCode(newBlueprint, homeSlug);
      
      const updatedBlueprint = { ...newBlueprint };
      updatedBlueprint.pages[0].code = homeCode;
      
      setBlueprint(updatedBlueprint);
      setCurrentGenerationStep(3); // Generating Pages

      // Generate the rest in background or finalize
      setScreen('EDITOR');
    } catch (error) {
      console.error("Generation failed", error);
      setScreen('SETUP');
      alert("Something went wrong during generation. Please try again.");
    }
  };

  return (
    <div className="min-h-screen">
      {screen === 'LANDING' && <LandingPage onStart={handleStartSetup} />}
      {screen === 'SETUP' && <SetupForm onSubmit={handleGenerate} />}
      {screen === 'GENERATING' && <GeneratingState step={currentGenerationStep} />}
      {screen === 'EDITOR' && blueprint && (
        <Editor 
          blueprint={blueprint} 
          setBlueprint={setBlueprint} 
          onDeploy={() => setIsDeploying(true)}
        />
      )}
    </div>
  );
};

export default App;
