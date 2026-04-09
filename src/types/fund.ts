export interface Fund {
  schemeCode: number;
  schemeName: string;
}

export interface FundNav {
  date: string;
  nav: string;
}

export interface FundDetail {
  meta: {
    fund_house: string;
    scheme_type: string;
    scheme_category: string;
    scheme_code: number;
    scheme_name: string;
  };
  data: FundNav[];
}
