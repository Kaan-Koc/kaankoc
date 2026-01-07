import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Timeline from '@/components/Timeline';
import ProjectGallery from '@/components/ProjectGallery';
import CertificateWall from '@/components/CertificateWall';
import ContactSection from '@/components/ContactSection';
import ChatBubble from '@/components/ChatBubble';
import CVSection from '@/components/CVSection';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export default async function HomePage() {
  let projects = [];
  let experiences = [];
  let education = [];
  let certificates = [];

  // Default empty state to prevent crashes
  let projects = [];
  let experiences = [];
  let education = [];
  let certificates = [];

  try {
    // Attempt to load from Cloudflare KV if available
    const ctx = getRequestContext();
    const env = ctx?.env;

    if (env && env.PORTFOLIO_DATA) {
      const kv = env.PORTFOLIO_DATA;
      const [projectsData, experienceData, educationData, certificatesData] = await Promise.all([
        kv.get('projects', { type: 'json' }),
        kv.get('experience', { type: 'json' }),
        kv.get('education', { type: 'json' }),
        kv.get('certificates', { type: 'json' })
      ]);

      projects = projectsData || [];
      experiences = experienceData || [];
      education = educationData || [];
      certificates = certificatesData || [];
    }
  } catch (error) {
    console.error('KV Data Fetch Failed (Using empty defaults):', error);
    // Silent fallback to empty arrays - prevents 500 Error
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <Timeline experiences={experiences} education={education} />
      <ProjectGallery projects={projects} />
      <CertificateWall certificates={certificates} />
      <CVSection />
      <ContactSection />
      <ChatBubble />
    </main>
  );
}
