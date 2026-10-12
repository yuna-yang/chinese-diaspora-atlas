'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
export type VisitorPosition = {
  latitude: number;
  longitude: number;
  accuracy: number;
};
type ErrorKind =
  'denied' | 'unavailable' | 'timeout' | 'unsupported' | 'insecure';
type LocationState = {
  status: 'idle' | 'locating' | 'located' | 'error';
  position: VisitorPosition | null;
  error: ErrorKind | null;
};
const idle: LocationState = { status: 'idle', position: null, error: null };
export function useVisitorLocation(onLocated?: () => void) {
  const [state, setState] = useState<LocationState>(idle);
  const generation = useRef(0);
  const pending = useRef(false);
  useEffect(
    () => () => {
      generation.current++;
      pending.current = false;
    },
    [],
  );
  const clear = useCallback(() => {
    generation.current++;
    pending.current = false;
    setState(idle);
  }, []);
  const request = useCallback(() => {
    if (pending.current) return;
    const id = ++generation.current;
    if (!window.isSecureContext) {
      setState({ status: 'error', position: null, error: 'insecure' });
      return;
    }
    if (!navigator.geolocation) {
      setState({ status: 'error', position: null, error: 'unsupported' });
      return;
    }
    pending.current = true;
    setState({ status: 'locating', position: null, error: null });
    const fail = (error: ErrorKind) => {
      if (generation.current !== id) return;
      pending.current = false;
      setState({ status: 'error', position: null, error });
    };
    try {
      navigator.geolocation.getCurrentPosition(
        (result) => {
          if (generation.current !== id) return;
          const { latitude, longitude, accuracy } = result.coords;
          if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude) ||
            !Number.isFinite(accuracy) ||
            Math.abs(latitude) > 90 ||
            Math.abs(longitude) > 180 ||
            accuracy < 0
          ) {
            fail('unavailable');
            return;
          }
          pending.current = false;
          setState({
            status: 'located',
            position: { latitude, longitude, accuracy },
            error: null,
          });
          onLocated?.();
        },
        (e) =>
          fail(
            e.code === 1 ? 'denied' : e.code === 3 ? 'timeout' : 'unavailable',
          ),
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
      );
    } catch {
      fail('unavailable');
    }
  }, [onLocated]);
  return { ...state, request, clear };
}
