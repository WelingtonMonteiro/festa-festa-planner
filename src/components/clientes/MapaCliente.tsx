
import { useEffect, useRef, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Evento } from '@/types';
import { MapPin } from "lucide-react";

interface MapaClienteProps {
  eventos: Evento[];
}

// Mapbox access token provided by the user
const MAPBOX_ACCESS_TOKEN = "pk.eyJ1Ijoid2VsaW5ndG9ubW9udGVpcm8iLCJhIjoiY2twNGJtNW5kMW10djMzbXd1MzQwejJrdyJ9.qjJLmY-44I8AiTN5sbn5Qw";

const MapaCliente = ({ eventos }: MapaClienteProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  
  // Filtra apenas eventos com locais diferentes para o mapa
  const locaisUnicos = eventos.reduce((acc: Evento[], evento) => {
    if (!acc.find(e => e.local === evento.local)) {
      acc.push(evento);
    }
    return acc;
  }, []);

  const initializeMap = async () => {
    if (!mapRef.current) return;
    
    try {
      // Carregar o script do Mapbox dinamicamente
      if (!window.mapboxgl) {
        await loadMapboxScript();
      }
      
      if (!window.mapboxgl) {
        throw new Error("Falha ao carregar o Mapbox");
      }
      
      const { mapboxgl } = window;
      mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
      
      // Inicializar o mapa
      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-46.6333, -23.5505], // São Paulo como padrão
        zoom: 10
      });

      map.addControl(new mapboxgl.NavigationControl());

      // Adicionar marcadores para cada local
      const bounds = new mapboxgl.LngLatBounds();
      
      // Função para adicionar marcadores
      const addMarkers = async () => {
        for (const evento of locaisUnicos) {
          try {
            // Simular geocodificação (em uma implementação real, usaria a API de geocodificação)
            // Esta é uma simulação muito simplificada
            const randomLat = -23.5505 + (Math.random() - 0.5) * 0.2;
            const randomLng = -46.6333 + (Math.random() - 0.5) * 0.2;
            
            // Em um app real, usaria algo como:
            // const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(evento.local)}.json?access_token=${MAPBOX_ACCESS_TOKEN}`);
            // const data = await response.json();
            // const [lng, lat] = data.features[0].center;
            
            // Criar um marcador personalizado
            const el = document.createElement('div');
            el.className = 'marker';
            el.innerHTML = `<div class="w-8 h-8 bg-festa-primary rounded-full flex items-center justify-center text-white">${locaisUnicos.indexOf(evento) + 1}</div>`;
            
            // Adicionar o marcador ao mapa
            new mapboxgl.Marker(el)
              .setLngLat([randomLng, randomLat])
              .setPopup(
                new mapboxgl.Popup({ offset: 25 })
                  .setHTML(`
                    <h3 class="font-medium">${evento.tema?.nome || "Evento"}</h3>
                    <p>${evento.local}</p>
                    <p class="text-sm">${new Date(evento.data).toLocaleDateString('pt-BR')}</p>
                  `)
              )
              .addTo(map);
            
            bounds.extend([randomLng, randomLat]);
          } catch (error) {
            console.error(`Erro ao geocodificar: ${evento.local}`, error);
          }
        }
        
        // Ajustar o mapa para mostrar todos os marcadores
        if (!bounds.isEmpty()) {
          map.fitBounds(bounds, { padding: 50 });
        }
      };
      
      map.on('load', () => {
        setMapLoaded(true);
        addMarkers();
      });
      
    } catch (error) {
      console.error("Erro ao inicializar o mapa:", error);
      setMapError("Erro ao carregar o mapa. Por favor, tente novamente mais tarde.");
    }
  };

  const loadMapboxScript = () => {
    return new Promise<void>((resolve, reject) => {
      if (window.mapboxgl) {
        resolve();
        return;
      }
      
      // Carregar CSS
      const linkEl = document.createElement('link');
      linkEl.rel = 'stylesheet';
      linkEl.href = 'https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css';
      document.head.appendChild(linkEl);
      
      // Carregar JavaScript
      const scriptEl = document.createElement('script');
      scriptEl.src = 'https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js';
      scriptEl.onload = () => resolve();
      scriptEl.onerror = () => reject(new Error("Falha ao carregar o script do Mapbox"));
      document.body.appendChild(scriptEl);
    });
  };
  
  useEffect(() => {
    // Inicializar o mapa assim que o componente for montado
    initializeMap();
  }, []);
  
  if (!eventos.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <MapPin className="h-16 w-16 text-muted-foreground/50" />
        <p className="mt-4 text-center text-muted-foreground">
          Este cliente ainda não possui eventos com locais registrados
        </p>
      </div>
    );
  }
  
  return (
    <div className="relative h-full w-full overflow-hidden rounded-md border">
      <div ref={mapRef} className="h-full w-full"></div>
      
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-2 text-sm text-muted-foreground">Carregando mapa...</p>
          </div>
        </div>
      )}

      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90">
          <div className="max-w-md rounded-md bg-destructive/10 p-4 text-center">
            <MapPin className="mx-auto h-10 w-10 text-destructive" />
            <p className="mt-2 font-medium text-destructive">{mapError}</p>
            <button
              onClick={() => {
                setMapError(null);
                initializeMap();
              }}
              className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Adicionar tipos para o Mapbox GL JS
declare global {
  interface Window {
    mapboxgl: any;
  }
}

export default MapaCliente;
