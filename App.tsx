import React, { useState, useEffect, lazy, Suspense } from 'react';
import { LoadingPage } from './components/pages/LoadingPage';
import { Navbar } from './components/navigation/Navbar';
import { DesktopSidebar } from './components/navigation/DesktopSidebar';
import { Page, User, HushNote } from './types';
import { MOCK_USERS, MOCK_HUSH_NOTES, SPLASH_SCREENS } from './constants';

import { ToastProvider, useToast } from './src/context/ToastContext';
import { PageTransition } from './src/components/common/PageTransition';
import { AppStateProvider, useAppState } from './src/context/AppStateContext';
import { parseLocalStorage, setLocalStorage, isHushNoteArray } from './src/utils/storage';

const LaunchSplash = lazy(() => import('./components/pages/LaunchSplash').then(m => ({ default: m.LaunchSplash })));
const InitialSplash = lazy(() => import('./components/pages/InitialSplash').then(m => ({ default: m.InitialSplash })));
const WelcomePage = lazy(() => import('./components/pages/WelcomePage').then(m => ({ default: m.WelcomePage })));
const LoginPage = lazy(() => import('./components/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('./components/pages/SignupPage').then(m => ({ default: m.SignupPage })));
const SplashScreen = lazy(() => import('./components/pages/SplashScreen').then(m => ({ default: m.SplashScreen })));
const FlowPage = lazy(() => import('./components/pages/FlowPage').then(m => ({ default: m.FlowPage })));
const HushPage = lazy(() => import('./components/pages/HushPage').then(m => ({ default: m.HushPage })));
const PersonaPage = lazy(() => import('./components/pages/PersonaPage').then(m => ({ default: m.PersonaPage })));
const SettingsPage = lazy(() => import('./components/pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const SwitchAccountPage = lazy(() => import('./components/pages/SwitchAccountPage').then(m => ({ default: m.SwitchAccountPage })));
const ExplorePage = lazy(() => import('./components/pages/ExplorePage').then(m => ({ default: m.ExplorePage })));
const NotificationsPage = lazy(() => import('./components/pages/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const ConnectionsPage = lazy(() => import('./components/pages/ConnectionsPage').then(m => ({ default: m.ConnectionsPage })));
const EditProfilePage = lazy(() => import('./components/pages/EditProfilePage').then(m => ({ default: m.EditProfilePage })));
const HushCameraPage = lazy(() => import('./components/pages/HushCameraPage').then(m => ({ default: m.HushCameraPage })));
const StoryCreatorPage = lazy(() => import('./components/pages/StoryCreatorPage').then(m => ({ default: m.StoryCreatorPage })));
const StoryViewerPage = lazy(() => import('./components/pages/StoryViewerPage').then(m => ({ default: m.StoryViewerPage })));
const VistaPage = lazy(() => import('./components/pages/VistaPage').then(m => ({ default: m.VistaPage })));

const VizuMainContent: React.FC = () => {
  const { showToast } = useToast();
  const {
    currentPage,
    setCurrentPage,
    user,
    setUser,
    setIsLoading,
    splashIndex,
    setSplashIndex,
    isGlobalGhostMode,
    setIsGlobalGhostMode,
    isDarkMode,
    setIsDarkMode,
    selectedStoryId,
    setSelectedStoryId,
  } = useAppState();

  const [isGhostTransitioning, setIsGhostTransitioning] = useState(false);
  const [hushNotes, setHushNotes] = useState<HushNote[]>(() =>
    parseLocalStorage<HushNote[]>('hush_all_notes', isHushNoteArray, MOCK_HUSH_NOTES)
  );

  const handleAddHushNote = (newNote: HushNote) => {
    setHushNotes(prev => {
      const updated = [newNote, ...prev];
      setLocalStorage('hush_all_notes', updated);
      return updated;
    });
    showToast('Secret whisper note published!', 'success');
  };

  useEffect(() => {
    if (currentPage === 'launch') {
      const timer = setTimeout(() => {
        setCurrentPage('welcome');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  useEffect(() => {
    if (isDarkMode || isGlobalGhostMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode, isGlobalGhostMode]);

  const handleStartOnboarding = () => {
    setCurrentPage('login');
  };

  const handleFinishSplash = () => {
    setUser(MOCK_USERS[0]);
    setCurrentPage('home');
    showToast('Welcome back, ' + MOCK_USERS[0].displayName + '!', 'success');
  };

  const handleNextSplash = () => {
    if (splashIndex < 4) {
      setSplashIndex(prev => prev + 1);
    } else {
      handleFinishSplash();
    }
  };

  const handleLogin = () => {
    setUser(MOCK_USERS[0]);
    setCurrentPage('home');
    showToast('Authenticated as ' + MOCK_USERS[0].username, 'success');
  };

  const handleSignup = () => {
    setCurrentPage('splash');
    showToast('Persona registration started', 'info');
  };

  const handleAccountSwitch = (newUser: User) => {
    setUser(newUser);
    setCurrentPage('persona');
    showToast('Switched to ' + newUser.displayName, 'info');
  };

  const toggleGhostMode = () => {
    setIsGhostTransitioning(true);
    const nextGhostState = !isGlobalGhostMode;
    setIsGlobalGhostMode(nextGhostState);
    showToast(nextGhostState ? 'Ghost Mode Activated (Encrypted Proximity)' : 'Ghost Mode Deactivated', 'warning');
    setTimeout(() => {
      setIsGhostTransitioning(false);
    }, 600);
  };

  const toggleThemeMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'launch':
        return <LaunchSplash />;
      case 'initial':
        return <InitialSplash />;
      case 'welcome':
        return <WelcomePage onGetStarted={handleStartOnboarding} />;
      case 'splash':
        return <SplashScreen index={splashIndex} onNext={handleNextSplash} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onBack={() => setCurrentPage('welcome')} onSignUp={() => setCurrentPage('signup')} />;
      case 'signup':
        return <SignupPage onSignup={handleSignup} onBack={() => setCurrentPage('login')} />;
      case 'loading':
        return <LoadingPage />;
      case 'home':
        return <FlowPage onExplore={() => setCurrentPage('explore')} onNotifications={() => setCurrentPage('notifications')} onAddStory={() => setCurrentPage('story-creator')} onViewStory={(id) => { setSelectedStoryId(id); setCurrentPage('story-viewer'); }} isGhostMode={isGlobalGhostMode} />;
      case 'vista':
        return <VistaPage isGhostMode={isGlobalGhostMode} onNavigate={(p) => setCurrentPage(p as Page)} />;
      case 'explore':
        return <ExplorePage onBack={() => setCurrentPage('home')} isGhostMode={isGlobalGhostMode} />;
      case 'notifications':
        return <NotificationsPage onBack={() => setCurrentPage('home')} isGhostMode={isGlobalGhostMode} />;
      case 'hush':
        return <HushPage isGhostMode={isGlobalGhostMode} onCameraOpen={() => setCurrentPage('hush-camera')} notes={hushNotes} onAddNote={handleAddHushNote} />;
      case 'hush-camera':
        return <HushCameraPage onBack={() => setCurrentPage('hush')} isGhostMode={isGlobalGhostMode} />;
      case 'story-creator':
        return <StoryCreatorPage onBack={() => setCurrentPage('home')} isGhostMode={isGlobalGhostMode} />;
      case 'story-viewer':
        return selectedStoryId ? <StoryViewerPage storyId={selectedStoryId} onClose={() => { setSelectedStoryId(null); setCurrentPage('home'); }} isGhostMode={isGlobalGhostMode} /> : null;
      case 'persona':
        return <PersonaPage user={user} isGhostMode={isGlobalGhostMode} onToggleGhost={toggleGhostMode} isDarkMode={isDarkMode} onToggleTheme={toggleThemeMode} onSettings={() => setCurrentPage('settings')} onConnections={() => setCurrentPage('connections')} onEditProfile={() => setCurrentPage('edit-profile')} userNotes={hushNotes} />;
      case 'edit-profile':
        return user ? <EditProfilePage user={user} onBack={() => setCurrentPage('persona')} onSave={(updatedUser) => { setUser(updatedUser); showToast('Persona profile updated successfully!', 'success'); }} isGhostMode={isGlobalGhostMode} /> : null;
      case 'connections':
        return <ConnectionsPage onBack={() => setCurrentPage('persona')} onViewProfile={(u) => { handleAccountSwitch(u); }} isGhostMode={isGlobalGhostMode} />;
      case 'switch-account':
        return <SwitchAccountPage currentUser={user} onSelect={handleAccountSwitch} onBack={() => setCurrentPage('persona')} />;
      case 'settings':
        return <SettingsPage onBack={() => setCurrentPage('persona')} isGhostMode={isGlobalGhostMode} isDarkMode={isDarkMode} onToggleTheme={toggleThemeMode} onLogout={() => { setUser(null); setCurrentPage('welcome'); setSplashIndex(0); showToast('Logged out of persona session', 'info'); }} />;
      default:
        return <FlowPage onExplore={() => setCurrentPage('explore')} onNotifications={() => setCurrentPage('notifications')} onAddStory={() => setCurrentPage('story-creator')} onViewStory={(id) => { setSelectedStoryId(id); setCurrentPage('story-viewer'); }} isGhostMode={isGlobalGhostMode} />;
    }
  };

  const showNavbar = ['home', 'vista', 'hush', 'persona', 'explore', 'notifications', 'connections', 'edit-profile', 'settings', 'story-creator'].includes(currentPage);
  const isDarkPage = ['launch', 'initial', 'loading'].includes(currentPage);
  
  const getAppBgClass = () => {
    if (isDarkPage) return 'bg-[#062B34]';
    if (isGlobalGhostMode) return 'bg-[#03171C]';
    if (isDarkMode) return 'bg-[#0B1319] text-white';
    return 'bg-[var(--app-bg,#FFF9E6)] text-[var(--text-primary,#0B1720)]';
  };

  return (
    <div className={`relative h-screen w-full flex flex-col md:flex-row overflow-hidden transition-all duration-500 ${getAppBgClass()} ${isGhostTransitioning ? 'animate-ghost-trans-blur' : ''}`}>
      {showNavbar && (
        <DesktopSidebar
          activePage={currentPage}
          onNavigate={(page) => setCurrentPage(page as Page)}
          isGhostActive={isGlobalGhostMode}
          onToggleGhost={toggleGhostMode}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleThemeMode}
        />
      )}

      <div className="flex-1 flex flex-col h-full overflow-hidden w-full max-w-4xl mx-auto md:border-x md:border-black/5 dark:md:border-white/10 relative">
        <main className={`flex-1 flex flex-col overflow-y-auto overflow-x-hidden safe-area-inset ${showNavbar ? 'pb-24 md:pb-6' : ''}`}>
          <Suspense fallback={<LoadingPage />}>
            <PageTransition pageKey={currentPage}>
              {renderPage()}
            </PageTransition>
          </Suspense>
        </main>
      </div>
      
      {showNavbar && (
        <Navbar 
          activePage={currentPage} 
          onNavigate={(page) => setCurrentPage(page as Page)} 
          isGhostActive={isGlobalGhostMode}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppStateProvider>
        <VizuMainContent />
      </AppStateProvider>
    </ToastProvider>
  );
};

export default App;
