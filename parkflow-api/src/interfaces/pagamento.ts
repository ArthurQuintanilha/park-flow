export interface Pagamento {
  id_pagamento: number;
  id_movimentacao: number;
  forma_pagamento: string;
  data_pagamento: string;
}

export interface PagamentoCreate {
  id_movimentacao: number;
  forma_pagamento: string;
  data_pagamento: string;
}

export interface PagamentoUpdate {
  id_movimentacao?: number;
  forma_pagamento?: string;
  data_pagamento?: string;
}
