import React, { useContext, useState } from 'react';
import { EventContext } from "../context/EventContext";
import { Marker, InfoWindow } from "@react-google-maps/api";
import EventCard from "./EventCard";
import { Event } from "../types/Event";

const EventMarkers: React.FC = () => {
    const events = useContext(EventContext);
    const [currentEvent, setCurrentEvent] = useState<Event | undefined>(undefined);
    const [showEventCard, setShowEventCard] = useState<boolean>(false);
    const [eventPosition, setEventPosition] = useState<{ lat: number, lng: number } | null>(null);

    function handleMouseOver(event: Event) {
        setCurrentEvent(event);
        setEventPosition({ lat: event.latitude, lng: event.longitude });
        setShowEventCard(true);
    }

    function handleOnMouseOut() {
        setShowEventCard(false);
        setCurrentEvent(undefined);
        setEventPosition(null);
    }

    function handleOnDelete() {

    }

    return (
        <div>
            <div>
                {events.map(event => (
                    <Marker
                        key={event.id}
                        position={{ lat: event.latitude, lng: event.longitude }}
                        onMouseOver={() => handleMouseOver(event)}
                        onMouseOut={handleOnMouseOut}
                    />
                ))}
            </div>
            {showEventCard && currentEvent && eventPosition && (
                <InfoWindow
                    position={eventPosition}
                    onCloseClick={handleOnMouseOut}
                    options={{ pixelOffset: new window.google.maps.Size(0, -40) }}
                >
                    <EventCard
                        id={currentEvent.id}
                        name={currentEvent.name}
                        imageUrl={currentEvent.imageUrl || ""}
                        description={currentEvent.description || ""}
                        organizerId={currentEvent.organizerId}
                        onDelete={handleOnDelete}
                    />
                </InfoWindow>
            )}
        </div>
    );
};

export default EventMarkers;
