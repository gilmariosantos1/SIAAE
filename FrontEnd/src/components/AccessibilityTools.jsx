import { useEffect, useRef, useState } from 'react';
import { IonIcon, IonSpinner } from '@ionic/react';
import { accessibilityOutline } from 'ionicons/icons';
import '../theme/Accessibility.css';

const AccessibilityTools = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimer = useRef();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      window.clearTimeout(scrollTimer.current);
      scrollTimer.current = window.setTimeout(() => setIsScrolling(false), 600);
    };

    const scrollTargets = [window, document];
    document.querySelectorAll('ion-content').forEach((content) => {
      scrollTargets.push(content);
      const innerScroll = content.shadowRoot?.querySelector('.inner-scroll');
      if (innerScroll) scrollTargets.push(innerScroll);
    });

    scrollTargets.forEach((target) => target.addEventListener('scroll', handleScroll, { passive: true }));
    return () => {
      scrollTargets.forEach((target) => target.removeEventListener('scroll', handleScroll));
      window.clearTimeout(scrollTimer.current);
    };
  }, []);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const initializeVlibras = () => {
      if (window.VLibras && !document.querySelector('.vw-plugin-wrapper iframe')) {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
      }
    };
    const existingScript = document.querySelector('script#vlibras-plugin');
    if (existingScript) {
      initializeVlibras();
      return undefined;
    }
    const script = document.createElement('script');
    script.id = 'vlibras-plugin';
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.async = true;
    script.onload = initializeVlibras;
    document.body.appendChild(script);
    return undefined;
  }, []);

  const setLargeText = () => document.body.classList.add('accessibility-large-text');
  const setHighContrast = () => document.body.classList.toggle('accessibility-high-contrast');
  const resetAccessibility = () => {
    document.body.classList.remove('accessibility-large-text', 'accessibility-high-contrast');
  };

  return (
    <div className="accessibility-tools" aria-label="Ferramentas de acessibilidade">
      <button
        className="accessibility-button"
        type="button"
        aria-label="Abrir opções de acessibilidade"
        aria-expanded={isOpen}
        title="Acessibilidade"
        onClick={() => setIsOpen(!isOpen)}
      >
        <IonIcon icon={accessibilityOutline} />
      </button>
      {isScrolling && (
        <div className="scroll-spinner" role="status" aria-label="Carregando durante a rolagem">
          <IonSpinner name="crescent" />
        </div>
      )}
      <div vw="" className="enabled">
        <div vw-access-button="" className="active"></div>
        <div vw-plugin-wrapper="">
          <div vw-plugin-top=""></div>
        </div>
      </div>
      {isOpen && (
        <div className="accessibility-panel" role="dialog" aria-label="Opções de acessibilidade">
          <strong>Acessibilidade</strong>
          <button type="button" onClick={setLargeText}>Aumentar texto</button>
          <button type="button" onClick={setHighContrast}>Alto contraste</button>
          <button type="button" onClick={resetAccessibility}>Restaurar padrão</button>
        </div>
      )}
    </div>
  );
};

export default AccessibilityTools;
