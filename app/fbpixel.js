// Fires a Meta Pixel event, retrying briefly until the pixel script is ready.
export function fbTrack(event, params) {
  if (typeof window === 'undefined') return;
  let tries = 0;
  const go = () => {
    if (window.fbq) {
      if (params) window.fbq('track', event, params);
      else window.fbq('track', event);
      return;
    }
    if (tries++ < 20) setTimeout(go, 300);
  };
  go();
}
