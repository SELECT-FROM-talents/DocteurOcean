// src/components/DreamWorld/PLASTIC_WASTE/Dialogue.tsx
import React from 'react';

interface DialogueProps {
    doctorDialogue: string[];
    patientDialogue: string[];
    onDialogueEnd: () => void;
}

const Dialogue: React.FC<DialogueProps> = ({ doctorDialogue, patientDialogue, onDialogueEnd }) => {
    const [currentDialogue, setCurrentDialogue] = React.useState(0);

    const handleNextDialogue = () => {
        if (currentDialogue < doctorDialogue.length + patientDialogue.length - 1) {
            setCurrentDialogue(currentDialogue + 1);
        } else {
            onDialogueEnd();
        }
    };

    const isDoctorSpeaking = currentDialogue % 2 === 0;
    const dialogueText = isDoctorSpeaking ? doctorDialogue[Math.floor(currentDialogue / 2)] : patientDialogue[Math.floor(currentDialogue / 2)];

    return (
        <div className="dialogue">
            <p>{dialogueText}</p>
            <button onClick={handleNextDialogue}>Next</button>
        </div>
    );
};

export default Dialogue;