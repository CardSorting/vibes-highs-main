import { useEffect } from 'react';
import SEO from '@/components/SEO';
import { useVibes } from '@/hooks/use-vibes';
import { Hero } from '@/components/sections/Hero';
import { Ecosystem } from '@/components/sections/Ecosystem';
import { SystemPulse } from '@/components/SystemPulse';
import { Philosophy } from '@/components/sections/Philosophy';
import { Agenda } from '@/components/sections/Agenda';
import { Schedule } from '@/components/sections/Schedule';
import { Connect } from '@/components/sections/Connect';
import { FAQ, GlobalCTA } from '@/components/sections/FooterSections';

/**
 * Vibes & Highs - Primary Entry Point
 * 
 * This component orchestrates the landing page experience.
 * It uses a modular section-based architecture for better maintainability
 * and performance.
 */
export default function Home() {
  const {
    wedState,
    friState,
    isWednesdayToday,
    isFridayToday,
    rsvps,
    hasRsvpd,
    handleRsvp,
    handleCalendar,
    nextUpEvent
  } = useVibes();

  // Forensic grounding: Ensure we scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="selection:bg-primary selection:text-black bg-[#0A0A0B] min-h-screen text-white antialiased">
      <SEO 
        title="Build Weird Things | Vibes & Highs SLC" 
        description="A casual, no-pressure meetup for people making weird internet projects, creative code, and AI explorations in Salt Lake City."
        breadcrumbs={[
          { name: 'Home', item: '/' }
        ]}
        structuredData={[
          {
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is Vibes & Highs?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Vibes & Highs is a casual, non-transactional meetup for builders, artists, and researchers in Salt Lake City. We focus on building weird internet projects and creative experiments."
                }
              },
              {
                "@type": "Question",
                "name": "Do I need to be a technical expert to join?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Not at all. While many members are developers or researchers, we welcome anyone who wants to make things. 'Weird' is the only requirement."
                }
              },
              {
                "@type": "Question",
                "name": "Is there a cost to attend?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No, our weekly meetups are free. We are a community-driven collective, not a business."
                }
              }
            ]
          },
          {
            "@type": "Event",
            "name": "Wednesday Builder Session",
            "startDate": "2024-05-08T16:00",
            "endDate": "2024-05-08T20:00",
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "eventStatus": "https://schema.org/EventScheduled",
            "location": {
              "@type": "Place",
              "name": "GameHaven Herriman",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "5254 Anthem Peak Ln",
                "addressLocality": "Herriman",
                "addressRegion": "UT",
                "postalCode": "84096",
                "addressCountry": "US"
              }
            },
            "description": "Weekly session for builders and creative coders in Herriman."
          }
        ]}
      />

      {/* Main Content Flow */}
      <main>
        <Hero nextUpEvent={nextUpEvent} />
        <Ecosystem />
        <SystemPulse />
        <Philosophy />
        <Agenda />
        <Schedule 
          wedState={wedState}
          friState={friState}
          isWednesdayToday={isWednesdayToday}
          isFridayToday={isFridayToday}
          rsvps={rsvps}
          hasRsvpd={hasRsvpd}
          onRsvp={handleRsvp}
          onCalendar={handleCalendar}
        />
        <Connect />
        <FAQ />
        <GlobalCTA />
      </main>


    </div>
  );
}
