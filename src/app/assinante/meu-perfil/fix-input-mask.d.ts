declare module 'react-input-mask' {
  import * as React from 'react';
  
  export interface Props {
    mask: string;
    maskChar?: string | null;
    formatChars?: { [key: string]: string };
    alwaysShowMask?: boolean;
    inputRef?: React.Ref<HTMLInputElement>;
    beforeMaskedValueChange?: (newValue: any, oldValue: any, mask: string) => any;
    children?: (inputProps: React.InputHTMLAttributes<HTMLInputElement>) => React.ReactElement;
    [key: string]: any;
  }
  
  export default class InputMask extends React.Component<Props> {}
}
