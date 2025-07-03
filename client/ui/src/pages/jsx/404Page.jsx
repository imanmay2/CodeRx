
import styles from '../css/NotFound.module.css';

const NotFoundPage = () => {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>404</h1>
                <p className={styles.subtitle}>"This is not the page you're looking for..."</p>

                <div className={styles.hologram}>
                    <img
                        src="https://media.giphy.com/media/l2JJKs3Smsqjdgq0Gw/giphy.gif"
                        alt="Obi-Wan Kenobi Hand Wave"
                        className={styles.obiWan}
                    />
                    <div className={styles.hologramEffect}></div>
                </div>

                <p className={styles.message}>Move along, move along.</p>
                <a href="/" className={styles.homeButton}>
                    <span>Return to Base</span>
                    <svg className={styles.buttonIcon} viewBox="0 0 24 24">
                        <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
                    </svg>
                </a>
            </div>

            <div className={styles.stars}>
                {[...Array(50)].map((_, i) => (
                    <div key={i} className={styles.star} style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        width: `${Math.random() * 3 + 1}px`,
                        height: `${Math.random() * 3 + 1}px`
                    }}></div>
                ))}
            </div>
        </div>
    );
};

export default NotFoundPage;