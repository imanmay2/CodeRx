import React, { useState } from 'react';
import styles from '../css/PresidentDashboard.module.css';

const PresidentDashboard = () => {
    const [clubMembers, setClubMembers] = useState([
        { id: 'm1', name: 'John Doe', email: 'john.doe@example.com', role: 'Member' },
        { id: 'm2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Secretary' },
        { id: 'm3', name: 'Peter Jones', email: 'peter.jones@example.com', role: 'Member' },
        { id: 'm4', name: 'Emily White', email: 'emily.white@example.com', role: 'Treasurer' },
    ]);

    const [newMemberRequestText, setNewMemberRequestText] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [selectedMember, setSelectedMember] = useState(null);

    const showMessageBox = (msg, type = 'success') => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => setMessage(''), 3000);
    };

    const handleAddMemberRequest = (e) => {
        e.preventDefault();
        if (!newMemberRequestText.trim()) {
            showMessageBox('Please enter member details to send request', 'error');
            return;
        }
        showMessageBox('Request sent to Admin for approval!', 'success');
        setNewMemberRequestText('');
    };

    const handleRoleChange = (id, newRole) => {
        setClubMembers(clubMembers.map(member =>
            member.id === id ? { ...member, role: newRole } : member
        ));
        showMessageBox('Member role updated', 'success');
        setSelectedMember(null);
    };

    const [inputText, setInputText] = useState('');
    const [formatHint, setFormatHint] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputText.trim()) {
            onSubmit('Please enter at least one member', 'error');
            return;
        }
        onSubmit(inputText, 'success');
        setInputText('');
    };

    return (
        <div className={styles.dashboard}>
            {/* Message Box */}
            {message && (
                <div className={`${styles.messageBox} ${styles[messageType]}`}>
                    {message}
                </div>
            )}

            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1>President Dashboard</h1>
                    <p>Manage your club members and request new additions</p>
                </div>
                <div className={styles.profileBadge}>
                    <span>P</span> {/* President initial */}
                </div>
            </header>

            {/* Members Section */}
            <section className={styles.membersSection}>
                <div className={styles.sectionHeader}>
                    <h2>Club Members</h2>
                    <span className={styles.countBadge}>{clubMembers.length} members</span>
                </div>

                <div className={styles.membersGrid}>
                    {clubMembers.length > 0 ? (
                        clubMembers.map(member => (
                            <div key={member.id} className={styles.memberCard}>
                                <div className={styles.memberAvatar}>
                                    {member.name.charAt(0)}
                                </div>
                                <div className={styles.memberInfo}>
                                    <h3>{member.name}</h3>
                                    <p>{member.email}</p>
                                </div>
                                <div className={styles.memberActions}>
                                    <div
                                        className={`${styles.roleBadge} ${member.role.toLowerCase()}`}
                                        onClick={() => setSelectedMember(member)}
                                    >
                                        {member.role}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <svg viewBox="0 0 24 24">
                                <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                            </svg>
                            <p>No members in your club yet</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Role Change Modal */}
            {selectedMember && (
                <div className={styles.modalOverlay} onClick={() => setSelectedMember(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h3>Change Role for {selectedMember.name}</h3>
                        <div className={styles.roleOptions}>
                            {['Member', 'Secretary', 'Treasurer'].map(role => (
                                <button
                                    key={role}
                                    className={`${styles.roleButton} ${selectedMember.role === role ? styles.active : ''}`}
                                    onClick={() => handleRoleChange(selectedMember.id, role)}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                        <button
                            className={styles.closeButton}
                            onClick={() => setSelectedMember(null)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Request form */}
            <div className={styles.formContainer}>
                <div className={styles.formHeader}>
                    <h3>Request New Members</h3>
                    <button
                        className={styles.helpButton}
                        onClick={() => setFormatHint(!formatHint)}
                        aria-label="Format help"
                    >
                        ?
                    </button>
                    {formatHint && (
                        <div className={styles.formatTooltip}>
                            <p>Enter one member per line or separate with commas:</p>
                            <ul>
                                <li>Full Name (email@example.com)</li>
                                <li>First Last, email@example.com</li>
                                <li>email@example.com</li>
                            </ul>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className={styles.memberForm}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="memberInput">Member Information</label>
                        <textarea
                            id="memberInput"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder={`John Doe (john@example.com)\nJane Smith, jane@example.com\n...`}
                            className={styles.memberTextarea}
                            rows={6}
                        />
                        <div className={styles.inputFooter}>
                            <span className={styles.counter}>
                                {inputText.split(/[\n,]/).filter(Boolean).length} members
                            </span>
                            <span className={styles.exampleLink} onClick={() => setInputText(
                                `John Doe (john@example.com)\nJane Smith, jane@example.com\nmike@example.com`
                            )}>
                                Insert example
                            </span>
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button
                            type="button"
                            className={styles.clearButton}
                            onClick={() => setInputText('')}
                            disabled={!inputText}
                        >
                            Clear
                        </button>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={!inputText}
                        >
                            Send Request to Admin
                            <svg viewBox="0 0 24 24">
                                <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
                            </svg>
                        </button>
                    </div>
                </form>

                <div className={styles.note}>
                    <svg viewBox="0 0 24 24">
                        <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" />
                    </svg>
                    <p>All requests require admin approval before members are added</p>
                </div>
            </div>


        </div>
    );
};

export default PresidentDashboard;