import { FaPlus, FaTrash } from 'react-icons/fa';

interface ProductFormImagesProps {
  imageUrl: string;
  images: string[];
  newImageUrl: string;
  onImageUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNewImageUrlChange: (value: string) => void;
  onAddImage: () => void;
  onRemoveImage: (index: number) => void;
}

const ProductFormImages = ({
  imageUrl,
  images,
  newImageUrl,
  onImageUrlChange,
  onNewImageUrlChange,
  onAddImage,
  onRemoveImage,
}: ProductFormImagesProps) => {
  return (
    <div className="space-y-4 border-t border-blue/20 pt-4">
      <h3 className="text-lg font-semibold text-dark">Imagens</h3>
      
      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-dark mb-1.5">
          URL da Imagem Principal
        </label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          value={imageUrl}
          onChange={onImageUrlChange}
          className="w-full px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
          placeholder="https://exemplo.com/imagem.jpg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-dark mb-1.5">
          Galeria de Imagens
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            value={newImageUrl}
            onChange={(e) => onNewImageUrlChange(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onAddImage();
              }
            }}
            className="flex-1 px-4 py-2.5 text-sm bg-white/60 border border-blue/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-blue/40"
            placeholder="https://exemplo.com/imagem2.jpg"
          />
          <button
            type="button"
            onClick={onAddImage}
            className="px-4 py-2.5 bg-blue/20 text-dark rounded-lg hover:bg-blue/30 transition-colors flex items-center gap-2"
          >
            <FaPlus className="text-sm" />
            <span>Adicionar</span>
          </button>
        </div>
        {images.length > 0 && (
          <div className="mt-2 space-y-2">
            {images.map((img, index) => (
              <div key={index} className="flex items-center justify-between bg-white/40 p-2 rounded-lg">
                <span className="text-sm text-dark truncate flex-1">{img}</span>
                <button
                  type="button"
                  onClick={() => onRemoveImage(index)}
                  className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex items-center gap-1"
                >
                  <FaTrash className="text-xs" />
                  <span>Remover</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFormImages;

