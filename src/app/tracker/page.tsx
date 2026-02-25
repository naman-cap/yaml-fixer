"use client";

import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, CheckCircle2, CircleDashed, FileJson, AlertCircle } from 'lucide-react';

interface Endpoint {
    category: string;
    subcategory: string | null;
    title: string;
    status: 'pending' | 'completed';
    specFile: string | null;
}

export default function TrackerDashboard() {
    const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    useEffect(() => {
        async function fetchRegistry() {
            try {
                const response = await fetch('/api/registry');
                if (!response.ok) {
                    throw new Error('Failed to fetch endpoint registry');
                }
                const data = await response.json();
                setEndpoints(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setIsLoading(false);
            }
        }

        fetchRegistry();
    }, []);

    const categories = useMemo(() => {
        const cats = new Set(endpoints.map((e) => e.category));
        return Array.from(cats).sort();
    }, [endpoints]);

    const filteredEndpoints = useMemo(() => {
        return endpoints.filter((endpoint) => {
            const matchesSearch =
                endpoint.title.toLowerCase().includes(search.toLowerCase()) ||
                endpoint.category.toLowerCase().includes(search.toLowerCase()) ||
                (endpoint.subcategory && endpoint.subcategory.toLowerCase().includes(search.toLowerCase()));

            const matchesStatus = statusFilter === 'all' || endpoint.status === statusFilter;
            const matchesCategory = categoryFilter === 'all' || endpoint.category === categoryFilter;

            return matchesSearch && matchesStatus && matchesCategory;
        });
    }, [endpoints, search, statusFilter, categoryFilter]);

    const stats = useMemo(() => {
        const total = endpoints.length;
        const completed = endpoints.filter((e) => e.status === 'completed').length;
        const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
        return { total, completed, pending: total - completed, percentage };
    }, [endpoints]);

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-700 border-t-white" />
                    <p className="text-gray-400">Loading registry...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-4xl p-8">
                <div className="rounded-lg bg-red-900/50 p-6 border border-red-500/50 flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
                    <div>
                        <h3 className="text-red-200 font-medium text-lg">Failed to load registry</h3>
                        <p className="text-red-300 mt-1">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8">
            {/* Header & Stats */}
            <div className="mb-8 grid gap-6 md:grid-cols-4">
                <div className="md:col-span-2">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">API Documentation Tracker</h1>
                    <p className="text-gray-400">
                        Track the progress of OpenAPI specification generation and validation across the platform.
                    </p>
                </div>

                <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 col-span-2 md:col-span-1">
                    <div className="text-sm font-medium text-gray-400 mb-1">Overall Progress</div>
                    <div className="flex items-end gap-3">
                        <div className="text-3xl font-bold text-white">{stats.percentage}%</div>
                        <div className="text-sm text-gray-400 mb-1">{stats.completed} / {stats.total}</div>
                    </div>
                    <div className="mt-4 h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${stats.percentage}%` }}
                        />
                    </div>
                </div>

                <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 col-span-2 md:col-span-1 flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-gray-400">Completed</span>
                        <span className="text-lg font-medium text-green-400 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> {stats.completed}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Pending</span>
                        <span className="text-lg font-medium text-orange-400 flex items-center gap-1">
                            <CircleDashed className="w-4 h-4" /> {stats.pending}
                        </span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search endpoints..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-lg border border-gray-700 bg-gray-800/50 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="appearance-none rounded-lg border border-gray-700 bg-gray-800/50 py-2 pl-10 pr-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 max-w-[200px] truncate"
                        >
                            <option value="all">All Categories</option>
                            {categories.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="rounded-lg border border-gray-700 bg-gray-800/50 py-2 px-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="all">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-gray-800/50 text-xs uppercase text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-medium">Status</th>
                                <th scope="col" className="px-6 py-4 font-medium">Category / Subcategory</th>
                                <th scope="col" className="px-6 py-4 font-medium">Endpoint Title</th>
                                <th scope="col" className="px-6 py-4 font-medium">Spec File</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {filteredEndpoints.length > 0 ? (
                                filteredEndpoints.map((endpoint, i) => (
                                    <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            {endpoint.status === 'completed' ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-400">
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    Done
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-medium text-orange-400">
                                                    <CircleDashed className="h-3.5 w-3.5" />
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-300">{endpoint.category}</div>
                                            {endpoint.subcategory && (
                                                <div className="text-gray-500 text-xs mt-0.5">{endpoint.subcategory}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-white font-medium">
                                            {endpoint.title}
                                        </td>
                                        <td className="px-6 py-4">
                                            {endpoint.specFile ? (
                                                <div className="flex items-center gap-2 text-blue-400">
                                                    <FileJson className="h-4 w-4" />
                                                    <span className="text-xs font-mono">{endpoint.specFile}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-600">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <Search className="h-8 w-8 text-gray-600 mb-3" />
                                            <p className="text-gray-400 font-medium text-lg">No endpoints found</p>
                                            <p className="text-gray-500 mt-1">Try adjusting your filters or search query.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="mt-4 text-center text-sm text-gray-500">
                Showing {filteredEndpoints.length} of {endpoints.length} endpoints
            </div>
        </div>
    );
}
