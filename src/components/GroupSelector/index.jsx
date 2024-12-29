// src/components/GroupSelector/index.jsx

import React from 'react';
import styles from './GroupSelector.module.css';

function GroupSelector({ selectedGroup, setSelectedGroup }) {
    return (
        <div className={styles.groupSelector}>
            <label htmlFor="groupSelect">Selecione o Grupo:</label>
            <select
                id="groupSelect"
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className={styles.groupSelect}
            >
                <option value="Grupo 1">Grupo 1</option>
                <option value="Grupo 2">Grupo 2</option>
                <option value="Grupo 3">Grupo 3</option>
                <option value="Grupo 4">Grupo 4</option>
                <option value="Grupo 5">Grupo 5</option>
            </select>
        </div>
    );
}

export default GroupSelector;
