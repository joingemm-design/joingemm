
import { STATIC_EVENTS, EventData } from "@/lib/events";
import Link from "next/link";

export default function EventsPage() {
  const events = STATIC_EVENTS;

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-4xl md:text-6xl font-black text-center mb-8 md:mb-12 text-white">
          Upcoming Events
        </h1>
        <div className="grid gap-8">
          {events.map((event: EventData) => (
            <div
              key={event.id}
              className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/50 transition-shadow duration-300"
            >
              <div className="md:flex">
                <div className="md:w-1/3">
                  {event.imageUrl && (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="object-cover h-48 w-full md:h-full"
                    />
                  )}
                </div>
                <div className="p-6 md:p-8 md:w-2/3">
                  <div className="flex justify-between items-start">
                      <div>
                          <p className="text-sm text-cyan-400 font-bold">{event.category || 'General'}</p>
                          <h2 className="text-2xl font-bold text-white mt-1">{event.title}</h2>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <p className="text-lg font-bold bg-cyan-500 text-black px-3 py-1 rounded-md">
                          {new Date(event.date || "").toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                  </div>
                  <p className="text-gray-400 mt-2">{event.location} - {event.address}</p>
                  <p className="text-gray-300 mt-4">{event.description}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {event.tags?.map(tag => (
                      <span key={tag} className="bg-gray-700 text-gray-300 px-2 py-1 text-xs font-semibold rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                   <div className="mt-6 flex items-center gap-4">
                    {event.sourceUrl && (
                        <Link href={event.sourceUrl} target="_blank" className="text-cyan-400 hover:text-cyan-300 font-semibold">
                          View Source
                        </Link>
                    )}
                     {event.venueWebsite && (
                        <Link href={event.venueWebsite} target="_blank" className="text-cyan-400 hover:text-cyan-300 font-semibold">
                          Venue Website
                        </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
