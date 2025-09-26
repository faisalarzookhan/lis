import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { TeamMember } from '../types';
import Card from '../components/ui/Card';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import LazyImage from '../components/ui/LazyImage';
import CompanyTimeline from '../components/about/CompanyTimeline';
import AwardsCertifications from '../components/about/AwardsCertifications';
import TeamProfiles from '../components/about/TeamProfiles';
import InteractiveValuesIcons from '../components/about/InteractiveValuesIcons';
import MissionVisionVisuals from '../components/about/MissionVisionVisuals';

const About: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      const { data, error } = await supabase.from('team_members').select('*').order('id');
      
      if (error) {
        setError(error.message);
      } else if (data) {
        setTeamMembers(data as TeamMember[]);
      }
      setLoading(false);
    };

    fetchTeam();
  }, []);

  const founder = teamMembers.find(m => m.role === 'Founder & CEO');

  return (
    <div className="pt-20">
      <header className="section-padding bg-gray-bg dark:bg-gray-900/50 text-center">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4">About Us</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          From Vision to Impact: The Story of Limitless Infotech Solution.
        </p>
      </header>

      {/* Our Story & Founder */}
      <section className="section-padding">
        <div className="container-custom">
          {loading ? (
            <div className="grid lg:grid-cols-5 gap-12 items-center">
              <div className="lg:col-span-3">
                <SkeletonLoader width="50%" height="2rem" className="mb-6" />
                <SkeletonLoader width="100%" height="1rem" className="mb-4" />
                <SkeletonLoader width="95%" height="1rem" className="mb-4" />
                <SkeletonLoader width="90%" height="1rem" />
              </div>
              <div className="lg:col-span-2">
                <Card className="p-8 text-center">
                  <SkeletonLoader width="8rem" height="8rem" rounded className="mx-auto mb-4" />
                  <SkeletonLoader width="60%" height="1.5rem" className="mb-2" />
                  <SkeletonLoader width="40%" height="1rem" className="mb-2" />
                  <SkeletonLoader width="80%" height="1rem" />
                </Card>
              </div>
            </div>
          ) : error ? <div className="text-center text-red-500">Error: {error}</div> : founder && (
            <div className="grid lg:grid-cols-5 gap-12 items-center">
              <div className="lg:col-span-3">
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Founded in 2018 by Faisal Khan, Limitless Infotech began with a simple idea: technology should empower businesses, not complicate them. Starting with a small team of passionate developers, we’ve grown to deliver 120+ projects globally, partnering with startups and enterprises alike.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Our journey is driven by one promise: 'Where Innovation Meets Execution'. We believe in building long-term partnerships, crafting unique solutions, and delivering a 'Royal Client Experience' that sets new industry standards.
                </p>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-2"
              >
                <Card className="p-8 text-center">
                  <LazyImage
                    src={founder.image}
                    alt={founder.name}
                    width={128}
                    height={128}
                    className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-accent"
                  />
                  <h3 className="text-2xl font-bold">{founder.name}</h3>
                  <p className="text-accent font-semibold mb-2">{founder.role}</p>
                  <p className="text-sm italic text-gray-600 dark:text-gray-400">
                    "Technology is only powerful if it solves real problems. At Limitless, we build solutions that grow with you."
                  </p>
                </Card>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* Company Timeline */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From humble beginnings to industry leadership: milestones that shaped our path to innovation.
            </p>
          </div>
          <CompanyTimeline items={[
            {
              id: '1',
              year: '2018',
              title: 'Company Founded',
              description: 'Limitless Infotech Solution was established with a vision to revolutionize digital transformation.',
              type: 'milestone'
            },
            {
              id: '2',
              year: '2019',
              title: 'First Major Client',
              description: 'Secured our first enterprise client, marking the beginning of our growth journey.',
              type: 'growth'
            },
            {
              id: '3',
              year: '2020',
              title: 'ISO Certification',
              description: 'Achieved ISO 27001 certification for information security management.',
              type: 'certification'
            },
            {
              id: '4',
              year: '2021',
              title: 'Team Expansion',
              description: 'Grew our team to 50+ experts across multiple technology domains.',
              type: 'growth'
            },
            {
              id: '5',
              year: '2022',
              title: 'Industry Recognition',
              description: 'Received "Best Technology Partner" award from leading industry association.',
              type: 'award'
            },
            {
              id: '6',
              year: '2023',
              title: 'Global Expansion',
              description: 'Opened offices in 3 countries and partnered with international corporations.',
              type: 'partnership'
            }
          ]} />
        </div>
      </section>

      {/* Awards & Certifications */}
      <section className="section-padding bg-gray-bg dark:bg-gray-900/50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Awards & Certifications</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Recognition and certifications that validate our commitment to excellence and quality.
            </p>
          </div>
          <AwardsCertifications awards={[
            {
              id: '1',
              title: 'ISO 27001 Certified',
              issuer: 'International Standards Organization',
              year: '2020',
              description: 'Information Security Management Systems certification.',
              category: 'certification',
              verificationUrl: 'https://www.iso.org/iso-27001-information-security.html'
            },
            {
              id: '2',
              title: 'Best Technology Partner 2022',
              issuer: 'Tech Excellence Awards',
              year: '2022',
              description: 'Recognized for outstanding client partnerships and innovative solutions.',
              category: 'award'
            },
            {
              id: '3',
              title: 'GDPR Compliant',
              issuer: 'European Union',
              year: '2021',
              description: 'Fully compliant with General Data Protection Regulation standards.',
              category: 'certification'
            },
            {
              id: '4',
              title: 'Top 100 Tech Companies',
              issuer: 'Business Review Magazine',
              year: '2023',
              description: 'Ranked among the top 100 technology companies globally.',
              category: 'recognition'
            }
          ]} />
        </div>
      </section>

      {/* Interactive Values */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The principles that guide everything we do and shape our approach to innovation.
            </p>
          </div>
          <InteractiveValuesIcons />
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-gray-bg dark:bg-gray-900/50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Mission & Vision</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our purpose and aspirations that drive us to create meaningful impact.
            </p>
          </div>
          <MissionVisionVisuals />
        </div>
      </section>

      {/* Enhanced Team Profiles */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The talented individuals who bring our vision to life through expertise and passion.
            </p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="p-6">
                  <SkeletonLoader width="4rem" height="4rem" rounded className="mb-4" />
                  <SkeletonLoader width="60%" height="1.5rem" className="mb-2" />
                  <SkeletonLoader width="40%" height="1rem" className="mb-2" />
                  <SkeletonLoader width="80%" height="1rem" />
                </Card>
              ))}
            </div>
          ) : error ? <div className="text-center text-red-500">Error: {error}</div> : (
            <TeamProfiles members={teamMembers.map(member => ({
              id: member.id,
              name: member.name,
              role: member.role,
              bio: member.bio,
              image: member.image,
              linkedin: `https://linkedin.com/in/${member.name.toLowerCase().replace(' ', '-')}`,
              github: `https://github.com/${member.name.toLowerCase().replace(' ', '')}`,
              email: `${member.name.toLowerCase().replace(' ', '.')}@limitless.com`,
              skills: ['React', 'Node.js', 'Python', 'AWS', 'TypeScript'],
              achievements: [
                'Led 15+ successful projects',
                'Mentored junior developers',
                'Published technical articles',
                'Spoke at industry conferences'
              ]
            }))} />
          )}
        </div>
      </section>
    </div>
  );
};

export default About;
