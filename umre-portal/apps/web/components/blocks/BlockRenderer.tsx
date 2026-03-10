"use client";
import React from 'react';
import { motion } from 'framer-motion';
import HeroVideo from './HeroVideo';
import SearchBox from './SearchBox';
import FeaturedTours from './FeaturedTours';
import FeaturedHotels from './FeaturedHotels';
import TestimonialsCarousel from './TestimonialsCarousel';
import FaqAccordion from './FaqAccordion';
import LatestPosts from './LatestPosts';
import PartnersSlider from './PartnersSlider';
import FeedbackCTA from './FeedbackCTA';
import VipServices from './VipServices';
import CustomTourBlock from './CustomTourBlock';
import FaqSection from './FaqSection';

const blockMap: any = {
    heroVideo: HeroVideo,
    searchBox: SearchBox,
    featuredTours: FeaturedTours,
    customTourForm: CustomTourBlock,
    featuredHotels: FeaturedHotels,
    testimonials: TestimonialsCarousel,
    faq: FaqAccordion,
    faqSection: FaqSection,
    latestPosts: LatestPosts,
    partnersSlider: PartnersSlider,
    feedbackCTA: FeedbackCTA,
    vipServices: VipServices,
};

export default function BlockRenderer({ blocks }: { blocks: any[] }) {
    if (!blocks) return null;

    return (
        <>
            {blocks.map((block: any, idx: number) => {
                const Component = blockMap[block.type];
                if (!Component) return null;

                // Don't animate HeroVideo or SearchBox to avoid CLS on initial load or jerky feel
                if (block.type === 'heroVideo' || block.type === 'searchBox') {
                    return <Component key={idx} data={block.data} />;
                }

                return (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <Component data={block.data} />
                    </motion.div>
                );
            })}
        </>
    );
}
