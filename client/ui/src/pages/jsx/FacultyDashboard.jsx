import React, { useState, useRef, useEffect } from 'react';
import styles from '../css/FacultyDashboard.module.css';

const FacultyDashboard = () => {
    const [clubs] = useState([
        { id: 'c1', name: 'Literary Club', president: 'Alice Smith', facultyCoordinator: 'Dr. John Doe', membersCount: 120, category: 'Academic', status: 'Active' },
        { id: 'c2', name: 'Robotics Club', president: 'Bob Johnson', facultyCoordinator: 'Prof. Jane Roe', membersCount: 85, category: 'Technical', status: 'Active' },
        { id: 'c3', name: 'Sports Club', president: 'Charlie Brown', facultyCoordinator: 'Mr. David Lee', membersCount: 250, category: 'Sports', status: 'Active' },
        { id: 'c4', name: 'Photography Club', president: 'Diana Prince', facultyCoordinator: 'Ms. Emily White', membersCount: 60, category: 'Arts', status: 'Active' },
        { id: 'c5', name: 'Debate Society', president: 'Eve Adams', facultyCoordinator: 'Dr. Frank Green', membersCount: 95, category: 'Academic', status: 'Inactive' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedClub, setSelectedClub] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const filteredClubs = clubs.filter(club => {
        const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            club.president.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || club.category === filterCategory;
        const matchesStatus = filterStatus === 'All' || club.status === filterStatus;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    const uniqueCategories = ['All', ...new Set(clubs.map(club => club.category))];

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getCategoryColor = (category) => {
        const colors = {
            'Academic': 'linear-gradient(135deg, #6C5CE7, #A55EEA)',
            'Technical': 'linear-gradient(135deg, #00B894, #55EFC4)',
            'Sports': 'linear-gradient(135deg, #FDCB6E, #E17055)',
            'Arts': 'linear-gradient(135deg, #FD79A8, #E84393)'
        };
        return colors[category] || 'linear-gradient(135deg, #0984E3, #74B9FF)';
    };

    return (
        <div className={styles.dashboard}>
            {/* Animated Background Elements */}
            <div className={styles.bgBlur1}></div>
            <div className={styles.bgBlur2}></div>

            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1>Faculty Dashboard</h1>
                    <p>Manage and oversee all student clubs</p>
                </div>

                {/* Profile Dropdown */}
                <div className={styles.profileDropdown} ref={dropdownRef}>
                    <button
                        className={styles.profileButton}
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        <div className={styles.profileAvatar}>
                            <span>F</span>
                        </div>
                        <span>Faculty</span>
                        <i className={`${styles.dropdownArrow} ${showDropdown ? styles.open : ''}`}>▼</i>
                    </button>

                    {showDropdown && (
                        <div className={styles.dropdownMenu}>
                            <div className={styles.dropdownItem}>
                                <i className={styles.iconUser}>👤</i>
                                <span>12458796</span>
                            </div>
                            <div
                                className={styles.dropdownItem}
                                onClick={() => console.log('Logging out...')}
                            >
                                <i className={styles.iconLogout}>⎋</i>
                                <span>Logout</span>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Filters */}
            <div className={styles.filters}>
                <div className={styles.searchBox}>
                    <svg viewBox="0 0 24 24">
                        <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search clubs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className={styles.selectWrapper}>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        {uniqueCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <div className={styles.selectArrow}>▼</div>
                </div>

                <div className={styles.selectWrapper}>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                    <div className={styles.selectArrow}>▼</div>
                </div>
            </div>

            {/* Clubs Overview */}
            <section className={styles.clubSection}>
                <div className={styles.sectionHeader}>
                    <h2>Club Overview</h2>
                    <span className={styles.countBadge}>
                        {filteredClubs.length} {filteredClubs.length === 1 ? 'club' : 'clubs'}
                    </span>
                </div>

                {filteredClubs.length > 0 ? (
                    <div className={styles.clubGrid}>
                        {filteredClubs.map(club => (
                            <div
                                key={club.id}
                                className={styles.clubCard}
                                onClick={() => setSelectedClub(club)}
                                style={{
                                    '--category-color': getCategoryColor(club.category)
                                }}
                            >
                                <div className={styles.clubHeader}>
                                    <h3>{club.name}</h3>
                                    <span className={`${styles.statusBadge} ${club.status.toLowerCase()}`}>
                                        {club.status}
                                    </span>
                                </div>
                                <div className={styles.clubMeta}>
                                    <div className={styles.metaItem}>
                                        <span>President</span>
                                        <p>{club.president}</p>
                                    </div>
                                    <div className={styles.metaItem}>
                                        <span>Members</span>
                                        <p>{club.membersCount}</p>
                                    </div>
                                    <div className={styles.metaItem}>
                                        <span>Category</span>
                                        <p>{club.category}</p>
                                    </div>
                                </div>
                                <div className={styles.cardGlow}></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <svg viewBox="0 0 24 24">
                            <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z" />
                        </svg>
                        <p>No clubs found matching your criteria</p>
                    </div>
                )}
            </section>

            {/* Club Detail Modal */}
            {selectedClub && (
                <div className={styles.modalOverlay} onClick={() => setSelectedClub(null)}>
                    <div
                        className={styles.modalContent}
                        onClick={e => e.stopPropagation()}
                        style={{
                            '--category-color': getCategoryColor(selectedClub.category)
                        }}
                    >
                        <button
                            className={styles.closeButton}
                            onClick={() => setSelectedClub(null)}
                        >
                            &times;
                        </button>
                        <h3>{selectedClub.name}</h3>
                        <div className={styles.modalGrid}>
                            <div className={styles.detailItem}>
                                <span>President</span>
                                <p>{selectedClub.president}</p>
                            </div>
                            <div className={styles.detailItem}>
                                <span>Faculty Coordinator</span>
                                <p>{selectedClub.facultyCoordinator}</p>
                            </div>
                            <div className={styles.detailItem}>
                                <span>Total Members</span>
                                <p>{selectedClub.membersCount}</p>
                            </div>
                            <div className={styles.detailItem}>
                                <span>Category</span>
                                <p>{selectedClub.category}</p>
                            </div>
                            <div className={styles.detailItem}>
                                <span>Status</span>
                                <p className={`${styles.statusText} ${selectedClub.status.toLowerCase()}`}>
                                    {selectedClub.status}
                                </p>
                            </div>
                        </div>
                        <div className={styles.modalGlow}></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacultyDashboard;