import React, { useEffect, useState, ChangeEvent, FormEvent} from 'react';
import './styles.css';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';
import api from '../../services/api';


import logo from '../../assets/logo.svg';

interface Item{
    id: number;
    title: string;
    image_url: string;
}

interface UF{
   sigla:string;
}

interface City{
    nome: string;
}

const CreatePoint = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [citys, setCity] = useState<string[]>([]);
    const [selectedUF, setSelectedUF] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    });
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const history = useHistory();


    useEffect(()=> {
        api.get('items').then(response => {
            setItems(response.data);
        })
    }, []);

    useEffect (()=> {
        axios.get<UF[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome`).then(response =>{
           const ufInitials = response.data.map(uf => uf.sigla);
           setUfs(ufInitials);
        })
    }, []);

    useEffect (() => {
        if (selectedUF === '0') return;
        axios.get<City[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios?orderBy=nome`).then(response => {
            const ci = response.data.map(city => city.nome);
            setCity(ci);
        })
    }, [selectedUF]);

    useEffect (()=> {
        navigator.geolocation.getCurrentPosition(position =>{

            const {latitude, longitude} = position.coords;
            setInitialPosition([
                latitude, 
                longitude
            ]);
            setSelectedPosition([
                latitude,
                longitude
            ]);
        })
    }, []);


    function handleSelectUF(event: ChangeEvent<HTMLSelectElement>){
        setSelectedUF(event.target.value);
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>){
        setSelectedCity(event.target.value);
    }

    function handleMapClick(event: LeafletMouseEvent){
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ]);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const {name, value} = event.target;
        setFormData({ ...formData, [name]:value });
    }

    function handleSelectItem(id: number){

        const alreadySelected = selectedItems.findIndex(item => item === id);

        if (alreadySelected >= 0){
            const filtered = selectedItems.filter(item => item !== id);
            setSelectedItems(filtered);
        }else{
            setSelectedItems([...selectedItems, id]);
        }
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const {name, email, whatsapp } = formData;
        const uf = selectedUF;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const items = selectedItems;

        const data = {
            name,
            email,
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            items,
        }

        await api.post('points', data);
        alert ("Ponto de Coleta Criado!");
        history.push('/');
    }
    return(
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />
                <Link to="/">
                    <span><FiArrowLeft /></span>
                    Voltar para Home
                </Link>
            </header>
            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br / >Ponto de Coleta</h1>

                <fieldset>
                    <legend>
                        <h2>Dados da Entidade</h2>
                    </legend>
                </fieldset>

                <div className="field">
                    <label htmlFor="name">Nome da Entidade</label>
                    <input type="text" id="name" name="name" onChange={handleInputChange} />
                </div>
                <div className="field-group">
                    <div className="field">
                        <label htmlFor="email">E-mail</label>
                        <input type="email" id="email" name="email" onChange={handleInputChange} />
                    </div>
                    <div className="field">
                        <label htmlFor="whatsapp">Whatsapp</label>
                        <input type="text" id="whatsapp" name="whatsapp" onChange={handleInputChange} />
                    </div>
                </div>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o Endereço no Mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={12} onClick={handleMapClick}>
                        <TileLayer 
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf" onChange={handleSelectUF} value={selectedUF}>
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf =>( 
                                    <option  key={uf} value={uf}>{uf}</option>
                                    ))}
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" onChange={handleSelectCity} value={selectedCity}>
                                <option value="0">Selecione uma Cidade</option>
                                {citys.map(city =>(
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de Coleta</h2>
                        <span>Selecione Um ou Mais Itens Abaixo</span>
                    </legend>

                    <ul className="items-grid">
                       {items.map(item => (
                        <li key={item.id} 
                            onClick={() => handleSelectItem(item.id)}
                            className={selectedItems.includes(item.id) ? 'selected' : ''}>
                            <img src={item.image_url} alt={item.title}/>
                            <span>{item.title}</span>
                        </li>
                        ))}
                    </ul>
                </fieldset>

                <button type="submit" >Cadastrar Ponto de Coleta</button>
            </form>
        </div>
    );
};

export default CreatePoint;