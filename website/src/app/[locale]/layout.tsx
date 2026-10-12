import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title:
      locale === 'zh-CN'
        ? '星散 · 中国离散社群与公民连接地图'
        : 'Scattered Stars · Chinese Diaspora & Civic Atlas',
    description:
      locale === 'zh-CN'
        ? '共同探索中国离散社群及其与所在社会的公开连接。'
        : 'Explore Chinese diaspora communities and their documented civic connections.',
  };
}
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh-CN' }];
}
export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== 'en' && locale !== 'zh-CN') notFound();
  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
