import React, { useState } from 'react';
import '../css/AdminDashboard.css';
import axios from "axios";
import NotificationsSection from '../../components/jsx/NotificationSection';

const AdminDashboard = () => {
    // State for managing the list of clubs
    const [clubs, setClubs] = useState([

        //error in maxMemberCount
        // { id: 'c1', name: 'Literary Club', president: 'Alice Smith', facultyCoordinator: 'Dr. John Doe', membersCount: 120, category: 'Academic', status: 'Active' },
        // { id: 'c2', name: 'Robotics Club', president: 'Bob Johnson', facultyCoordinator: 'Prof. Jane Roe', membersCount: 85, category: 'Technical', status: 'Active' },
        // { id: 'c3', name: 'Sports Club', president: 'Charlie Brown', facultyCoordinator: 'Mr. David Lee', membersCount: 250, category: 'Sports', status: 'Active' },
        // { id: 'c4', name: 'Photography Club', president: 'Diana Prince', facultyCoordinator: 'Ms. Emily White', membersCount: 60, category: 'Arts', status: 'Active' },
        // { id: 'c5', name: 'Debate Society', president: 'Eve Adams', facultyCoordinator: 'Dr. Frank Green', membersCount: 95, category: 'Academic', status: 'Inactive' },
        // { id: 'c6', name: 'Chess Club', president: 'Grace Hopper', facultyCoordinator: 'Mr. Alan Turing', membersCount: 40, category: 'Academic', status: 'Active' },
        // { id: 'c7', name: 'Coding Club', president: 'Ivan Ivanov', facultyCoordinator: 'Prof. Maria Sklodowska', membersCount: 150, category: 'Technical', status: 'Active' },
        // { id: 'c8', name: 'Drama Club', president: 'Judy Garland', facultyCoordinator: 'Ms. Olivia Newton', membersCount: 70, category: 'Arts', status: 'Inactive' },
    ]);

    // State for search and filter inputs
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showCreateClubModal, setShowCreateClubModal] = useState(false);
    const [newClub, setNewClub] = useState({
        name: '', president: '', facultyCoordinator: '', maxMemberCount: '',
        category: '', status: 'Active'
    });
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');


    const [showDropdown, setShowDropdown] = useState(false);

    // Function to display messages in the custom message box
    const showMessageBox = (msg, type = 'success') => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage('');
        }, 3000); // Message disappears after 3 seconds.
    };

    // Filtered clubs based on search term and filter selections.
    const filteredClubs = clubs.filter(club => {
        const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            club.category.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = filterCategory === 'All' || club.category === filterCategory;
        const matchesStatus = filterStatus === 'All' || club.status === filterStatus;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Handle input changes for the new club form.
    const handleNewClubChange = (e) => {
        const { name, value } = e.target;
        setNewClub(prev => ({ ...prev, [name]: value }));
    };

    // Handle submission of the new club form
    const handleCreateClubSubmit = async (e) => {
        e.preventDefault();
        if (!newClub.name || !newClub.president || !newClub.facultyCoordinator || !newClub.maxMemberCount) {
            showMessageBox('Please fill in all required fields for the new club.', 'error');
            return;
        }
        const newId = `c${clubs.length + 1}`; // Simple ID generation
        //Post request to the backend.
        const response = await axios.post("http://localhost:8080/createNewClub", newClub, { withCredentials: true });
        console.log(response.data);
        if (response.data.flag === "success") {
            setClubs(prev => [...prev, { id: newId, ...newClub, membersCount: parseInt(newClub.maxMemberCount) }]);
            showMessageBox(`Club "${newClub.name}" created successfully!`, response.data.flag);
            setNewClub({ // Reset form
                name: '',
                president: '',
                facultyCoordinator: '',
                membersCount: '',
                category: 'Academic',
                status: 'Active',
            });
            setShowCreateClubModal(false); // Close modal
            return;
        }
        showMessageBox(response.data.message, response.data.flag);
    };

    // Simulate redirection for quick actions
    const handleManageMembers = () => {
        showMessageBox('Redirecting to Member Management page...', 'info');
        // In a real app: window.location.href = '/manage-members';
    };

    const handleAssignRoles = () => {
        showMessageBox('Redirecting to Role Assignment page...', 'info');
        // In a real app: window.location.href = '/assign-roles';
    };

    // Get unique categories for filter dropdown
    const uniqueCategories = ['All', ...new Set(clubs.map(club => club.category))];



    return (
        <div className="ultra-premium-dashboard">


            {/* Message Box */}
            {message && (
                <div className={`message-box ${messageType}`}>
                    {message}
                </div>
            )}

            {/* Dashboard Header */}
            <header className="dashboard-header">
                <div className="header-content">
                    <div className='heading'>
                        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <h1>Admin Dashboard</h1>
                            <p>Manage all student organizations in one place</p>
                        </span>

                        {/* profile button */}
                        <div className="profile-dropdown">
                            <button className="profile-button" onClick={() => setShowDropdown(!showDropdown)}>
                                <div className="profile-avatar">
                                    <span>A</span> {/* Replace with admin initial or image */}
                                </div>
                                <span>Admin</span>
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
                    </div>
                    <div className="header-stats">
                        <div className="stat-card">
                            <span className="stat-number">{clubs.length}</span>
                            <span className="stat-label">Total Clubs</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">{clubs.filter(c => c.status === 'Active').length}</span>
                            <span className="stat-label">Active Clubs</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">
                                {clubs.reduce((acc, club) => acc + club.membersCount, 0)}
                            </span>
                            <span className="stat-label">Total Members</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="dashboard-main">
                {/* Action Bar */}
                <section className="action-bar">
                    <button
                        className="action-button primary"
                        onClick={() => setShowCreateClubModal(true)}
                    >
                        <i className="icon-plus"></i> Create New Club
                    </button>
                    <div className="search-filter-group">
                        <div className="search-box">
                            <i className="icon-search"></i>
                            <input
                                type="text"
                                placeholder="Search clubs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="All">All Categories</option>
                            <option value="Academic">Academic</option>
                            <option value="Technical">Technical</option>
                            <option value="Sports">Sports</option>
                            <option value="Arts">Arts</option>
                        </select>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </section>

                {/* Clubs Table */}
                <section className="data-section">
                    <div className="section-header">
                        <h2>Club Overview</h2>
                        <span className="badge">{filteredClubs.length} clubs</span>
                    </div>

                    {filteredClubs.length > 0 ? (
                        <div className="data-table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Club Name</th>
                                        <th>President</th>
                                        <th>Faculty</th>
                                        <th>Members</th>
                                        <th>Category</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredClubs.map(club => (
                                        <tr key={club.id}>
                                            <td>
                                                <div className="club-name">
                                                    <div className="club-avatar"
                                                        style={{ background: getRandomColor() }}>
                                                        {club.name.charAt(0)}
                                                    </div>
                                                    {club.name}
                                                </div>
                                            </td>
                                            <td>{club.president}</td>
                                            <td>{club.facultyCoordinator}</td>
                                            <td>{club.membersCount}</td>
                                            <td>
                                                <span className="category-tag">
                                                    {club.category}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${club.status.toLowerCase()}`}>
                                                    {club.status}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="table-action">
                                                    <i className="icon-edit"></i>
                                                </button>
                                                <button className="table-action">
                                                    <i className="icon-more"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="no-results">
                            <i className="icon-search"></i>
                            <p>No clubs found matching your criteria</p>
                        </div>
                    )}
                </section>

            </main>

            {/* Notifications Section */}
            <NotificationsSection />

            {/* Create Club Modal */}
            {showCreateClubModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Create New Club</h2>
                            <button
                                className="modal-close"
                                onClick={() => setShowCreateClubModal(false)}
                            >
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleCreateClubSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    {/* <label>Club Name</label> */}
                                    <input
                                        type="text"
                                        placeholder='Club Name'
                                        name="name"
                                        value={newClub.name}
                                        onChange={handleNewClubChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    {/* <label>President</label> */}
                                    <input
                                        type="text"
                                        name="president"
                                        placeholder='President Reg. No'
                                        value={newClub.president}
                                        onChange={handleNewClubChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    {/* <label>Faculty Coordinator</label> */}
                                    <input
                                        type="text"
                                        name="facultyCoordinator"
                                        placeholder='Faculty Coordinator Reg. No'
                                        value={newClub.facultyCoordinator}
                                        onChange={handleNewClubChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    {/* <label>Members Count</label> */}
                                    <input
                                        type="number"
                                        name="maxMemberCount"
                                        placeholder='Maximum Number of Members'
                                        value={newClub.maxMemberCount}
                                        onChange={handleNewClubChange}
                                        required
                                        min="0"
                                    />
                                </div>
                                <div className="form-group">
                                    {/* <label>Category</label> */}
                                    <input
                                        type="text"
                                        name="category"
                                        placeholder='Category'
                                        value={newClub.category}
                                        onChange={handleNewClubChange}
                                        required
                                        min="0"
                                    />
                                </div>
                                <div className="form-group">
                                    {/* <label>Status</label> */}
                                    <select
                                        name="status"
                                        value={newClub.status}
                                        onChange={handleNewClubChange}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="secondary" onClick={() => setShowCreateClubModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="primary">
                                    Create Club
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

// Helper function for random colors
const getRandomColor = () => {
    const colors = ['#3a86ff', '#4cc9f0', '#2ecc71', '#9b59b6', '#ff9f1c', '#ff2a6d'];
    return colors[Math.floor(Math.random() * colors.length)];
};

export default AdminDashboard;