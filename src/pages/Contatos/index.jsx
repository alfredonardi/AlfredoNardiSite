import styles from './Contatos.module.css'
import { GoMail } from 'react-icons/go'
import { BsInstagram, BsWhatsapp, BsYoutube, BsLinkedin } from 'react-icons/bs'
function Contatos() {
    return (
                <section className={styles.contatos}>
                    <h2>CONTATOS</h2>
                    <h3>Entre em contato</h3>
                    <p>Para que possamos conversar mais sobre.</p>
               

                    <div className={styles.icones}>

                        <a href='mailto:alfredo@alfredonardi.com' target='_blank' rel='noopener noreferrer'>
                            <GoMail className={styles.icone} />
                        </a>

                        <a href='https://www.instagram.com/alfredonardi/' target='_blank' rel='noopener noreferrer'>
                            <BsInstagram className={styles.icone} />
                        </a>

                        <a href='https://wa.me/5511964784646' target='_blank' rel='noopener noreferrer'>
                            <BsWhatsapp className={styles.icone} />
                        </a>

                        <a href='mailto:alfredo@alfredonardi.com' target='_blank' rel='noopener noreferrer'>
                            <BsYoutube className={styles.icone} />
                        </a>

                        <a href='https://www.linkedin.com/in/nardialfredo/' target='_blank' rel='noopener noreferrer'>
                              <BsLinkedin className={styles.icone} />
                        </a>
                    </div>
                </section>
    )
}

export default Contatos
 