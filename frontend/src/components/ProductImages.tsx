interface ProductImagesProps {
  imagens: string[];
  imagemSelecionada: number;
  onSelectImage: (index: number) => void;
  produtoNome: string;
}

const ProductImages = ({ imagens, imagemSelecionada, onSelectImage, produtoNome }: ProductImagesProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, isThumbnail = false) => {
    const target = e.target as HTMLImageElement;
    if (target.src.includes('data:image') || target.dataset.fallback === 'true') {
      target.style.display = 'none';
      return;
    }
    target.dataset.fallback = 'true';
    const size = isThumbnail ? '200' : '600';
    target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'%3E%3Crect fill='%23D8E1E8' width='${size}' height='${size}'/%3E%3Ctext fill='%235A6A7A' font-family='system-ui,-apple-system' font-size='${isThumbnail ? '14' : '24'}' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EProduto%3C/text%3E%3C/svg%3E`;
  };

  return (
    <div className="space-y-4">
      <div className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-blue/20 to-blue/10 border border-blue/40">
        <img
          src={imagens[imagemSelecionada]}
          alt={produtoNome}
          className="w-full h-full object-cover"
          onError={(e) => handleImageError(e, false)}
        />
      </div>
      {imagens.length > 1 && (
        <div className="flex gap-4">
          {imagens.map((img, index) => (
            <button
              key={index}
              onClick={() => onSelectImage(index)}
              className={`flex-1 aspect-square overflow-hidden rounded-xl border-2 transition-all ${
                imagemSelecionada === index
                  ? 'border-dark scale-105'
                  : 'border-blue/40 hover:border-dark/50'
              }`}
            >
              <img
                src={img}
                alt={`${produtoNome} ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => handleImageError(e, true)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImages;

