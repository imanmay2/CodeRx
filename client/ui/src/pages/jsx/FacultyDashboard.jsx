import  { useState, useRef, useEffect, useMemo } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import styles from '../css/FacultyDashboard.module.css';

const FacultyDashboard = () => {

    const navigate = useNavigate();
    // Sample data - in a real app, this would come from an API
    // const facultyInfo = {
    //     id: 'f123',
    //     name: 'Dr. John Doe',
    //     email: 'john.doe@university.edu',
    //     department: 'Computer Science',
    //     clubId: 'c1' // The club this faculty is associated with
    // };

    const [club,setClub] = useState(
        {
            id: 'c1',
            name: 'Literary Club',
            president: 'Alice Smith',
            faculty: 'Dr. John Doe',
            membersCount: 120,
            maxMembers: 150,
            category: 'Academic',
            status: 'Active',
            members: [
                { id: 'm1', regNo: '2023001', name: 'Alice Smith', status: 'Active', role: 'President', joinDate: '2022-01-15' },
                { id: 'm2', regNo: '2023002', name: 'Bob Johnson', status: 'Active', role: 'Vice President', joinDate: '2022-02-10' },
                { id: 'm3', regNo: '2023003', name: 'Charlie Brown', status: 'Active', role: 'Secretary', joinDate: '2022-03-05' },
                { id: 'm4', regNo: '2023004', name: 'Diana Prince', status: 'Inactive', role: 'Member', joinDate: '2022-04-20', leaveDate: '2023-01-15' },
                { id: 'm5', regNo: '2023005', name: 'Eve Adams', status: 'Active', role: 'Treasurer', joinDate: '2022-05-12' },
            ]
        },
        
    );

    // const [searchTerm, setSearchTerm] = useState('');
    // const [filterCategory, setFilterCategory] = useState('All');
    // const [filterStatus, setFilterStatus] = useState('All');
    const [selectedClub, setSelectedClub] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // // Find the club this faculty is associated with
    // const facultyClub = useMemo(() => {
    //     return clubs.find(club => club.id === facultyInfo.clubId);
    // }, [clubs, facultyInfo.clubId]);

    // Filtered clubs based on search term and filter selections
    // const filteredClubs = useMemo(() => {
    //     return clubs.filter(club => {
    //         if (club && club.name && club.category && club.status) {
    //             const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //                 club.category.toLowerCase().includes(searchTerm.toLowerCase());
    //             const matchesCategory = filterCategory === 'All' || club.category === filterCategory;
    //             const matchesStatus = filterStatus === 'All' || club.status === filterStatus;
    //             return matchesSearch && matchesCategory && matchesStatus;
    //         }
    //         return false;
    //     });
    // }, [clubs, searchTerm, filterCategory, filterStatus]);


    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(()=>{
        const func = async () => {
            const response = await axios.get(`http://localhost:8080/getClubData`, { withCredentials: true });
            if(response.data !=undefined){
                //filter the faculty with matching id from cookies from resposne.data
                const facultyId = Cookies.get('id');
                const facultyClubData = response.data.filter(club => club.facultyId === facultyId)[0];
                console.log(facultyClubData);
                setClub(facultyClubData);
            }
        };
        func();
    },[]);

    const getCategoryColor = (category) => {
        const colors = {
            'Academic': 'linear-gradient(135deg, #6C5CE7, #A55EEA)',
            'Technical': 'linear-gradient(135deg, #00B894, #55EFC4)',
            'Sports': 'linear-gradient(135deg, #FDCB6E, #E17055)',
            'Arts': 'linear-gradient(135deg, #FD79A8, #E84393)'
        };
        return colors[category] || 'linear-gradient(135deg, #0984E3, #74B9FF)';
    };

    const getStatusColor = (status) => {
        return status === 'Active' ? '#2ecc71' : '#e74c3c';
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
                    <p>Manage and oversee your student club</p>
                </div>

                {/* profile button */}
                <div className="profile-dropdown" ref={dropdownRef}>
                    <button className="profile-button" onClick={() => setShowDropdown(!showDropdown)}>
                        <div className="profile-avatar">
                            <span>F</span> {/* Replace with admin initial or image */}
                        </div>
                        <span>Faculty</span>
                        <i className={`dropdown-arrow ${showDropdown ? 'open' : ''}`}>▼</i>
                    </button>

                    {showDropdown && (
                        <div className="dropdown-menu">
                            <div className="dropdown-item">
                                <i className="icon-user">👤</i>
                                {/* User Id to be given below */}
                                <span>{Cookies?.get('id')}</span>
                            </div>
                            <div className="dropdown-item" onClick={async () => {
                                // Add your logout logic here
                                const response = await axios.get("http://localhost:8080/logout", { withCredentials: true });
                                if (response) {
                                    navigate("/");
                                    console.log('Logging out...');
                                }
                            }}>
                                <i className="icon-logout">⎋</i>
                                <span>Logout</span>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <div className={styles.mainContent}>
                {/* Faculty Club Section */}
                <section className={styles.facultyClubSection}>
                    <div className={styles.sectionHeader}>
                        <h2>Your Club</h2>
                        <div className={styles.clubStatus}>
                            <span className={styles.statusIndicator} style={{ backgroundColor: getStatusColor(club?.status) }}></span>
                            <span>{club?.status}</span>
                        </div>
                    </div>

                    <div className={styles.clubDetailsCard} style={{ '--category-color': getCategoryColor(club?.category) }}>
                        <div className={styles.clubBasicInfo}>
                            <div className={styles.clubNameCategory}>
                                <h3>{club?.name}</h3>
                                <span className={styles.clubCategory}>{club?.category}</span>
                            </div>
                            <div className={styles.membersCount}>
                                <span className={styles.currentCount}>{club?.members?.length}</span>
                                <span className={styles.maxCount}>/ {club?.maxMemberCount}</span>
                                <span className={styles.membersLabel}>Members</span>
                            </div>
                        </div>

                        <div className={styles.clubLeadership}>
                            <div className={styles.leaderCard}>
                                <span className={styles.leaderRole}>President</span>
                                <span className={styles.leaderName}>{club?.president}</span>
                            </div>
                            <div className={styles.leaderCard}>
                                <span className={styles.leaderRole}>Faculty Coordinator</span>
                                <span className={styles.leaderName}>{club?.faculty}</span>
                            </div>
                        </div>

                        <div className={styles.progressBarContainer}>
                            <div
                                className={styles.progressBar}
                                style={{
                                    width: `${(club?.members?.length / club?.maxMemberCount) * 100}%`,
                                    background: getCategoryColor(club?.category)
                                }}
                            ></div>
                        </div>
                    </div>
                </section>

                {/* Club Members Section */}
                <section className={styles.membersSection}>
                    <div className={styles.sectionHeader}>
                        <h2>Club Members</h2>
                        <span className={styles.countBadge}>
                            {club?.members?.length || 0} members
                        </span>
                    </div>

                    <div className={styles.membersTableContainer}>
                        <table className={styles.membersTable}>
                            <thead>
                                <tr>
                                    <th>Reg No</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr key={club?.president.id}>
                                    <td>{club?.presidentId}</td>
                                    <td>{club?.president}</td>
                                    <td>{club?.presidentEmail}</td>
                                    <td>President</td>

                                </tr>
                                {club?.members?.map(member => (
                                    <tr key={member.id}>
                                        <td>{member.regNo}</td>
                                        <td>{member.name}</td>
                                        <td>{member.email}</td>
                                        <td>Member</td>
                                    </tr>
                                ))}
                                
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

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
                                <p>{selectedClub.membersCount}/{selectedClub.maxMembers}</p>
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