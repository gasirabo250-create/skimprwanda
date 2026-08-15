import React from 'react';

const About: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
    <h1 className="text-4xl font-extrabold mb-4">About SKIMP Rwanda</h1>
    <p className="text-lg text-black/70 dark:text-white/70 mb-8">
      Your next car is closer than you think. Quality vehicles. Clear information. A simpler way to buy.
    </p>
    <div className="prose dark:prose-invert max-w-none space-y-4 text-black/70 dark:text-white/70 leading-relaxed">
      <p>
        SKIMP Rwanda is a Kigali-based automotive marketplace connecting buyers and sellers of quality
        used and new vehicles across Rwanda. We built SKIMP because buying a car locally often meant
        unclear pricing, unreliable information, and a lot of back-and-forth. We wanted to change that.
      </p>
      <p>
        Every vehicle listed on our platform is reviewed for accuracy before it goes live, and our team
        is available on WhatsApp to answer questions, arrange viewings, and guide you through the process
        — from your first search to picking up the keys.
      </p>
    </div>
  </div>
);

export default About;
