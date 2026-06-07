import { motion } from 'framer-motion';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.footer
      className="footer-modern"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="footer-content">
        <div className="container">
          <div className="footer-grid">
            {/* Section Infos */}
            <motion.div className="footer-section" variants={itemVariants}>
              <h5>À Propos</h5>
              <p>Plateforme complète de gestion des stocks et matériels pour optimiser votre entreprise.</p>
            </motion.div>

            {/* Section Rapides */}
            <motion.div className="footer-section" variants={itemVariants}>
              <h5>Liens Rapides</h5>
              <ul className="footer-links">
                <li><a href="/dashboard">Dashboard</a></li>
                <li><a href="/materiel">Matériels</a></li>
                <li><a href="/mouvement">Mouvements</a></li>
                <li><a href="/utilisateur">Utilisateurs</a></li>
              </ul>
            </motion.div>

            {/* Section Contact */}
            <motion.div className="footer-section" variants={itemVariants}>
              <h5>Contact</h5>
              <p>Email: <a href="mailto:support@gestion-stock.com">support@gestion-stock.com</a></p>
              <p>Tél: <a href="tel:+212600000000">+212 6 00 00 00 00</a></p>
            </motion.div>

            {/* Section Réseaux */}
            <motion.div className="footer-section" variants={itemVariants}>
              <h5>Réseaux Sociaux</h5>
              <div className="social-links">
                <a href="#" className="social-icon">f</a>
                <a href="#" className="social-icon">𝕏</a>
                <a href="#" className="social-icon">in</a>
              </div>
            </motion.div>
          </div>

          {/* Footer Bottom */}
          <motion.div className="footer-bottom" variants={itemVariants}>
            <p>&copy; {currentYear} Gestion du Stock - Tous droits réservés</p>
            <p className="footer-version">Version 1.0.0</p>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;
