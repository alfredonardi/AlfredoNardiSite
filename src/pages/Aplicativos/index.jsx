import { useEffect, useState } from 'react'
import Card from '../../components/Card'
import styles from './Aplicativos.module.css'

function Aplicativos() {

    const [repositories, setRepositories] = useState([])

    useEffect(() => {
        const buscarRepositorios = async () => {
            const response = await fetch('https://api.github.com/users/edsonmaia/repos?page=1&per_page=100')
            const data = await response.json()
            setRepositories(data)
        }
        buscarRepositorios()
    }, [])

    return (
        <section className={styles.aplicativos}>
            <h2>Aplicativos</h2>
            {
                repositories.length > 0 ? (
                    <section className={styles.lista}>
                        {
                            repositories.map((repo) => (
                                <Card
                                    key={repo.id}
                                    name={repo.name}
                                    description={repo.description}
                                    html_url={repo.html_url}
                                />
                            ))
                        }
                    </section>
                ) : (
                    <p>Carregando aplicativos...</p>
                )
            }
        </section>
    )
}

export default Aplicativos
