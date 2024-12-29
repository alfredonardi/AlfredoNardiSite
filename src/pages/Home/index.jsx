import { Link } from 'react-router-dom'
import styles from './Home.module.css'
function Home() {
    return (
        <>

            <section className={styles.home}>
                <div className='styles.apresentacao'>
                    <p>
                        Bem vindo ao futuro <br />
                        da investigação de homicídios! <br />
                        <span>Alfredo Nardi</span> <br />
                        Investigador de Polícia
                    </p>
                    <Link to="/sobre" className={`${styles.btn} ${styles.btn_red}`}>
                        Comece aqui
                    </Link>
                </div>
                <figure>
                    <img className={styles.img_home} src="/homeICON.svg" alt="Imagem de Home" />
                </figure>
            </section>
        </>
    )
}

export default Home