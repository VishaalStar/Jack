import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  Users, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  MapPin,
  CalendarCheck
} from 'lucide-react';
import { CalendarEvent, CRMContact } from '../types';

interface CalendarViewProps {
  events: CalendarEvent[];
  crmContacts: CRMContact[];
  onScheduleEvent: (newEvent: Omit<CalendarEvent, 'id'>) => void;
  onRequestPrepForEvent: (event: CalendarEvent) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  crmContacts,
  onScheduleEvent,
  onRequestPrepForEvent,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventStart, setEventStart] = useState('2:30 PM');
  const [eventEnd, setEventEnd] = useState('3:15 PM');
  const [eventAttendees, setEventAttendees] = useState('team@enterprise.com');
  const [eventPlatform, setEventPlatform] = useState<'Google Meet' | 'Zoom' | 'In-Person'>('Google Meet');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle) return;

    onScheduleEvent({
      title: eventTitle,
      startTime: eventStart,
      endTime: eventEnd,
      attendees: eventAttendees.split(',').map(a => a.trim()),
      platform: eventPlatform,
      status: 'confirmed',
      priority: 'high',
      prepBriefing: `Jack generated executive talking points and CRM cross-reference for ${eventTitle}.`,
    });

    setEventTitle('');
    setShowAddModal(false);
  };

  return (
    <div id="calendar-scheduling-module" className="space-y-4">
      {/* Calendar Header */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <CalendarCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-semibold text-slate-100">
              Executive Calendar & Smart Scheduling
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Bi-directional calendar sync with automated meeting prep, CRM cross-referencing, and smart conflict buffers.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800/80 text-xs text-slate-300 border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Google Calendar & Meet Connected</span>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Event</span>
          </button>
        </div>
      </div>

      {/* Events Timeline */}
      <div className="space-y-3">
        {events.map((event) => {
          const matchedContact = crmContacts.find(c => c.id === event.crmContactId);

          return (
            <div
              key={event.id}
              id={`calendar-event-${event.id}`}
              className="p-5 rounded-xl bg-slate-900/80 border border-slate-800/90 hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700/80 text-cyan-400 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-semibold text-cyan-300">
                        {event.startTime} - {event.endTime}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-300 flex items-center gap-1">
                        <Video className="w-3.5 h-3.5 text-slate-400" />
                        {event.platform}
                      </span>
                      {event.status === 'confirmed' ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                          Confirmed
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          Tentative
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-slate-100 mt-1">
                      {event.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <button
                    type="button"
                    onClick={() => onRequestPrepForEvent(event)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700 text-xs font-medium flex items-center space-x-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Jack Briefing</span>
                  </button>
                </div>
              </div>

              {/* Attendees & CRM Context */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-1">
                <span className="text-slate-500 flex items-center gap-1">
                  <Users className="w-3 h-3" /> Attendees:
                </span>
                {event.attendees.map((att, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700 font-mono text-[11px]">
                    {att}
                  </span>
                ))}
                {matchedContact && (
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30 font-medium text-[11px]">
                    CRM Link: {matchedContact.company} (${matchedContact.dealValue.toLocaleString()})
                  </span>
                )}
              </div>

              {/* Jack AI Meeting Prep Briefing */}
              {event.prepBriefing && (
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 flex items-start space-x-2.5">
                  <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-cyan-300 uppercase tracking-wider">
                      Jack Executive Meeting Prep:
                    </span>
                    <p className="leading-relaxed text-slate-300">
                      {event.prepBriefing}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Schedule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-cyan-400" />
              Schedule New Calendar Session
            </h3>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium">Session Title</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Q4 Growth Review & Marketing Sync"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 font-medium">Start Time</label>
                  <input
                    type="text"
                    required
                    value={eventStart}
                    onChange={(e) => setEventStart(e.target.value)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-medium">End Time</label>
                  <input
                    type="text"
                    required
                    value={eventEnd}
                    onChange={(e) => setEventEnd(e.target.value)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 font-medium">Attendees (comma-separated)</label>
                <input
                  type="text"
                  value={eventAttendees}
                  onChange={(e) => setEventAttendees(e.target.value)}
                  placeholder="sarah.chen@techcorp.io, alex@enterprise.com"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium">Platform</label>
                <select
                  value={eventPlatform}
                  onChange={(e) => setEventPlatform(e.target.value as any)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                >
                  <option value="Google Meet">Google Meet</option>
                  <option value="Zoom">Zoom</option>
                  <option value="In-Person">In-Person Executive Boardroom</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
                >
                  Confirm Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
