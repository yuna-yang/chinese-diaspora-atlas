// @vitest-environment jsdom
import { it, expect, vi, afterEach } from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react';
import { useVisitorLocation } from '../../website/src/features/atlas/useVisitorLocation';
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
function fakeLocation() {
  let success: PositionCallback = () => {};
  let failure: PositionErrorCallback = () => {};
  vi.stubGlobal('isSecureContext', true);
  Object.defineProperty(navigator, 'geolocation', {
    configurable: true,
    value: {
      getCurrentPosition: (
        s: PositionCallback,
        e: PositionErrorCallback,
        options: PositionOptions,
      ) => {
        expect(options).toEqual({
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 60000,
        });
        success = s;
        failure = e;
      },
    },
  });
  return {
    success: (accuracy = 100) =>
      success({
        coords: { latitude: 55.6761, longitude: 12.5683, accuracy },
        timestamp: 0,
      } as GeolocationPosition),
    failure: (code: number) => failure({ code } as GeolocationPositionError),
  };
}
it('waits for activation then exposes one temporary position', () => {
  const device = fakeLocation();
  const { result } = renderHook(useVisitorLocation);
  expect(result.current.status).toBe('idle');
  expect(result.current.position).toBeNull();
  act(() => result.current.request());
  expect(result.current.status).toBe('locating');
  act(() => device.success());
  expect(result.current.position).toEqual({
    latitude: 55.6761,
    longitude: 12.5683,
    accuracy: 100,
  });
  act(() => result.current.clear());
  expect(result.current.position).toBeNull();
});
it('ignores late callbacks after clearing', () => {
  const device = fakeLocation();
  const { result } = renderHook(useVisitorLocation);
  act(() => result.current.request());
  act(() => result.current.clear());
  act(() => device.success());
  expect(result.current.position).toBeNull();
  expect(result.current.status).toBe('idle');
});
it.each([
  [1, 'denied'],
  [2, 'unavailable'],
  [3, 'timeout'],
])('maps error %s without storing coordinates', (code, error) => {
  const device = fakeLocation();
  const { result } = renderHook(useVisitorLocation);
  act(() => result.current.request());
  act(() => device.failure(code as number));
  expect(result.current.error).toBe(error);
  expect(result.current.position).toBeNull();
});
