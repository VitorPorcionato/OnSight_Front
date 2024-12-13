"use client";

// console.log = () => {};
// console.error = () => {};
// console.warn = () => {};

import { Header } from "@/components/Header";
import { InputForm, InputFormComplement } from "@/components/Inputs";
import { IoIosSend } from "react-icons/io";
import withAuth from "@/components/AuthFunction";
import { useState, useEffect } from "react";
import { UserContext } from "@/providers/userContext";
import { useContext } from "react";
import { registerCalled } from "@/service/calledService";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

const Called = () => {

  const { user } = useContext(UserContext);

  useEffect(() => {
    console.log("formdata:", formData);
  }, [user]);


  const [typeService, setTypeService] = useState(null);

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
        clientId: "dc77317c-56f6-4a3f-a1d8-389a3f3ccbcc",
        contactEmail: "",
        contactPhoneNumber: "",
        addressCEP: "",
        addressNumber: "",
        addressComplement: "",
        callReasonDescription: "",
        isRecurringCall: false,
        district: "",
        street: ""
      });
    } catch (error) {
      console.error("Erro ao registrar o chamado:", error);
      toast({
        title: "Não foi possivel cadastrar chamado !",
        description: `Verifique as informações corretamentes`,
      });
    }
  };

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
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Componente de formulário */}
          <div className=" w-[100%] flex items-center justify-center">
            <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg flex flex-col items-center w-[80%]">
              <h2 className="text-2xl font-nunito-bold mb-4 text-center">
                Cadastre seu chamado
              </h2>
              <form className="space-y-4 w-[70%]" onSubmit={handleSubmit}>
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

          {/* Cards de contato */}
          <div className=" flex flex-col items-center justify-between space-y-6">
            <div className="bg-custom-gradient p-4 rounded-lg shadow-lg h-[50%] w-[90%] flex flex-col justify-around">
              <h3 className="text-xl font-nunito-bold">
                Fale Conosco por Telefone !
              </h3>
              <p className="font-nunito">
                Precisa de suporte ou deseja agendar um atendimento? Nossa
                equipe está pronta para ajudar! Entre em contato pelo nosso
                telefone e fale diretamente com nossos especialistas. Estamos
                aqui para oferecer soluções rápidas e eficientes, garantindo que
                você tenha a melhor experiência possível.
              </p>
              <p className="mt-2 font-nunito-bold">
                Telefone para Atendimento: (11) 98573-4321
              </p>
            </div>

            <div className="bg-custom-gradient p-4 rounded-lg shadow-lg h-[50%] w-[90%] flex flex-col justify-around">
              <h3 className="text-xl font-nunito-bold">
                Fale Conosco por E-mail !
              </h3>
              <p className="font-nunito">
                Tem dúvidas, sugestões ou precisa de suporte? Nossa equipe de
                atendimento está pronta para ajudar! Envie sua mensagem para o
                nosso e-mail, e responderemos o mais rápido possível, oferecendo
                a atenção e o cuidado que você merece.
              </p>
              <p className="mt-2 font-nunito-bold">
                E-mail para Contato: contato@email.com
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Called;