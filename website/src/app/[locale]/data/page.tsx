import type { Locale } from '../../../lib/contracts';
import { loadDataset, loadStatistics } from '../../../lib/dataset';
import Shell from '../../../components/Shell';
import DataPage from '../../../features/data/DataPage';
export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const [{ locale }, dataset, statistics] = await Promise.all([
    params,
    loadDataset(),
    loadStatistics(),
  ]);
  return (
    <Shell locale={locale}>
      <DataPage locale={locale} dataset={dataset} statistics={statistics} />
    </Shell>
  );
}
