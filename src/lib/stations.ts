// src/lib/stations.ts
export interface Station {
  name: string;
  latitude: number;
  longitude: number;
}

export const mrtJakartaPhase1Stations: Station[] = [
  { name: "Bundaran HI", latitude: -6.195806, longitude: 106.822570 },
  { name: "Dukuh Atas", latitude: -6.201740, longitude: 106.822640 },
  { name: "Setiabudi", latitude: -6.208155, longitude: 106.823240 },
  { name: "Bendungan Hilir", latitude: -6.213667, longitude: 106.822960 },
  { name: "Istora Mandiri", latitude: -6.220191, longitude: 106.812291 },
  { name: "Senayan", latitude: -6.224553, longitude: 106.809953 },
  { name: "ASEAN", latitude: -6.229728, longitude: 106.808083 },
  { name: "Blok M", latitude: -6.244890, longitude: 106.799470 },
  { name: "Blok A", latitude: -6.253468, longitude: 106.799231 },
  { name: "Haji Nawi", latitude: -6.260927, longitude: 106.797547 },
  { name: "Cipete Raya", latitude: -6.266463, longitude: 106.797500 },
  { name: "Fatmawati", latitude: -6.283348, longitude: 106.797317 },
  { name: "Lebak Bulus Grab", latitude: -6.292421, longitude: 106.789304 }
];
