import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Limitless Infotech - Transforming Businesses with Technology',
  description = 'Leading technology solutions provider specializing in web development, AI automation, mobile apps, and digital transformation. Empowering businesses with cutting-edge technology.',
  keywords = ['web development', 'AI automation', 'mobile apps', 'digital transformation', 'technology solutions', 'software development'],
  image = '/images/og-image.jpg',
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Limitless Infotech',
  section,
  tags
}) => {
  const router = useRouter();
  const canonicalUrl = url || `https://limitlessinfotech.com${router.asPath}`;
  const fullTitle = title.includes('Limitless Infotech') ? title : `${title} | Limitless Infotech`;

  // Structured data for the organization
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Limitless Infotech',
    url: 'https://limitlessinfotech.com',
    logo: 'https://limitlessinfotech.com/images/logo.png',
    description: 'Leading technology solutions provider specializing in web development, AI automation, mobile apps, and digital transformation.',
    foundingDate: '2020',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-XXX-XXX-XXXX',
      contactType: 'Customer Service',
      email: 'contact@limitlessinfotech.com'
    },
    sameAs: [
      'https://www.linkedin.com/company/limitless-infotech',
      'https://twitter.com/limitlessinfotech',
      'https://www.facebook.com/limitlessinfotech'
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Technology Solutions',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Web Development',
            description: 'Custom web applications and websites'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'AI Automation',
            description: 'Intelligent automation solutions'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Mobile Applications',
            description: 'Cross-platform mobile app development'
          }
        }
      ]
    }
  };

  // WebSite structured data
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Limitless Infotech',
    url: 'https://limitlessinfotech.com',
    description: 'Leading technology solutions provider',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://limitlessinfotech.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image.startsWith('http') ? image : `https://limitlessinfotech.com${image}`} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Limitless Infotech" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image.startsWith('http') ? image : `https://limitlessinfotech.com${image}`} />
      <meta name="twitter:site" content="@limitlessinfotech" />
      <meta name="twitter:creator" content="@limitlessinfotech" />

      {/* Article specific meta tags */}
      {type === 'article' && publishedTime && (
        <>
          <meta property="article:published_time" content={publishedTime} />
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags && tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#2A52BE" />
      <meta name="msapplication-TileColor" content="#2A52BE" />
      <meta name="application-name" content="Limitless Infotech" />

      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="format-detection" content="telephone=no" />

      {/* Security Headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema)
        }}
      />

      {/* Additional structured data for breadcrumbs if needed */}
      {router.pathname !== '/' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://limitlessinfotech.com'
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: title,
                  item: canonicalUrl
                }
              ]
            })
          }}
        />
      )}
    </Head>
  );
};

export default SEOHead;
