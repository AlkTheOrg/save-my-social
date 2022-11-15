import { ExportFrom, ReqBodyWithExportProps } from "../../controllers/types.js";

export type EmptyObject = Record<string, never>;

export type ParentPageID = {
  page_id: string;
  type: 'page_id';
};

export type Title = Array<{
  type: 'text';
  text: { content: string };
}>;

// prop types
export type DBPropTypeName =
  | 'title'
  | 'number'
  | 'rich_text'
  | 'checkbox'
  | 'select';
export type TitleProp = { type: 'title'; title: EmptyObject };
export type NumberFormat =
  | 'number'
  | 'number_with_commas'
  | 'percent'
  | 'dollar'
  | 'canadian_dollar'
  | 'singapore_dollar'
  | 'euro'
  | 'pound'
  | 'yen'
  | 'ruble'
  | 'rupee'
  | 'won'
  | 'yuan'
  | 'real'
  | 'lira'
  | 'rupiah'
  | 'franc'
  | 'hong_kong_dollar'
  | 'new_zealand_dollar'
  | 'krona'
  | 'norwegian_krone'
  | 'mexican_peso'
  | 'rand'
  | 'new_taiwan_dollar'
  | 'danish_krone'
  | 'zloty'
  | 'baht'
  | 'forint'
  | 'koruna'
  | 'shekel'
  | 'chilean_peso'
  | 'philippine_peso'
  | 'dirham'
  | 'colombian_peso'
  | 'riyal'
  | 'ringgit'
  | 'leu'
  | 'argentine_peso'
  | 'uruguayan_peso';
export type NumberProp = {
  type: 'number';
  number: {
    format: NumberFormat;
  };
};
export type RichTextProp = { type: 'rich_text'; rich_text: EmptyObject };
export type CheckBoxProp = { type: 'checkbox'; checkbox: EmptyObject };
export type SelectColor =
  | 'default'
  | 'gray'
  | 'brown'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red';
export type SelectOptions = Array<{ name: string; color: SelectColor }>;
export type SelectProp = { type: 'select'; select: { options: SelectOptions } };
export type DBPropType =
  | TitleProp
  | NumberProp
  | RichTextProp
  | CheckBoxProp
  | SelectProp;

export type CreateDBPropArguments =
  | {
      type: Exclude<DBPropTypeName, 'number' | 'select'>;
      key: string;
      args: undefined;
    }
  | { type: 'number'; key: string; args: NumberFormat }
  | { type: 'select'; key: string; args: SelectOptions };

// body of /importItems endpoint
export interface ReqBodyWithLastEditedPageID extends ReqBodyWithExportProps {
  lastEditedPageID: string,
};

export type SocialAppToDBPropsMapping = {
  [T in ExportFrom] : {
    [exportFeatureType in `${T}_${string}`]: {
      properties: Array<CreateDBPropArguments>
    }
  }
};
