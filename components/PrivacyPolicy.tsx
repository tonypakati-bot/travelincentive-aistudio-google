import React, { useState, useRef } from 'react';

const privacyText = `CONSENSO AL TRATTAMENTO DEI DATI PERSONALI FORNITI
Preso atto della specifica informativa di cui all’art. 10 della legge n. 675/96 e del seguente decreto legislativo n. 467 del 28 dicembre 2001, acconsento, al trattamento e alla comunicazione dei miei dati personali, forniti con il modulo di adesione al viaggio, a opera dei soggetti indicati nella predetta informativa e nei limiti di cui alla stessa, vale a dire in funzione di una corretta gestione delle finalità indicate nell’informativa stessa.

Rimane fermo che tale consenso è condizionato al rispetto delle disposizioni della vigente normativa.

Acconsento, inoltre, alla pubblicazione delle immagini sul sito web dell’organizzatore www.sararossoincentive.com per utilizzarle, senza fini di lucro, come documentazione del viaggio svolto. L'utilizzo delle immagini è da considerarsi effettuato in forma del tutto gratuita.

Il partecipante al viaggio prende atto e riconosce che [NOME CLIENTE] e la società organizzativa SaraRosso Incentive Sa, non saranno in alcun modo responsabili per danni di ogni genere che il partecipante dovesse subire o causare per qualsivoglia ragione, in occasione del viaggio.`;

// Function to convert plain text to structured HTML
const createInitialHtml = (text: string): string => {
    const textWithLink = text.replace(
        'www.sararossoincentive.com',
        '<a href="http://www.sararossoincentive.com" target="_blank" rel="noopener noreferrer">www.sararossoincentive.com</a>'
    );
    // Use paragraphs for blocks separated by double newlines
    return textWithLink.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br />')}</p>`).join('');
};

const FormatButton: React.FC<{ command: string, title: string, children: React.ReactNode, applyFormat: (command: string) => void }> = ({ command, title, children, applyFormat }) => (
    <button 
        type="button" 
        onMouseDown={(e) => e.preventDefault()} // Prevent editor from losing focus
        onClick={() => applyFormat(command)} 
        className="p-2 rounded hover:bg-gray-200" 
        title={title}
    >
        {children}
    </button>
);

const Toolbar: React.FC<{ editorRef: React.RefObject<HTMLDivElement> }> = ({ editorRef }) => {
    const applyFormat = (command: string, value: string | null = null) => {
        if(editorRef.current) editorRef.current.focus();
        document.execCommand(command, false, value);
    };

    return (
        <div className="flex items-center space-x-1 p-2 bg-gray-100 border border-b-0 border-gray-300 rounded-t-lg">
            <FormatButton command="bold" title="Bold" applyFormat={applyFormat}><strong className="font-bold w-5 text-center">B</strong></FormatButton>
            <FormatButton command="italic" title="Italic" applyFormat={applyFormat}><em className="italic w-5 text-center">I</em></FormatButton>
            <FormatButton command="underline" title="Underline" applyFormat={applyFormat}><u className="underline w-5 text-center">U</u></FormatButton>
            <span className="w-px h-5 bg-gray-300 mx-2"></span>
            <FormatButton command="insertUnorderedList" title="Bulleted List" applyFormat={applyFormat}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
            </FormatButton>
             <FormatButton command="insertOrderedList" title="Numbered List" applyFormat={applyFormat}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 3a1 1 0 00-1 1v1.333H5.333a1 1 0 100 1.334h3.667v1.333H5.333a1 1 0 100 1.334h3.667v1.333H5.333a1 1 0 100 1.334H9V16a1 1 0 102 0v-1.333h3.667a1 1 0 100-1.334h-3.667v-1.333h3.667a1 1 0 100-1.334h-3.667V8.667h3.667a1 1 0 100-1.334H11V4a1 1 0 00-1-1z" clipRule="evenodd" fillRule="evenodd"></path></svg>
            </FormatButton>
        </div>
    );
};

const PrivacyPolicy: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [policyHtml, setPolicyHtml] = useState(createInitialHtml(privacyText));
    const editorRef = useRef<HTMLDivElement>(null);

    const handleSave = () => {
        if (editorRef.current) {
            setPolicyHtml(editorRef.current.innerHTML);
        }
        setIsEditing(false);
    };

    const commonEditorClasses = `w-full p-4 text-gray-800 leading-relaxed 
        [&_p]:mb-4 
        [&_a]:text-blue-600 [&_a:hover]:underline
        [&_ul]:list-disc [&_ul]:pl-8
        [&_ol]:list-decimal [&_ol]:pl-8
        `;

    return (
    <div className="p-8">
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Privacy Policy</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-8">
            {isEditing ? (
                <div>
                    <Toolbar editorRef={editorRef} />
                    <div
                        ref={editorRef}
                        contentEditable={true}
                        dangerouslySetInnerHTML={{ __html: policyHtml }}
                        className={`${commonEditorClasses} border border-blue-300 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white min-h-[300px]`}
                        aria-label="Privacy Policy text editor"
                    />
                </div>
            ) : (
                <div 
                    className={`${commonEditorClasses} border border-gray-200 rounded-lg bg-gray-50`}
                    dangerouslySetInnerHTML={{ __html: policyHtml }}
                />
            )}
            <div className="mt-6 flex justify-end">
                {isEditing ? (
                    <button 
                        onClick={handleSave}
                        className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
                        Salva Modifiche
                    </button>
                ) : (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
                        Modifica
                    </button>
                )}
            </div>
        </div>
    </div>
    );
};

export default PrivacyPolicy;