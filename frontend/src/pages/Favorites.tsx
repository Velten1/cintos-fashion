import { useState, useEffect } from 'react';
import { FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';

interface FavoriteProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  promotionalPrice?: number;
  inStock: boolean;
}

const Favorites = () => {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Buscar favoritos da API
    setTimeout(() => {
      setFavorites([]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleRemoveFavorite = (productId: string) => {
    // TODO: Remover favorito da API
    setFavorites(favorites.filter((fav) => fav.id !== productId));
  };

  const handleAddToCart = (productId: string) => {
    // TODO: Adicionar ao carrinho via API
    alert('Produto adicionado ao carrinho!');
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-dark mb-4">Meus Favoritos</h1>
          <p className="text-slate/70 text-lg">
            {favorites.length > 0
              ? `Você tem ${favorites.length} ${favorites.length === 1 ? 'produto favorito' : 'produtos favoritos'}`
              : 'Salve seus produtos favoritos para comprar depois'}
          </p>
        </div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-blue/40 shadow-lg p-12 text-center">
            <FaHeart className="text-6xl text-slate/30 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-dark mb-2">Nenhum favorito encontrado</h3>
            <p className="text-slate/70 mb-6">
              Adicione produtos aos favoritos para encontrá-los facilmente depois!
            </p>
            <a
              href="/catalogo"
              className="inline-block bg-gradient-to-r from-blue to-dark text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            >
              Explorar Produtos
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <div
                key={product.id}
                className="bg-white/70 backdrop-blur-xl rounded-2xl border border-blue/40 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                        Fora de Estoque
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => handleRemoveFavorite(product.id)}
                    className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-colors group/btn"
                  >
                    <FaHeart className="text-red-500 group-hover/btn:text-white" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-dark mb-2 line-clamp-2">{product.name}</h3>
                  
                  {/* Price */}
                  <div className="mb-4">
                    {product.promotionalPrice ? (
                      <div>
                        <span className="text-sm text-slate/70 line-through">
                          R$ {product.price.toFixed(2)}
                        </span>
                        <span className="text-2xl font-bold text-green-600 ml-2">
                          R$ {product.promotionalPrice.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-dark">
                        R$ {product.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      disabled={!product.inStock}
                      className="flex-1 bg-gradient-to-r from-blue to-dark text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <FaShoppingCart />
                      {product.inStock ? 'Adicionar' : 'Indisponível'}
                    </button>
                    <button
                      onClick={() => handleRemoveFavorite(product.id)}
                      className="px-4 py-3 bg-red-500/10 text-red-500 rounded-xl font-semibold hover:bg-red-500/20 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;

