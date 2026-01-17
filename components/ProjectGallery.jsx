'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from '@/lib/i18n';
import Image from 'next/image';
import { staggerContainer, slideInFromBottom } from '@/lib/animations';

// Helper function to extract video thumbnail from URL
function getVideoThumbnail(url) {
    if (!url) return null;

    // YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
        return `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`;
    }

    // Vimeo
    const vimeoRegex = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|)(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
        // Note: Vimeo thumbnails require API call, using default for now
        return `https://vumbnail.com/${vimeoMatch[2]}.jpg`;
    }

    return null;
}

export default function ProjectGallery({ projects }) {
    const t = useTranslations('Projects');
    const locale = useLocale();

    return (
        <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="text-center mb-16"
                >
                    <motion.h2
                        variants={slideInFromBottom}
                        className="font-anton text-4xl md:text-6xl text-yeditepe dark:text-white mb-4"
                    >
                        {t('title')}
                    </motion.h2>
                    <motion.p
                        variants={slideInFromBottom}
                        className="text-lg text-gray-600 dark:text-gray-400"
                    >
                        {t('subtitle')}
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {projects.map((project) => {
                        const videoThumbnail = getVideoThumbnail(project.demoUrl);
                        const displayImage = videoThumbnail || project.image;

                        return (
                            <motion.div
                                key={project.id}
                                variants={slideInFromBottom}
                                whileHover={{ y: -10 }}
                                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-900"
                            >
                                {/* Project Image */}
                                <div className="relative h-64 overflow-hidden">
                                    {displayImage && (
                                        <Image
                                            src={displayImage}
                                            alt={project.title[locale] || project.title.tr}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    )}
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                        <div className="flex gap-4">
                                            {project.demoUrl && (
                                                <a
                                                    href={project.demoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-2 bg-yeditepe hover:bg-yeditepe-700 text-white rounded-lg text-sm font-semibold transition-colors"
                                                >
                                                    {t('viewDemo')}
                                                </a>
                                            )}
                                            {project.githubUrl && (
                                                <a
                                                    href={project.githubUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-semibold transition-colors"
                                                >
                                                    {t('viewCode')}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Project Info */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-yeditepe dark:text-white mb-2">
                                        {project.title[locale] || project.title.tr}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        {project.description[locale] || project.description.tr}
                                    </p>

                                    {/* Technologies */}
                                    {project.technologies && project.technologies.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {project.technologies.map((tech, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 text-xs font-medium bg-yeditepe-100 dark:bg-yeditepe-900 text-yeditepe-800 dark:text-yeditepe-200 rounded-full"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
