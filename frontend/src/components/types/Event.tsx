// Define Address type
export type Address = {
    street: string;
    apartmentNumber?: string; // Optional field
    city: string;
    state: string;
    zip: string;
    country: string;
    phone?: string; // Optional field
};

// Define Event type
export type Event = {
    id: string;
    name: string;
    description: string;
    categoryId: string; // ID or name of the category
    organizerId: string; // ID of the organizer
    what3wordsAddress?: string; // Optional What3Words address
    latitude: number;
    longitude: number;
    address: Address;
    date: string; // ISO date string
    attendees: string[]; // List of user IDs or names
    maybeAttendees: string[]; // List of user IDs or names
    declinedAttendees: string[]; // List of user IDs or names
    duration: string;
    imageUrl?: string; // Optional image URL
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    type: 'Private' | 'Group' | 'Public'; // Event type enumeration
    likes: 0
};
