export const createMRTMarkerElement = (label: string) => {
  const markerElement = document.createElement('div');
  markerElement.className = 'flex flex-col gap-1 items-center';

  const img = document.createElement('img');
  img.className = 'w-8 h-8';
  img.src = './mrt_jkt.png';

  const text = document.createElement('div');
  text.className = 'text-outline';
  text.textContent = label;

  markerElement.appendChild(img);
  markerElement.appendChild(text);
  return markerElement;
}