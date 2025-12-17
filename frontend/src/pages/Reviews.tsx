import { useState, useEffect } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

interface Review {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  rating: number;
  comment: string;
  date: string;
}

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Buscar avaliações da API
    setTimeout(() => {
      setReviews([]);
      setLoading(false);
    }, 1000);
  }, []);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-500" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-500" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-500" />);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-gray-200 rounded-2xl"></div>
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
          <h1 className="text-4xl lg:text-5xl font-bold text-dark mb-4">Minhas Avaliações</h1>
          <p className="text-slate/70 text-lg">Veja e gerencie suas avaliações de produtos</p>
        </div>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-blue/40 shadow-lg p-12 text-center">
            <FaStar className="text-6xl text-slate/30 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-dark mb-2">Nenhuma avaliação encontrada</h3>
            <p className="text-slate/70 mb-6">
              Você ainda não avaliou nenhum produto. Após receber seus pedidos, volte aqui para avaliar!
            </p>
            <a
              href="/minha-conta/pedidos"
              className="inline-block bg-gradient-to-r from-blue to-dark text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            >
              Ver Meus Pedidos
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white/70 backdrop-blur-xl rounded-2xl border border-blue/40 shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex gap-6">
                  {/* Product Image */}
                  <img
                    src={review.productImage}
                    alt={review.productName}
                    className="w-24 h-24 object-cover rounded-xl"
                  />

                  {/* Review Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-dark mb-2">{review.productName}</h3>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex gap-1">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-slate/70 text-sm">
                        {review.rating.toFixed(1)} / 5.0
                      </span>
                    </div>

                    {/* Comment */}
                    <p className="text-slate/80 mb-3">{review.comment}</p>

                    {/* Date */}
                    <p className="text-sm text-slate/70">Avaliado em {review.date}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button className="px-4 py-2 bg-blue/10 text-blue rounded-lg font-semibold hover:bg-blue/20 transition-colors">
                      Editar
                    </button>
                    <button className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg font-semibold hover:bg-red-500/20 transition-colors">
                      Excluir
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

export default Reviews;

