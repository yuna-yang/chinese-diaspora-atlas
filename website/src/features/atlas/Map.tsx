'use client';
import dynamic from 'next/dynamic';
import { Component, type ReactNode } from 'react';
import { messages } from '../../lib/i18n';
import type { MapProps } from './MapClient';
const Client = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => (
    <div className="map-skeleton" aria-busy="true">
      <span aria-hidden="true">✳</span>
    </div>
  ),
});
class Boundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
export default function AtlasMap(props: MapProps) {
  return (
    <Boundary fallback={<p role="status">{messages(props.locale).mapError}</p>}>
      <Client {...props} />
    </Boundary>
  );
}
