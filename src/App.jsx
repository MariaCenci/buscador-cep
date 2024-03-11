import { useState } from "react";
import "./App.scss";
import { CiSearch } from "react-icons/ci";

const BASE_URL = "https://viacep.com.br/ws/";

function App() {
  const [input, setInput] = useState("");
  const [localidade, setLocalidade] = useState(null);
  const [estado, setEstado] = useState("");
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setInput(e);
    console.log(e);
  };

  const urlSearch = `${BASE_URL}${input}/json/`;

  const validarCep = (cep) => {
    const onlyNumbers = cep.replace(/[^\d]/g, "");
    console.log(onlyNumbers);

    if (onlyNumbers.length === 8 && /^\d+$/.test(onlyNumbers)) {
      console.log(onlyNumbers);

      return onlyNumbers;
    } else {
      setError("CEP invalido");
    }
  };

  const req = async (url) => {
    try {
      
      const res = await fetch(url);
      console.log(res);

      if (!res.ok) {
        throw new Error("erro na requisição");
      }
      const data = await res.json();
      console.log(data);
      return data;
    } catch (e) {
      console.log(`erro na requisição ${e.message}`);
      setError(`CEP não encontrado`);
      console.log(error);
    }
  };
  const getCep = async () => {
    setError(null);
    const cepValidado = validarCep(input);
    console.log(input)

    if (cepValidado) {
      console.log(cepValidado)
      const data = await req(`${BASE_URL}${cepValidado}/json/`);
      if (data) {
        await Promise.all([getLocalidade(data), getEstado(data)]);
      } else {
        setError("erro na validacao")
      }
    }
  };

  const getLocalidade = (data) => {
    const localidadeCep = data.localidade;
    setLocalidade(localidadeCep);
    console.log(`localidade: ${localidadeCep}`);
  };

  const getEstado = (data) => {
    const estadoCep = data.uf;
    setEstado(estadoCep);
  };

  return (
    <>
      <div className="container">
        <h1 className="title">Buscador de CEP</h1>
        <div className="input-container">
          <input
            type="text"
            placeholder="Digite um CEP..."
            value={input}
            onChange={(e) => handleChange(e.target.value)}
          />
          <button className="search-btn" onClick={getCep}>
            <CiSearch color="#FFF" />
          </button>
        </div>
        <div className="resultado">
          {localidade != null && estado && !error && (
            <h2 className="localidade">
              {localidade} - {estado}
            </h2>
          )}
          {localidade === null && !estado && !error && <h2>...</h2>}
          {error && <h2>{error}</h2>}
          {localidade === undefined && <h2>CEP não encontrado</h2>}
        </div>
      </div>
    </>
  );
}

export default App;
