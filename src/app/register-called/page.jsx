"use client";

console.log = () => { };
console.error = () => { };
console.warn = () => { };

import withAuth from "@/components/AuthFunction";
import { Header } from "@/components/Header";
import { InputForm, InputFormComplement } from "@/components/Inputs";
import { registerCalled } from "@/service/calledService";
import axios from "axios";
import { useEffect, useState } from "react";
import { IoIosSend } from "react-icons/io";
import { useContext } from "react";
import { UserContext } from "@/providers/userContext";
import { getAllClients } from "@/service/userManagementService";
import { toast } from "@/hooks/use-toast";

const RegisterCalled = () => {
  const [typeService, setTypeService] = useState(null);
  const { user } = useContext(UserContext);
  const [clients, setClients] = useState([]);

  const [formData, setFormData] = useState({
    clientId: user.client_id,
    contactEmail: "",
    contactPhoneNumber: "",
    addressCEP: "",
    addressNumber: "",
    addressComplement: "",
    callReasonDescription: "",
    isRecurringCall: false,
    district: "",
    street: "",
  });

  const handleServiceTypeChange = (e) => {
    setTypeService(e.target.value);
    console.log(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const calledData = {
        clientId: formData.clientId,
        contactEmail: formData.contactEmail,
        contactPhoneNumber: formData.contactPhoneNumber,
        addressCEP: formData.addressCEP,
        addressNumber: formData.addressNumber,
        addressComplement: formData.addressComplement,
        serviceType: parseInt(typeService, 10),
        callReasonDescription: formData.callReasonDescription,
        isRecurringCall: formData.isRecurringCall,
      };

      const response = await registerCalled(calledData);
      console.log("Chamado registrado com sucesso:", response.data);
        toast({
          title: "Chamado Criado com sucesso !",
          description: `Chamado foi criado com sucesso.`,
        });
      setFormData({
        clientId: "",
        contactEmail: "",
        contactPhoneNumber: "",
        addressCEP: "",
        addressNumber: "",
        addressComplement: "",
        callReasonDescription: "",
        isRecurringCall: false,
      });
    } catch (error) {
      console.error("Erro ao registrar o chamado:", error);
      toast({
        title: "Não foi possivel cadastrar chamado !",
        description: `Verifique as informações corretamentes`,
      });
    }
  };

  useEffect(() => {
    // Função para buscar os clientes
    const fetchClients = async () => {
      try {
        const clientsData = await getAllClients();
        setClients(clientsData); // Atualiza o estado com a lista de clientes
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    };

    fetchClients();
  }, []);

  const handleCEPChange = async (txt) => {
    const cep = txt.target.value;
    setFormData({ ...formData, addressCEP: cep });

    if (cep.length === 8) {
      try {
        const response = await axios.get(
          `https://viacep.com.br/ws/${cep}/json/`
        );
        if (response.data && !response.data.erro) {
          setFormData((prevData) => ({
            ...prevData,
            district: response.data.bairro || "",
            street: response.data.logradouro || "",
          }));
        } else {
          alert("CEP não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        alert("Erro ao buscar o CEP. Verifique sua conexão e tente novamente.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F1F1] overflow-x-hidden">
      <Header />
      <div className=" w-[100%] flex items-center justify-center">
        <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg flex flex-col items-center w-full max-w-4xl mx-auto mt-10 mb-10 sm:w-[90%] lg:w-[50%]">
          <h2 className="text-2xl font-nunito-bold mb-4 text-center mt-8">
            Cadastre seu chamado
          </h2>
          <form
            className="space-y-4 w-full px-4 sm:px-8 lg:w-[80%]"
            onSubmit={handleSubmit}
          >
            <select
              className="w-full h-auto mt-2 p-2 rounded-lg border border-[#142937] font-nunito placeholder-[#124262] text-[#124262]"
              value={formData.clientId}
              onChange={(e) =>
                setFormData({ ...formData, clientId: e.target.value })
              }
            >
              <option value="">Selecione o cliente</option>
              {clients.map((client) => (
                <option key={client.clientId} value={client.clientId}>
                  {client.tradeName}{" "}
                </option>
              ))}
            </select>

            <InputForm
              placeholder="Email"
              type="email"
              name="email"
              value={formData.contactEmail}
              additionalClasses={"w-full"}
              onChange={(txt) =>
                setFormData({
                  ...formData,
                  contactEmail: txt.target.value,
                })
              }
            />

            <InputForm
              placeholder="Telefone"
              type="tel"
              name="phone"
              additionalClasses={"w-full"}
              value={formData.contactPhoneNumber}
              onChange={(txt) =>
                setFormData({
                  ...formData,
                  contactPhoneNumber: txt.target.value,
                })
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <InputForm
                placeholder="CEP"
                type="number"
                name="cep"
                additionalClasses={"w-full"}
                value={formData.addressCEP}
                onChange={handleCEPChange}
              />
              <InputForm
                placeholder="Bairro"
                type="text"
                name="district"
                additionalClasses={"w-full"}
                value={formData.district}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputForm
                placeholder="Rua"
                type="text"
                name="Street"
                additionalClasses={"w-full"}
                value={formData.street}
              />
              <InputForm
                placeholder="Nº"
                type="Number"
                name="Number"
                additionalClasses={"w-full"}
                value={formData.addressNumber}
                onChange={(txt) =>
                  setFormData({
                    ...formData,
                    addressNumber: txt.target.value,
                  })
                }
              />
            </div>

            <InputFormComplement
              placeholder="Complemento"
              type="text"
              name="complement"
              additionalClasses={"w-full"}
              value={formData.addressComplement}
              onChange={(txt) =>
                setFormData({
                  ...formData,
                  addressComplement: txt.target.value,
                })
              }
            />

            <select
              onChange={handleServiceTypeChange}
              className="w-full h-auto mt-2 p-2 rounded-lg border border-[#142937] font-nunito placeholder-[#124262] text-[#124262]"
              value={typeService}
            >
              <option>Selecione uma opção</option>
              <option value={0}>Instalação</option>
              <option value={1}>Manutenção</option>
            </select>

            <textarea
              placeholder="Descrição"
              className="w-full h-auto mt-2 p-2 rounded-lg border border-[#142937] font-nunito placeholder-[#124262] text-[#124262]"
              rows="4"
              value={formData.callReasonDescription}
              onChange={(txt) =>
                setFormData({
                  ...formData,
                  callReasonDescription: txt.target.value,
                })
              }
            ></textarea>
            <div className="flex items-center space-x-2">
              <input
                checked={formData.isRecurringCall}
                type="checkbox"
                id="recorrente"
                className="w-4 h-4"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isRecurringCall: e.target.checked,
                  })
                }
              />
              <label htmlFor="recorrente" className="font-nunito">
                É motivado por problema recorrente?
              </label>
            </div>
            <button
              type="submit"
              className=" flex items-center justify-center gap-1 w-full bg-custom-gradient text-white p-2 rounded-md hover:bg-blue-700"
            >
              <IoIosSend size={20} />
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterCalled;
