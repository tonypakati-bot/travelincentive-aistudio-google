import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Trip from './components/Trip';
import CreateTrip from './components/CreateTrip';
import Communications from './components/Communications';
import CreateCommunication from './components/CreateCommunication';
import Forms from './components/Forms';
import CreateForm from './components/CreateForm';
import ManageParticipants from './components/ManageParticipants';
import Reports from './components/Reports';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsConditions, { initialDocuments, TermsDocument } from './components/TermsConditions';
import SendReminderModal from './components/SendReminderModal';
import SendInvitesModal from './components/SendInvitesModal';
import Documents from './components/Documents';
import UsefulInformations, { initialInformations, UsefulInfoEntry } from './components/UsefulInformations';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [tripFormMode, setTripFormMode] = useState<'hidden' | 'create' | 'edit'>('hidden');
  const [isCommFormVisible, setIsCommFormVisible] = useState(false);
  const [formFormMode, setFormFormMode] = useState<'hidden' | 'create' | 'edit'>('hidden');
  const [commInitialType, setCommInitialType] = useState<'information' | 'alert' | undefined>(undefined);

  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [reminderParticipantCount, setReminderParticipantCount] = useState(0);
  const [onReminderSentCallback, setOnReminderSentCallback] = useState<(() => void) | null>(null);

  const [isInvitesModalOpen, setIsInvitesModalOpen] = useState(false);
  const [invitesModalData, setInvitesModalData] = useState<{ tripName: string; inviteeCount: number } | null>(null);
  
  const [usefulInformations, setUsefulInformations] = useState<UsefulInfoEntry[]>(initialInformations);
  const [termsDocuments, setTermsDocuments] = useState<TermsDocument[]>(initialDocuments);


  // Trip form handlers
  const handleCreateTrip = () => setTripFormMode('create');
  const handleEditTrip = () => setTripFormMode('edit');
  const handleCloseTripForm = () => setTripFormMode('hidden');
  const handleSaveTripForm = () => {
    // Logic to save the new/edited trip would go here
    setTripFormMode('hidden');
  };

  // Communication form handlers
  const handleCreateCommunication = (initialType?: 'information' | 'alert') => {
    setCommInitialType(initialType);
    setIsCommFormVisible(true);
  };
  const handleCloseCommForm = () => {
    setIsCommFormVisible(false);
    setCommInitialType(undefined);
  };
  const handleSaveCommForm = () => {
    // Logic to save/send communication would go here
    setIsCommFormVisible(false);
    setCommInitialType(undefined);
  };
  
  // Form handlers
  const handleCreateForm = () => setFormFormMode('create');
  const handleCloseForm = () => setFormFormMode('hidden');
  const handleSaveForm = () => {
    // Logic to save form would go here
    setFormFormMode('hidden');
  };

  // Reminder modal handlers
  const handleOpenReminderModal = (count: number, onSent?: () => void) => {
    setReminderParticipantCount(count);
    if (onSent) {
      setOnReminderSentCallback(() => onSent);
    }
    setIsReminderModalOpen(true);
  };

  const handleCloseReminderModal = () => {
    setIsReminderModalOpen(false);
    setReminderParticipantCount(0);
    setOnReminderSentCallback(null);
  };

  const handleSendReminder = (subject: string, body: string) => {
    alert(`Invio del promemoria a ${reminderParticipantCount} partecipanti in corso...\n\nOggetto: ${subject}`);
    if (onReminderSentCallback) {
      onReminderSentCallback();
    }
    handleCloseReminderModal();
  };

  // Invites modal handlers
  const handleOpenInvitesModal = (tripName: string, inviteeCount: number) => {
    setInvitesModalData({ tripName, inviteeCount });
    setIsInvitesModalOpen(true);
  };

  const handleCloseInvitesModal = () => {
    setIsInvitesModalOpen(false);
    setInvitesModalData(null);
  };

  const handleConfirmSendInvites = (emailBody: string) => {
    if (invitesModalData) {
      alert(`Invio di ${invitesModalData.inviteeCount} inviti per "${invitesModalData.tripName}" in corso...`);
      console.log("Email body to be sent:", emailBody);
    }
    handleCloseInvitesModal();
  };


  const handleSetView = (view: string) => {
    setTripFormMode('hidden');
    setIsCommFormVisible(false); // Reset comm form on view change
    setFormFormMode('hidden'); // Reset form creator on view change
    setActiveView(view);
  };

  const renderContent = () => {
    if (tripFormMode !== 'hidden') {
      return <CreateTrip onCancel={handleCloseTripForm} onSave={handleSaveTripForm} isEditing={tripFormMode === 'edit'} usefulInformations={usefulInformations} termsDocuments={termsDocuments} />;
    }

    if (isCommFormVisible) {
      return <CreateCommunication onCancel={handleCloseCommForm} onSave={handleSaveCommForm} initialType={commInitialType} />;
    }

    if (formFormMode !== 'hidden') {
      return <CreateForm onCancel={handleCloseForm} onSave={handleSaveForm} />;
    }
    
    switch (activeView) {
      case 'dashboard':
        return <Dashboard onCreateTrip={handleCreateTrip} onCreateCommunication={handleCreateCommunication} onSendReminder={handleOpenReminderModal} onSendInvites={handleOpenInvitesModal} />;
      case 'manage-trip':
        return <Trip onCreateTrip={handleCreateTrip} onEditTrip={handleEditTrip} onCreateCommunication={handleCreateCommunication} />;
      case 'manage-participants':
        return <ManageParticipants onSendReminder={handleOpenReminderModal} />;
      case 'communications':
        return <Communications onCreateCommunication={handleCreateCommunication} />;
      case 'useful-informations':
        return <UsefulInformations informations={usefulInformations} setInformations={setUsefulInformations} />;
      case 'forms':
        return <Forms onCreateForm={handleCreateForm} />;
      case 'privacy-policy':
        return <PrivacyPolicy />;
      case 'terms-conditions':
        return <TermsConditions documents={termsDocuments} setDocuments={setTermsDocuments} />;
      case 'documents':
        return <Documents />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard onCreateTrip={handleCreateTrip} onCreateCommunication={handleCreateCommunication} onSendReminder={handleOpenReminderModal} onSendInvites={handleOpenInvitesModal} />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex">
      <Sidebar activeView={activeView} setActiveView={handleSetView} />
      <main className="flex-1 h-screen overflow-y-auto">
        {renderContent()}
      </main>
      <SendReminderModal
        isOpen={isReminderModalOpen}
        onClose={handleCloseReminderModal}
        onSend={handleSendReminder}
        participantCount={reminderParticipantCount}
      />
      <SendInvitesModal
        isOpen={isInvitesModalOpen}
        onClose={handleCloseInvitesModal}
        onSend={handleConfirmSendInvites}
        tripName={invitesModalData?.tripName || ''}
        inviteeCount={invitesModalData?.inviteeCount || 0}
      />
    </div>
  );
};

export default App;