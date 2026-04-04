/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type GlobalEventCreateFormInputValues = {
    title?: string;
    date?: string;
    time?: string;
    location?: string;
    notes?: string;
    createdBy?: string;
};
export declare type GlobalEventCreateFormValidationValues = {
    title?: ValidationFunction<string>;
    date?: ValidationFunction<string>;
    time?: ValidationFunction<string>;
    location?: ValidationFunction<string>;
    notes?: ValidationFunction<string>;
    createdBy?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type GlobalEventCreateFormOverridesProps = {
    GlobalEventCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    title?: PrimitiveOverrideProps<TextFieldProps>;
    date?: PrimitiveOverrideProps<TextFieldProps>;
    time?: PrimitiveOverrideProps<TextFieldProps>;
    location?: PrimitiveOverrideProps<TextFieldProps>;
    notes?: PrimitiveOverrideProps<TextFieldProps>;
    createdBy?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type GlobalEventCreateFormProps = React.PropsWithChildren<{
    overrides?: GlobalEventCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: GlobalEventCreateFormInputValues) => GlobalEventCreateFormInputValues;
    onSuccess?: (fields: GlobalEventCreateFormInputValues) => void;
    onError?: (fields: GlobalEventCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: GlobalEventCreateFormInputValues) => GlobalEventCreateFormInputValues;
    onValidate?: GlobalEventCreateFormValidationValues;
} & React.CSSProperties>;
export default function GlobalEventCreateForm(props: GlobalEventCreateFormProps): React.ReactElement;
