import {createContext, ReactNode, useEffect, useState} from "react";
import axios from "axios";
import {Event} from "../types/Event";


interface EventContextProps {
    children: ReactNode;
}

const EventContext = createContext<Event[]>([]);

function EventContextProvider({ children }: EventContextProps) {
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        axios.get<Event[]>('/event/get-all-events')
            .then((result) => {
                setEvents(result.data);
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    return (
        <EventContext.Provider value={events}>
            {children}
        </EventContext.Provider>
    );
}

export { EventContext, EventContextProvider };
