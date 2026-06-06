import SEO from '../components/SEO';

export default function TermsOfService() {
  return (
    <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto min-h-screen">
      <SEO title="Terms of Service" description="Terms of service and community rules for the SLC AI Town Hall." />
      <div className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold mb-4">LEGAL / TERMS OF SERVICE</div>
      <h1 className="font-display font-black text-4xl md:text-5xl tracking-tighter mb-12">TERMS OF SERVICE</h1>

      <div className="prose prose-invert prose-p:text-white/70 prose-a:text-primary max-w-none space-y-8 font-sans">
        <section>
          <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the SLC AI TOWN HALL website and community platforms (including Discord and Twitch), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access our platforms or attend our events.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">2. Community Guidelines</h2>
          <p>
            SLC AI TOWN HALL is a community-driven initiative. Participants are expected to behave respectfully towards others at both physical meetups and digital spaces. Harassment, spam, or disruptive behavior will not be tolerated and may result in a ban from all our platforms and events.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">3. Intellectual Property</h2>
          <p>
            Projects, code, art, and content created or shared during SLC AI TOWN HALL events remain the property of their respective creators. However, by sharing your work in our public forums, you grant the community a non-exclusive right to view and interact with your content.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">4. Limitation of Liability</h2>
          <p>
            SLC AI TOWN HALL organizers are not liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your access to, or use of, our website, events, or community platforms. Attendees participate in events at their own risk.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">5. Modifications</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide noticeable communication before any new terms take effect.
          </p>
        </section>
      </div>
    </div>
  );
}
