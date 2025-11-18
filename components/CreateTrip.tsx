
import React, { useState } from 'react';
import { AgendaIcon, LocationMarkerIcon, InformationCircleIcon, PlusIcon, TrashIcon, PencilIcon, ClockIcon, ChevronDownIcon, CheckIcon, UploadIcon, RestaurantIcon, FlightIcon, HotelIcon, HangerIcon, DocumentIcon, FormIcon } from './icons';
import { UsefulInfoEntry } from './UsefulInformations';
import { TermsDocument } from './TermsConditions';
import { PrivacyDocument } from './PrivacyPolicy';
import { Contact } from './AddContactModal';
import { Form } from './Forms';

interface CreateTripProps {
    onCancel: () => void;
    onSave: () => void;
    isEditing?: boolean;
    usefulInformations: UsefulInfoEntry[];
    termsDocuments: TermsDocument[];
    privacyDocuments: PrivacyDocument[];
    contacts: Contact[];
    forms: Form[];
}

const Section: React.FC<{ title: string; children: React.ReactNode; actions?: React.ReactNode; isOpen: boolean; onClick: () => void; }> = ({ title, children, actions, isOpen, onClick }) => (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <button
            type="button"
            onClick={onClick}
            className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition-colors"
            aria-expanded={isOpen}
        >
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <div className="flex items-center space-x-4">
                {actions && <div onClick={(e) => e.stopPropagation()}>{actions}</div>}
                <ChevronDownIcon className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
        </button>
        <div
            className={`transition-[max-height,opacity] duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[9999px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
            <div className="p-6 pt-0">
                {children}
            </div>
        </div>
    </div>
);


const FormField: React.FC<{ label: string; required?: boolean; children: React.ReactNode; className?: string }> = ({ label, required, children, className }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
    </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input 
        {...props}
        className={`w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${props.className || ''}`}
    />
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea 
        {...props}
        rows={4}
        className={`w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${props.className || ''}`}
    />
);

const IconButton: React.FC<{ icon: React.ReactNode; onClick?: () => void, className?: string }> = ({ icon, onClick, className }) => (
    <button type="button" onClick={onClick} className={`text-gray-500 hover:text-gray-700 ${className}`}>{icon}</button>
);


const iconOptions = [
    { name: 'flight', label: 'Flight', icon: <FlightIcon className="w-5 h-5" /> },
    { name: 'hotel', label: 'Hotel', icon: <HotelIcon className="w-5 h-5" /> },
    { name: 'event', label: 'Event', icon: <AgendaIcon className="w-5 h-5" /> },
    { name: 'info', label: 'Info', icon: <InformationCircleIcon className="w-5 h-5" /> },
];

const IconSelect: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState<{ name: string; label: string; icon: React.ReactNode } | null>(null);

    const displayIcon = selectedIcon ? selectedIcon.icon : <span className="w-5 h-5" />;
    const displayLabel = selectedIcon ? selectedIcon.label : '-- Seleziona Icona --';

    return (
        <div className="relative">
            <button
                type="button"
                className="w-full bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition flex items-center px-3 py-2 text-left"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="mr-2 text-gray-500">{displayIcon}</span>
                <span className={`flex-1 text-sm ${!selectedIcon ? 'text-gray-400' : ''}`}>{displayLabel}</span>
                <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg border border-gray-200 rounded-lg">
                    <ul className="py-1 max-h-48 overflow-y-auto">
                        {iconOptions.map((option) => (
                            <li
                                key={option.name}
                                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center"
                                onClick={() => {
                                    setSelectedIcon(option);
                                    setIsOpen(false);
                                }}
                            >
                                <span className="mr-2 text-gray-500">{option.icon}</span>
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const detailIconOptions = [
    { name: 'info', label: 'Informazione', icon: <InformationCircleIcon className="w-5 h-5" /> },
    { name: 'dress-code', label: 'Dress Code', icon: <HangerIcon className="w-5 h-5" /> },
    { name: 'address', label: 'Indirizzo', icon: <LocationMarkerIcon className="w-5 h-5" /> },
    { name: 'restaurant', label: 'Restaurant', icon: <RestaurantIcon className="w-5 h-5" /> },
    { name: 'flight', label: 'Flight', icon: <FlightIcon className="w-5 h-5" /> },
    { name: 'hotel', label: 'Hotel', icon: <HotelIcon className="w-5 h-5" /> },
    { name: 'event', label: 'Event', icon: <AgendaIcon className="w-5 h-5" /> },
    { name: 'clock', label: 'Time', icon: <ClockIcon className="w-5 h-5" /> },
] as const;

type AdditionalDetailType = typeof detailIconOptions[number]['name'];

type AdditionalDetail = {
  id: number;
  type: AdditionalDetailType | null;
  value: string;
};

const DetailIconSelect: React.FC<{
    value: AdditionalDetailType | null;
    onChange: (value: AdditionalDetailType) => void;
}> = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = value ? detailIconOptions.find(o => o.name === value) : null;

    const displayIcon = selectedOption ? selectedOption.icon : <span className="w-5 h-5" />;
    const displayLabel = selectedOption ? selectedOption.label : '-- Seleziona Icona --';

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition flex items-center px-3 py-2 text-left"
                style={{ width: '160px' }}
            >
                <span className="mr-2 text-gray-500">{displayIcon}</span>
                <span className={`flex-1 text-sm truncate ${!selectedOption ? 'text-gray-400' : ''}`}>{displayLabel}</span>
                <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ml-2 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg border border-gray-200 rounded-lg">
                    <ul className="py-1 max-h-48 overflow-y-auto">
                        {detailIconOptions.map((option) => (
                            <li
                                key={option.name}
                                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center"
                                onClick={() => {
                                    onChange(option.name);
                                    setIsOpen(false);
                                }}
                            >
                                <span className="mr-2 text-gray-500">{option.icon}</span>
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const ImageUrlInput: React.FC<{
    label: string;
}> = ({ label }) => {
    return (
        <FormField label={label}>
            <div className="relative flex items-center">
                <Input 
                    type="text"
                    placeholder="Incolla l'URL dell'immagine"
                    className="pr-12 w-full"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm font-medium text-gray-500 pointer-events-none">
                    URL
                </span>
            </div>
        </FormField>
    );
};

const CreateTrip: React.FC<CreateTripProps> = ({ onCancel, onSave, isEditing = false, usefulInformations, termsDocuments, privacyDocuments, contacts, forms }) => {
    const [openSections, setOpenSections] = useState<number[]>([1]);
    const [activeFlightTab, setActiveFlightTab] = useState('andata');
    const [allowCompanion, setAllowCompanion] = useState<'yes' | 'no'>('no');
    const [businessFlights, setBusinessFlights] = useState<'yes' | 'no'>('no');
    
    const [additionalDetails, setAdditionalDetails] = useState<AdditionalDetail[]>([
        { id: 1, type: null, value: 'Please bring sunscreen, a hat, and swimwear. Towels and snorkeling gear will be provided.' },
        { id: 2, type: null, value: 'Smart Casual' },
        { id: 3, type: null, value: 'Via della Conciliazione, 4' },
    ]);

    const [tripContacts, setTripContacts] = useState<{id: number, groupId: string, contactId: string}[]>([
        { id: Date.now(), groupId: '', contactId: '' }
    ]);
    
    const handleToggleSection = (index: number) => {
        setOpenSections(prev => 
            prev.includes(index) 
                ? prev.filter(i => i !== index) 
                : [...prev, index]
        );
    };

    const handleAddDetail = () => {
        setAdditionalDetails(prev => [...prev, { id: Date.now(), type: null, value: '' }]);
    };

    const handleRemoveDetail = (id: number) => {
        setAdditionalDetails(prev => prev.filter(detail => detail.id !== id));
    };

    const handleDetailValueChange = (id: number, value: string) => {
        setAdditionalDetails(prev => prev.map(d => d.id === id ? { ...d, value } : d));
    };
    
    const handleDetailTypeChange = (id: number, type: AdditionalDetailType) => {
        setAdditionalDetails(prev => prev.map(d => d.id === id ? { ...d, type } : d));
    };

    const handleAddTripContact = () => {
        setTripContacts(prev => [...prev, { id: Date.now(), groupId: '', contactId: '' }]);
    };

    const handleRemoveTripContact = (id: number) => {
        setTripContacts(prev => prev.filter(c => c.id !== id));
    };

    const handleTripContactChange = (id: number, field: 'groupId' | 'contactId', value: string) => {
        setTripContacts(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
    };


    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">{isEditing ? 'Modifica Viaggio' : 'Crea Nuovo Viaggio'}</h1>
                <p className="text-gray-500 mt-1">Compila le sezioni per creare o modificare il viaggio.</p>
            </header>

            <div className="space-y-4">
                {/* Sezione 1: Informazioni Base */}
                <Section 
                    title="Sezione 1: Informazioni Base del Viaggio"
                    isOpen={openSections.includes(1)}
                    onClick={() => handleToggleSection(1)}
                    actions={
                        <button 
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!openSections.includes(1)) handleToggleSection(1);
                            }}
                            className="text-sm font-semibold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center"
                        >
                            <PencilIcon className="w-4 h-4 mr-1.5" /> Modifica
                        </button>
                    }
                >
                    <div className="space-y-6">
                        <FormField label="Nome Cliente" required>
                            <Input placeholder="e.g. Azienda S.p.A." />
                        </FormField>
                        <FormField label="Nome del Viaggio" required>
                            <Input placeholder="e.g. Sales Kick-off 2024" />
                        </FormField>
                        <FormField label="Sottotitolo del Viaggio" required>
                            <Input placeholder="e.g. President's Club" />
                        </FormField>
                        <FormField label="Descrizione">
                            <Textarea placeholder="Descrivi brevemente lo scopo e i punti salienti del viaggio." />
                        </FormField>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField label="Data di Inizio" required>
                                <div className="relative">
                                    <AgendaIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"/>
                                    <Input type="text" placeholder="Seleziona una data" className="pl-10"/>
                                </div>
                            </FormField>
                            <FormField label="Data di Fine" required>
                                <div className="relative">
                                    <AgendaIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"/>
                                    <Input type="text" placeholder="Seleziona una data" className="pl-10"/>
                                </div>
                            </FormField>
                            <FormField label="Scadenza Registrazione" required>
                                <div className="relative">
                                    <AgendaIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"/>
                                    <Input type="text" placeholder="Seleziona una data" className="pl-10"/>
                                </div>
                            </FormField>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <FormField label="Useful Informations">
                                <div className="relative">
                                    <InformationCircleIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
                                    <select
                                        defaultValue=""
                                        className="w-full pl-10 pr-8 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none"
                                    >
                                        <option value="" disabled>-- Seleziona --</option>
                                        {usefulInformations.map(info => (
                                            <option key={info.id} value={info.destinationName}>{info.destinationName}</option>
                                        ))}
                                    </select>
                                    <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
                                </div>
                            </FormField>
                             <FormField label="Privacy Policy">
                                <div className="relative">
                                    <DocumentIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
                                    <select
                                        defaultValue=""
                                        className="w-full pl-10 pr-8 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none"
                                    >
                                        <option value="" disabled>-- Seleziona --</option>
                                        {privacyDocuments.map(doc => (
                                            <option key={doc.id} value={doc.title}>{doc.title}</option>
                                        ))}
                                    </select>
                                    <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
                                </div>
                            </FormField>
                             <FormField label="Terms & Conditions">
                                <div className="relative">
                                    <DocumentIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
                                    <select
                                        defaultValue=""
                                        className="w-full pl-10 pr-8 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none"
                                    >
                                        <option value="" disabled>-- Seleziona --</option>
                                        {termsDocuments.map(doc => (
                                            <option key={doc.id} value={doc.title}>{doc.title}</option>
                                        ))}
                                    </select>
                                    <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
                                </div>
                            </FormField>
                            <FormField label="Form di Registrazione">
                                <div className="relative">
                                    <FormIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
                                    <select
                                        defaultValue=""
                                        className="w-full pl-10 pr-8 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none"
                                    >
                                        <option value="" disabled>-- Seleziona --</option>
                                        {forms.map(form => (
                                            <option key={form.id} value={form.id}>{form.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
                                </div>
                            </FormField>
                        </div>
                        <FormField label="Gruppi">
                            <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-800">
                                    Milano
                                    <button type="button" className="ml-1.5 flex-shrink-0 text-gray-500 hover:text-gray-700">
                                        <svg className="h-3 w-3" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                            <path strokeLinecap="round" strokeWidth="1.2" d="M1 1l6 6m0-6L1 7" />
                                        </svg>
                                    </button>
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-800">
                                    Roma
                                    <button type="button" className="ml-1.5 flex-shrink-0 text-gray-500 hover:text-gray-700">
                                        <svg className="h-3 w-3" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                            <path strokeLinecap="round" strokeWidth="1.2" d="M1 1l6 6m0-6L1 7" />
                                        </svg>
                                    </button>
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-800">
                                    Venezia
                                    <button type="button" className="ml-1.5 flex-shrink-0 text-gray-500 hover:text-gray-700">
                                        <svg className="h-3 w-3" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                            <path strokeLinecap="round" strokeWidth="1.2" d="M1 1l6 6m0-6L1 7" />
                                        </svg>
                                    </button>
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-200 text-amber-800">
                                    Vip
                                    <button type="button" className="ml-1.5 flex-shrink-0 text-amber-600 hover:text-amber-800">
                                        <svg className="h-3 w-3" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                            <path strokeLinecap="round" strokeWidth="1.2" d="M1 1l6 6m0-6L1 7" />
                                        </svg>
                                    </button>
                                </span>
                                <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded-lg transition-colors">
                                    <PlusIcon className="w-4 h-4 mr-1" /> Aggiungi Gruppo
                                </button>
                            </div>
                        </FormField>
                        <FormField label="Aggiungi accompagnatore">
                            <div className="flex items-center space-x-6 pt-1">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="companion" 
                                        value="yes"
                                        checked={allowCompanion === 'yes'}
                                        onChange={() => setAllowCompanion('yes')}
                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">Sì</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="companion" 
                                        value="no" 
                                        checked={allowCompanion === 'no'}
                                        onChange={() => setAllowCompanion('no')}
                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">No</span>
                                </label>
                            </div>
                        </FormField>
                        <FormField label="Voli Business">
                            <div className="flex items-center space-x-6 pt-1">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="businessFlights" 
                                        value="yes"
                                        checked={businessFlights === 'yes'}
                                        onChange={() => setBusinessFlights('yes')}
                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">Sì</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="businessFlights" 
                                        value="no" 
                                        checked={businessFlights === 'no'}
                                        onChange={() => setBusinessFlights('no')}
                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">No</span>
                                </label>
                            </div>
                        </FormField>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ImageUrlInput 
                                label="Immagine del Viaggio" 
                            />
                            <ImageUrlInput 
                                label="Logo del Viaggio" 
                            />
                        </div>
                    </div>
                </Section>

                {/* Sezione 2: Dettagli Voli e Trasporti */}
                <Section 
                    title="Sezione 2: Dettagli Voli e Trasporti"
                    isOpen={openSections.includes(2)}
                    onClick={() => handleToggleSection(2)}
                >
                    <div>
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                                <button
                                    onClick={() => setActiveFlightTab('andata')}
                                    className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                                        activeFlightTab === 'andata'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Voli di Andata
                                </button>
                                <button
                                    onClick={() => setActiveFlightTab('ritorno')}
                                    className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                                        activeFlightTab === 'ritorno'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Voli di Ritorno
                                </button>
                            </nav>
                        </div>
                        <div className="pt-6">
                            {activeFlightTab === 'andata' ? (
                                <div>
                                    <FormField label="Titolo (Voli di Andata)" className="mb-6">
                                        <Input placeholder="e.g. Voli Gruppo Milano" />
                                    </FormField>
                                    <FormField label="Note Importanti (Voli di Andata)" className="mb-6">
                                        <Textarea 
                                            rows={2} 
                                            defaultValue="Si prega di arrivare in aeroporto almeno 3 ore prima della partenza del volo. I banchi check-in chiudono 60 minuti prima del decollo."
                                            placeholder="Aggiungi note o informazioni importanti per i voli di andata."
                                        />
                                    </FormField>
                                    <div className="space-y-4">
                                        <div className="relative p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                                <FormField label="Gruppo Partenza">
                                                    <div className="relative">
                                                        <select defaultValue="" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none pr-8">
                                                            <option value="" disabled>-- Seleziona Gruppo --</option>
                                                            <option>Milano</option>
                                                            <option>Roma</option>
                                                            <option>Venezia</option>
                                                            <option>Vip</option>
                                                        </select>
                                                        <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
                                                    </div>
                                                </FormField>
                                                <FormField label="Compagnia Aerea">
                                                    <Input placeholder="e.g. Emirates" />
                                                </FormField>
                                                <FormField label="Codice Volo">
                                                    <Input placeholder="e.g. EK206" />
                                                </FormField>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                                <FormField label="Aeroporto Partenza">
                                                    <Input placeholder="e.g. MXP" />
                                                </FormField>
                                                <FormField label="Orario Partenza">
                                                    <Input type="time" />
                                                </FormField>
                                                <FormField label="Data Partenza">
                                                    <Input type="date" />
                                                </FormField>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <FormField label="Aeroporto Arrivo">
                                                    <Input placeholder="e.g. DXB" />
                                                </FormField>
                                                <FormField label="Orario Arrivo">
                                                    <Input type="time" />
                                                </FormField>
                                                <FormField label="Data Arrivo">
                                                    <Input type="date" />
                                                </FormField>
                                            </div>
                                            <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-medium hover:border-blue-500 hover:text-blue-600 transition-colors flex justify-center items-center">
                                            <PlusIcon className="w-5 h-5 mr-2" /> Aggiungi Volo
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <FormField label="Titolo (Voli di Ritorno)" className="mb-6">
                                        <Input placeholder="e.g. Rientro in Italia" />
                                    </FormField>
                                    <FormField label="Note Importanti (Voli di Ritorno)" className="mb-6">
                                        <Textarea 
                                            rows={2} 
                                            defaultValue="Si ricorda di effettuare il check-out in hotel entro le ore 10:00."
                                            placeholder="Aggiungi note o informazioni importanti per i voli di ritorno."
                                        />
                                    </FormField>
                                    <div className="space-y-4">
                                         <div className="relative p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                                <FormField label="Gruppo Ritorno">
                                                    <div className="relative">
                                                        <select defaultValue="" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none pr-8">
                                                            <option value="" disabled>-- Seleziona Gruppo --</option>
                                                            <option>Milano</option>
                                                            <option>Roma</option>
                                                            <option>Venezia</option>
                                                            <option>Vip</option>
                                                        </select>
                                                        <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
                                                    </div>
                                                </FormField>
                                                <FormField label="Compagnia Aerea">
                                                    <Input placeholder="e.g. Emirates" />
                                                </FormField>
                                                <FormField label="Codice Volo">
                                                    <Input placeholder="e.g. EK205" />
                                                </FormField>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                                <FormField label="Aeroporto Partenza">
                                                    <Input placeholder="e.g. DXB" />
                                                </FormField>
                                                <FormField label="Orario Partenza">
                                                    <Input type="time" />
                                                </FormField>
                                                <FormField label="Data Partenza">
                                                    <Input type="date" />
                                                </FormField>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <FormField label="Aeroporto Arrivo">
                                                    <Input placeholder="e.g. MXP" />
                                                </FormField>
                                                <FormField label="Orario Arrivo">
                                                    <Input type="time" />
                                                </FormField>
                                                <FormField label="Data Arrivo">
                                                    <Input type="date" />
                                                </FormField>
                                            </div>
                                            <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-medium hover:border-blue-500 hover:text-blue-600 transition-colors flex justify-center items-center">
                                            <PlusIcon className="w-5 h-5 mr-2" /> Aggiungi Volo
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Section>

                {/* Sezione 3: Dettagli Aggiuntivi */}
                <Section 
                    title="Sezione 3: Dettagli Aggiuntivi (Agenda & Hotel)"
                    isOpen={openSections.includes(3)}
                    onClick={() => handleToggleSection(3)}
                >
                   <div className="space-y-4">
                        {additionalDetails.map((detail) => (
                            <div key={detail.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg bg-gray-50/50 relative group">
                                <div className="flex-shrink-0 pt-1">
                                    <DetailIconSelect 
                                        value={detail.type} 
                                        onChange={(newType) => handleDetailTypeChange(detail.id, newType)} 
                                    />
                                </div>
                                <div className="flex-grow">
                                    <Textarea 
                                        rows={2} 
                                        placeholder="Inserisci i dettagli qui..." 
                                        value={detail.value}
                                        onChange={(e) => handleDetailValueChange(detail.id, e.target.value)}
                                        className="bg-white"
                                    />
                                </div>
                                <button 
                                    onClick={() => handleRemoveDetail(detail.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                        <button 
                            onClick={handleAddDetail}
                            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-medium hover:border-blue-500 hover:text-blue-600 transition-colors flex justify-center items-center"
                        >
                            <PlusIcon className="w-5 h-5 mr-2" /> Aggiungi Dettaglio
                        </button>
                   </div>
                </Section>

                 {/* Sezione 4: Contatti di Riferimento */}
                 <Section 
                    title="Sezione 4: Contatti di Riferimento"
                    isOpen={openSections.includes(4)}
                    onClick={() => handleToggleSection(4)}
                >
                     <div className="space-y-4">
                        <p className="text-sm text-gray-600 mb-4">Seleziona i contatti da mostrare nell'app per ogni gruppo.</p>
                        {tripContacts.map((tripContact) => (
                            <div key={tripContact.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Gruppo</label>
                                    <div className="relative">
                                        <select 
                                            value={tripContact.groupId}
                                            onChange={(e) => handleTripContactChange(tripContact.id, 'groupId', e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none"
                                        >
                                            <option value="" disabled>Seleziona Gruppo</option>
                                            <option value="all">Tutti i Gruppi</option>
                                            <option value="milano">Milano</option>
                                            <option value="roma">Roma</option>
                                            <option value="venezia">Venezia</option>
                                            <option value="vip">Vip</option>
                                        </select>
                                        <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Contatto</label>
                                     <div className="relative">
                                        <select 
                                            value={tripContact.contactId}
                                            onChange={(e) => handleTripContactChange(tripContact.id, 'contactId', e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none"
                                        >
                                            <option value="" disabled>Seleziona Contatto</option>
                                            {contacts.map(contact => (
                                                <option key={contact.id} value={contact.id}>{contact.name} ({contact.category})</option>
                                            ))}
                                        </select>
                                        <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
                                    </div>
                                </div>
                                <div className="pt-5">
                                     <button 
                                        onClick={() => handleRemoveTripContact(tripContact.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                         <button 
                            onClick={handleAddTripContact}
                            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-medium hover:border-blue-500 hover:text-blue-600 transition-colors flex justify-center items-center"
                        >
                            <PlusIcon className="w-5 h-5 mr-2" /> Aggiungi Contatto al Viaggio
                        </button>
                     </div>
                </Section>
            </div>

            <footer className="mt-12 pt-6 border-t border-gray-200 flex justify-end items-center space-x-4">
                <button 
                    onClick={onCancel}
                    className="bg-gray-200 text-gray-800 font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-300 transition-colors">
                    Annulla
                </button>
                <button 
                    onClick={onSave}
                    className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
                    Salva Viaggio
                </button>
            </footer>
        </div>
    );
};

export default CreateTrip;
