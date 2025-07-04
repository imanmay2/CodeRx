import React, { useState, useRef, useEffect } from 'react';
import styles from '../css/PresidentDashboard.module.css';

const PresidentDashboard = () => {
    const [clubMembers, setClubMembers] = useState([
        { id: 'm1', name: 'John Doe', email: 'john.doe@example.com', role: 'Member' },
        { id: 'm2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'President' },
        { id: 'm3', name: 'Peter Jones', email: 'peter.jones@example.com', role: 'Member' },
        { id: 'm4', name: 'Emily White', email: 'emily.white@example.com', role: 'Member' },
    ]);

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [selectedMember, setSelectedMember] = useState(null);

    const showMessageBox = (msg, type = 'success') => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => setMessage(''), 3000);
    };

    const [members, setMembers] = useState([{ regNo: '', name: '' }]);
    const [errors, setErrors] = useState([]);

    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const updatedMembers = [...members];
        updatedMembers[index][name] = value;
        setMembers(updatedMembers);

        // Clear error when field is edited
        if (errors.includes(`${name}-${index}`)) {
            setErrors(errors.filter(err => err !== `${name}-${index}`));
        }
    };

    const addMember = () => {
        setMembers([...members, { regNo: '', name: '' }]);
    };

    const removeMember = (index) => {
        if (members.length > 1) {
            const updatedMembers = [...members];
            updatedMembers.splice(index, 1);
            setMembers(updatedMembers);

            // Remove related errors
            const fieldErrors = ['regNo', 'name']
                .map(field => `${field}-${index}`);
            setErrors(errors.filter(err => !fieldErrors.includes(err)));
        }
    };

    const validate = () => {
        const newErrors = [];
        members.forEach((member, index) => {
            if (!member.regNo.trim()) newErrors.push(`regNo-${index}`);
            if (!member.name.trim()) newErrors.push(`name-${index}`);
        });
        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(members);
            setMembers([{ regNo: '', name: '' }]);
        }
    };


    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }

        // Add event listener
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            // Clean up
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
                    <h1>Club President Dashboard</h1>
                    <p>Manage your club members and request new additions</p>
                </div>

                {/* profile button */}
                <div className="profile-dropdown" ref={dropdownRef}>
                    <button className="profile-button" onClick={() => setShowDropdown(!showDropdown)}>
                        <div className="profile-avatar">
                            <span>A</span> {/* Replace with admin initial or image */}
                        </div>
                        <span>President</span>
                        <i className={`dropdown-arrow ${showDropdown ? 'open' : ''}`}>▼</i>
                    </button>

                    {showDropdown && (
                        <div className="dropdown-menu">
                            <div className="dropdown-item">
                                <i className="icon-user">👤</i>
                                {/* User Id to be given below */}
                                <span>12458796</span>
                            </div>
                            <div className="dropdown-item" onClick={() => {
                                // Add your logout logic here
                                console.log('Logging out...');
                            }}>
                                <i className="icon-logout">⎋</i>
                                <span>Logout</span>
                            </div>
                        </div>
                    )}
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
                <h3 className={styles.formTitle}>Add New Members Request</h3>
                <p className={styles.formSubtitle}>Enter details for each member you want to add</p>

                <form onSubmit={handleSubmit}>
                    {members.map((member, index) => (
                        <div key={index} className={`${styles.memberCard} ${styles.requestFormCard}`}>
                            <div className={styles.cardHeader}>
                                <span>Member #{index + 1}</span>
                                {members.length > 1 && (
                                    <button
                                        type="button"
                                        className={styles.removeButton}
                                        onClick={() => removeMember(index)}
                                        aria-label="Remove member"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>

                            <div >
                                <div className={styles.inputGroup}>
                                    <label htmlFor={`regNo-${index}`}>Registration Number*</label>
                                    <input
                                        id={`regNo-${index}`}
                                        type="text"
                                        name="regNo"
                                        value={member.regNo}
                                        onChange={(e) => handleChange(index, e)}
                                        className={errors.includes(`regNo-${index}`) ? styles.errorInput : ''}
                                        placeholder="2023CS101"
                                    />
                                    {errors.includes(`regNo-${index}`) && (
                                        <span className={styles.errorText}>Required field</span>
                                    )}
                                </div>

                                <div className={styles.inputGroup}>
                                    <label htmlFor={`name-${index}`}>Full Name*</label>
                                    <input
                                        id={`name-${index}`}
                                        type="text"
                                        name="name"
                                        value={member.name}
                                        onChange={(e) => handleChange(index, e)}
                                        className={errors.includes(`name-${index}`) ? styles.errorInput : ''}
                                        placeholder="John Doe"
                                    />
                                    {errors.includes(`name-${index}`) && (
                                        <span className={styles.errorText}>Required field</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className={styles.formActions}>
                        <button
                            type="button"
                            className={styles.addButton}
                            onClick={addMember}
                        >
                            + Add Another Member
                        </button>

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={members.some(m => Object.values(m).some(v => !v.trim()))}
                        >
                            Send Request to Admin
                        </button>
                    </div>
                </form>

                <div className={styles.formFooter}>
                    <svg viewBox="0 0 24 24">
                        <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" />
                    </svg>
                    <p>All requests will be reviewed by admin before members are added</p>
                </div>
            </div>


        </div>
    );
};

export default PresidentDashboard;