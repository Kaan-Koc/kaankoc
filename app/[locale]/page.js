import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Timeline from '@/components/Timeline';
import ProjectGallery from '@/components/ProjectGallery';
import CertificateWall from '@/components/CertificateWall';
import ContactSection from '@/components/ContactSection';
import ChatBubble from '@/components/ChatBubble';
import CVSection from '@/components/CVSection';

// Import JSON data
import projectsData from '@/data/projects.json';
import experienceData from '@/data/experience.json';
import educationData from '@/data/education.json';
import certificatesData from '@/data/certificates.json';

export const runtime = 'edge';

export default async function HomePage() {
  const projects = projectsData;
  const experiences = experienceData;
  const education = educationData;
  const certificates = certificatesData;

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
