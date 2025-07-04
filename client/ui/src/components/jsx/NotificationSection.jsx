import React, { useState,useEffect } from 'react';
import axios from 'axios';
import styles from '../css/NotificationSection.module.css';

const NotificationsSection = () => {
    const [notifications, setNotifications] = useState([
    ]);

    const [activeTab, setActiveTab] = useState('Pending');
    const [selectedNotification, setSelectedNotification] = useState(null);

    const handleApproval = async (id,status) => {
        const response = await axios.post(`http://localhost:8080/requestApproval/${id}`, { status }, { withCredentials: true });
        if (response.data.flag === "success") {
            console.log("Request updated successfully");
            setNotifications(notifications.map(notif =>
                notif._id === id ? { ...notif, status: status } : notif
            ));
            setSelectedNotification(null);
        } else {
            console.error("Failed to update request");
        }
        
    };

    const filteredNotifications = notifications.filter(notif =>
        activeTab === 'all' ? true : notif.status === activeTab
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    useEffect(()=>{
        const fetchnotifications = async () => {
            const response = await axios.get("http://localhost:8080/getNewMembers",{withCredentials:true});
            if(response.data.flag === "success"){
                // [{_id,clubName,presidentName,status,date,members:[name1,name2]}]
                setNotifications(response.data.data_);
            }
        }
        fetchnotifications();
    },[]);

    return (
        <div className={styles.notificationsContainer}>
            <div className={styles.notificationsHeader}>
                <h2>Membership Requests</h2>
                <div className={styles.tabs}>
                    <button
                        className={activeTab === 'Pending' ? styles.active : ''}
                        onClick={() => setActiveTab('Pending')}
                    >
                        Pending
                        <span className={styles.badge}>
                            {notifications.filter(n => n.status === 'Pending').length}
                        </span>
                    </button>
                    <button
                        className={activeTab === 'Approved' ? styles.active : ''}
                        onClick={() => setActiveTab('Approved')}
                    >
                        Approved
                    </button>
                    <button
                        className={activeTab === 'Rejected' ? styles.active : ''}
                        onClick={() => setActiveTab('Rejected')}
                    >
                        Rejected
                    </button>
                    <button
                        className={activeTab === 'all' ? styles.active : ''}
                        onClick={() => setActiveTab('all')}
                    >
                        All Requests
                    </button>
                </div>
            </div>

            <div className={styles.notificationsGrid}>
                {filteredNotifications.length > 0 ? (
                    <div className={styles.notificationsList}>
                        {filteredNotifications.map(notification => (
                            notification?._id ?
                            <div
                                key={notification._id}
                                className={`${styles.notificationCard} ${styles[notification.status]}`}
                                onClick={() => setSelectedNotification(notification)}
                            >
                                <div className={styles.notificationIcon}>
                                    {true && (
                                        <svg viewBox="0 0 24 24">
                                            <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                                        </svg>
                                    )}
                                </div>
                                <div className={styles.notificationContent}>
                                    <h3>{notification.clubName}</h3>
                                    <p>Request to add {notification.members.length} members</p>
                                    <div className={styles.notificationMeta}>
                                        <span className={styles.president}>{notification.presidentName}</span>
                                        <span className={styles.date}>{notification.date}</span>
                                    </div>
                                </div>
                                <div className={styles.notificationStatus}>
                                    <span className={`${styles.statusBadge} ${styles[notification.status]}`}>
                                        {notification.status}
                                    </span>
                                </div>
                            </div> :null
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <svg viewBox="0 0 24 24">
                            <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z" />
                        </svg>
                        <p>No {activeTab} notifications found</p>
                    </div>
                )}
            </div>

            {selectedNotification && (
                <div className={styles.notificationModal}>
                    <div className={styles.modalContent}>
                        <button
                            className={styles.closeModal}
                            onClick={() => setSelectedNotification(null)}
                        >
                            &times;
                        </button>
                        <h3>{selectedNotification.clubName} Membership Request</h3>
                        <div className={styles.modalHeader}>
                            <span className={styles.president}>From: {selectedNotification.presidentName}</span>
                            <span className={styles.date}>{formatDate(selectedNotification.date)}</span>
                        </div>

                        <div className={styles.membersList}>
                            <h4>Requested Members:</h4>
                            <ul>
                                {selectedNotification?.members?.map((member, index) => (
                                    <li key={index}>
                                        <span className={styles.memberAvatar}>
                                            {member.name.charAt(0)}
                                        </span>
                                        {member.name}({member.email})
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {selectedNotification.status === 'Pending' && (
                            <div className={styles.actionButtons}>
                                <button
                                    className={styles.approveBtn}
                                    onClick={() => handleApproval(selectedNotification._id,'Approved')}
                                >
                                    Approve Request
                                </button>
                                <button
                                    className={styles.rejectBtn}
                                    onClick={() => handleApproval(selectedNotification._id,'Rejected')}
                                >
                                    Reject Request
                                </button>
                            </div>
                        )}

                        {selectedNotification.status !== 'pending' && (
                            <div className={styles.statusDisplay}>
                                <p>This request has been <span className={selectedNotification.status}>
                                    {selectedNotification.status}
                                </span></p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationsSection;