 // IceScheduleApp.jsx
'use client';

import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { halls } from './data/halls';
import './styles/globals.css';

export default function IceScheduleApp() {
  const [events, setEvents] = useState([]);
  const [role, setRole] = useState('public');

  // Load events from localStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem('iceScheduleEvents');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  // Save events to localStorage
  useEffect(() => {
    localStorage.setItem('iceScheduleEvents', JSON.stringify(events));
  }, [events]);

  const handleDateSelect = (selectInfo) => {
    if (role !== 'admin') return;
    const title = prompt('Ange aktivitetstitel');
    if (title) {
      const newEvent = {
        id: String(Date.now()),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        color: '#a3e635'
      };
      if (!hasTimeConflict(newEvent)) {
        setEvents([...events, newEvent]);
      } else {
        alert('Tiden är redan bokad i denna hall.');
      }
    }
  };

  const handleEventDrop = (dropInfo) => {
    if (role !== 'admin') return;
    const updatedEvent = {
      id: dropInfo.event.id,
      title: dropInfo.event.title,
      start: dropInfo.event.startStr,
      end: dropInfo.event.endStr,
      color: dropInfo.event.backgroundColor
    };
    if (!hasTimeConflict(updatedEvent, dropInfo.event.id)) {
      const updatedEvents = events.map((event) =>
        event.id === dropInfo.event.id ? updatedEvent : event
      );
      setEvents(updatedEvents);
    } else {
      alert('Tiden krockar med en annan bokning.');
      dropInfo.revert();
    }
  };

  const hasTimeConflict = (newEvent, ignoreId = null) => {
    const newStart = new Date(newEvent.start).getTime();
    const newEnd = new Date(newEvent.end).getTime();
    return events.some(event => {
      if (event.id === ignoreId) return false;
      const existingStart = new Date(event.start).getTime();
      const existingEnd = new Date(event.end).getTime();
      return (
        (newStart < existingEnd && newEnd > existingStart)
      );
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Istidsschema HV71</h1>

      <div className="mb-4">
        <label className="mr-2 font-medium">Visa som:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="public">Publik</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridDay"
        selectable={role === 'admin'}
        editable={role === 'admin'}
        events={events}
        select={handleDateSelect}
        eventDrop={handleEventDrop}
        eventResizableFromStart={role === 'admin'}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        slotMinTime="06:00:00"
        slotMaxTime="23:50:00"
        allDaySlot={false}
        height="auto"
      />
    </div>
  );
}
