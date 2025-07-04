import React, { useState, useRef,useMemo } from 'react';
import '../css/AdminDashboard.css';
import axios from "axios";
import NotificationsSection from '../../components/jsx/NotificationSection';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { useEffect } from 'react';
const AdminDashboard = () => {
    const navigate = useNavigate();
    // State for managing the list of clubs
    const [clubs, setClubs] = useState([])

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const response = await axios.get("http://localhost:8080/getClubData", {
                    withCredentials: true
                });
                // console.log(response.data);

                ///fix the bug.
                let data = [];
                if (response.data != undefined){
                    for (let index = 0; index < response.data.length; index++) {
                        const element = response.data[index];
                        console.log(element);
                        data.push({_id:element._id,name:element.name,president:element.president,faculty:element.faculty,members:element.members,maxMemberCount:element.maxMemberCount,category:element.category,status:element.status})
                    }
                }
                    setClubs(data);
            } catch (error) {
                console.error("Failed to fetch clubs:", error);
            }
        };

        
        fetchClubs();
    }, []);

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
    const dropdownRef = useRef(null);

    // Function to display messages in the custom message box
    const showMessageBox = (msg, type = 'success') => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage('');
        }, 3000); // Message disappears after 3 seconds.
    };

    // Filtered clubs based on search term and filter selections.
     const filteredClubs = useMemo(() => {
        return clubs.filter(club => {
            if (club && club.name && club.category && club.status) {
                const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    club.category.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesCategory = filterCategory === 'All' || club.category === filterCategory;
                const matchesStatus = filterStatus === 'All' || club.status === filterStatus;
                return matchesSearch && matchesCategory && matchesStatus;
            }
            return false;
        });
    }, [clubs, searchTerm, filterCategory, filterStatus]);

    // Handle input changes for the new club form.
    const handleNewClubChange = (e) => {
        const { name, value } = e.target;
        setNewClub(prev => ({ ...prev, [name]: value.trim() }));
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
            setClubs(prev => [...prev, { _id: newId,name:newClub.name, president: response.data.presidentName, faculty: response.data.facultyName ,members: [{regNo:newClub.president,name:response.data.presidentName}],maxMemberCount: newClub.maxMemberCount,category: newClub.category,status:newClub.status }]);
            showMessageBox(`Club "${newClub.name}" created successfully!`, response.data.flag);
            setNewClub({ // Reset form
                name: '',
                president: '',
                facultyCoordinator: '',
                maxMemberCount: '',
                category: '',
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
                        <div className="profile-dropdown" ref={dropdownRef}>
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
                                        <span>{Cookies.get('id')}</span>
                                    </div>
                                    <div className="dropdown-item" onClick={async () => {
                                        // Add your logout logic here.
                                        const response = await axios.get("http://localhost:8080/logout", { withCredentials: true });
                                        navigate("/");

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
                            <span className="stat-number">{clubs?.length}</span>
                            <span className="stat-label">Total Clubs</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">{clubs?.filter(c => c.status === 'Active').length}</span>
                            <span className="stat-label">Active Clubs</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">
                                {clubs?.reduce((acc, club) => acc + club?.members?.length, 0)}
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
                                        club?._id ?
                                            <tr key={club._id}>
                                                <td>
                                                    <div className="club-name">
                                                        <div className="club-avatar"
                                                            style={{ background: getRandomColor() }}>
                                                            {club?.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        {club.name}
                                                    </div>
                                                </td>
                                                <td>{club.president}</td>
                                                <td>{club.faculty}</td>
                                                <td>{club.members.length}</td>
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
                                            </tr> : null
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

// import React, { useState, useRef, useMemo, useEffect } from 'react';
// import '../css/AdminDashboard.css';
// import axios from "axios";
// import NotificationsSection from '../../components/jsx/NotificationSection';
// import { useNavigate } from "react-router-dom";
// import Cookies from 'js-cookie';

// const AdminDashboard = () => {
//     const navigate = useNavigate();
//     const [clubs, setClubs] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filterCategory, setFilterCategory] = useState('All');
//     const [filterStatus, setFilterStatus] = useState('All');
//     const [showCreateClubModal, setShowCreateClubModal] = useState(false);
//     const [newClub, setNewClub] = useState({
//         name: '', president: '', facultyCoordinator: '', maxMemberCount: '',
//         category: '', status: 'Active'
//     });
//     const [message, setMessage] = useState('');
//     const [messageType, setMessageType] = useState('success');
//     const [showDropdown, setShowDropdown] = useState(false);
//     const dropdownRef = useRef(null);


//     const fetchClubs = async () => {
//         try {
//             const response = await axios.get("http://localhost:8080/getClubData", {
//                 withCredentials: true
//             });
//             if (response.data !== undefined) {
//                 setClubs(response.data);
//             }
//         } catch (error) {
//             console.error("Failed to fetch clubs:", error);
//         }
//     };
//     let func=()=>{
//         useEffect(() => {
//         fetchClubs();
//     }, []);
//     }
//     func();

//     const filteredClubs = useMemo(() => {
//         return clubs.filter(club => {
//             if (club && club.name && club.category && club.status) {
//                 const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                     club.category.toLowerCase().includes(searchTerm.toLowerCase());
//                 const matchesCategory = filterCategory === 'All' || club.category === filterCategory;
//                 const matchesStatus = filterStatus === 'All' || club.status === filterStatus;
//                 return matchesSearch && matchesCategory && matchesStatus;
//             }
//             return false;
//         });
//     }, [clubs, searchTerm, filterCategory, filterStatus]);

//     const showMessageBox = (msg, type = 'success') => {
//         setMessage(msg);
//         setMessageType(type);
//         setTimeout(() => {
//             setMessage('');
//         }, 3000);
//     };

//     const handleNewClubChange = (e) => {
//         const { name, value } = e.target;
//         setNewClub(prev => ({ ...prev, [name]: value }));
//     };

//     const handleCreateClubSubmit = async (e) => {
//         e.preventDefault();
//         if (!newClub.name || !newClub.president || !newClub.facultyCoordinator || !newClub.maxMemberCount) {
//             showMessageBox('Please fill in all required fields for the new club.', 'error');
//             return;
//         }

//         const response = await axios.post("http://localhost:8080/createNewClub", newClub, { withCredentials: true });
//         if (response.data.flag === "success") {
//             setClubs(prev => [...prev, { ...newClub, members: [], faculty: newClub.facultyCoordinator }]);
            
//             showMessageBox(`Club "${newClub.name}" created successfully!`, response.data.flag);
//             setNewClub({
//                 name: '',
//                 president: '',
//                 facultyCoordinator: '',
//                 maxMemberCount: '',
//                 category: '',
//                 status: 'Active'
//             });
//             setShowCreateClubModal(false);
//         } else {
//             showMessageBox(response.data.message, response.data.flag);
//         }
//     };

//     const handleClickOutside = (event) => {
//         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//             setShowDropdown(false);
//         }
//     };

//     useEffect(() => {
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, []);

//     const uniqueCategories = ['All', ...new Set(clubs.map(club => club.category))];

//     return (
//         <div className="ultra-premium-dashboard">
//             {message && <div className={`message-box ${messageType}`}>{message}</div>}

//             <header className="dashboard-header">
//                 <div className="header-content">
//                     <div className='heading'>
//                         <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
//                             <h1>Admin Dashboard</h1>
//                             <p>Manage all student organizations in one place</p>
//                         </span>

//                         <div className="profile-dropdown" ref={dropdownRef}>
//                             <button className="profile-button" onClick={() => setShowDropdown(!showDropdown)}>
//                                 <div className="profile-avatar"><span>A</span></div>
//                                 <span>Admin</span>
//                                 <i className={`dropdown-arrow ${showDropdown ? 'open' : ''}`}>▼</i>
//                             </button>
//                             {showDropdown && (
//                                 <div className="dropdown-menu">
//                                     <div className="dropdown-item"><i className="icon-user">👤</i><span>{Cookies.get('id')}</span></div>
//                                     <div className="dropdown-item" onClick={async () => {
//                                         await axios.get("http://localhost:8080/logout", { withCredentials: true });
//                                         navigate("/");
//                                     }}>
//                                         <i className="icon-logout">⎋</i><span>Logout</span>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                     <div className="header-stats">
//                         <div className="stat-card"><span className="stat-number">{clubs.length}</span><span className="stat-label">Total Clubs</span></div>
//                         <div className="stat-card"><span className="stat-number">{clubs.filter(c => c.status === 'Active').length}</span><span className="stat-label">Active Clubs</span></div>
//                         <div className="stat-card"><span className="stat-number">{clubs.reduce((acc, club) => acc + (club.members?.length || 0), 0)}</span><span className="stat-label">Total Members</span></div>
//                     </div>
//                 </div>
//             </header>

//             <main className="dashboard-main">
//                 <section className="action-bar">
//                     <button className="action-button primary" onClick={() => setShowCreateClubModal(true)}>
//                         <i className="icon-plus"></i> Create New Club
//                     </button>
//                     <div className="search-filter-group">
//                         <div className="search-box">
//                             <i className="icon-search"></i>
//                             <input type="text" placeholder="Search clubs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//                         </div>
//                         <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
//                             <option value="All">All Categories</option>
//                             <option value="Academic">Academic</option>
//                             <option value="Technical">Technical</option>
//                             <option value="Sports">Sports</option>
//                             <option value="Arts">Arts</option>
//                         </select>
//                         <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
//                             <option value="All">All Statuses</option>
//                             <option value="Active">Active</option>
//                             <option value="Inactive">Inactive</option>
//                         </select>
//                     </div>
//                 </section>

//                 <section className="data-section">
//                     <div className="section-header">
//                         <h2>Club Overview</h2>
//                         <span className="badge">{filteredClubs.length} clubs</span>
//                     </div>

//                     {filteredClubs.length > 0 ? (
//                         <div className="data-table-container">
//                             <table className="data-table">
//                                 <thead>
//                                     <tr>
//                                         <th>Club Name</th>
//                                         <th>President</th>
//                                         <th>Faculty</th>
//                                         <th>Members</th>
//                                         <th>Category</th>
//                                         <th>Status</th>
//                                         <th>Actions</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {filteredClubs.map(club => (
//                                         club?._id ? (
//                                             <tr key={club._id}>
//                                                 <td>
//                                                     <div className="club-name">
//                                                         <div className="club-avatar" style={{ background: getRandomColor() }}>{club.name.charAt(0)}</div>
//                                                         {club.name}
//                                                     </div>
//                                                 </td>
//                                                 <td>{club.president}</td>
//                                                 <td>{club.faculty}</td>
//                                                 <td>{club.members?.length || 0}</td>
//                                                 <td><span className="category-tag">{club.category}</span></td>
//                                                 <td><span className={`status-badge ${club.status.toLowerCase()}`}>{club.status}</span></td>
//                                                 <td>
//                                                     <button className="table-action"><i className="icon-edit"></i></button>
//                                                     <button className="table-action"><i className="icon-more"></i></button>
//                                                 </td>
//                                             </tr>
//                                         ) : null
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     ) : (
//                         <div className="no-results"><i className="icon-search"></i><p>No clubs found matching your criteria</p></div>
//                     )}
//                 </section>
//             </main>

//             <NotificationsSection />

//             {showCreateClubModal && (
//                 <div className="modal-overlay">
//                     <div className="modal-content">
//                         <div className="modal-header">
//                             <h2>Create New Club</h2>
//                             <button className="modal-close" onClick={() => setShowCreateClubModal(false)}>&times;</button>
//                         </div>
//                         <form onSubmit={handleCreateClubSubmit}>
//                             <div className="form-grid">
//                                 <input type="text" placeholder='Club Name' name="name" value={newClub.name} onChange={handleNewClubChange} required />
//                                 <input type="text" name="president" placeholder='President Reg. No' value={newClub.president} onChange={handleNewClubChange} required />
//                                 <input type="text" name="facultyCoordinator" placeholder='Faculty Coordinator Reg. No' value={newClub.facultyCoordinator} onChange={handleNewClubChange} required />
//                                 <input type="number" name="maxMemberCount" placeholder='Maximum Number of Members' value={newClub.maxMemberCount} onChange={handleNewClubChange} required min="0" />
//                                 <input type="text" name="category" placeholder='Category' value={newClub.category} onChange={handleNewClubChange} required />
//                                 <select name="status" value={newClub.status} onChange={handleNewClubChange}>
//                                     <option value="Active">Active</option>
//                                     <option value="Inactive">Inactive</option>
//                                 </select>
//                             </div>
//                             <div className="modal-actions">
//                                 <button type="button" className="secondary" onClick={() => setShowCreateClubModal(false)}>Cancel</button>
//                                 <button type="submit" className="primary">Create Club</button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// const getRandomColor = () => {
//     const colors = ['#3a86ff', '#4cc9f0', '#2ecc71', '#9b59b6', '#ff9f1c', '#ff2a6d'];
//     return colors[Math.floor(Math.random() * colors.length)];
// };

// export default AdminDashboard;