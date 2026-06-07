
import { motion } from 'framer-motion';
import './Accueil.css';

const Accueil = () => {
    // Variantes d'animation pour le conteneur principal
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
            },
        },
    };

    // Variantes d'animation pour les enfants
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: 'easeOut' },
        },
    };

    // Variantes pour le titre
    const titleVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 1, ease: 'easeOut' },
        },
    };

    return ( 
        <motion.div
            className="accueil-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="dashboard-panel container text-center accueil-content">
                <motion.div
                    className="welcome-header"
                    variants={titleVariants}
                >
                    <motion.h2
                        className="text-primary welcome-title"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        Bienvenu sur votre plateforme
                    </motion.h2>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <motion.p
                        className="welcome-subtitle"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    >
                        Gérer votre stock facilement
                    </motion.p>
                </motion.div>

                <motion.div
                    className="features-grid"
                    variants={containerVariants}
                >
                    <motion.div className="feature-card" variants={itemVariants}>
                        <motion.div
                            className="feature-icon"
                            whileHover={{ rotate: 10, scale: 1.1 }}
                        >
                            📊
                        </motion.div>
                        <h4>Tableau de Bord</h4>
                        <p>Visualisez vos statistiques en temps réel</p>
                    </motion.div>

                    <motion.div className="feature-card" variants={itemVariants}>
                        <motion.div
                            className="feature-icon"
                            whileHover={{ rotate: 10, scale: 1.1 }}
                        >
                            📦
                        </motion.div>
                        <h4>Stock</h4>
                        <p>Gérez vos matériels et leurs mouvements</p>
                    </motion.div>

                    <motion.div className="feature-card" variants={itemVariants}>
                        <motion.div
                            className="feature-icon"
                            whileHover={{ rotate: 10, scale: 1.1 }}
                        >
                            👥
                        </motion.div>
                        <h4>Utilisateurs</h4>
                        <p>Administrez les utilisateurs du système</p>
                    </motion.div>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <motion.button
                        className="btn btn-primary cta-button"
                        whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Commencer
                    </motion.button>
                </motion.div>
            </div>
        </motion.div>
     );
}
 
export default Accueil;