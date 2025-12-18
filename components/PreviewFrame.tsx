
import React, { useEffect, useRef } from 'react';

interface Props {
  code: string;
}

const PreviewFrame: React.FC<Props> = ({ code }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    // We use a simplified rendering approach. 
    // In a real production app, we would use a library like 'react-frame-component' or Transpilation.
    // For this prototype, we'll inject the code into a standalone HTML structure.
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <script src="https://unpkg.com/lucide-react@latest/dist/umd/lucide-react.js"></script>
          <style>
            body { font-family: 'Inter', sans-serif; }
          </style>
        </head>
        <body class="bg-white">
          <div id="root"></div>
          <script type="text/babel">
            // Setup Lucide icons globally
            const { 
              Rocket, Monitor, Zap, CheckCircle, ArrowRight, Sparkles, Layout, Palette, Send, 
              ChevronLeft, RefreshCw, Eye, Code, ExternalLink, Menu, X, Facebook, Twitter, 
              Instagram, Linkedin, Play, Check, Search, User, ShoppingCart, Star, Clock, Globe
            } = LucideReact;

            // Injected Page Code
            ${code}

            // Standard export naming convention workaround
            const PageComponent = typeof App !== 'undefined' ? App : (typeof DefaultExport !== 'undefined' ? DefaultExport : (typeof Page !== 'undefined' ? Page : null));
            
            // Render
            const container = document.getElementById('root');
            const root = ReactDOM.createRoot(container);
            // If the code defines a function/component, we try to render it.
            // Many AI outputs name the component differently, we'll try to find the default one.
            root.render(<PageComponent />);
          </script>
        </body>
      </html>
    `;

    doc.open();
    doc.write(htmlContent);
    doc.close();
  }, [code]);

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-full border-none"
      title="Preview"
      sandbox="allow-scripts allow-modals allow-popups"
    />
  );
};

export default PreviewFrame;
