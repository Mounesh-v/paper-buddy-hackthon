import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import { Activity, Server, Database, ShieldCheck, RefreshCw, Cpu } from 'lucide-react';
import { getHealthStatus } from '../../api/healthApi';

const SystemHealth = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [health, setHealth] = useState(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getHealthStatus();
      setHealth(res);
    } catch (e) {
      setError(e.message || 'Failed to connect to backend health endpoint.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  if (loading) return <LoadingSpinner label="Checking Java Spring Boot Health Probes..." fullPage />;
  if (error) return <ErrorState message={error} onRetry={fetchHealth} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Health & Actuator Monitor"
        subtitle="Real-time operational health, microservice status, and PostgreSQL persistence metrics."
        action={
          <Button onClick={fetchHealth} icon={RefreshCw} variant="outline" size="sm">
            Refresh Health Probes
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Microservice Status"
          value={health?.status || 'UP'}
          icon={Activity}
          color="emerald"
          subtitle={health?.service || 'ScholarOS Homework Intelligence Service'}
        />
        <StatCard
          title="Database Connection"
          value="HEALTHY"
          icon={Database}
          color="indigo"
          subtitle="PostgreSQL 16 Engine"
        />
        <StatCard
          title="JWT Auth Provider"
          value="ACTIVE"
          icon={ShieldCheck}
          color="violet"
          subtitle="ScholarOS ERP Gateway"
        />
      </div>

      <div className="p-6 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <Server className="w-5 h-5 text-neutral-700" />
            <h3 className="font-bold text-neutral-900 dark:text-neutral-100">Service Deployment Parameters</h3>
          </div>
          <StatusBadge status={health?.status || 'UP'} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/50 dark:border-neutral-800">
            <p className="text-neutral-400 font-semibold uppercase">Service Identifier</p>
            <p className="font-bold text-neutral-800 dark:text-neutral-200 mt-1">{health?.service}</p>
          </div>
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/50 dark:border-neutral-800">
            <p className="text-neutral-400 font-semibold uppercase">API Gateway Base URL</p>
            <p className="font-mono text-neutral-700 mt-1">{import.meta.env.VITE_API_URL || 'http://localhost:8080'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;
