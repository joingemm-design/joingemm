// app/dashboard/events/[eventId]/client.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getEvent, getEventRSVPs, type EventData, type RSVP, type Ticket } from "@/lib/events";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Calendar, Clock, MapPin, Ticket as TicketIcon, Users, Settings, BarChart2 } from 'lucide-react';

const ArrowLeft = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

const tabs = [
  { name: 'Overview', icon: BarChart2 },
  { name: 'Guestlist', icon: Users },
  { name: 'Tickets', icon: TicketIcon },
  { name: 'Settings', icon: Settings },
];

export default function EventDetailClientPage() {
  const params = useParams();
  const eventId = params?.eventId as string;
  const { user } = useAuth();
  const router = useRouter();
  const [event, setEvent] = useState<EventData | null>(null);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    if (user && eventId) {
      const loadEventData = async () => {
        try {
          setLoading(true);
          const eventData = await getEvent(eventId);
          if (eventData && eventData.createdBy === user.uid) {
            setEvent(eventData);
            if(activeTab === 'Guestlist'){
                const rsvpData = await getEventRSVPs(eventId);
                setRsvps(rsvpData);
            }
          } else {
            setEvent(null); // Or handle unauthorized access
          }
        } catch (error) {
          console.error("Error fetching event data:", error);
        } finally {
          setLoading(false);
        }
      };
      loadEventData();
    }
  }, [user, eventId, activeTab]);

  const renderContent = () => {
    if (loading) {
      return <p className="text-center py-12">Loading event data...</p>;
    }
    if (!event) {
      return <p className="text-center py-12">Event not found or you do not have permission to view it.</p>;
    }

    switch (activeTab) {
      case 'Overview': return <EventOverview event={event} rsvpCount={rsvps.length} />;
      case 'Guestlist': return <Guestlist rsvps={rsvps} />;
      case 'Tickets': return <TicketsList tickets={event.tickets} />;
      case 'Settings': return <p className="text-center py-12">Event settings management coming soon.</p>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <button className="bg-transparent hover:bg-zinc-800 text-white font-semibold py-2 px-2 rounded-lg inline-flex items-center justify-center mb-4" onClick={() => router.push("/dashboard/events")}>
          <ArrowLeft />
        </button>
        
        {loading ? <LoadingSpinner/> : event ? (
            <>
            <div className="relative h-60 md:h-80 rounded-lg overflow-hidden mb-6">
                <Image src={event.flyerURL || '/placeholder-image.png'} alt={event.title} fill={true} objectFit="cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"/>
                <div className="absolute bottom-0 left-0 p-6">
                    <h1 className="text-4xl font-bold text-white">{event.title}</h1>
                    <div className="flex items-center text-zinc-300 mt-2 gap-x-4">
                        {event.startDate && <div className="flex items-center gap-2"><Calendar size={16}/><span>{new Date(event.startDate).toLocaleDateString()}</span></div>}
                        {event.venueName && <div className="flex items-center gap-2"><MapPin size={16}/><span>{event.venueName}</span></div>}
                    </div>
                </div>
            </div>

            <div className="border-b border-zinc-800 mb-6">
              <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`${
                      activeTab === tab.name
                        ? 'border-purple-500 text-purple-400'
                        : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-500'
                    } group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                  >
                    <tab.icon className="-ml-0.5 mr-2 h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
            
            <div>{renderContent()}</div>
            </>
        ) : (
            <p>Event not found.</p>
        )}
      </div>
    </div>
  );
}

const EventOverview = ({ event, rsvpCount }: { event: EventData, rsvpCount: number }) => (
    <div className="space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 p-6 rounded-lg col-span-2">
                <h3 className="font-bold text-lg mb-2">Description</h3>
                <p className="text-zinc-300 whitespace-pre-wrap">{event.detailedInfo || event.shortDescription}</p>
            </div>
             <div className="bg-zinc-900 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-4">Key Info</h3>
                <ul className="space-y-3 text-sm">
                    {event.startDate && <li className="flex items-center gap-3"><Calendar size={18} className="text-purple-400"/> <div><strong>Starts:</strong> {new Date(event.startDate).toLocaleString()}</div></li>}
                    {event.endDate && <li className="flex items-center gap-3"><Clock size={18} className="text-purple-400"/> <div><strong>Ends:</strong> {new Date(event.endDate).toLocaleString()}</div></li>}
                    {event.venueName && <li className="flex items-center gap-3"><MapPin size={18} className="text-purple-400"/> <div><strong>Venue:</strong> {event.venueName}</div></li>}
                     <li className="flex items-center gap-3"><Users size={18} className="text-purple-400"/> <div><strong>Guests:</strong> {rsvpCount}</div></li>
                </ul>
            </div>
        </div>
    </div>
);

const Guestlist = ({ rsvps }: { rsvps: RSVP[] }) => (
  <div>
    {rsvps.length === 0 ? <p>No guests have registered yet.</p> : (
      <div className="bg-zinc-900 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-zinc-800">
          <thead className="bg-zinc-800/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">Ticket Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">Registered On</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {rsvps.map(rsvp => (
              <tr key={rsvp.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{rsvp.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">{rsvp.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">{rsvp.ticketType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">{rsvp.purchaseDate ? new Date(rsvp.purchaseDate.seconds * 1000).toLocaleDateString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

const TicketsList = ({ tickets }: { tickets: Ticket[] }) => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map(ticket => (
            <div key={ticket.id} className="bg-zinc-900 p-5 rounded-lg border border-zinc-800">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-purple-400">{ticket.type}</h3>
                    <span className="text-xl font-bold">${ticket.price}</span>
                </div>
                <p className="text-sm text-zinc-400 mt-2">{ticket.description}</p>
                {ticket.limit && <p className="text-xs mt-3 text-zinc-500">Limit: {ticket.limit}</p>}
                 <div className={`mt-3 text-xs font-bold py-1 px-2 rounded-full inline-block ${ticket.soldout ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                    {ticket.soldout ? 'Sold Out' : 'On Sale'}
                </div>
            </div>
        ))}
    </div>
);

const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
    </div>
)
