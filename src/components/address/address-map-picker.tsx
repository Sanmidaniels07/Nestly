"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { APILoadingStatus, APIProvider, Map, useApiLoadingStatus, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { Crosshair, Keyboard, Loader2, MapPin, Search, X } from "lucide-react";

import { DEFAULT_CENTER, GOOGLE_MAPS_API_KEY, PickedAddress, inNigeria, toPickedAddress } from "@/src/lib/google-maps";

interface Props {
  /** Reopening an address that already has a pin. */
  initial?: { lat: number; lng: number } | null;
  onConfirm: (address: PickedAddress) => void;
  /** "Type address instead" - also used when the map can't load. */
  onManual: () => void;
}

// Uber/Bolt-style address picker: opens on the buyer's exact location, the
// map moves under a fixed pin, and the spot is turned into an address.
export default function AddressMapPicker(props: Props) {
  if (!GOOGLE_MAPS_API_KEY) return null;
  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY} region="NG" language="en">
      <Picker {...props} />
    </APIProvider>
  );
}

type Locating = "locating" | "found" | "denied" | "idle";

function Picker({ initial, onConfirm, onManual }: Props) {
  const status = useApiLoadingStatus();
  const map = useMap();
  const geocoding = useMapsLibrary("geocoding");
  const places = useMapsLibrary("places");

  const [locating, setLocating] = useState<Locating>(initial ? "idle" : "locating");
  const [moving, setMoving] = useState(false);
  const [looking, setLooking] = useState(false);
  const [picked, setPicked] = useState<PickedAddress | null>(null);
  const [lookupFailed, setLookupFailed] = useState(false);
  const [mapBroken, setMapBroken] = useState(false);
  const lookupId = useRef(0);
  const mapBox = useRef<HTMLDivElement>(null);

  // A bad or restricted key: Google calls gm_authFailure and paints its own
  // "Oops! Something went wrong" box - offer typing instead.
  useEffect(() => {
    const w = window as Window & { gm_authFailure?: () => void };
    const previous = w.gm_authFailure;
    w.gm_authFailure = () => {
      setMapBroken(true);
      previous?.();
    };
    const box = mapBox.current;
    const observer = new MutationObserver(() => {
      if (box?.querySelector(".gm-err-container")) setMapBroken(true);
    });
    if (box) observer.observe(box, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      w.gm_authFailure = previous;
    };
  }, []);

  // ---- Where the buyer is ----
  const goTo = useCallback(
    (position: { lat: number; lng: number }, zoom = 18) => {
      map?.panTo(position);
      map?.setZoom(zoom);
    },
    [map]
  );

  // Asks the browser for the exact spot (GPS on phones). Results arrive in
  // callbacks, so this never sets state straight away.
  const requestLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      queueMicrotask(() => setLocating("denied"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const here = { lat: coords.latitude, lng: coords.longitude };
        if (!inNigeria(here)) {
          setLocating("denied");
          return;
        }
        setLocating("found");
        goTo(here);
      },
      () => setLocating("denied"),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  }, [goTo]);

  const locate = () => {
    setLocating("locating");
    requestLocation();
  };

  // Open on their location (unless reopening a saved pin).
  const started = useRef(false);
  useEffect(() => {
    if (!map || started.current) return;
    started.current = true;
    if (!initial) requestLocation();
  }, [map, initial, requestLocation]);

  // ---- Pin -> address ----
  const lookUp = useCallback(async () => {
    if (!map || !geocoding) return;
    const center = map.getCenter();
    if (!center) return;
    const location = { lat: center.lat(), lng: center.lng() };
    const id = ++lookupId.current;
    setLooking(true);
    setLookupFailed(false);
    try {
      const { results } = await new geocoding.Geocoder().geocode({ location, region: "NG" });
      if (id !== lookupId.current) return;
      setPicked(
        toPickedAddress(
          results.slice(0, 4).map((result) => ({
            formattedAddress: result.formatted_address,
            components: result.address_components.map((component) => ({ longText: component.long_name, types: component.types })),
          })),
          location
        )
      );
    } catch {
      if (id !== lookupId.current) return;
      setPicked(null);
      setLookupFailed(true);
    } finally {
      if (id === lookupId.current) setLooking(false);
    }
  }, [map, geocoding]);

  if (mapBroken || status === APILoadingStatus.FAILED || status === APILoadingStatus.AUTH_FAILURE) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
        The map couldn&apos;t load right now.{" "}
        <button type="button" onClick={onManual} className="font-semibold underline underline-offset-2">
          Type your address instead
        </button>
      </div>
    );
  }

  const canConfirm = !!picked && picked.inNigeria && !looking && !moving;

  return (
    <div className="space-y-3">
      <PlaceSearch places={places} map={map} onPicked={(location) => goTo(location)} />

      <div ref={mapBox} className="relative h-[300px] overflow-hidden rounded-2xl border border-line sm:h-[360px]">
        <Map
          defaultCenter={initial ?? DEFAULT_CENTER}
          defaultZoom={initial ? 18 : 12}
          gestureHandling="greedy"
          disableDefaultUI
          zoomControl
          clickableIcons={false}
          onDragstart={() => setMoving(true)}
          onIdle={() => {
            setMoving(false);
            lookUp();
          }}
          className="h-full w-full"
        />

        {/* The pin stays in the middle; the map moves under it. */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
          <MapPin
            size={40}
            strokeWidth={2.2}
            className={`fill-violet-600 text-white drop-shadow-lg transition-transform ${moving ? "-translate-y-2" : ""}`}
          />
        </div>
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-900/40" />

        <button
          type="button"
          onClick={locate}
          aria-label="Use my current location"
          className="absolute bottom-3 right-3 flex h-11 items-center gap-1.5 rounded-full bg-white px-3.5 text-[12.5px] font-semibold text-violet-700 shadow-md hover:bg-violet-50"
        >
          {locating === "locating" ? <Loader2 size={15} className="animate-spin" /> : <Crosshair size={15} />}
          {locating === "locating" ? "Finding you..." : "My location"}
        </button>
      </div>

      {locating === "denied" && (
        <p className="text-[12.5px] text-muted">
          We couldn&apos;t get your location. Search for your street above, or move the map to put the pin on your gate.
        </p>
      )}

      <div className="rounded-xl border border-line bg-surface px-4 py-3">
        <p className="text-[11.5px] font-semibold uppercase tracking-wide text-subtle">Deliver to</p>
        {looking || moving ? (
          <p className="mt-1 flex items-center gap-2 text-[13.5px] text-muted">
            <Loader2 size={14} className="animate-spin" /> Finding the address...
          </p>
        ) : picked ? (
          picked.inNigeria ? (
            <>
              <p className="mt-1 text-[14px] font-medium text-ink">{picked.address || "Pinned location"}</p>
              <p className="text-[12.5px] text-muted">{[picked.city, picked.state].filter(Boolean).join(", ")}</p>
            </>
          ) : (
            <p className="mt-1 text-[13px] text-amber-700 dark:text-amber-300">Move the pin to a place in Nigeria.</p>
          )
        ) : (
          <p className="mt-1 text-[13px] text-muted">
            {lookupFailed ? "Couldn't find an address here. Move the pin a little, or type it instead." : "Move the map to put the pin on your gate."}
          </p>
        )}
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onManual}
          className="flex items-center justify-center gap-1.5 text-[13px] font-medium text-violet-700 hover:underline dark:text-violet-300"
        >
          <Keyboard size={14} /> Type address instead
        </button>
        <button
          type="button"
          disabled={!canConfirm}
          onClick={() => picked && onConfirm(picked)}
          className="h-11 rounded-xl bg-violet-600 px-5 text-[13.5px] font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Confirm location
        </button>
      </div>
    </div>
  );
}

// Street, estate or landmark search (Places Autocomplete), Nigeria only.
function PlaceSearch({
  places,
  map,
  onPicked,
}: {
  places: google.maps.PlacesLibrary | null;
  map: google.maps.Map | null;
  onPicked: (location: { lat: number; lng: number }) => void;
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<google.maps.places.PlacePrediction[]>([]);
  const [open, setOpen] = useState(false);
  // One token per search, ended by picking a place (cheaper billing).
  const session = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  useEffect(() => {
    if (!places || query.trim().length < 3) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      session.current ??= new places.AutocompleteSessionToken();
      const center = map?.getCenter();
      try {
        const { suggestions: found } = await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: query.trim(),
          includedRegionCodes: ["ng"],
          sessionToken: session.current,
          ...(center ? { origin: center, locationBias: center } : {}),
        });
        if (!cancelled) {
          setSuggestions(found.map((s) => s.placePrediction).filter((p): p is google.maps.places.PlacePrediction => !!p).slice(0, 5));
          setOpen(true);
        }
      } catch {
        if (!cancelled) setSuggestions([]);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, places, map]);

  const choose = async (prediction: google.maps.places.PlacePrediction) => {
    setOpen(false);
    setQuery(prediction.mainText?.text ?? prediction.text.text);
    try {
      const place = prediction.toPlace();
      await place.fetchFields({ fields: ["location"] });
      session.current = null;
      if (place.location) onPicked({ lat: place.location.lat(), lng: place.location.lng() });
    } catch {
      // Leave the map where it is.
    }
  };

  const visible = open && query.trim().length >= 3 ? suggestions : [];

  return (
    <div className="relative">
      <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Search street, estate or landmark"
        aria-label="Search for your address"
        className="h-12 w-full rounded-xl border border-line bg-surface pl-10 pr-10 text-[16px] text-ink outline-none placeholder:text-subtle focus:border-violet-400 sm:text-[14px]"
      />
      {query && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            setQuery("");
            setSuggestions([]);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-ink"
        >
          <X size={15} />
        </button>
      )}
      {visible.length > 0 && (
        <ul className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-line bg-surface shadow-lg">
          {visible.map((prediction) => (
            <li key={prediction.placeId}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(prediction)}
                className="flex w-full items-start gap-2.5 px-3.5 py-2.5 text-left hover:bg-violet-50 dark:hover:bg-violet-500/10"
              >
                <MapPin size={15} className="mt-0.5 shrink-0 text-violet-600 dark:text-violet-400" />
                <span className="min-w-0">
                  <span className="block truncate text-[13.5px] font-medium text-ink">{prediction.mainText?.text ?? prediction.text.text}</span>
                  {prediction.secondaryText?.text && <span className="block truncate text-[12px] text-muted">{prediction.secondaryText.text}</span>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
