import React, { useState, useEffect } from 'react';
import { SportEvent, ParticipantRegistration } from './types';
import { storageService } from './services/storage';

// Public Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/landing/HeroSection';
import { AboutSection } from './components/landing/AboutSection';
import { UpcomingEventsSection } from './components/landing/UpcomingEventsSection';
import { SportsCategoriesSection } from './components/landing/SportsCategoriesSection';
import { GalleryHighlightsSection } from './components/landing/GalleryHighlightsSection';
import { StatsSection } from './components/landing/StatsSection';
import { SponsorsSection } from './components/landing/SponsorsSection';

// Event & Registration Components
import { EventDetailPage } from './components/events/EventDetailPage';
import { MultiStepRegistration } from './components/registration/MultiStepRegistration';
import { ETicketView } from './components/ticket/ETicketView';
import { TicketLookupModal } from './components/ticket/TicketLookupModal';
import { DigitalIDCardModal } from './components/idcard/DigitalIDCardModal';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout, AdminTab } from './components/admin/AdminLayout';
import { DashboardOverview } from './components/admin/DashboardOverview';
import { EventManagement } from './components/admin/EventManagement';
import { ParticipantManagement } from './components/admin/ParticipantManagement';
import { PaymentVerification } from './components/admin/PaymentVerification';
import { EventCheckIn } from './components/admin/EventCheckIn';
import { IDCardManagement } from './components/admin/idcard/IDCardManagement';
import { ContentManagement } from './components/admin/ContentManagement';
import { AdminSettings } from './components/admin/AdminSettings';
import { ParticipantIDCardRecord } from './types';

type ViewMode = 'landing' | 'event-detail' | 'registration' | 'admin-login' | 'admin-dashboard';

export default function App() {
  // Global Data State
  const [events, setEvents] = useState<SportEvent[]>(() => storageService.getEvents());
  const [registrations, setRegistrations] = useState<ParticipantRegistration[]>(() =>
    storageService.getRegistrations()
  );
  const [settings, setSettings] = useState(() => storageService.getSettings());
  const [sponsors, setSponsors] = useState(() => storageService.getSponsors());
  const [gallery, setGallery] = useState(() => storageService.getGallery());

  // View & Navigation State
  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [selectedEvent, setSelectedEvent] = useState<SportEvent | null>(null);
  const [selectedCategoryForReg, setSelectedCategoryForReg] = useState<string | undefined>(undefined);
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');

  // Modals
  const [isLookupModalOpen, setIsLookupModalOpen] = useState(false);
  const [activeETicket, setActiveETicket] = useState<ParticipantRegistration | null>(null);
  const [activeIDCardRecord, setActiveIDCardRecord] = useState<ParticipantIDCardRecord | null>(null);

  // Sync state when storageService changes
  const reloadData = () => {
    setEvents(storageService.getEvents());
    setRegistrations(storageService.getRegistrations());
    setSettings(storageService.getSettings());
    setSponsors(storageService.getSponsors());
    setGallery(storageService.getGallery());
  };

  useEffect(() => {
    const handleDataChanged = () => reloadData();
    window.addEventListener('kinetix_data_changed', handleDataChanged);
    return () => window.removeEventListener('kinetix_data_changed', handleDataChanged);
  }, []);

  // Handle URL hash on initial load
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'admin') {
      if (storageService.isAdminLoggedIn()) {
        setViewMode('admin-dashboard');
      } else {
        setViewMode('admin-login');
      }
    } else if (hash.startsWith('events/')) {
      const slug = hash.replace('events/', '');
      const ev = storageService.getEventBySlug(slug);
      if (ev) {
        setSelectedEvent(ev);
        setViewMode('event-detail');
      }
    }
  }, []);

  // Navigation handlers
  const handleScrollToSection = (sectionId: string) => {
    if (viewMode !== 'landing') {
      setViewMode('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleSelectEvent = (event: SportEvent) => {
    setSelectedEvent(event);
    setViewMode('event-detail');
    window.location.hash = `events/${event.slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartRegistration = (event: SportEvent, categoryId?: string) => {
    setSelectedEvent(event);
    setSelectedCategoryForReg(categoryId);
    setViewMode('registration');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminClick = () => {
    if (storageService.isAdminLoggedIn()) {
      setViewMode('admin-dashboard');
      window.location.hash = 'admin';
    } else {
      setViewMode('admin-login');
      window.location.hash = 'admin';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogout = () => {
    storageService.adminLogout();
    setViewMode('landing');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F5F7F4] text-[#101713] flex flex-col justify-between selection:bg-[#9BE34A] selection:text-[#101713]">
      
      {/* 1. ADMIN DASHBOARD VIEW */}
      {viewMode === 'admin-dashboard' && (
        <AdminLayout
          currentTab={adminTab}
          onTabChange={setAdminTab}
          onLogout={handleAdminLogout}
          onViewWebsite={() => {
            setViewMode('landing');
            window.location.hash = '';
          }}
        >
          {adminTab === 'overview' && (
            <DashboardOverview
              events={events}
              registrations={registrations}
              onNavigateTab={tab => setAdminTab(tab)}
              onVerifyPayment={reg => {
                setAdminTab('verification');
              }}
            />
          )}

          {adminTab === 'events' && (
            <EventManagement events={events} onRefresh={reloadData} />
          )}

          {adminTab === 'participants' && (
            <ParticipantManagement
              registrations={registrations}
              events={events}
              onViewETicket={reg => setActiveETicket(reg)}
              onViewIDCard={reg => {
                let card = storageService.getParticipantIDCardByRegNumber(reg.registrationNumber);
                if (!card && reg.status === 'approved') {
                  const issued = storageService.generateParticipantIDCard(reg.id, 'Admin');
                  if (issued) card = issued;
                  reloadData();
                }
                if (card) {
                  setActiveIDCardRecord(card);
                }
              }}
              onOpenVerification={reg => {
                setAdminTab('verification');
              }}
            />
          )}

          {adminTab === 'verification' && (
            <PaymentVerification
              registrations={registrations}
              onRefresh={reloadData}
              onViewETicket={reg => setActiveETicket(reg)}
            />
          )}

          {adminTab === 'checkin' && (
            <EventCheckIn
              events={events}
              registrations={registrations}
              onRefresh={reloadData}
            />
          )}

          {adminTab === 'idcard' && (
            <IDCardManagement
              events={events}
              registrations={registrations}
              onRefresh={reloadData}
              onPreviewCard={card => setActiveIDCardRecord(card)}
            />
          )}

          {adminTab === 'content' && (
            <ContentManagement
              settings={settings}
              sponsors={sponsors}
              gallery={gallery}
              onRefresh={reloadData}
            />
          )}

          {adminTab === 'settings' && (
            <AdminSettings settings={settings} onRefresh={reloadData} />
          )}
        </AdminLayout>
      )}

      {/* 2. ADMIN LOGIN VIEW */}
      {viewMode === 'admin-login' && (
        <AdminLogin
          onLoginSuccess={() => setViewMode('admin-dashboard')}
          onBackToHome={() => {
            setViewMode('landing');
            window.location.hash = '';
          }}
        />
      )}

      {/* 3. MULTI-STEP REGISTRATION VIEW */}
      {viewMode === 'registration' && selectedEvent && (
        <>
          <Navbar
            onNavigate={handleScrollToSection}
            onOpenLookup={() => setIsLookupModalOpen(true)}
            onOpenAdmin={handleAdminClick}
            currentView="registration"
          />
          <MultiStepRegistration
            event={selectedEvent}
            initialCategoryId={selectedCategoryForReg}
            onBack={() => {
              setViewMode('event-detail');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenLookup={() => setIsLookupModalOpen(true)}
            onViewETicket={reg => setActiveETicket(reg)}
          />
          <Footer
            settings={settings}
            onNavigate={handleScrollToSection}
            onOpenLookup={() => setIsLookupModalOpen(true)}
            onOpenAdmin={handleAdminClick}
          />
        </>
      )}

      {/* 4. EVENT DETAIL VIEW */}
      {viewMode === 'event-detail' && selectedEvent && (
        <>
          <Navbar
            onNavigate={handleScrollToSection}
            onOpenLookup={() => setIsLookupModalOpen(true)}
            onOpenAdmin={handleAdminClick}
            currentView="event-detail"
          />
          <EventDetailPage
            event={selectedEvent}
            onRegister={catId => handleStartRegistration(selectedEvent, catId)}
            onBack={() => {
              setViewMode('landing');
              window.location.hash = '';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenLookup={() => setIsLookupModalOpen(true)}
          />
          <Footer
            settings={settings}
            onNavigate={handleScrollToSection}
            onOpenLookup={() => setIsLookupModalOpen(true)}
            onOpenAdmin={handleAdminClick}
          />
        </>
      )}

      {/* 5. PUBLIC LANDING PAGE VIEW */}
      {viewMode === 'landing' && (
        <div className="flex flex-col min-h-screen justify-between">
          <div>
            <Navbar
              onNavigate={handleScrollToSection}
              onOpenLookup={() => setIsLookupModalOpen(true)}
              onOpenAdmin={handleAdminClick}
              currentView="landing"
            />

            <main>
              {/* Hero Section */}
              <div id="home">
                <HeroSection
                  onExploreEvents={() => handleScrollToSection('events')}
                  onDiscoverAbout={() => handleScrollToSection('about')}
                />
              </div>

              {/* Statistics Strip */}
              <StatsSection events={events} registrations={registrations} />

              {/* Upcoming Events Main Showcase */}
              <UpcomingEventsSection
                events={events}
                onSelectEvent={handleSelectEvent}
                onRegisterEvent={event => handleStartRegistration(event)}
              />

              {/* Sports Disciplines */}
              <SportsCategoriesSection
                onSelectCategory={catKey => {
                  handleScrollToSection('events');
                }}
              />

              {/* About Organization Editorial */}
              <AboutSection
                settings={settings}
                onExploreEvents={() => handleScrollToSection('events')}
              />

              {/* Gallery Highlights Documentation */}
              <GalleryHighlightsSection gallery={gallery} />

              {/* Sponsors & Partners */}
              <SponsorsSection sponsors={sponsors} />
            </main>
          </div>

          <Footer
            settings={settings}
            onNavigate={handleScrollToSection}
            onOpenLookup={() => setIsLookupModalOpen(true)}
            onOpenAdmin={handleAdminClick}
          />
        </div>
      )}

      {/* GLOBAL MODALS */}

      {/* Ticket Lookup Modal */}
      <TicketLookupModal
        isOpen={isLookupModalOpen}
        onClose={() => setIsLookupModalOpen(false)}
        onViewTicket={reg => {
          setActiveETicket(reg);
        }}
        onViewIDCard={card => {
          setActiveIDCardRecord(card);
        }}
        onPayNow={reg => {
          const ev = events.find(e => e.id === reg.eventId);
          if (ev) {
            handleStartRegistration(ev, reg.categoryId);
          }
        }}
      />

      {/* Official E-Ticket Full View Modal */}
      {activeETicket && (
        <ETicketView
          registration={activeETicket}
          event={events.find(e => e.id === activeETicket.eventId)}
          onClose={() => setActiveETicket(null)}
        />
      )}

      {/* Official Digital Participant ID Card Modal */}
      {activeIDCardRecord && (
        <DigitalIDCardModal
          cardRecord={activeIDCardRecord}
          onClose={() => setActiveIDCardRecord(null)}
        />
      )}

    </div>
  );
}
