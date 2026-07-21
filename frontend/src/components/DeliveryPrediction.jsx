import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FaTruck, FaMapMarkerAlt, FaStore, FaBoxOpen, FaCreditCard, FaDollarSign, FaCalculator, FaTimes } from 'react-icons/fa';

export const DeliveryPrediction = () => {
  // Dropdown Options
  const STATE_NAMES = {
    AC: 'Acre',
    AL: 'Alagoas',
    AM: 'Amazonas',
    AP: 'Amapá',
    BA: 'Bahia',
    CE: 'Ceará',
    DF: 'Distrito Federal',
    ES: 'Espírito Santo',
    GO: 'Goiás',
    MA: 'Maranhão',
    MG: 'Minas Gerais',
    MS: 'Mato Grosso do Sul',
    MT: 'Mato Grosso',
    PA: 'Pará',
    PB: 'Paraíba',
    PE: 'Pernambuco',
    PI: 'Piauí',
    PR: 'Paraná',
    RJ: 'Rio de Janeiro',
    RN: 'Rio Grande do Norte',
    RO: 'Rondônia',
    RR: 'Roraima',
    RS: 'Rio Grande do Sul',
    SC: 'Santa Catarina',
    SE: 'Sergipe',
    SP: 'São Paulo',
    TO: 'Tocantins'
  };

  const customerStates = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'];
  
  const sellerStates = ['AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RS', 'SC', 'SE', 'SP'];
  
  const paymentTypes = [
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'boleto', label: 'Boleto' },
    { value: 'debit_card', label: 'Debit Card' },
    { value: 'voucher', label: 'Voucher' }
  ];
  
  const categories = [
    { value: 'Unknown', label: 'Unknown' },
    { value: 'agro_industria_e_comercio', label: 'Agro, Industry & Commerce' },
    { value: 'alimentos', label: 'Foods' },
    { value: 'alimentos_bebidas', label: 'Foods & Drinks' },
    { value: 'artes', label: 'Arts' },
    { value: 'artes_e_artesanato', label: 'Arts & Crafts' },
    { value: 'artigos_de_festas', label: 'Party Articles' },
    { value: 'artigos_de_natal', label: 'Christmas Articles' },
    { value: 'audio', label: 'Audio' },
    { value: 'automotivo', label: 'Automotive' },
    { value: 'bebes', label: 'Babies' },
    { value: 'bebidas', label: 'Drinks' },
    { value: 'beleza_saude', label: 'Beauty & Health' },
    { value: 'brinquedos', label: 'Toys' },
    { value: 'cama_mesa_banho', label: 'Bed, Bath & Table' },
    { value: 'casa_conforto', label: 'Home Comfort' },
    { value: 'casa_conforto_2', label: 'Home Comfort 2' },
    { value: 'casa_construcao', label: 'Home & Construction' },
    { value: 'cds_dvds_musicais', label: 'CDs & DVDs (Music)' },
    { value: 'cine_foto', label: 'Cine & Photo' },
    { value: 'climatizacao', label: 'Air Conditioning' },
    { value: 'consoles_games', label: 'Consoles & Games' },
    { value: 'construcao_ferramentas_construcao', label: 'Construction Tools (Construction)' },
    { value: 'construcao_ferramentas_ferramentas', label: 'Construction Tools (Tools)' },
    { value: 'construcao_ferramentas_iluminacao', label: 'Construction Tools (Lighting)' },
    { value: 'construcao_ferramentas_jardim', label: 'Construction Tools (Garden)' },
    { value: 'construcao_ferramentas_seguranca', label: 'Construction Tools (Security)' },
    { value: 'cool_stuff', label: 'Cool Stuff' },
    { value: 'dvds_blu_ray', label: 'DVDs & Blu-Ray' },
    { value: 'eletrodomesticos', label: 'Home Appliances' },
    { value: 'eletrodomesticos_2', label: 'Home Appliances 2' },
    { value: 'eletronicos', label: 'Electronics' },
    { value: 'eletroportateis', label: 'Small Appliances' },
    { value: 'esporte_lazer', label: 'Sports & Leisure' },
    { value: 'fashion_bolsas_e_acessorios', label: 'Fashion Bags & Accessories' },
    { value: 'fashion_calcados', label: 'Fashion Shoes' },
    { value: 'fashion_esporte', label: 'Fashion Sports' },
    { value: 'fashion_roupa_feminina', label: 'Fashion Women\'s Clothing' },
    { value: 'fashion_roupa_infanto_juvenil', label: 'Fashion Kids\' Clothing' },
    { value: 'fashion_roupa_masculina', label: 'Fashion Men\'s Clothing' },
    { value: 'fashion_underwear_e_moda_praia', label: 'Fashion Underwear & Beachwear' },
    { value: 'ferramentas_jardim', label: 'Garden Tools' },
    { value: 'flores', label: 'Flowers' },
    { value: 'fraldas_higiene', label: 'Diapers & Hygiene' },
    { value: 'industria_comercio_e_negocios', label: 'Industry, Commerce & Business' },
    { value: 'informatica_acessorios', label: 'Computers & Accessories' },
    { value: 'instrumentos_musicais', label: 'Musical Instruments' },
    { value: 'la_cuisine', label: 'La Cuisine' },
    { value: 'livros_importados', label: 'Imported Books' },
    { value: 'livros_interesse_geral', label: 'General Interest Books' },
    { value: 'livros_tecnicos', label: 'Technical Books' },
    { value: 'malas_acessorios', label: 'Luggage & Accessories' },
    { value: 'market_place', label: 'Marketplace' },
    { value: 'moveis_colchao_e_estofado', label: 'Furniture (Mattresses & Upholstery)' },
    { value: 'moveis_cozinha_area_de_servico_jantar_e_jardim', label: 'Furniture (Kitchen, Dining & Garden)' },
    { value: 'moveis_decoracao', label: 'Furniture & Decor' },
    { value: 'moveis_escritorio', label: 'Office Furniture' },
    { value: 'moveis_quarto', label: 'Bedroom Furniture' },
    { value: 'moveis_sala', label: 'Living Room Furniture' },
    { value: 'musica', label: 'Music' },
    { value: 'papelaria', label: 'Stationery' },
    { value: 'pcs', 'label': 'PCs' },
    { value: 'perfumaria', label: 'Perfumery' },
    { value: 'pet_shop', label: 'Pet Shop' },
    { value: 'portateis_casa_forno_e_cafe', label: 'Portable Home Ovens & Coffee' },
    { value: 'relogios_presentes', label: 'Watches & Gifts' },
    { value: 'seguros_e_servicos', label: 'Insurance & Services' },
    { value: 'sinalizacao_e_seguranca', label: 'Signaling & Security' },
    { value: 'tablets_impressao_imagem', label: 'Tablets & Image Printing' },
    { value: 'telefonia', label: 'Telephony' },
    { value: 'telefonia_fixa', label: 'Fixed Telephony' },
    { value: 'utilidades_domesticas', label: 'Housewares' }
  ];

  // Form State
  const [customerState, setCustomerState] = useState('SP');
  const [sellerState, setSellerState] = useState('SP');
  const [productCategory, setProductCategory] = useState('beleza_saude');
  const [paymentType, setPaymentType] = useState('credit_card');
  const [price, setPrice] = useState(100);
  const [freightValue, setFreightValue] = useState(20);

  // Status State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [predictionResult, setPredictionResult] = useState(null);

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      customer_state: customerState,
      seller_state: sellerState,
      product_category_name: productCategory,
      payment_type: paymentType,
      price: Number(price),
      freight_value: Number(freightValue)
    };

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/predict', payload);
      if (response.data && response.data.success) {
        setPredictionResult(response.data);
      } else {
        setError(response.data.error || 'Failed to predict delivery days.');
      }
    } catch (err) {
      console.error('Prediction API Error:', err);
      const errMsg = err.response?.data?.error || 'Failed to connect to the prediction model server.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low':
        return 'bg-[#4ADE80] text-black border-2 border-black shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]';
      case 'Medium':
        return 'bg-[#FEF08A] text-black border-2 border-black shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]';
      case 'High':
        return 'bg-[#FCA5A5] text-black border-2 border-black shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]';
      default:
        return 'bg-slate-100 text-black border-2 border-black';
    }
  };

  return (
    <div className="glass-panel p-6 md:p-8 rounded-xl relative overflow-hidden bg-grid shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white border-3 border-black">
      
      {/* Header */}
      <div className="flex items-center gap-4 border-b-3 border-black pb-5 mb-6">
        <div className="w-12 h-12 bg-[#C7D2FE] border-3 border-black text-black rounded-2xl flex items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,1)]">
          <FaTruck className="text-2xl" />
        </div>
        <div>
          <h3 className="text-base font-black text-black uppercase tracking-tight flex items-center gap-2">
            🚚 Delivery Prediction
          </h3>
          <p className="text-[10px] text-slate-700 font-bold mt-0.5">
            Predict estimated delivery time using the trained Machine Learning model.
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-[#FCA5A5] border-2 border-black px-4 py-3 rounded-xl mb-6 flex justify-between items-center text-xs font-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2">
            <FaTimes className="text-rose-700 text-sm" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="cursor-pointer font-black text-sm">×</button>
        </div>
      )}

      {/* Prediction Form */}
      <form onSubmit={handlePredict} className="space-y-4 sm:space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
          
          {/* Customer State */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-black flex items-center gap-1">
              <FaMapMarkerAlt className="text-[9px] text-[#FF9900]" />
              <span>Customer State</span>
            </label>
            <select
              value={customerState}
              onChange={(e) => setCustomerState(e.target.value)}
              className="px-3 py-2 bg-white text-xs border-2 border-black rounded-xl text-black font-bold focus:outline-none"
            >
              {customerStates.map((st) => (
                <option key={st} value={st}>{STATE_NAMES[st] || st}</option>
              ))}
            </select>
          </div>

          {/* Seller State */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-black flex items-center gap-1">
              <FaStore className="text-[9px] text-indigo-500" />
              <span>Seller State</span>
            </label>
            <select
              value={sellerState}
              onChange={(e) => setSellerState(e.target.value)}
              className="px-3 py-2 bg-white text-xs border-2 border-black rounded-xl text-black font-bold focus:outline-none"
            >
              {sellerStates.map((st) => (
                <option key={st} value={st}>{STATE_NAMES[st] || st}</option>
              ))}
            </select>
          </div>

          {/* Product Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-black flex items-center gap-1">
              <FaBoxOpen className="text-[9px] text-emerald-500" />
              <span>Product Category</span>
            </label>
            <select
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              className="px-3 py-2 bg-white text-xs border-2 border-black rounded-xl text-black font-bold focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Payment Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-black flex items-center gap-1">
              <FaCreditCard className="text-[9px] text-amber-500" />
              <span>Payment Type</span>
            </label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="px-3 py-2 bg-white text-xs border-2 border-black rounded-xl text-black font-bold focus:outline-none"
            >
              {paymentTypes.map((pt) => (
                <option key={pt.value} value={pt.value}>{pt.label}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-black flex items-center gap-1">
              <FaDollarSign className="text-[9px] text-black" />
              <span>Price ($)</span>
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0.01"
              step="0.01"
              required
              className="px-3 py-2 bg-white text-xs border-2 border-black rounded-xl text-black font-bold focus:outline-none"
            />
          </div>

          {/* Freight Value */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-black flex items-center gap-1">
              <FaCalculator className="text-[9px] text-black" />
              <span>Freight Value ($)</span>
            </label>
            <input
              type="number"
              value={freightValue}
              onChange={(e) => setFreightValue(e.target.value)}
              min="0"
              step="0.01"
              required
              className="px-3 py-2 bg-white text-xs border-2 border-black rounded-xl text-black font-bold focus:outline-none"
            />
          </div>

        </div>

        {/* Prediction Execution Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full brutalist-btn py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>Predicting...</span>
            </>
          ) : (
            <span>Predict Delivery</span>
          )}
        </button>
      </form>

      {/* Prediction Result Display */}
      <AnimatePresence>
        {predictionResult && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-6 border-3 border-black rounded-2xl p-4 sm:p-5 bg-[#FAF6EE] shadow-[3px_3px_0px_rgba(0,0,0,1)] grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {/* Predicted Days Card */}
            <div className="bg-white border-2 border-black p-3.5 sm:p-4 rounded-xl flex items-center gap-3 sm:gap-4 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              <div className="w-10 h-10 rounded-lg bg-[#C7D2FE] border border-black flex items-center justify-center text-black font-black text-lg shrink-0">
                📦
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-slate-500 block mb-0.5">Estimated Delivery</span>
                <span className="text-lg sm:text-xl font-black text-black">{predictionResult.predicted_days} Days</span>
              </div>
            </div>

            {/* Risk Card */}
            <div className="bg-white border-2 border-black p-3.5 sm:p-4 rounded-xl flex items-center gap-3 sm:gap-4 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              <div className="w-10 h-10 rounded-lg bg-[#FDE68A] border border-black flex items-center justify-center text-black font-black text-lg shrink-0">
                ⚠️
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-slate-500 block mb-1">Risk Level</span>
                <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-full ${getRiskColor(predictionResult.risk)}`}>
                  {predictionResult.risk}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default DeliveryPrediction;
