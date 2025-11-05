import { FaMapMarkerAlt, FaPlus } from 'react-icons/fa';

interface EmptyAddressesProps {
  onAddClick: () => void;
}

const EmptyAddresses = ({ onAddClick }: EmptyAddressesProps) => {
  return (
    <div className="text-center py-12 bg-white/70 backdrop-blur-xl rounded-2xl border border-blue/40">
      <FaMapMarkerAlt className="mx-auto text-6xl text-slate/30 mb-4" />
      <p className="text-slate/70 text-lg mb-4">Nenhum endereço cadastrado</p>
      <button
        onClick={onAddClick}
        className="inline-flex items-center gap-2 px-6 py-3 bg-dark text-light rounded-lg hover:bg-slate transition-colors"
      >
        <FaPlus />
        <span>Adicionar Primeiro Endereço</span>
      </button>
    </div>
  );
};

export default EmptyAddresses;

