const fs = require('fs');
const path = require('path');

// Knowledge base content from Limitless website
const knowledgeBase = [
  {
    title: "About Limitless Infotech Solution Pvt. Ltd.",
    content: "Limitless Infotech Solution Pvt. Ltd. is a cutting-edge technology company specializing in innovative software development, web applications, mobile apps, and digital transformation. Founded by Faishal Khan, we bridge the gap between technology and business needs, delivering solutions that drive growth and efficiency. Our mission is to empower businesses with limitless possibilities through technology."
  },
  {
    title: "Auralis - Our AI Assistant",
    content: "Auralis is our AI-powered assistant, representing innovation, intelligence, and seamless user interaction. Auralis serves as the intelligent interface for website & enterprise solutions, powered by advanced AI technology. With continuous self-learning and self-improvement capabilities, Auralis provides personalized assistance and maintains the 'Limitless Brain' knowledge base for comprehensive support."
  },
  {
    title: "Our Founder - Faishal Khan",
    content: "Faishal Khan is the Founder and CEO of Limitless Infotech Solution Pvt. Ltd. As a visionary leader in technology, Faishal drives innovation and excellence in delivering cutting-edge solutions. Under his leadership, the company has established itself as a trusted partner for businesses seeking digital transformation."
  },
  {
    title: "Limitless Brain - Self Learning Knowledge Base",
    content: "The Limitless Brain is our advanced, self-learning knowledge base that continuously evolves and improves. Powered by AI and machine learning, it provides intelligent responses, learns from interactions, and adapts to provide better assistance over time. This self-improvement system ensures our clients always receive the most current and relevant information."
  },
  {
    title: "Our Services",
    content: "We offer comprehensive technology services including: Custom Software Development, Web Application Development, Mobile App Development (iOS & Android), E-commerce Solutions, Cloud Services & Migration, API Development & Integration, Database Design & Management, UI/UX Design, Quality Assurance & Testing, DevOps & CI/CD, Digital Marketing Solutions, and IT Consulting."
  },
  {
    title: "Web Development Services",
    content: "Our web development services include responsive website design, e-commerce platforms, content management systems, progressive web apps, and custom web applications. We use modern technologies like React, Next.js, Node.js, and cloud platforms for scalable solutions."
  },
  {
    title: "Mobile App Development",
    content: "We create native and cross-platform mobile applications for iOS and Android. Our expertise includes React Native, Flutter, Swift, and Kotlin. We focus on user experience, performance, and seamless integration with backend systems."
  },
  {
    title: "Cloud Services",
    content: "We provide cloud migration, AWS/Azure/GCP consulting, serverless architecture, cloud security, and infrastructure as code. Our solutions ensure scalability, reliability, and cost-effectiveness."
  },
  {
    title: "Portfolio Highlights",
    content: "Our portfolio includes successful projects in healthcare, finance, e-commerce, education, and logistics. We have delivered solutions for startups to enterprise clients, focusing on innovation and measurable results."
  },
  {
    title: "Technology Stack",
    content: "We work with modern technologies including JavaScript/TypeScript, Python, Java, PHP, React, Angular, Vue.js, Node.js, Express, Django, Spring Boot, MongoDB, PostgreSQL, MySQL, AWS, Azure, Docker, Kubernetes, and more."
  },
  {
    title: "Quality Assurance",
    content: "Our QA process includes automated testing, manual testing, performance testing, security testing, and continuous integration. We ensure high-quality, bug-free applications that meet industry standards."
  },
  {
    title: "Pricing and Consultation",
    content: "We offer flexible pricing models including fixed-price, time & materials, and dedicated team options. Contact us for a free consultation to discuss your project requirements and get a customized quote."
  },
  {
    title: "Contact Information",
    content: "Get in touch with us through our contact form, email, or phone. We're located to serve clients globally and provide remote collaboration. Our team is ready to discuss your technology needs."
  },
  {
    title: "Why Choose Limitless",
    content: "Choose Limitless for our expertise in emerging technologies, agile development methodology, transparent communication, post-launch support, and commitment to delivering innovative solutions that drive business success."
  },
  {
    title: "Tagline and Mission",
    content: "'Where Innovation Meets Execution – Powered by Auralis.' This tagline represents our commitment to delivering cutting-edge technology solutions through intelligent automation and AI-powered assistance."
  }
];

// Function to generate responses based on keywords
function generateResponse(message, knowledgeBase) {
  // Always return the specified response
  return "Sorry for the inconvenience.";
}

// Export for use in other files
module.exports = {
  knowledgeBase,
  generateResponse
};

// If run directly, test the function
if (require.main === module) {
  console.log("Testing knowledge base responses:");
  const testMessages = [
    "Hello",
    "What services do you offer?",
    "How much does it cost?",
    "Show me your portfolio",
    "How can I contact you?",
    "Tell me about your company",
    "What technologies do you use?",
    "I need web development",
    "Mobile app development",
    "Cloud services",
    "Quality assurance",
    "Who is Auralis?",
    "Tell me about Faishal Khan",
    "What is Limitless Brain?"
  ];

  testMessages.forEach(msg => {
    console.log(`\nUser: ${msg}`);
    console.log(`Bot: ${generateResponse(msg, knowledgeBase)}`);
  });
}
