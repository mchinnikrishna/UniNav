// GoogleCalendarButton.tsx
import React from 'react';
import { Button } from 'react-bootstrap';
import { FaCalendarPlus } from 'react-icons/fa';

interface CalendarButtonProps {
    eventName: string;
    eventDescription: string;
    eventDate: string;
    eventDuration: string;
    eventLocation: string;
}

const GoogleCalendarButton: React.FC<CalendarButtonProps> = ({
                                                                 eventName,
                                                                 eventDescription,
                                                                 eventDate,
                                                                 eventDuration,
                                                                 eventLocation
                                                             }) => {
    const formatDateForCalendar = (date: string, duration: string): { start: string; end: string } => {
        const startDate = new Date(date);
        const endDate = new Date(startDate.getTime());

        const durationMatch = duration.match(/(\d+)\s+(hour|minute)s?/);
        if (durationMatch) {
            const value = parseInt(durationMatch[1]);
            const unit = durationMatch[2];

            if (unit === 'hour') {
                endDate.setHours(endDate.getHours() + value);
            } else if (unit === 'minute') {
                endDate.setMinutes(endDate.getMinutes() + value);
            }
        }

        return {
            start: startDate.toISOString().replace(/-|:|\.\d\d\d/g, ''),
            end: endDate.toISOString().replace(/-|:|\.\d\d\d/g, '')
        };
    };

    const handleAddToCalendar = () => {
        const { start, end } = formatDateForCalendar(eventDate, eventDuration);

        const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventName)}&dates=${start}/${end}&details=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent(eventLocation)}`;

        window.open(googleCalendarUrl, '_blank');
    };

    return (
        <Button
            variant="primary"
            className="d-flex align-items-center gap-2 mt-3"
            onClick={handleAddToCalendar}
        >
            <FaCalendarPlus />
            Add to Calendar
        </Button>
    );
};

export default GoogleCalendarButton;