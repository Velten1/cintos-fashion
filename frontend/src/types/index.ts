// Types

export type Material = 'couro-genuino' | 'couro-sintetico' | 'nalon' | 'tecido';
export type Acabamento = 'brilhante' | 'fosco' | 'texturizado' | 'verniz' | 'acetinado';
export type TipoCinto = 'classico' | 'casual' | 'executivo' | 'esportivo' | 'social';
export type Cor = 'preto' | 'marrom' | 'azul-marinho' | 'cinza' | 'bege' | 'castanho' | 'branco' | 'verde-oliva';
export type TipoFivela = 'prateada' | 'dourada' | 'preta' | 'cromada' | 'antiquada' | 'oxidada';
export type Categoria = 'cintos' | 'fivelas' | 'acessorios';

export interface Fivela {
  tipo: TipoFivela;
  formato: string;
  dimensoes: string;
}

export interface Caracteristicas {
  largura: string; // em cm
  comprimento: string; // em cm (tamanhos disponíveis)
  material: Material;
  acabamento: Acabamento;
  fivela: Fivela;
  cor: Cor;
  resistenteAgua?: boolean;
  forro?: string;
  garantia?: string;
}

export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  descricaoCompleta?: string;
  preco: number;
  precoOriginal?: number;
  categoria: Categoria;
  tipoCinto?: TipoCinto;
  caracteristicas: Caracteristicas;
  imagem: string;
  imagens?: string[];
  emPromocao?: boolean;
  maisVendido?: boolean;
  novo?: boolean;
  estoque: number;
}

export interface Filtros {
  categoria?: Categoria[];
  tipoCinto?: TipoCinto[];
  material?: Material[];
  cor?: Cor[];
  acabamento?: Acabamento[];
  tipoFivela?: TipoFivela[];
  precoMin?: number;
  precoMax?: number;
  emPromocao?: boolean;
  maisVendido?: boolean;
  novo?: boolean;
}
