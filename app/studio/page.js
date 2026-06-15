export const metadata = { title: 'Studio — Voodoo Visualizer' };

export default function StudioPage() {
  return (
    <iframe
      src="/app/index.html"
      title="Voodoo Visualizer"
      className="studio-frame"
      allow="autoplay; clipboard-write; fullscreen"
    />
  );
}
