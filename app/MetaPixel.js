'use client';

import Script from 'next/script';
import { Suspense, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { fbTrack } from './fbpixel';

const PIXEL_ID = '938608509225079';

// Fire PageView on client-side route changes (the base snippet already fires the
// first one on load, so we skip the initial mount to avoid double-counting).
function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    fbTrack('PageView');
  }, [pathname, searchParams]);
  return null;
}

// Fire CompleteRegistration once, when a freshly-created user appears.
function SignupTracker() {
  const { isSignedIn, user } = useUser();
  useEffect(() => {
    if (!isSignedIn || !user) return;
    try {
      const createdAt = new Date(user.createdAt).getTime();
      const isFresh = Date.now() - createdAt < 5 * 60 * 1000; // signed up < 5 min ago
      const key = 'fb_signup_' + user.id;
      if (isFresh && !localStorage.getItem(key)) {
        fbTrack('CompleteRegistration');
        localStorage.setItem(key, '1');
      }
    } catch {}
  }, [isSignedIn, user?.id]);
  return null;
}

export default function MetaPixel() {
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        <img
          height="1" width="1" style={{ display: 'none' }} alt=""
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      <SignupTracker />
    </>
  );
}
