import React, { useState } from 'react';
import styles from '../css/NotificationSection.module.css';

const NotificationsSection = () => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'membership',
            club: 'Robotics Club',
            president: 'Bob Johnson',
            message: 'Request to add 5 new members',
            status: 'pending',
            date: '2023-06-15T10:30:00',
            members: ['Sarah Lee', 'Michael Chen', 'Emma Wilson', 'David Kim', 'Priya Patel']
        },
        {
            id: 2,
            type: 'membership',
            club: 'Literary Club',
            president: 'Alice Smith',
            message: 'Request to add 3 new members',
            status: 'pending',
            date: '2023-06-14T14:45:00',
            members: ['James Wilson', 'Sophia Martinez', 'Liam Brown']
        },
        {
            id: 3,
            type: 'membership',
            club: 'Photography Club',
            president: 'Diana Prince',
            message: 'Request to add 2 new members',
            status: 'approved',
            date: '2023-06-10T09:15:00',
            members: ['Olivia Johnson', 'Noah Garcia']
        }
    ]);

    const [activeTab, setActiveTab] = useState('pending');
    const [selectedNotification, setSelectedNotification] = useState(null);

    const handleApprove = (id) => {
        setNotifications(notifications.map(notif =>
            notif.id === id ? { ...notif, status: 'approved' } : notif
        ));
        setSelectedNotification(null);
    };

    const handleReject = (id) => {
        setNotifications(notifications.map(notif =>
            notif.id === id ? { ...notif, status: 'rejected' } : notif
        ));
        setSelectedNotification(null);
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

    return (
        <div className={styles.notificationsContainer}>
            <div className={styles.notificationsHeader}>
                <h2>Membership Requests</h2>
                <div className={styles.tabs}>
                    <button
                        className={activeTab === 'pending' ? styles.active : ''}
                        onClick={() => setActiveTab('pending')}
                    >
                        Pending
                        <span className={styles.badge}>
                            {notifications.filter(n => n.status === 'pending').length}
                        </span>
                    </button>
                    <button
                        className={activeTab === 'approved' ? styles.active : ''}
                        onClick={() => setActiveTab('approved')}
                    >
                        Approved
                    </button>
                    <button
                        className={activeTab === 'rejected' ? styles.active : ''}
                        onClick={() => setActiveTab('rejected')}
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
                            <div
                                key={notification.id}
                                className={`${styles.notificationCard} ${styles[notification.status]}`}
                                onClick={() => setSelectedNotification(notification)}
                            >
                                <div className={styles.notificationIcon}>
                                    {notification.type === 'membership' && (
                                        <svg viewBox="0 0 24 24">
                                            <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                                        </svg>
                                    )}
                                </div>
                                <div className={styles.notificationContent}>
                                    <h3>{notification.club}</h3>
                                    <p>{notification.message}</p>
                                    <div className={styles.notificationMeta}>
                                        <span className={styles.president}>{notification.president}</span>
                                        <span className={styles.date}>{formatDate(notification.date)}</span>
                                    </div>
                                </div>
                                <div className={styles.notificationStatus}>
                                    <span className={`${styles.statusBadge} ${styles[notification.status]}`}>
                                        {notification.status}
                                    </span>
                                </div>
                            </div>
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
                        <h3>{selectedNotification.club} Membership Request</h3>
                        <div className={styles.modalHeader}>
                            <span className={styles.president}>From: {selectedNotification.president}</span>
                            <span className={styles.date}>{formatDate(selectedNotification.date)}</span>
                        </div>

                        <div className={styles.membersList}>
                            <h4>Requested Members:</h4>
                            <ul>
                                {selectedNotification.members.map((member, index) => (
                                    <li key={index}>
                                        <span className={styles.memberAvatar}>
                                            {member.charAt(0)}
                                        </span>
                                        {member}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {selectedNotification.status === 'pending' && (
                            <div className={styles.actionButtons}>
                                <button
                                    className={styles.approveBtn}
                                    onClick={() => handleApprove(selectedNotification.id)}
                                >
                                    Approve Request
                                </button>
                                <button
                                    className={styles.rejectBtn}
                                    onClick={() => handleReject(selectedNotification.id)}
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