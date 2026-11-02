import React, { useState } from 'react';
import { SportEvent, ParticipantRegistration, ParticipantIDCardRecord } from '../../../types';
import { TemplateManagement } from './TemplateManagement';
import { EventIDCardSettings } from './EventIDCardSettings';
import { ParticipantIDCardsList } from './ParticipantIDCardsList';
import { LayoutTemplate, Sliders, Users, CreditCard } from 'lucide-react';

export type IDCardSubmenu = 'templates' | 'event-settings' | 'participant-cards';

interface IDCardManagementProps {
  events: SportEvent[];
  registrations: ParticipantRegistration[];
  onRefresh: () => void;
  onPreviewCard: (card: ParticipantIDCardRecord) => void;
}

export const IDCardManagement: React.FC<IDCardManagementProps> = ({
  events,
  registrations,
  onRefresh,
  onPreviewCard
}) => {
  const [activeSubmenu, setActiveSubmenu] = useState<IDCardSubmenu>('participant-cards');

  const submenus = [
    { id: 'participant-cards', label: 'Participant ID Cards', icon: Users },
    { id: 'templates', label: 'ID Card Templates', icon: LayoutTemplate },
    { id: 'event-settings', label: 'Event ID Card Settings', icon: Sliders }
  ];

  return (
    <div className="space-y-6">
      {/* Top Submenu Switcher */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/70 rounded-2xl self-start w-fit">
        {submenus.map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubmenu === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubmenu(tab.id as IDCardSubmenu)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-[#101713] text-[#9BE34A] shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content depending on selected submenu */}
      {activeSubmenu === 'participant-cards' && (
        <ParticipantIDCardsList
          events={events}
          registrations={registrations}
          onRefresh={onRefresh}
          onPreviewCard={onPreviewCard}
        />
      )}

      {activeSubmenu === 'templates' && (
        <TemplateManagement onRefresh={onRefresh} />
      )}

      {activeSubmenu === 'event-settings' && (
        <EventIDCardSettings
          events={events}
          onRefresh={onRefresh}
        />
      )}
    </div>
  );
};
