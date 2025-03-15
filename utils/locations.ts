import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://brasilapi.com.br/api",
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
  },
});

const getCepDataBrazilApi = async (cep: string) => {
  try {
    const res = await apiClient.get(`/cep/v2/${cep}`);
    return res;
  } catch (error) {
    const res = await apiClient.get(`/cep/v1/${cep}`);
    return res;
  }
};

const getEstadosListWithLabel = () => {
  return [
    { value: "AC", label: "Acre" },
    { value: "AL", label: "Alagoas" },
    { value: "AP", label: "Amapá" },
    { value: "AM", label: "Amazonas" },
    { value: "BA", label: "Bahia" },
    { value: "CE", label: "Ceará" },
    { value: "DF", label: "Distrito Federal" },
    { value: "ES", label: "Espírito Santo" },
    { value: "GO", label: "Goiás" },
    { value: "MA", label: "Maranhão" },
    { value: "MT", label: "Mato Grosso" },
    { value: "MS", label: "Mato Grosso do Sul" },
    { value: "MG", label: "Minas Gerais" },
    { value: "PA", label: "Pará" },
    { value: "PB", label: "Paraíba" },
    { value: "PR", label: "Paraná" },
    { value: "PE", label: "Pernambuco" },
    { value: "PI", label: "Piauí" },
    { value: "RJ", label: "Rio de Janeiro" },
    { value: "RN", label: "Rio Grande do Norte" },
    { value: "RS", label: "Rio Grande do Sul" },
    { value: "RO", label: "Rondônia" },
    { value: "RR", label: "Roraima" },
    { value: "SC", label: "Santa Catarina" },
    { value: "SP", label: "São Paulo" },
    { value: "SE", label: "Sergipe" },
    { value: "TO", label: "Tocantins" },
  ];
};

const getCidadesFromEstado = async (estado: string) => {
  try {
    const { data } = await apiClient.get(
      `/ibge/municipios/v1/${estado}?providers=dados-abertos-br,gov,wikipedia`
    );
    return data.map((c: { nome: string }) => c.nome);
  } catch (error) {
    return [];
  }
};

const viaCepApiClient = axios.create({
  baseURL: "https://viacep.com.br/ws",
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
  },
});

const getCepDataViaCep = async (cep: string) => {
  const res = await viaCepApiClient.get(`/${cep}/json`);
  res.data = {
    cep: cep,
    neighborhood: res.data.bairro,
    street: res.data.logradouro,
    city: res.data.localidade,
    state: res.data.uf,
  };
  return res;
};

const getCepData = async (cep: string) => {
  const brasilApiRes = getCepDataBrazilApi(cep);
  const viaCepRes = getCepDataViaCep(cep);
  const res = await Promise.any([brasilApiRes, viaCepRes]);
  return res;
};

export { getCepData, getEstadosListWithLabel, getCidadesFromEstado };
