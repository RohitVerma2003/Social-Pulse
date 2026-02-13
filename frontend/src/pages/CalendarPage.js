import React, { useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Navbar from '../components/layout/Navbar';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import '@fullcalendar/core/index.js';

const CalendarPage = () => {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Twitter: Product Launch Post',
      start: new Date(Date.now() + 86400000),
      platform: 'twitter',
      backgroundColor: '#1DA1F2',
    },
    {
      id: '2',
      title: 'LinkedIn: Industry Insights',
      start: new Date(Date.now() + 172800000),
      platform: 'linkedin',
      backgroundColor: '#0077B5',
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    platform: '',
    date: '',
    time: '',
  });

  const platformColors = {
    twitter: '#1DA1F2',
    linkedin: '#0077B5',
    instagram: '#E4405F',
  };

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setSelectedEvent(null);
    setFormData({
      title: '',
      content: '',
      platform: '',
      date: info.dateStr,
      time: '12:00',
    });
    setIsDialogOpen(true);
  };

  const handleEventClick = (info) => {
    const event = events.find((e) => e.id === info.event.id);
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      content: event.content || '',
      platform: event.platform,
      date: event.start.toISOString().split('T')[0],
      time: event.start.toTimeString().slice(0, 5),
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dateTime = new Date(`${formData.date}T${formData.time}`);

    if (selectedEvent) {
      // Update existing event
      setEvents((prev) =>
        prev.map((event) =>
          event.id === selectedEvent.id
            ? {
                ...event,
                title: `${formData.platform}: ${formData.title}`,
                start: dateTime,
                platform: formData.platform,
                backgroundColor: platformColors[formData.platform],
                content: formData.content,
              }
            : event
        )
      );
      toast.success('Post updated successfully!');
    } else {
      // Create new event
      const newEvent = {
        id: Date.now().toString(),
        title: `${formData.platform}: ${formData.title}`,
        start: dateTime,
        platform: formData.platform,
        backgroundColor: platformColors[formData.platform],
        content: formData.content,
      };
      setEvents((prev) => [...prev, newEvent]);
      toast.success('Post scheduled successfully!');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (selectedEvent) {
      setEvents((prev) => prev.filter((event) => event.id !== selectedEvent.id));
      toast.success('Post deleted successfully!');
      setIsDialogOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      platform: '',
      date: '',
      time: '',
    });
    setSelectedEvent(null);
    setSelectedDate(null);
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar 
        title="Content Calendar" 
        subtitle="Plan and schedule your social media posts"
      />

      <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Calendar Legend */}
          <div className="mb-6 flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#1DA1F2' }} />
              <span className="text-sm">Twitter</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#0077B5' }} />
              <span className="text-sm">LinkedIn</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#E4405F' }} />
              <span className="text-sm">Instagram</span>
            </div>
          </div>

          {/* FullCalendar */}
          <div 
            data-testid="calendar-container"
            className="glass-card p-6 rounded-3xl"
            style={{
              '--fc-border-color': 'hsl(var(--border))',
              '--fc-button-bg-color': 'hsl(var(--primary))',
              '--fc-button-border-color': 'hsl(var(--primary))',
              '--fc-button-hover-bg-color': 'hsl(var(--primary))',
              '--fc-button-hover-border-color': 'hsl(var(--primary))',
              '--fc-button-active-bg-color': 'hsl(var(--primary))',
              '--fc-today-bg-color': 'hsl(var(--muted))',
            }}
          >
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              events={events}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              height="auto"
            />
          </div>
        </div>
      </div>

      {/* Schedule/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle data-testid="dialog-title">
              {selectedEvent ? 'Edit Scheduled Post' : 'Schedule New Post'}
            </DialogTitle>
            <DialogDescription>
              {selectedEvent ? 'Update your scheduled post details' : 'Create a new scheduled post for your social media'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select
                value={formData.platform}
                onValueChange={(value) => setFormData({ ...formData, platform: value })}
                required
              >
                <SelectTrigger data-testid="platform-select">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Post Title</Label>
              <Input
                id="title"
                data-testid="title-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Brief description"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                data-testid="content-textarea"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your post content..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  data-testid="date-input"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  data-testid="time-input"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              {selectedEvent && (
                <Button
                  data-testid="delete-button"
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  className="rounded-full"
                >
                  Delete
                </Button>
              )}
              <div className="flex gap-2 ml-auto">
                <Button
                  data-testid="cancel-button"
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  data-testid="save-button"
                  type="submit"
                  className="btn-primary"
                >
                  {selectedEvent ? 'Update' : 'Schedule'}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarPage;
