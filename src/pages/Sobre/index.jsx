import styles from './Sobre.module.css'
import avatar from './images/avatar.webp'
import fgv from './images/FGV.png'
import pc from './images/PC.webp'
import usp from './images/usp.svg'
import goe from './images/GOE.jpg'


function Sobre() {
    return (
        <section className={styles.sobre}>

            <div className={styles.bio}>
                <img src={avatar} alt="Avatar" className={styles.avatar} />
                <div className={styles.textos}>
                    <h2>Sobre</h2>

                    <p>Sou <span>Alfredo Nardi</span> <br />
                        <strong>Investigador de Policial</strong> </p>

                    <p>Trabalho esclarecendo crimes de homicídios desde 2001.</p>

                    <p>Sou apaixonado por solucionar crimes complexos.</p>

                    <p>Especializado em investigação de homicídios, <br />
                        com foco em investigação digital e interpessoal.</p>
                </div>
            </div>

            <div className={styles.techs}>
                <h3>Formação e Experiência</h3>
                <div className={styles.icones}>
                    <img src={usp} alt="Icone da USP" />
                    <img src={fgv} alt="Icone da FGV" />
                    <img src={pc} alt="Icone da PC" />
                    <img src={goe} alt="Icone do GOE" />
                </div>
            </div>

        </section>
    )
}

export default Sobre