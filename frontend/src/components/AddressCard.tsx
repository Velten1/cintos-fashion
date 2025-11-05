import { FaEdit, FaTrash, FaStar } from 'react-icons/fa';
import type { Address } from '../services/addressServices';

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

const AddressCard = ({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) => {
  return (
    <div
      className={`relative bg-white/70 backdrop-blur-xl rounded-2xl border shadow-lg p-6 ${
        address.isDefault
          ? 'border-green-500 ring-2 ring-green-500/20'
          : 'border-blue/40'
      }`}
    >
      {/* Badge padrão */}
      {address.isDefault && (
        <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-full text-xs font-semibold">
          <FaStar />
          <span>Padrão</span>
        </div>
      )}

      <div className="pr-20">
        <h3 className="text-xl font-bold text-dark mb-2">{address.name}</h3>
        <div className="space-y-1 text-slate/70 text-sm">
          <p>
            {address.street}, {address.number}
            {address.complement && ` - ${address.complement}`}
          </p>
          <p>{address.neighborhood}</p>
          <p>
            {address.city} - {address.state}
          </p>
          <p>CEP: {address.zipCode.replace(/(\d{5})(\d{3})/, '$1-$2')}</p>
        </div>
      </div>

      {/* Ações */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-blue/20">
        {!address.isDefault && (
          <button
            onClick={() => onSetDefault(address.id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue/20 text-blue rounded-lg hover:bg-blue/30 transition-colors text-sm"
          >
            <FaStar />
            <span>Definir como padrão</span>
          </button>
        )}
        <button
          onClick={() => onEdit(address)}
          className="px-4 py-2 bg-blue/20 text-blue rounded-lg hover:bg-blue/30 transition-colors"
        >
          <FaEdit />
        </button>
        <button
          onClick={() => onDelete(address.id)}
          className="px-4 py-2 bg-red/20 text-red rounded-lg hover:bg-red/30 transition-colors"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default AddressCard;

