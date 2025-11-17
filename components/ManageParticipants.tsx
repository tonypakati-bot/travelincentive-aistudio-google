import React, { useState, useMemo, useEffect } from 'react';
import { SearchIcon, PencilIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon, UploadIcon, ChevronDownIcon, DownloadIcon } from './icons';

type ParticipantStatus = 'Registered' | 'Invited' | 'Incomplete';

type Participant = {
    id: number;
    name: string;
    email: string;
    trip: string;
    group: string;
    status: ParticipantStatus;
};

interface ManageParticipantsProps {
    onSendReminder: (count: number, onSent: () => void) => void;
}

const participants: Participant[] = [
    { id: 1, name: 'Giulia Rosa', email: 'g.rosa@example.com', trip: 'Trip to Ibiza', group: 'VIP', status: 'Invited' },
    { id: 2, name: 'Laura Bianchi', email: 'l.bianchi@example.com', trip: 'Trip to Ibiza', group: 'Roma', status: 'Invited' },
    { id: 3, name: 'Luca Azzurri', email: 'l.azzurri@example.com', trip: 'Team Retreat Mykonos', group: 'Tutti', status: 'Registered' },
    { id: 4, name: 'Marco Gialli', email: 'm.gialli@example.com', trip: 'Sales Kick-off Dubai', group: 'Milano', status: 'Registered' },
    { id: 5, name: 'Mario Rossi', email: 'm.rossi@example.com', trip: 'Trip to Ibiza', group: 'Milano', status: 'Registered' },
    { id: 6, name: 'Paolo Verdi', email: 'p.verdi@example.com', trip: 'Sales Kick-off Dubai', group: 'VIP', status: 'Invited' },
    { id: 7, name: 'Sara Neri', email: 's.neri@example.com', trip: 'Team Retreat Mykonos', group: 'Tutti', status: 'Incomplete' },
];


const getStatusBadge = (status: ParticipantStatus) => {
    switch (status) {
        case 'Registered':
            return 'bg-green-100 text-green-800';
        case 'Invited':
            return 'bg-blue-100 text-blue-800';
        case 'Incomplete':
            return 'bg-yellow-100 text-yellow-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const uniqueTrips = ['All Trips', ...Array.from(new Set(participants.map(p => p.trip)))];
const allStatuses: ParticipantStatus[] = ['Registered', 'Invited', 'Incomplete'];

const ManageParticipants: React.FC<ManageParticipantsProps> = ({ onSendReminder }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Participant; direction: 'ascending' | 'descending' } | null>({ key: 'name', direction: 'ascending' });
    const [tripFilter, setTripFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState<ParticipantStatus | 'all'>('all');
    const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);

    const headerCheckboxRef = React.useRef<HTMLInputElement>(null);

    const filteredAndSortedParticipants = useMemo(() => {
        let sortableItems = [...participants]
            .filter(p => tripFilter === 'all' || p.trip === tripFilter)
            .filter(p => statusFilter === 'all' || p.status === statusFilter)
            .filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.trip.toLowerCase().includes(searchTerm.toLowerCase())
            );

        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [searchTerm, sortConfig, tripFilter, statusFilter]);

    useEffect(() => {
        if (headerCheckboxRef.current) {
            const numVisible = filteredAndSortedParticipants.length;
            const numSelected = selectedParticipants.length;
            headerCheckboxRef.current.checked = numSelected === numVisible && numVisible > 0;
            headerCheckboxRef.current.indeterminate = numSelected > 0 && numSelected < numVisible;
        }
    }, [selectedParticipants, filteredAndSortedParticipants]);

    const requestSort = (key: keyof Participant) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (name: keyof Participant) => {
        if (!sortConfig || sortConfig.key !== name) {
            return <span className="inline-block w-4 h-4"></span>;
        }
        return sortConfig.direction === 'ascending' ? <ArrowUpIcon /> : <ArrowDownIcon />;
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedParticipants(filteredAndSortedParticipants.map(p => p.id));
        } else {
            setSelectedParticipants([]);
        }
    };

    const handleSelectOne = (id: number) => {
        setSelectedParticipants(prev =>
            prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
        );
    };

    const handleOpenReminderModal = () => {
        if (selectedParticipants.length > 0) {
            onSendReminder(selectedParticipants.length, () => setSelectedParticipants([]));
        }
    };

    const handleExport = () => {
        const participantsToExport = filteredAndSortedParticipants;
        if (participantsToExport.length === 0) {
            alert('No participants to export.');
            return;
        }

        const headers = ['ID', 'Name', 'Email', 'Trip', 'Group', 'Status'];
        const csvRows = [headers.join(',')];

        const escapeCsvCell = (cellData: string) => {
            if (/[",\n]/.test(cellData)) {
                return `"${cellData.replace(/"/g, '""')}"`;
            }
            return cellData;
        };

        participantsToExport.forEach(p => {
            const row = [
                p.id,
                p.name,
                p.email,
                p.trip,
                p.group,
                p.status,
            ].map(String).map(escapeCsvCell).join(',');
            csvRows.push(row);
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'participants.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };


    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Manage Participants</h1>
                <p className="text-gray-500 mt-1">View, add, and manage participants for all trips.</p>
            </div>

            <div className="mb-8">
                {selectedParticipants.length > 0 ? (
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-700">{selectedParticipants.length} partecipante/i selezionato/i</span>
                         <div className="flex items-center space-x-4">
                            <button 
                                onClick={handleOpenReminderModal}
                                className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                Invia Reminder
                            </button>
                            <button 
                                onClick={() => setSelectedParticipants([])}
                                className="bg-gray-200 text-gray-800 font-semibold px-5 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                                Annulla
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email.."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-72 border rounded-lg bg-white text-gray-900 placeholder-gray-500 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                            <div className="relative">
                                <select
                                    value={tripFilter}
                                    onChange={(e) => setTripFilter(e.target.value)}
                                    className="w-48 border border-gray-300 rounded-lg py-2 px-4 text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none pr-8"
                                >
                                    {uniqueTrips.map(trip => (
                                        <option key={trip} value={trip === 'All Trips' ? 'all' : trip}>
                                            {trip}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value as ParticipantStatus | 'all')}
                                    className="w-48 border border-gray-300 rounded-lg py-2 px-4 text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none pr-8"
                                >
                                    <option value="all">All Statuses</option>
                                    {allStatuses.map(status => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="bg-white text-gray-700 font-semibold px-5 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center border border-gray-300">
                                <UploadIcon className="w-5 h-5 mr-2" />
                                Import
                            </button>
                            <button 
                                onClick={handleExport}
                                className="bg-white text-gray-700 font-semibold px-5 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center border border-gray-300">
                                <DownloadIcon className="w-5 h-5 mr-2" />
                                Export
                            </button>
                            <button className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                Add Participant
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 w-12">
                                    <input 
                                        type="checkbox"
                                        ref={headerCheckboxRef}
                                        onChange={handleSelectAll}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    <button onClick={() => requestSort('name')} className="flex items-center hover:text-gray-900">
                                        Participant {getSortIcon('name')}
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    <button onClick={() => requestSort('trip')} className="flex items-center hover:text-gray-900">
                                        Trip {getSortIcon('trip')}
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    <button onClick={() => requestSort('group')} className="flex items-center hover:text-gray-900">
                                        Group {getSortIcon('group')}
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    <button onClick={() => requestSort('status')} className="flex items-center hover:text-gray-900">
                                        Status {getSortIcon('status')}
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-4 text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedParticipants.map((participant) => (
                                <tr key={participant.id} className={`bg-white border-b last:border-b-0 hover:bg-gray-50 ${selectedParticipants.includes(participant.id) ? 'bg-blue-50' : ''}`}>
                                    <td className="px-6 py-4">
                                        <input 
                                            type="checkbox"
                                            checked={selectedParticipants.includes(participant.id)}
                                            onChange={() => handleSelectOne(participant.id)}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </td>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">
                                                {participant.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-base font-semibold">{participant.name}</div>
                                                <div className="text-sm text-gray-500 font-normal">{participant.email}</div>
                                            </div>
                                        </div>
                                    </th>
                                    <td className="px-6 py-4">{participant.trip}</td>
                                    <td className="px-6 py-4">{participant.group}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadge(participant.status)}`}>
                                            {participant.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end space-x-3">
                                            <button className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md transition-colors hover:bg-gray-100" aria-label="Edit participant">
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 text-red-500 hover:text-red-700 rounded-md transition-colors hover:bg-red-100" aria-label="Delete participant">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageParticipants;