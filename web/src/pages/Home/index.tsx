import React from 'react';
import logo from '../../assets/logo.svg';
import './styles.css';
import { FiPlusSquare } from 'react-icons/fi';
import { Link } from 'react-router-dom';


const Home = () => {
    return (
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={logo} alt="Ecoleta" /> 
                </header>

                <main>
                    <h1>Seu Marketplace de Coleta de Resíduos.</h1>
                    <p>Ajudamos pessoas a encontrarmos pontos de coleta de forma eficiente.</p>

                    <Link to="/create-point">
                        <span>
                            <FiPlusSquare />
                        </span>
                        <strong>Cadastrar Ponto de Coleta</strong>
                    </Link>
                </main>
            </div>
        </div>
    )
}

export default Home;