// Utils
import type { Produto, Filtros } from '../types';

export const produtosMock: Produto[] = [
  {
    id: '1',
    nome: 'Cinto Executivo em Couro Genuíno',
    descricao: 'Elegância e sofisticação para o look executivo',
    descricaoCompleta: 'Cinto premium em couro genuíno italiano, perfeito para ambientes corporativos. Acabamento brilhante com fivela prateada cromada. Disponível em vários tamanhos.',
    preco: 189.90,
    precoOriginal: 249.90,
    categoria: 'cintos',
    tipoCinto: 'executivo',
    caracteristicas: {
      largura: '3.5cm',
      comprimento: '90-110cm',
      material: 'couro-genuino',
      acabamento: 'brilhante',
      fivela: {
        tipo: 'prateada',
        formato: 'Retangular',
        dimensoes: '4cm x 2.5cm'
      },
      cor: 'preto',
      forro: 'Couro',
      garantia: '1 ano'
    },
    imagem: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800',
    imagens: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800',
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800',
    ],
    emPromocao: true,
    maisVendido: true,
    estoque: 15
  },
  {
    id: '2',
    nome: 'Cinto Casual em Couro Texturizado',
    descricao: 'Estilo descontraído com máxima qualidade',
    descricaoCompleta: 'Cinto casual em couro texturizado, ideal para looks informais e modernos. Fivela antiquada com acabamento fosco.',
    preco: 149.90,
    categoria: 'cintos',
    tipoCinto: 'casual',
    caracteristicas: {
      largura: '4cm',
      comprimento: '90-115cm',
      material: 'couro-genuino',
      acabamento: 'texturizado',
      fivela: {
        tipo: 'antiquada',
        formato: 'Redonda',
        dimensoes: '5cm'
      },
      cor: 'marrom',
      garantia: '6 meses'
    },
    imagem: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800',
    emPromocao: false,
    estoque: 23
  },
  {
    id: '3',
    nome: 'Cinto Clássico Preto com Fivela Dourada',
    descricao: 'Timeless e elegante para todas as ocasiões',
    descricaoCompleta: 'Cinto clássico em couro genuíno preto com fivela dourada brilhante. A escolha perfeita para eventos formais.',
    preco: 219.90,
    categoria: 'cintos',
    tipoCinto: 'classico',
    caracteristicas: {
      largura: '3.5cm',
      comprimento: '85-105cm',
      material: 'couro-genuino',
      acabamento: 'verniz',
      fivela: {
        tipo: 'dourada',
        formato: 'Retangular',
        dimensoes: '4.5cm x 2.8cm'
      },
      cor: 'preto',
      forro: 'Couro genuíno',
      garantia: '1 ano'
    },
    imagem: 'https://images.unsplash.com/photo-1611647549091-40fe787b59e8?w=800',
    maisVendido: true,
    estoque: 12
  },
  {
    id: '4',
    nome: 'Cinto Esportivo em Náilon',
    descricao: 'Resistente e confortável para atividades físicas',
    descricaoCompleta: 'Cinto esportivo em náilon resistente à água, com fivela de ajuste rápido. Perfeito para corridas e atividades ao ar livre.',
    preco: 89.90,
    categoria: 'cintos',
    tipoCinto: 'esportivo',
    caracteristicas: {
      largura: '3.8cm',
      comprimento: '95-120cm',
      material: 'nalon',
      acabamento: 'fosco',
      fivela: {
        tipo: 'preta',
        formato: 'Esportiva',
        dimensoes: 'Ajustável'
      },
      cor: 'preto',
      resistenteAgua: true,
      garantia: '6 meses'
    },
    imagem: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
    estoque: 31
  },
  {
    id: '5',
    nome: 'Cinto Social Marrom Vintage',
    descricao: 'Estilo vintage com acabamento antiquado',
    descricaoCompleta: 'Cinto social em couro marrom com acabamento antiquado e fivela oxidada. Design único e sofisticado.',
    preco: 179.90,
    categoria: 'cintos',
    tipoCinto: 'social',
    caracteristicas: {
      largura: '3.5cm',
      comprimento: '90-110cm',
      material: 'couro-genuino',
      acabamento: 'texturizado',
      fivela: {
        tipo: 'oxidada',
        formato: 'Retangular',
        dimensoes: '4cm x 2.5cm'
      },
      cor: 'marrom',
      garantia: '1 ano'
    },
    imagem: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800',
    novo: true,
    estoque: 8
  },
  {
    id: '6',
    nome: 'Cinto Executivo Cinza Moderno',
    descricao: 'Modernidade e elegância para o ambiente corporativo',
    descricaoCompleta: 'Cinto executivo em couro cinza com acabamento acetinado e fivela cromada. Design minimalista e contemporâneo.',
    preco: 199.90,
    categoria: 'cintos',
    tipoCinto: 'executivo',
    caracteristicas: {
      largura: '3.5cm',
      comprimento: '90-110cm',
      material: 'couro-genuino',
      acabamento: 'acetinado',
      fivela: {
        tipo: 'cromada',
        formato: 'Retangular',
        dimensoes: '4cm x 2.5cm'
      },
      cor: 'cinza',
      forro: 'Couro',
      garantia: '1 ano'
    },
    imagem: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    estoque: 19
  },
  {
    id: '7',
    nome: 'Fivela Prateada Cromada Premium',
    descricao: 'Fivela de alta qualidade para personalização',
    descricaoCompleta: 'Fivela prateada cromada em aço inoxidável, perfeita para substituição ou personalização de cintos.',
    preco: 49.90,
    categoria: 'fivelas',
    caracteristicas: {
      largura: '4cm',
      comprimento: 'Padrão',
      material: 'couro-genuino',
      acabamento: 'brilhante',
      fivela: {
        tipo: 'prateada',
        formato: 'Retangular',
        dimensoes: '4cm x 2.5cm'
      },
      cor: 'cinza',
      garantia: '2 anos'
    },
    imagem: 'https://images.unsplash.com/photo-1611647549091-40fe787b59e8?w=800',
    estoque: 45
  },
  {
    id: '8',
    nome: 'Cinto Azul Marinho Executivo',
    descricao: 'Sofisticação em azul para o guarda-roupa masculino',
    descricaoCompleta: 'Cinto executivo em couro azul marinho com acabamento brilhante e fivela prateada. Ideal para complementar ternos e looks formais.',
    preco: 189.90,
    categoria: 'cintos',
    tipoCinto: 'executivo',
    caracteristicas: {
      largura: '3.5cm',
      comprimento: '90-110cm',
      material: 'couro-genuino',
      acabamento: 'brilhante',
      fivela: {
        tipo: 'prateada',
        formato: 'Retangular',
        dimensoes: '4cm x 2.5cm'
      },
      cor: 'azul-marinho',
      forro: 'Couro',
      garantia: '1 ano'
    },
    imagem: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800',
    estoque: 14
  },
  {
    id: '9',
    nome: 'Kit Acessórios para Cinto',
    descricao: 'Kit completo para manutenção e cuidado',
    descricaoCompleta: 'Kit com produtos de limpeza e cuidado para cintos de couro. Inclui limpador, condicionador e protetor.',
    preco: 69.90,
    categoria: 'acessorios',
    caracteristicas: {
      largura: 'N/A',
      comprimento: 'N/A',
      material: 'couro-genuino',
      acabamento: 'fosco',
      fivela: {
        tipo: 'prateada',
        formato: 'N/A',
        dimensoes: 'N/A'
      },
      cor: 'preto'
    },
    imagem: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800',
    estoque: 27
  },
  {
    id: '10',
    nome: 'Cinto Bege Casual Verão',
    descricao: 'Leveza e estilo para o verão',
    descricaoCompleta: 'Cinto casual em couro bege com acabamento texturizado. Perfeito para looks de verão e ocasiões informais.',
    preco: 139.90,
    categoria: 'cintos',
    tipoCinto: 'casual',
    caracteristicas: {
      largura: '4cm',
      comprimento: '90-115cm',
      material: 'couro-genuino',
      acabamento: 'texturizado',
      fivela: {
        tipo: 'antiquada',
        formato: 'Redonda',
        dimensoes: '5cm'
      },
      cor: 'bege',
      garantia: '6 meses'
    },
    imagem: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800',
    estoque: 21
  },
  {
    id: '11',
    nome: 'Cinto Castanho Executivo Premium',
    descricao: 'Sofisticação em castanho para looks elegantes',
    descricaoCompleta: 'Cinto executivo em couro castanho premium com acabamento brilhante e fivela dourada. Perfeito para eventos corporativos e sociais.',
    preco: 229.90,
    precoOriginal: 289.90,
    categoria: 'cintos',
    tipoCinto: 'executivo',
    caracteristicas: {
      largura: '3.5cm',
      comprimento: '90-110cm',
      material: 'couro-genuino',
      acabamento: 'brilhante',
      fivela: {
        tipo: 'dourada',
        formato: 'Retangular',
        dimensoes: '4cm x 2.5cm'
      },
      cor: 'castanho',
      forro: 'Couro genuíno',
      garantia: '1 ano'
    },
    imagem: 'https://images.unsplash.com/photo-1611647549091-40fe787b59e8?w=800',
    emPromocao: true,
    estoque: 18
  },
  {
    id: '12',
    nome: 'Cinto Verde Oliva Militar',
    descricao: 'Estilo militar com robustez e durabilidade',
    descricaoCompleta: 'Cinto militar em couro verde oliva com acabamento fosco e fivela antiquada. Ideal para looks casuais e aventureiros.',
    preco: 169.90,
    categoria: 'cintos',
    tipoCinto: 'casual',
    caracteristicas: {
      largura: '4.5cm',
      comprimento: '95-120cm',
      material: 'couro-genuino',
      acabamento: 'fosco',
      fivela: {
        tipo: 'antiquada',
        formato: 'Retangular',
        dimensoes: '5cm x 3cm'
      },
      cor: 'verde-oliva',
      garantia: '1 ano'
    },
    imagem: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800',
    novo: true,
    estoque: 11
  },
  {
    id: '13',
    nome: 'Cinto Branco Social Elegante',
    descricao: 'Pureza e elegância para ocasiões especiais',
    descricaoCompleta: 'Cinto social em couro branco com acabamento acetinado e fivela prateada. Perfeito para casamentos e eventos formais de verão.',
    preco: 199.90,
    categoria: 'cintos',
    tipoCinto: 'social',
    caracteristicas: {
      largura: '3.5cm',
      comprimento: '85-105cm',
      material: 'couro-genuino',
      acabamento: 'acetinado',
      fivela: {
        tipo: 'prateada',
        formato: 'Retangular',
        dimensoes: '4cm x 2.5cm'
      },
      cor: 'branco',
      forro: 'Couro',
      garantia: '1 ano'
    },
    imagem: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800',
    estoque: 7
  },
  {
    id: '14',
    nome: 'Cinto Clássico Marrom Vintage',
    descricao: 'Timeless design com acabamento envelhecido',
    descricaoCompleta: 'Cinto clássico em couro marrom com acabamento vintage e fivela antiquada. Design que combina com qualquer guarda-roupa.',
    preco: 159.90,
    categoria: 'cintos',
    tipoCinto: 'classico',
    caracteristicas: {
      largura: '3.5cm',
      comprimento: '90-110cm',
      material: 'couro-genuino',
      acabamento: 'texturizado',
      fivela: {
        tipo: 'antiquada',
        formato: 'Retangular',
        dimensoes: '4cm x 2.5cm'
      },
      cor: 'marrom',
      garantia: '1 ano'
    },
    imagem: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800',
    maisVendido: true,
    estoque: 25
  },
  {
    id: '15',
    nome: 'Cinto Executivo Preto Slim',
    descricao: 'Modernidade em design fino e elegante',
    descricaoCompleta: 'Cinto executivo slim em couro preto com acabamento brilhante e fivela prateada minimalista. Ideal para calças modernas.',
    preco: 179.90,
    categoria: 'cintos',
    tipoCinto: 'executivo',
    caracteristicas: {
      largura: '3cm',
      comprimento: '85-100cm',
      material: 'couro-genuino',
      acabamento: 'brilhante',
      fivela: {
        tipo: 'prateada',
        formato: 'Retangular',
        dimensoes: '3.5cm x 2cm'
      },
      cor: 'preto',
      forro: 'Couro',
      garantia: '1 ano'
    },
    imagem: 'https://images.unsplash.com/photo-1611647549091-40fe787b59e8?w=800',
    estoque: 16
  },
  {
    id: '16',
    nome: 'Fivela Dourada Brilhante Premium',
    descricao: 'Fivela dourada de alto brilho para cintos especiais',
    descricaoCompleta: 'Fivela dourada em latão banhado a ouro, com acabamento brilhante. Perfeita para personalizar cintos executivos e sociais.',
    preco: 59.90,
    categoria: 'fivelas',
    caracteristicas: {
      largura: '4.5cm',
      comprimento: 'Padrão',
      material: 'couro-genuino',
      acabamento: 'brilhante',
      fivela: {
        tipo: 'dourada',
        formato: 'Retangular',
        dimensoes: '4.5cm x 2.8cm'
      },
      cor: 'marrom',
      garantia: '2 anos'
    },
    imagem: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800',
    estoque: 38
  },
  {
    id: '17',
    nome: 'Fivela Preta Oxidada Industrial',
    descricao: 'Estilo industrial com acabamento oxidado',
    descricaoCompleta: 'Fivela preta oxidada com acabamento industrial. Ideal para cintos casuais e estilos urbanos.',
    preco: 44.90,
    categoria: 'fivelas',
    caracteristicas: {
      largura: '4cm',
      comprimento: 'Padrão',
      material: 'couro-genuino',
      acabamento: 'fosco',
      fivela: {
        tipo: 'preta',
        formato: 'Retangular',
        dimensoes: '4cm x 2.5cm'
      },
      cor: 'preto',
      garantia: '1 ano'
    },
    imagem: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800',
    estoque: 42
  },
  {
    id: '18',
    nome: 'Cinto Casual Cinza Esportivo',
    descricao: 'Conforto e estilo para o dia a dia',
    descricaoCompleta: 'Cinto casual em couro cinza com acabamento texturizado. Perfeito para combinar com jeans e looks informais.',
    preco: 129.90,
    categoria: 'cintos',
    tipoCinto: 'casual',
    caracteristicas: {
      largura: '4cm',
      comprimento: '90-115cm',
      material: 'couro-genuino',
      acabamento: 'texturizado',
      fivela: {
        tipo: 'antiquada',
        formato: 'Redonda',
        dimensoes: '5cm'
      },
      cor: 'cinza',
      garantia: '6 meses'
    },
    imagem: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    estoque: 22
  },
  {
    id: '19',
    nome: 'Cinto Executivo Azul Marinho Premium',
    descricao: 'Elegância corporativa em azul profundo',
    descricaoCompleta: 'Cinto executivo premium em couro azul marinho com acabamento verniz e fivela dourada. A escolha perfeita para reuniões importantes.',
    preco: 249.90,
    precoOriginal: 299.90,
    categoria: 'cintos',
    tipoCinto: 'executivo',
    caracteristicas: {
      largura: '3.5cm',
      comprimento: '90-110cm',
      material: 'couro-genuino',
      acabamento: 'verniz',
      fivela: {
        tipo: 'dourada',
        formato: 'Retangular',
        dimensoes: '4cm x 2.5cm'
      },
      cor: 'azul-marinho',
      forro: 'Couro genuíno premium',
      garantia: '1 ano'
    },
    imagem: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800',
    emPromocao: true,
    maisVendido: true,
    estoque: 9
  },
  {
    id: '20',
    nome: 'Cinto Esportivo Tático Náilon',
    descricao: 'Máxima resistência para atividades intensas',
    descricaoCompleta: 'Cinto esportivo tático em náilon resistente com múltiplos ajustes e fivela de rápida liberação. Ideal para atividades ao ar livre.',
    preco: 99.90,
    categoria: 'cintos',
    tipoCinto: 'esportivo',
    caracteristicas: {
      largura: '4cm',
      comprimento: '100-130cm',
      material: 'nalon',
      acabamento: 'fosco',
      fivela: {
        tipo: 'preta',
        formato: 'Esportiva Tática',
        dimensoes: 'Ajustável'
      },
      cor: 'preto',
      resistenteAgua: true,
      garantia: '1 ano'
    },
    imagem: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
    estoque: 33
  },
  {
    id: '21',
    nome: 'Fivela Cromada Retangular Minimalista',
    descricao: 'Design minimalista para todos os estilos',
    descricaoCompleta: 'Fivela cromada com design minimalista e limpo. Perfeita para quem busca elegância discreta.',
    preco: 39.90,
    categoria: 'fivelas',
    caracteristicas: {
      largura: '3.5cm',
      comprimento: 'Padrão',
      material: 'couro-genuino',
      acabamento: 'brilhante',
      fivela: {
        tipo: 'cromada',
        formato: 'Retangular',
        dimensoes: '3.5cm x 2cm'
      },
      cor: 'cinza',
      garantia: '2 anos'
    },
    imagem: 'https://images.unsplash.com/photo-1611647549091-40fe787b59e8?w=800',
    estoque: 51
  },
  {
    id: '22',
    nome: 'Cinto Social Preto com Fivela Dourada',
    descricao: 'Clássico atemporal para eventos formais',
    descricaoCompleta: 'Cinto social em couro preto com fivela dourada brilhante. O clássico que nunca sai de moda.',
    preco: 189.90,
    categoria: 'cintos',
    tipoCinto: 'social',
    caracteristicas: {
      largura: '3.5cm',
      comprimento: '85-105cm',
      material: 'couro-genuino',
      acabamento: 'brilhante',
      fivela: {
        tipo: 'dourada',
        formato: 'Retangular',
        dimensoes: '4cm x 2.5cm'
      },
      cor: 'preto',
      forro: 'Couro',
      garantia: '1 ano'
    },
    imagem: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800',
    estoque: 13
  },
  {
    id: '23',
    nome: 'Kit Premium de Manutenção de Couro',
    descricao: 'Tudo que você precisa para cuidar dos seus cintos',
    descricaoCompleta: 'Kit completo premium com limpador, condicionador, protetor UV e flanela especial. Mantenha seus cintos sempre como novos.',
    preco: 89.90,
    precoOriginal: 119.90,
    categoria: 'acessorios',
    caracteristicas: {
      largura: 'N/A',
      comprimento: 'N/A',
      material: 'couro-genuino',
      acabamento: 'fosco',
      fivela: {
        tipo: 'prateada',
        formato: 'N/A',
        dimensoes: 'N/A'
      },
      cor: 'preto'
    },
    imagem: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800',
    emPromocao: true,
    estoque: 29
  },
  {
    id: '24',
    nome: 'Cinto Casual Bege Claro Verão',
    descricao: 'Frescor e leveza para o verão',
    descricaoCompleta: 'Cinto casual em couro bege claro com acabamento natural. Perfeito para looks de verão e ocasiões descontraídas.',
    preco: 119.90,
    categoria: 'cintos',
    tipoCinto: 'casual',
    caracteristicas: {
      largura: '4cm',
      comprimento: '90-115cm',
      material: 'couro-genuino',
      acabamento: 'texturizado',
      fivela: {
        tipo: 'antiquada',
        formato: 'Redonda',
        dimensoes: '5cm'
      },
      cor: 'bege',
      garantia: '6 meses'
    },
    imagem: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800',
    estoque: 17
  },
  {
    id: '25',
    nome: 'Fivela Antiquada Vintage Redonda',
    descricao: 'Charme vintage com acabamento envelhecido',
    descricaoCompleta: 'Fivela antiquada em formato redondo com acabamento vintage. Ideal para dar um toque retrô aos seus cintos.',
    preco: 54.90,
    categoria: 'fivelas',
    caracteristicas: {
      largura: '5cm',
      comprimento: 'Padrão',
      material: 'couro-genuino',
      acabamento: 'fosco',
      fivela: {
        tipo: 'antiquada',
        formato: 'Redonda',
        dimensoes: '5cm'
      },
      cor: 'marrom',
      garantia: '1 ano'
    },
    imagem: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800',
    estoque: 36
  }
];

export const filtrarProdutos = (produtos: Produto[], filtros: Filtros, busca: string = ''): Produto[] => {
  let produtosFiltrados = produtos;

  // Busca por texto
  if (busca.trim()) {
    const buscaLower = busca.toLowerCase();
    produtosFiltrados = produtosFiltrados.filter(produto =>
      produto.nome.toLowerCase().includes(buscaLower) ||
      produto.descricao.toLowerCase().includes(buscaLower) ||
      produto.categoria.toLowerCase().includes(buscaLower)
    );
  }

  // Filtro por categoria
  if (filtros.categoria && filtros.categoria.length > 0) {
    produtosFiltrados = produtosFiltrados.filter(produto =>
      filtros.categoria!.includes(produto.categoria)
    );
  }

  // Filtro por tipo de cinto
  if (filtros.tipoCinto && filtros.tipoCinto.length > 0) {
    produtosFiltrados = produtosFiltrados.filter(produto =>
      produto.tipoCinto && filtros.tipoCinto!.includes(produto.tipoCinto)
    );
  }

  // Filtro por material
  if (filtros.material && filtros.material.length > 0) {
    produtosFiltrados = produtosFiltrados.filter(produto =>
      filtros.material!.includes(produto.caracteristicas.material)
    );
  }

  // Filtro por cor
  if (filtros.cor && filtros.cor.length > 0) {
    produtosFiltrados = produtosFiltrados.filter(produto =>
      filtros.cor!.includes(produto.caracteristicas.cor)
    );
  }

  // Filtro por acabamento
  if (filtros.acabamento && filtros.acabamento.length > 0) {
    produtosFiltrados = produtosFiltrados.filter(produto =>
      filtros.acabamento!.includes(produto.caracteristicas.acabamento)
    );
  }

  // Filtro por tipo de fivela
  if (filtros.tipoFivela && filtros.tipoFivela.length > 0) {
    produtosFiltrados = produtosFiltrados.filter(produto =>
      filtros.tipoFivela!.includes(produto.caracteristicas.fivela.tipo)
    );
  }

  // Filtro por preço
  if (filtros.precoMin !== undefined) {
    produtosFiltrados = produtosFiltrados.filter(produto => produto.preco >= filtros.precoMin!);
  }
  if (filtros.precoMax !== undefined) {
    produtosFiltrados = produtosFiltrados.filter(produto => produto.preco <= filtros.precoMax!);
  }

  // Filtro por promoção
  if (filtros.emPromocao !== undefined) {
    produtosFiltrados = produtosFiltrados.filter(produto => produto.emPromocao === filtros.emPromocao);
  }

  // Filtro por mais vendido
  if (filtros.maisVendido !== undefined) {
    produtosFiltrados = produtosFiltrados.filter(produto => produto.maisVendido === filtros.maisVendido);
  }

  // Filtro por novo
  if (filtros.novo !== undefined) {
    produtosFiltrados = produtosFiltrados.filter(produto => produto.novo === filtros.novo);
  }

  return produtosFiltrados;
};

export const formatarPreco = (preco: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(preco);
};
