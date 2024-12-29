import React, { useRef, useEffect } from 'react';
import Cleave from 'cleave.js/react';
import styles from './BOInput.module.css';

function BOInput({ boNumber, setBoNumber, version, setVersion }) {
    const inputRef = useRef(null);

    const handleBoInput = (e) => {
        let value = e.target.rawValue.toUpperCase();

        // Extrai apenas letras das duas primeiras posições
        const letters = value.slice(0, 2).replace(/[^A-Z]/g, '');

        // Extrai apenas números das quatro últimas posições
        const numbers = value.slice(2).replace(/[^0-9]/g, '').slice(0, 4);

        // Combina letras e números
        const formattedValue = letters + numbers;

        setBoNumber(formattedValue);
    };

    const handleKeyDown = (e) => {
        const input = inputRef.current.element;
        const cursorPosition = input.selectionStart;

        // Permite apenas letras nas duas primeiras posições
        if (cursorPosition < 2 && !/[A-Za-z]/.test(e.key)) {
            if (!['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                e.preventDefault();
            }
        }

        // Permite apenas números nas quatro últimas posições
        if (cursorPosition >= 2 && cursorPosition < 6 && !/[0-9]/.test(e.key)) {
            if (!['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                e.preventDefault();
            }
        }

        // Remove a restrição de Backspace após o sexto caractere
        if (cursorPosition > 6 && !['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
            e.preventDefault();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedText = (e.clipboardData || window.clipboardData).getData('text');
        const letters = pastedText.slice(0, 2).toUpperCase().replace(/[^A-Z]/g, '');
        const numbers = pastedText.slice(2).replace(/[^0-9]/g, '').slice(0, 4);
        const formattedText = letters + numbers;
        setBoNumber(formattedText);
    };

    useEffect(() => {
        const input = inputRef.current?.element;
        if (input) {
            input.addEventListener('paste', handlePaste);
            return () => {
                input.removeEventListener('paste', handlePaste);
            };
        }
    }, []);

    return (
        <div className={styles.boInputContainer}>
            <div className={styles.inputWithSuffix}>
                <Cleave
                    options={{
                        blocks: [6],
                        uppercase: true,
                        numericOnly: false,
                        delimiterLazyShow: true,
                    }}
                    value={boNumber || ""}
                    onChange={handleBoInput}
                    onKeyDown={handleKeyDown}
                    className={styles.boInput}
                    placeholder="AB1234"
                    title="Formato: LLNNNN/2025"
                    autoComplete="off"
                    spellCheck="false"
                    ref={inputRef}
                    maxLength={6}
                />
                <span className={styles.fixedSuffix}>/2025</span>
            </div>

            <select
                className={styles.versionSelect}
                value={version || "Versão 1"}
                onChange={(e) => setVersion(e.target.value)}
            >
                {[...Array(10)].map((_, i) => (
                    <option key={i} value={`Versão ${i + 1}`}>
                        Versão {i + 1}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default BOInput;